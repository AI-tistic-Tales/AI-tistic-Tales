const jestFetchMock = require("jest-fetch-mock");
jestFetchMock.enableMocks();
const GPTClient = require("../../clients/GPTclient.js");
const GPTResponses = require("../seeds/GPTResponses");

describe("GPTclient class", () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  describe("generateStory method", () => {
    test("returns a story from GPT server based on prompts", async () => {
      fetch.mockResponseOnce(JSON.stringify(GPTResponses.okGPTResponse));
      const result = await GPTClient.generateStory(
        "prompt1",
        "prompt2"
      );
      expect(result).toEqual(GPTResponses.okGPTResponse.choices[0].text);
    });

    test("returns an invalid API key message if no API key is provided", async () => {
      fetch.mockResponseOnce(JSON.stringify(GPTResponses.invalidGPTResponse));
      await expect(
        GPTClient.generateStory("prompt1", "prompt2")
      ).rejects.toThrow("Invalid API Request");
    });

    test("returns a type error if there is no internet connection", async () => {
      fetch.mockRejectedValueOnce(new TypeError());
      await expect(
        GPTClient.generateStory("prompt1", "prompt2")
      ).rejects.toThrow(TypeError);
    });
  });
});
