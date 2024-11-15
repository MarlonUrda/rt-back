export const RAWGPaths = {
  popular: (page: number) => `games?&page=${page}`,
  gameDetails: (id: number) => `games/${id}`,
  gameScreenShots: (id: number) => `games/${id}/screenshots`,
}