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
    res.status(411).json({
      message: "Incorrect Inputs"
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
        userId: req.body.userId,
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
        userId: req.body.userId ?? " ",
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

    data: prompts.map((prompt, index) => ({
      prompt: prompt.prompt,
      userId: req.body.userId,
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
        userId: "12142"
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
    message: "webhook route and status in db updated successfully"
  })
})


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

