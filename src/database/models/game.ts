import mongoose from "mongoose";
import {
  developers,
  esrbRating,
  genres,
  parentPlatform,
  platformDetails,
} from "../../types/api/games/generics";
import z from "zod";

export interface IGame extends mongoose.Document {
  external_id: number;
  name: string;
  slug: string;
  released: string;
  tba: boolean;
  metacritic: number;
  description_raw: string;
  background_image: string;
  playtime: number;
  rating: number;
  esrb_rating: z.infer<typeof esrbRating>;
  platforms: Array<z.infer<typeof platformDetails>>;
  parent_platforms: Array<z.infer<typeof parentPlatform>>;
  genres: Array<z.infer<typeof genres>>;
  score: number;
  reviews_count: number;
  added: number;
  developers: Array<z.infer<typeof developers>>;
}

export interface GameModel extends mongoose.Model<IGame> {
  findByExternalId(external_id: number): Promise<IGame | null>;
  toJSON(): IGame;
}

const gameSchema = new mongoose.Schema(
  {
    external_id: { type: Number, required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    released: { type: String, required: true },
    tba: { type: Boolean, required: true },
    metacritic: { type: Number, required: true },
    description_raw: { type: String, required: true },
    background_image: { type: String, required: true },
    playtime: { type: Number, required: true },
    rating: { type: Number, required: true },
    esrb_rating: {
      type: {
        id: { type: Number, required: true },
        slug: { type: String, required: true },
        name: { type: String, required: true },
      },
      required: true,
    },
    platforms: {
      type: [
        {
          platform: {
            id: { type: Number, required: true },
            slug: { type: String, required: true },
            name: { type: String, required: true },
          },
          released_at: { type: String, required: true },
        },
      ],
      required: true,
    },
    parent_platforms: {
      type: [
        {
          platform: {
            id: { type: Number, required: true },
            slug: { type: String, required: true },
            name: { type: String, required: true },
          },
        },
      ],
      required: true,
    },
    genres: {
      type: [
        {
          id: { type: Number, required: true },
          name: { type: String, required: true },
        },
      ],
      required: true,
    },
    score: { type: Number, required: true, default: 0 },
    reviews_count: { type: Number, required: true, default: 0 },
    added: { type: Number, required: true },
    developers: {
      type: [
        {
          id: { type: Number, required: true },
          name: { type: String, required: true },
        },
      ],
      required: true,
    },
  },
  {
    methods: {
      toJSON() {
        return {
          _id: this._id,
          external_id: this.external_id,
          name: this.name,
          slug: this.slug,
          released: this.released,
          tba: this.tba,
          metacritic: this.metacritic,
          description_raw: this.description_raw,
          background_image: this.background_image,
          playtime: this.playtime,
          rating: this.rating,
          esrb_rating: this.esrb_rating,
          platforms: this.platforms,
          parent_platforms: this.parent_platforms,
          genres: this.genres,
          score: this.score,
          reviews_count: this.reviews_count,
          added: this.added,
          developers: this.developers,
        };
      },
    },
    statics: {
      findByExternalId(external_id: number): Promise<IGame | null> {
        return this.findOne({ external_id });
      },
    },
  }
);

const Game = mongoose.model<IGame, GameModel>("Game", gameSchema);

export default Game;
