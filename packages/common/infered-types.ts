import {z} from "zod";

import { TrainModelSchema, GenerateImageSchema, GenerateImagesFromPacksSchema } from "./types.ts"


export type ModelTraningInput = z.infer<typeof TrainModelSchema>
export type ModelGenerationInput = z.infer<typeof GenerateImageSchema>
export type ModelPackGeneration = z.infer<typeof GenerateImagesFromPacksSchema>



