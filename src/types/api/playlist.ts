import z from 'zod'

export type addGameRequest = {
  gameId: string;
}

export const addGameRequestSchema = z.object({
  gameId: z.string(),
})

export type addGameResponse = {
  _id: string;
}

export type deleteFromPlaylistRequest = {
  gameId: string;
}

export const deleteFromPlaylistRequestSchema = z.object({
  gameId: z.string(),
})

export type deleteFromPlaylistResponse = {
  _id: string;
}