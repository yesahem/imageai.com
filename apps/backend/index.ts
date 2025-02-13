import express from "express";
import "dotenv/config";
const PORT = process.env.PORT;
const app = express();
import { GenerateImagesFromPacksSchema, GenerateImageSchema, TrainModelSchema } from "common/types";
import { prisma } from "db";

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Healthy Server ✨");
});

app.post("/ai/trainModel", async (req, res) => {

  const parsedBody = TrainModelSchema.safeParse(req.body);

  if (!parsedBody.success) {
    res.status(411).json({
      message: "Incorrect Inputs"
    })
    return;
  }

  try {
    const model = await prisma.model.create({
      data: {
        name: req.body.name,
        type: req.body.type,
        age: req.body.age,
        ethnicity: req.body.ethnicity,
        eyeColor: req.body.eyeColor,
        bald: req.body.bald,
        userId: req.body.userId,
        imageUrls: req.body.imageUrls
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

app.post("/ai/generate", async (req, res) => {
  const parsedBody = GenerateImageSchema.safeParse(req.body)

  if (!parsedBody.success) {
    res.status(411).json({
      message: "Invalid Inputs"
    }
    )
    return;

  }

  try {
    const data = await prisma.outputImage.create({
      data: {
        prompt: req.body.prompt,
        imageUrl: req.body.imageUrl,
        modelId: req.body.modelId,
        userId: req.body.userId
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

app.post("/pack/generate", async (req, res) => {
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

  const image = await prisma.outputImage.createManyAndReturn({
    data: prompts.map((prompt) => ({
      prompt: prompt.prompt,
      userId: req.body.userId,
      modelId: req.body.modelId,
      imageUrl: req.body.imageUrl
    }))
  });

  res.json({
    images: image.map((image) => image.id)
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

