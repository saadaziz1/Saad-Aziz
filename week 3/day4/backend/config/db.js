const mongoose = require("mongoose");

if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (global.mongoose.conn) return global.mongoose.conn;

  if (!global.mongoose.promise) {
    global.mongoose.promise = mongoose
      .connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 20000, // good for cold starts
      })
      .then((mongoose) => mongoose)
      .catch((err) => {
        console.error("MongoDB error:", err);
        throw err;
      });
  }

  global.mongoose.conn = await global.mongoose.promise;
  return global.mongoose.conn;
}

module.exports = connectDB;
