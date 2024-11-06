import { z } from "zod";

export const fetchTMDB = async <Req, Res>(
  options: {
    path: string;
    method: string;
    responseSchema: z.ZodType<Res>;
    body?: Req;
  }
): Promise<[Res | null, Error | null]> => {
  const { path, method, responseSchema, body } = options;
  const apiKey = process.env.TMDB_RAT;
  const url = `https://api.themoviedb.org/3/${path}`;

  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log(data);
    if (!response.ok) {
      console.error(data);
      return [null, new Error(data)];
    }

    try {
      const result = responseSchema.parse(data);
      return [result, null];
    } catch (error) {
      console.error(error);
      return [null, error as Error];
    }
  } catch (error) {
    console.error(error);
    return [null, error as Error];
  }
};
