import bodyParser from "body-parser";
import express from "express";
import { tasksQueue } from "./queue/tasks.queue";
import { validate, validationQueue } from "./queue/validation.queue";
const { createBullBoard } = require("@bull-board/api");
const { BullMQAdapter } = require("@bull-board/api/bullMQAdapter");
const { ExpressAdapter } = require("@bull-board/express");
const serverAdapter = new ExpressAdapter();

const app = express();
const PORT = 8080;

app.use(bodyParser.json());

const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  queues: [new BullMQAdapter(tasksQueue), new BullMQAdapter(validationQueue)],
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
