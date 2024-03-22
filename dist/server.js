import { app } from "./app.js";
import { connectDB } from "./utils/connectDB.js";
connectDB();
app.listen(4040, () => {
    console.log("Backend is now working on port 4040");
});
