import express from "express";
import "dotenv/config";
import cors from "cors"
import { GenerateImagesFromPacksSchema, GenerateImageSchema, TrainModelSchema } from "common/types";
import { prisma } from "db";
import { S3Client } from "bun";
import { FalAiModel } from "./models/FalAiModel";
import { authMiddleWare } from "./middleware";

const falAiModel = new FalAiModel()

const PORT = process.env.PORT;
const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(cors())


const r2Credentials = {
  accessKeyId: process.env.R2_ACCESS_KEY,
  secretAccessKey: process.env.R2_SECRET_KEY,
  bucket: process.env.BUCKET_NAME,
  endpoint: process.env.R2_ENDPOINT, // Cloudflare R2 Endpoint

};

app.get("/", (req, res) => {
  res.send("Healthy Server ✨");
});


app.get("/preSignURLs", async (req, res) => {

  const key = `models/${Date.now()}_${Math.floor(Math.random() * 1000000000000000)}.zip`
  let presignedUrls = S3Client.presign(key, {
    method: "PUT",
    accessKeyId: process.env.R2_ACCESS_KEY,
    secretAccessKey: process.env.R2_SECRET_KEY,
    bucket: process.env.BUCKET_NAME,
    endpoint: process.env.R2_ENDPOINT, // Cloudflare R2 Endpoint
    expiresIn: 3600,
    type: "application/gzip"
  });
  console.log(presignedUrls)
  // presignedUrls = decodeURIComponent(presignedUrls)
  res.json({
    urls: presignedUrls,
    key: key
  })

})


app.post("/ai/trainModel", authMiddleWare, async (req, res) => {

  const parsedBody = TrainModelSchema.safeParse(req.body);


  if (!parsedBody.success) {
    console.log( parsedBody)
    res.status(411).json({
      message: "Incorrect Inputs",
      "ParsedBody": parsedBody
    })
    return;
  }

  const { request_id, response_url } = await falAiModel.trainModel(parsedBody.data.zipUrls, req.body.triggerWord)

  try {
    const model = await prisma.model.create({
      data: {
        name: parsedBody.data.name,
        type: parsedBody.data.type,
        age: parsedBody.data.age,
        ethnicity: parsedBody.data.ethnicity,
        eyeColor: parsedBody.data.eyeColor,
        bald: parsedBody.data.bald,
        userId: req.userId!,
        zipUrls: parsedBody.data.zipUrls,
        falAiRequestId: request_id,
      }
    })
    res.status(200).json({
      message: "Model added",
      modelId: model.id
    })
    return;
  } catch (err) {
    console.log("error caught while creating mode", err);
    res.status(500).json({
      message: "Internal server errored"
    })
  }



});


app.post("/ai/generate", authMiddleWare, async (req, res) => {
  const parsedBody = GenerateImageSchema.safeParse(req.body)

  if (!parsedBody.success) {
    res.status(411).json({
      message: "Invalid Inputs"
    }
    )
    return;

  }

  const model = await prisma.model.findUnique({
    where: {
      id: req.body.modelId
    }
  })
  if (!model || !model.tensorPath) {
    res.status(404).json({
      message: "Model not found"
    })
    return;
  }

  const { request_id, response_url } = await falAiModel.generateImage(model.tensorPath, req.body.prompt)

  try {
    const data = await prisma.outputImage.create({
      data: {
        prompt: parsedBody.data.prompt,
        imageUrl: req.body.imageUrl,
        modelId: parsedBody.data.modelId,
        userId: req.userId ?? " ",
        falAiRequestId: request_id
      }
    })
    if (!data) {
      res.status(403).json({
        message: "Something went wrong"
      })
      return
    }

    res.status(200).json({
      message: "Generation successfull",
      OutputImageID: data.id
    })

  } catch (error) {

  }

});


app.post("/pack/generate", authMiddleWare, async (req, res) => {
  const parsedBody = GenerateImagesFromPacksSchema.safeParse(req.body)

  if (!parsedBody.success) {
    res.status(411).json({
      message: "Incorrect Inputs"
    })
    return

  }

  const prompts = await prisma.packPrompts.findMany({
    where: {
      packId: parsedBody.data.packId
    }
  })



  let requestIds: { request_id: string }[] = await Promise.all(prompts.map(async (prompt, index) => falAiModel.generateImage(prompt.prompt, parsedBody.data.modelId)
  ))


  const image = await prisma.outputImage.createManyAndReturn({

    data: prompts.map((prompt, index:number) => ({
      prompt: prompt.prompt,
      userId: req.userId!,
      modelId: req.body.modelId,
      imageUrl: req.body.imageUrl,
      falAiRequestId: requestIds[index].request_id
    }))
  });

  res.json({
    images: image.map((img) => img.id)
  })
})


