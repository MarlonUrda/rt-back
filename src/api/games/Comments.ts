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
  UpdateCommentRequestSchema,
  DeleteCommentRequestSchema,
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
    rating: data.rating,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    gameId: data.gameId,
    userId: data.userId,
  })

  await newComment.save()

  res.status(201).json({ _id: newComment.id })
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
      console.log(comment)
    }
  }

  res.status(200).json(comments || [])
}

export const getCommentbyId = async (_req: Request, res: Response) => {
  const { id } = _req.params

  if (!id) {
    res.status(400).json({ error: "No se ha encontrado un id valido" })
    return
  }

  const comment = await Comment.findCommentbyId(id)

  if (!comment) {
    res.status(404).json({ error: "Comentario no encontrado" })
    return
  }

  res.status(200).json(comment)
}

export const updateComment = async (req: Request, res: Response) => {
  const { success, data, error } = UpdateCommentRequestSchema.safeParse(req.body)

  if(!success || !data) {
    res.status(400).json({ error: error.message?? "Peticion invalida" })
    return
  }

  if(!data._id){
    res.status(400).json({ error: "No se ha encontrado un id valido" })
    return
  }

  const updateData: Partial<{ content: string; rating: number }> = {}

  if (data.content) updateData.content = data.content
  if (data.rating) updateData.rating = data.rating

  try {
    const update = await Comment.findByIdAndUpdate(data._id, updateData, { new: true })

    if (!update) {
      res.status(404).json({ error: "Comentario no encontrado" })
      return
    }

    res.status(200).json({ _id: update.id })
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el comentario." })
  }

}

export const deleteComment = async (req: Request, res: Response) => {
  const { success, data, error } = DeleteCommentRequestSchema.safeParse(req.body)

  if(!success || !data) {
    res.status(400).json({ error: error.message?? "Peticion invalida" })
    return
  }

  if (!data._id) {
    res.status(400).json({ error: "No se ha encontrado un id valido" })
    return
  }

  try {
    const deleted = await Comment.findByIdAndDelete(data._id)
    
    if (!deleted) {
      res.status(404).json({ error: "Comentario no encontrado" })
      return
    }

    res.status(200).json({ _id: deleted.id })
  } catch (error) {
    res.status(500).json({ error: "Error borrando el comentario" })
  }
}