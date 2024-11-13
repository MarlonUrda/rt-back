import mongoose from "mongoose";

export interface IComment extends mongoose.Document {
  content: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
  gameId: number;
  userId: mongoose.Schema.Types.ObjectId;
}

export interface CommentModel extends mongoose.Model<IComment>{
  findComment(gameId: number, userId: string): Promise<IComment | null>;
  toJSON(): Omit<IComment, "updatedAt">;
  findCommentsByGameId(gameId: number): Promise<IComment[] | null>;
}

const commentSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now},
    gameId: { type: Number, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  {
    methods: {
      toJSON() {
        return {
          _id: this._id,
          content: this.content,
          createdAt: this.createdAt,
          updatedAt: this.updatedAt,
          gameId: this.gameId,
          userId: this.userId,
        }
      },
    },
    statics: {
      findComment(gameId: number, userId: string): Promise<IComment | null>{
        return this.findOne({ gameId, userId });
      },
      findCommentsByGameId(gameId: number): Promise<IComment[] | null> {
        return this.find({ gameId });
      }
    }
  }
)

const Comment = mongoose.model<IComment, CommentModel>("Comment", commentSchema);

export default Comment;