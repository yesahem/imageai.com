import { BaseModel } from "./BaseMode";
import { fal } from "@fal-ai/client";

export class FalAiModel extends BaseModel {
    constructor() {
        super()
    }

    public async generateImage(prompt: string, tensorPath: string, scale: number = 1) {


        const result = await fal.queue.submit("fal-ai/flux-lora", {
            input: {
                prompt: prompt,
                loras: [{ path: tensorPath, scale: scale }]
            },
            webhookUrl: `${process.env.WEBHOOK_URL}/image`

        });
        // console.log(result.data);
        // console.log(result.requestId);
        return {
            response_url:result.response_url,
            request_id: result.request_id
        }
};

        // return {
        //     data: result.data,
        //     requestId: result.requestId
        // }
    // }

    public async trainModel(inputImagesAsZipUrl: string, triggerWord: string) {

        // uncomment this to actually send request to fal-ai 
        
        // const { request_id, response_url } = await fal.queue.submit("fal-ai/flux-lora-fast-training", {
        //     input: {
        //       images_data_url: inputImagesAsZipUrl
        //     },
        //     webhookUrl: `${process.env.WEBHOOK_URL}/train`
        //   });
          
        //   return {request_id, response_url};
        
        console.log("zipUrlInBE",inputImagesAsZipUrl)
        return {request_id:"default reqid", response_url:"default resid"};
    }

}