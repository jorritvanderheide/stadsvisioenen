/**
 * Handle post request
 * @param {string} request.prompt - Prompt string to generate image
 *
 * @returns {Promise<Response>} - Image base64 string
 */
export const POST = async (request: Request): Promise<Response> => {
  const { prompt } = await request.json();

  try {
    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        prompt: `A digital illustration of ${prompt}, 4k, detailed, ghibli.`,
        n: 1,
        size: "1024x1024",
        response_format: "b64_json",
      }),
    });

    const data = await res.json();

    const base64 = data.data[0].b64_json;

    return Response.json(base64);
  } catch (error) {
    return Response.json(error);
  }
};
