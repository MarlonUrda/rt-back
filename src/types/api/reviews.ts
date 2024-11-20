import mongoose from "mongoose";
import z from "zod";

export type CreateReviewRequest = {
  content: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
  gameId: string;
  userId: string;
};

const objectIdValidator = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
  });

export const CreateReviewRequestSchema = z.object({
  content: z.string().min(1).max(100),
  rating: z.number(),
  gameId: z.string(),
});

export const CreateReviewResponse = z.object({
  _id: z.string(),
});

export type UpdateReviewRequest = {
  _id: string;
  content?: string;
  rating?: number;
};

export const UpdateReviewRequestSchema = z.object({
  _id: z.string(),
  content: z.string().min(1).max(500),
  rating: z.number(),
});

export const UpdateReviewResponseSchema = z.object({
  _id: z.string(),
});

export type DeleteReviewRequest = {
  _id: string;
};

export const DeleteReviewRequestSchema = z.object({
  _id: z.string(),
});

export const DeleteReviewResponseSchema = z.object({
  _id: z.string(),
});
