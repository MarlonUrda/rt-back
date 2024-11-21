import mongoose from "mongoose";

export interface IReview extends mongoose.Document {
  content: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
  gameId: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  user: {
    firstName: string;
    lastName: string;
    _id: mongoose.Schema.Types.ObjectId
  }
  reviewType: string;
}

export interface ReviewModel extends mongoose.Model<IReview> {
  findReview(gameId: string, userId: string): Promise<IReview | null>;
  toJSON(): Omit<IReview, "updatedAt">;
  findReviewsByGameId(gameId: string): Promise<IReview[] | null>;
}

const reviewSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    rating: { type: Number, required: true, min: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    gameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    user: {type: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      _id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    }, required: true},
    reviewType: { type: String, required: true },
  },
  {
    methods: {
      toJSON() {
        return {
          _id: this._id,
          content: this.content,
          rating: this.rating,
          createdAt: this.createdAt,
          updatedAt: this.updatedAt,
          gameId: this.gameId,
          userId: this.userId,
          user: this.user,
          reviewType: this.reviewType,
        };
      },
    },
    statics: {
      findReview(gameId: string, userId: string): Promise<IReview | null> {
        return this.findOne({ gameId, userId });
      },
      findReviewsByGameId(gameId: string): Promise<IReview[] | null> {
        return this.find({ gameId });
      },
    },
  }
);

const Review = mongoose.model<IReview, ReviewModel>("Review", reviewSchema);

export default Review;
