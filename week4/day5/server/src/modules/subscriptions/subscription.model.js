import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    plan: { type: String, enum: ["FREE_TRIAL", "BASIC", "PREMIUM", "STANDARD"], required: true },
    cardDetails: {
      cardNumber: { type: String },
      expiryMonth: { type: Number },
      expiryYear: { type: Number },
      cvv: { type: String }
    },
    status: { type: String, enum: ["ACTIVE", "EXPIRED"], default: "ACTIVE" },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.model("Subscription", subscriptionSchema);
