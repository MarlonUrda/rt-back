import mongoose from "mongoose";

interface IPlaylist extends mongoose.Document {
  gameIds: mongoose.Types.ObjectId[];
  userId: mongoose.Types.ObjectId;
  user: {
    firstName: string;
    lastName: string;
    _id: mongoose.Types.ObjectId;
  }
}

interface PlaylistModel extends mongoose.Model<IPlaylist> {
  addGame(userId: string, gameId: string): Promise<IPlaylist | null>;
  findPlaylistByUserId(userId: string): Promise<IPlaylist | null>;
  removeGame(userId: string, gameId: string): Promise<IPlaylist | null>;
  toJSON(): IPlaylist;
}

const playlistSchema = new mongoose.Schema({
  gameIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true}],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  user: { type: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    _id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" }
  }, required: true }
}, {
  methods: {
    toJSON(){
      return {
        _id: this._id,
        gameId: this.gameIds,
        userId: this.userId,
        user: this.user
      }
    }
  }, statics: {
    findPlaylistByUserId(userId: string): Promise<IPlaylist | null> {
      return this.findOne({ userId });
    },
    async addGame(userId: string, gameId: string): Promise<IPlaylist | null> {
      const playlist = await this.findOne({ userId });
      if (!playlist) {
        return null;
      }
      const myGame = new mongoose.Types.ObjectId(gameId)
      if (!playlist.gameIds.includes(myGame)) {
        playlist.gameIds.push(myGame);
        await playlist.save();
      }
      return playlist.populate('gameIds');
    },
    async removeGame(userId: string, gameId: string): Promise<IPlaylist | null> {
      const playlist = await this.findOne({ userId: new mongoose.Types.ObjectId(userId) });
      if (!playlist) {
        return null;
      }
      const myGame = new mongoose.Types.ObjectId(gameId);
      const gameIndex = playlist.gameIds.findIndex(id => id.equals(myGame));
      if (gameIndex !== -1) {
        playlist.gameIds.splice(gameIndex, 1);
        await playlist.save();
      }
      return playlist;
    }
  }
});

const Playlist = mongoose.model<IPlaylist, PlaylistModel>("Playlist", playlistSchema);

export default Playlist;