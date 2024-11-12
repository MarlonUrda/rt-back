import { Request, Response } from "express";
import Comment from "../../database/models/comment";
import {
  CreateCommentRequest,
  CreateCommentRequestSchema,
  CreateCommentResponse,
  UpdateCommentRequest,
  UpdateCommentResponseSchema,
  DeleteCommentRequest,
  DeleteCommentResponseSchema,
} from "../../types/api/comments";

export const addComment = async (req: Request, res: Response) => {
  const { success, data, error } = CreateCommentRequestSchema.safeParse(req.body)

  if (!success || !data){
    res.status(400).json({ error: error.message ?? "Peticion invalida" })
    return
  }

  const comment = await Comment.findComment(data.gameId, data.userId)

  if(comment){
    res.status(400).json({ error: "El usuario ya ha comentado este juego" })
    return
  }

  const newComment = new Comment({
    content: data.content,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    gameId: data.gameId,
    userId: data.userId,
  })

  await newComment.save()

  res.status(201).json({ commentId: newComment.id })
}

export const getComment = async (_req: Request, res: Response) => {

  const { id } = _req.params
  console.log(id)

  if(!id){
    res.status(400).json({ error: "No se ha encontrado un id valido" })
    return
  }

  const comments = await Comment.findCommentsByGameId(Number(id))

  if(comments && comments.length > 0) {
    for(const comment of comments) {
      await comment.populate("userId", "firstName lastName")
    }
  }

  res.status(200).json(comments || [])
}