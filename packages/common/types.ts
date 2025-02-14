import { z } from "zod";


export const TrainModelSchema = z.object({
    name: z.string(),
    type: z.enum(["Male", "Female", "Others"]),
    age: z.number(),
    ethnicity: z.enum(["White", "Black", "AsianAmerican", "EastAsian", "SouthEastAsian", "SouthAsian", "MiddleEastern", "Hispanic"]),
    eyeColor: z.enum(["Brown", "Blue", "Hazel", "Gray"]),
    bald: z.boolean(),
   zipUrls: z.string()
})

export const GenerateImageSchema = z.object({
    prompt: z.string(),
    modelId: z.string(),
    imagesToGenerate: z.number()
})

export const GenerateImagesFromPacksSchema = z.object({
    modelId: z.string(),
    packId: z.string()

})
