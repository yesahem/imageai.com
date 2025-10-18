import { fal } from "@fal-ai/client";

export class FalAiModel {
  public async generateImage(prompt: string, tensorPath: string, scale: number = 1) {
    const result = await fal.queue.submit("fal-ai/flux-lora", {
      input: {
        prompt: prompt,
        loras: [{ path: tensorPath, scale: scale }]
      },
      webhookUrl: `${process.env.WEBHOOK_URL}/image`
    });

    return {
      response_url: result.response_url,
      request_id: result.request_id
    };
  }

  public async trainModel(inputImagesAsZipUrl: string, triggerWord: string) {
    const { request_id, response_url } = await fal.queue.submit("fal-ai/flux-lora-fast-training", {
      input: {
        images_data_url: inputImagesAsZipUrl
      },
      webhookUrl: `${process.env.WEBHOOK_URL}/train`
    });

    return { request_id, response_url };
  }
}
