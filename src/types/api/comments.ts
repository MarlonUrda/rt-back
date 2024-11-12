import mongoose from "mongoose";
import z from "zod"

export type CreateCommentRequest = {
  content: string;
  createdAt: Date;
  updatedAt: Date;
  gameId: number;
  userId: string;
}

const objectIdValidator = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
  message: "Invalid ObjectId",
});

export const CreateCommentRequestSchema = z.object({
  content: z.string().min(1).max(100),
  createdAt: z.date(),
  updatedAt: z.date(),
  gameId: z.number(),
  userId: objectIdValidator,
})


export const CreateCommentResponse = z.object({
  _id: z.string()
})

export type UpdateCommentRequest = {
  _id: string,
  content?: string
}

export const UpdateCommentResponseSchema = z.object({
  _id: z.string()
})

export type DeleteCommentRequest = {
  _id: string
}

export const DeleteCommentResponseSchema = z.object({
  _id: z.string()
})