const fs = require("fs");
const imgBBUploader = require("../helpers/imgBBUploader");
const DSclientResponse = require("../helpers/DSclientResponse.json")

const engineId = "stable-diffusion-v1-5";
const apiHost = "https://api.stability.ai";
const apiKey = process.env.DS_KEY;

const DSGenerateImage = async (prompts, style) => {
  if (!apiKey) throw new Error("Missing Stability API key.");
  const response = await fetch(
    `${apiHost}/v1/generation/${engineId}/text-to-image`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        text_prompts: [
          {
            text: prompts,
          },
        ],
        cfg_scale: 7,
        clip_guidance_preset: "FAST_BLUE",
        height: 512,
        width: 512,
        samples: 1,
        steps: 50,
        style_preset: style,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Non-200 response: ${await response.text()}`);
  }

  const responseJSON = await response.json();
  const remoteImage = await imgBBUploader(process.env.IMGBB_KEY, responseJSON.artifacts[0]["base64"])
  return remoteImage
};

module.exports = DSGenerateImage;
