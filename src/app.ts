import bodyParser from "body-parser";
import express from "express";
import { tasksQueue } from "./queue/tasks.queue";
import { validate, validationQueue } from "./queue/validation.queue";
import { updatesQueue } from "./queue/updates.queue";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";

const serverAdapter = new ExpressAdapter();

const app = express();
const PORT = 8080;

app.use(bodyParser.json());

const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  queues: [
    new BullMQAdapter(tasksQueue),
    new BullMQAdapter(validationQueue),
    new BullMQAdapter(updatesQueue),
  ],
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
