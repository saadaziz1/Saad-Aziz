import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    genre: { 
      type: String, 
      required: true,
      enum: ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Thriller', 'Sci-Fi', 'Fantasy', 'Adventure', 'Documentary', 'Animation']
    },
    releaseYear: { type: Number, required: true },
    duration: { type: Number, required: true }, // seconds
    thumbnailUrl: { type: String, required: true },
    videoUrl: { type: String, required: true },
    publicId: { type: String },
    isVisible: { type: Boolean, default: true },
    languages: [{ type: String }],
    director: {
      name: { type: String },
      image: { type: String },
      country: { type: String }
    },
    cast: [{
      name: { type: String },
      image: { type: String }
    }],
    reviews: [{
      name: { type: String },
      location: { type: String },
      rating: { type: Number, min: 1, max: 5 },
      review: { type: String }
    }]
  },
  { timestamps: true }
);

export default mongoose.model("Video", videoSchema);
