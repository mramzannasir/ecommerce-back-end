import { app } from "./app.js";
import { connectDB } from "./utils/connectDB.js";

connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Backend is now working on port ${process.env.PORT}.....`);
});