app.get("/pack/bulk", async (req, res) => {


  const data = await prisma.packs.findMany({})
  res.status(200).json({
    message: "data fouund successfully",
    data: data
  })
})


app.get("/models/user", authMiddleWare, async (req, res) => {
  try {
    const models = await prisma.model.findMany({
      where: {
        userId: req.userId!
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    res.status(200).json({
      message: "Models fetched successfully",
      models: models
    })
  } catch (error) {
    console.log("Error fetching user models", error);
    res.status(500).json({
      message: "Error fetching models"
    })
  }
})


// Get a specific model by ID
app.get("/models/:id", authMiddleWare, async (req, res) => {
  try {
    const model = await prisma.model.findUnique({
      where: {
        id: req.params.id
      },
      include: {
        outputImages: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!model) {
      res.status(404).json({
        message: "Model not found"
      })
      return
    }

    // Check if user owns this model
    if (model.userId !== req.userId) {
      res.status(403).json({
        message: "Unauthorized access"
      })
      return
    }

    res.status(200).json({
      message: "Model fetched successfully",
      model: model
    })
  } catch (error) {
    console.log("Error fetching model", error);
    res.status(500).json({
      message: "Error fetching model"
    })
  }
})


// Delete a model
app.delete("/models/:id", authMiddleWare, async (req, res) => {
  try {
    const model = await prisma.model.findUnique({
      where: {
        id: req.params.id
      }
    })

    if (!model) {
      res.status(404).json({
        message: "Model not found"
      })
      return
    }

    if (model.userId !== req.userId) {
      res.status(403).json({
        message: "Unauthorized access"
      })
      return
    }

    // Delete associated images first
    await prisma.outputImage.deleteMany({
      where: {
        modelId: req.params.id
      }
    })

    // Delete the model
    await prisma.model.delete({
      where: {
        id: req.params.id
      }
    })

    res.status(200).json({
      message: "Model deleted successfully"
    })
  } catch (error) {
    console.log("Error deleting model", error);
    res.status(500).json({
      message: "Error deleting model"
    })
  }
})


// Update model details
app.patch("/models/:id", authMiddleWare, async (req, res) => {
  try {
    const model = await prisma.model.findUnique({
      where: {
        id: req.params.id
      }
    })

    if (!model) {
      res.status(404).json({
        message: "Model not found"
      })
      return
    }

    if (model.userId !== req.userId) {
      res.status(403).json({
        message: "Unauthorized access"
      })
      return
    }

    const updatedModel = await prisma.model.update({
      where: {
        id: req.params.id
      },
      data: {
        name: req.body.name || model.name,
        prompt: req.body.prompt || model.prompt
      }
    })

    res.status(200).json({
      message: "Model updated successfully",
      model: updatedModel
    })
  } catch (error) {
    console.log("Error updating model", error);
    res.status(500).json({
      message: "Error updating model"
    })
  }
})


app.get("/images/user", authMiddleWare, async (req, res) => {
  const limit = req.query.limit as string ?? "20"
  const offset = req.query.offset as string ?? "0"

  try {
    const images = await prisma.outputImage.findMany({
      where: {
        userId: req.userId!
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: parseInt(offset),
      take: parseInt(limit)
    })

    res.status(200).json({
      message: "Images fetched successfully",
      images: images
    })
  } catch (error) {
    console.log("Error fetching user images", error);
    res.status(500).json({
      message: "Error fetching images"
    })
  }
})


// Get a specific image by ID
app.get("/images/:id", authMiddleWare, async (req, res) => {
  try {
    const image = await prisma.outputImage.findUnique({
      where: {
        id: req.params.id
      },
      include: {
        model: true
      }
    })

    if (!image) {
      res.status(404).json({
        message: "Image not found"
      })
      return
    }

    if (image.userId !== req.userId) {
      res.status(403).json({
        message: "Unauthorized access"
      })
      return
    }

    res.status(200).json({
      message: "Image fetched successfully",
      image: image
    })
  } catch (error) {
    console.log("Error fetching image", error);
    res.status(500).json({
      message: "Error fetching image"
    })
  }
})


// Delete an image
app.delete("/images/:id", authMiddleWare, async (req, res) => {
  try {
    const image = await prisma.outputImage.findUnique({
      where: {
        id: req.params.id
      }
    })

    if (!image) {
      res.status(404).json({
        message: "Image not found"
      })
      return
    }

    if (image.userId !== req.userId) {
      res.status(403).json({
        message: "Unauthorized access"
      })
      return
    }

    await prisma.outputImage.delete({
      where: {
        id: req.params.id
      }
    })

    res.status(200).json({
      message: "Image deleted successfully"
    })
  } catch (error) {
    console.log("Error deleting image", error);
    res.status(500).json({
      message: "Error deleting image"
    })
  }
})


// Get images by model ID
app.get("/models/:id/images", authMiddleWare, async (req, res) => {
  const limit = req.query.limit as string ?? "20"
  const offset = req.query.offset as string ?? "0"

  try {
    const model = await prisma.model.findUnique({
      where: {
        id: req.params.id
      }
    })

    if (!model) {
      res.status(404).json({
        message: "Model not found"
      })
      return
    }

    if (model.userId !== req.userId) {
      res.status(403).json({
        message: "Unauthorized access"
      })
      return
    }

    const images = await prisma.outputImage.findMany({
      where: {
        modelId: req.params.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: parseInt(offset),
      take: parseInt(limit)
    })

    res.status(200).json({
      message: "Images fetched successfully",
      images: images
    })
  } catch (error) {
    console.log("Error fetching model images", error);
    res.status(500).json({
      message: "Error fetching images"
    })
  }
})


// Get user profile/stats
app.get("/user/profile", authMiddleWare, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        clerkId: req.userId!
      }
    })

    if (!user) {
      res.status(404).json({
        message: "User not found"
      })
      return
    }

    // Get user statistics
    const modelCount = await prisma.model.count({
      where: {
        userId: req.userId!
      }
    })

    const imageCount = await prisma.outputImage.count({
      where: {
        userId: req.userId!
      }
    })

    const completedModels = await prisma.model.count({
      where: {
        userId: req.userId!,
        trainingStatus: "Completed"
      }
    })

    res.status(200).json({
      message: "Profile fetched successfully",
      user: user,
      stats: {
        totalModels: modelCount,
        completedModels: completedModels,
        totalImages: imageCount
      }
    })
  } catch (error) {
    console.log("Error fetching user profile", error);
    res.status(500).json({
      message: "Error fetching profile"
    })
  }
})


// Get pack details with prompts
app.get("/pack/:id", async (req, res) => {
  try {
    const pack = await prisma.packs.findUnique({
      where: {
        id: req.params.id
      },
      include: {
        prompt: true
      }
    })

    if (!pack) {
      res.status(404).json({
        message: "Pack not found"
      })
      return
    }

    res.status(200).json({
      message: "Pack fetched successfully",
      pack: pack
    })
  } catch (error) {
    console.log("Error fetching pack", error);
    res.status(500).json({
      message: "Error fetching pack"
    })
  }
})


app.get("/image/bulk", async (req, res) => {

  const imagesId = req.query.images as string[]
  const limit = req.query.limit as string ?? 10
  const offset = req.query.offset as string ?? 0

  console.log(imagesId)
  try {

    const imageData = await prisma.outputImage.findMany({
      where: {
        id: {
          in: imagesId
        },
        userId: req.userId!
      },
      skip: parseInt(offset),
      take: parseInt(limit)
    })

    res.status(200).json({
      message: "data fetched",
      images: imageData

    })
  } catch (error) {
    console.log("error occured")
    console.log(error);
  }

});


app.post("/webhook/image", authMiddleWare, async (req, res) => {
  // for Generating an image
  console.log("Route for generating an image")
  console.log(req.body);
  const requestId = req.body.requestId
  const imageOutput = await prisma.outputImage.updateMany({
    where: {
      falAiRequestId: req.body.falAiRequestId
    },
    data: {
      status: "Generated",
      imageUrl: req.body.imageUrl
    }
  })

  //update the status of img in db 

  res.json({
    message: "webhook route and status in db updated successfully"
  })
})


app.post("/webhook/train", authMiddleWare, async (req, res) => {
  // for training a model
  console.log("route for training an model")
  console.log(req.body);
  //update the status of img in db 
  const trainModel = await prisma.model.updateMany({
    where: {
      falAiRequestId: req.body.falAiRequestId
    },
    data: {
      trainingStatus: "Completed",
      tensorPath: req.body.tensorPath
    }
  })
  res.json({
    message: "webhook route and status in db updated successfully",
    trainModel,
  })
})


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

