import path from "path";
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

export const fetchRawg = async <Req, Res>(
  options: {
    path: string;
    params?: Record<string, string>;
    method: string;
    responseSchema: z.ZodType<Res>;
    body?: Req;
  }
): Promise<[Res | null, Error | null]> => {
  const { path, method, responseSchema, body } = options;
  
  
  
  const apiKey = process.env.RAWG_API_KEY;
  const params = options.params ? new URLSearchParams(options.params) : new URLSearchParams();
  params.append("key", apiKey ?? "");
  
  const url = `https://api.rawg.io/api/${path}?${params.toString()}`;

  console.log(url, "fetching rawg");

  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
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
      console.error(JSON.stringify(error, null, 2));
      return [null, error as Error];
    }
  } catch (error) {
    console.error(error);
    return [null, error as Error];
  }
}
