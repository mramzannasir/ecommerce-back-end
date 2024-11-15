import mongoose from "mongoose";

export const connectDB = () => {
  mongoose
    .connect(process.env.MONGODB_URI || "mongodb://localhost:27017", {
      dbName: "e-commerce-app",
    })
    .then((c) => console.log(`DB connected to ${c.connection.host}`))
    .catch((e) => console.log(e, "Something  went wrong to connect database"));
};
