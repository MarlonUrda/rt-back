import { Request, Response } from "express";
import Review from "../../database/models/review";
import {
  CreateReviewRequest,
  CreateReviewRequestSchema,
  CreateReviewResponse,
  UpdateReviewRequest,
  UpdateReviewResponseSchema,
  DeleteReviewRequest,
  DeleteReviewResponseSchema,
  UpdateReviewRequestSchema,
  DeleteReviewRequestSchema,
} from "../../types/api/reviews";
import JwtPayloadWithUser from "../../types/api/jwtPayload";
import Game from "../../database/models/game";

export const createReview = async (req: Request, res: Response) => {
  const { success, data, error } = CreateReviewRequestSchema.safeParse(
    req.body
  );

  const user = res.locals.user as JwtPayloadWithUser;

  if (!success || !data) {
    res.status(400).json({ error: error.message ?? "Peticion invalida" });
    return;
  }

  const comment = await Review.findReview(data.gameId, user.user.id);

  if (comment) {
    res.status(400).json({ error: "El usuario ya ha comentado este juego" });
    return;
  }

  const newReview = new Review({
    content: data.content,
    rating: data.rating,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    gameId: data.gameId,
    userId: user.user.id,
    user: {
      firstName: user.user.firstName,
      lastName: user.user.lastName,
      _id: user.user.id,
    },
    reviewType: user.user.role,
  });

  await newReview.save();
  res.status(201).json({ _id: newReview.id });


  const game = await Game.findById(data.gameId);

  if (!game) {
    return;
  }

  const userRating = game.mt_rating_user || 0;
  const criticRating = game.mt_rating_critic || 0;
  const userRatingCount = game.mt_rating_user_count || 0;
  const criticRatingCount = game.mt_rating_critic_count || 0;

  if (user.user.role === "user") {
    const newRating = (userRating * userRatingCount + data.rating) / (userRatingCount + 1);

    await game.updateOne({
      mt_rating_user: newRating,
      mt_rating_user_count: userRatingCount + 1,
    })
    return;
  }

  const newRating = (criticRating * criticRatingCount + data.rating) / (criticRatingCount + 1);

  await game.updateOne({
    mt_rating_critic: newRating,
    mt_rating_critic_count: criticRatingCount + 1,
  });


}


export const getGameReviews = async (_req: Request, res: Response) => {
  const { id } = _req.params;
  console.log(id);

  if (!id) {
    res.status(400).json({ error: "No se ha encontrado un id valido" });
    return;
  }

  const comments = await Review.findReviewsByGameId(id);
  console.log(comments, "comments");

  res.status(200).json(comments || []);
};

export const getCommentbyId = async (_req: Request, res: Response) => {
  const { id } = _req.params;

  if (!id) {
    res.status(400).json({ error: "No se ha encontrado un id valido" });
    return;
  }

  const comment = await Review.findById(id);

  if (!comment) {
    res.status(404).json({ error: "Comentario no encontrado" });
    return;
  }

  res.status(200).json(comment);
};

export const updateReview = async (req: Request, res: Response) => {
  const { success, data, error } = UpdateReviewRequestSchema.safeParse(
    req.body
  );

  const user = res.locals.user as JwtPayloadWithUser;

  if (!success || !data) {
    res.status(400).json({ error: error.message ?? "Peticion invalida" });
    return;
  }

  if (!data._id) {
    res.status(400).json({ error: "No se ha encontrado un id valido" });
    return;
  }

  const updateData: Partial<{ content: string; rating: number }> = {};

  if (data.content) updateData.content = data.content;
  if (data.rating) updateData.rating = data.rating;

  try {
    const update = await Review.findByIdAndUpdate(data._id, updateData, {
      new: true,
    });

    if (!update) {
      res.status(404).json({ error: "Comentario no encontrado" });
      return;
    }

    res.status(200).json({ _id: update.id });

    const game = await Game.findById(update.gameId);

    if (!game) {
      return;
    }

    const userRating = game.mt_rating_user || 0;
    const criticRating = game.mt_rating_critic || 0;
    const userRatingCount = game.mt_rating_user_count || 0;
    const criticRatingCount = game.mt_rating_critic_count || 0;

    if (user.user.role === "user") {
      const newRating = (userRating * userRatingCount - update.rating + data.rating) / userRatingCount;

      await game.updateOne({
        mt_rating_user: newRating,
        mt_rating_user_count: userRatingCount + 1,
      })
      return;
    }

    const newRating = (criticRating * criticRatingCount - update.rating + data.rating) / criticRatingCount;

    await game.updateOne({
      mt_rating_critic: newRating,
      mt_rating_critic_count: criticRatingCount + 1,
    });


  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el comentario." });
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { success, data, error } = DeleteReviewRequestSchema.safeParse({
    _id: id,
  });

  if (!success || !data) {
    res.status(400).json({ error: error.message ?? "Peticion invalida" });
    return;
  }

  if (!data._id) {
    res.status(400).json({ error: "No se ha encontrado un id valido" });
    return;
  }

  try {
    const deleted = await Review.findByIdAndDelete(data._id);

    if (!deleted) {
      res.status(404).json({ error: "Comentario no encontrado" });
      return;
    }

    res.status(200).json({ _id: deleted.id });
  } catch (error) {
    res.status(500).json({ error: "Error borrando el comentario" });
  }
};
