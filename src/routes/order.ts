import express from "express";
import { myOrders, newOrder } from "../controllers/order.js";

const app = express.Router();

app.post("/new", newOrder);

app.get("/my/:id", myOrders);

export default app;
