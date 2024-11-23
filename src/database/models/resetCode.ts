import mongoose from "mongoose";

const resetCodeSchema = new mongoose.Schema({
  code: { type: String, required: true },
  email: { type: String, required: true }
})

const ResetCode = mongoose.model("Code", resetCodeSchema);

export default ResetCode