import { gamePreview, rawgGamePreview } from "../types/api/games/gamePreview";
import z from "zod";

export function convertRawgGameToGamePreview(
  game: z.infer<typeof rawgGamePreview>
): z.infer<typeof gamePreview> {
  return {
    _id: "temp",
    external_id: game.id,
    slug: game.slug,
    name: game.name,
    released: game.released,
    tba: game.tba,
    background_image: game.background_image,
    metacritic: game.metacritic,
    playtime: game.playtime,
    esrb_rating: game.esrb_rating,
    platforms: game.platforms,
    parent_platforms: game.parent_platforms,
  };
}
export function removeRawgDuplicates(
  games: z.infer<typeof gamePreview>[]
): z.infer<typeof gamePreview>[] {
  const gameMap = new Map<string, z.infer<typeof gamePreview>>();

  games.forEach((game) => {
    const existingGame = gameMap.get(game.external_id.toString());

    if (existingGame) {
      if (existingGame._id === "temp" && game._id !== "temp") {
        gameMap.set(game.external_id.toString(), game);
      }
    } else {
      gameMap.set(game.external_id.toString(), game);
    }
  });

  return Array.from(gameMap.values());
}
