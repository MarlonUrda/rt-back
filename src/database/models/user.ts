import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  email: string;
  password: string;
  role: "user" | "critic";
  firstName: string;
  lastName: string;
}

interface UserModel extends mongoose.Model<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
  toJSON(): Omit<IUser, "password">;
}

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: "user" },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
  },
  {
    methods: {
      toJSON() {
        return {
          _id: this._id,
          email: this.email,
          role: this.role,
          firstName: this.firstName,
          lastName: this.lastName,
        };
      },
    },
    statics: {
      findByEmail: function (email: string) {
        return this.findOne({ email });
      },
    },
    virtuals: {
      fullName: {
        get() {
          return `${this.firstName} ${this.lastName}`;
        },
      }
    },
  }
);

const User = mongoose.model<IUser, UserModel>("User", UserSchema);

export default User;
