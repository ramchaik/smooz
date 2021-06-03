import express from "express";
import bodyParser from "body-parser";
import { tasksQueue, doTask } from "./queue/tasks.queue";
import { validate, validationQueue } from "./queue/validation.queue";
const { createBullBoard } = require("@bull-board/api");
const { BullAdapter } = require("@bull-board/api/bullAdapter");
const { BullMQAdapter } = require("@bull-board/api/bullMQAdapter");
const { ExpressAdapter } = require("@bull-board/express");
const serverAdapter = new ExpressAdapter();

const app = express();
const PORT = 8080;

app.use(bodyParser.json());

const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  queues: [new BullAdapter(tasksQueue), new BullAdapter(validationQueue)],
  serverAdapter: serverAdapter,
});

serverAdapter.setBasePath("/admin/queues");
app.use("/admin/queues", serverAdapter.getRouter());

app.post("/bulk", async (req, res) => {
  console.log("Request recieved", req.body);

  validate(req.body);
  res.send({ status: "ok" });
});

app.listen(PORT, () => {
  console.log("App running on port " + PORT);
});