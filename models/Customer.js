import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dateOfBirth: { type: Date },
  memberNumber: { type: Number },
  interests: { type: String },
});

export default mongoose.models.Customer ||
  mongoose.model("Customer", CustomerSchema);

