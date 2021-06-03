import { Job, Queue, Worker, QueueScheduler } from "bullmq";
import IORedis from "ioredis";
import path from "path";
import { notify } from "./updates.queue";

const connection = new IORedis();

const queueName = "tasks";

const tasksQueueSchedule = new QueueScheduler(queueName);
const tasksQueue = new Queue(queueName, { connection });

const processorFile = path.join(__dirname, "../processes/tasks.process.ts");
const taskWorker = new Worker(queueName, processorFile, {
  concurrency: 5,
  lockDuration: 600000,
});

taskWorker.on("completed", (job: Job, returnvalue: any) => {
  console.log("BULLMQ `completed` the job");
  notify({ job, status: "success", msg: returnvalue });
});

taskWorker.on("progress", (job: Job, progress: number | object) => {
  console.log("BULLMQ `progress` the job");
});

taskWorker.on("failed", (job: Job, failedReason: string) => {
  console.log("BULLMQ `failed` the job");

  if (job.attemptsMade > 3) {
    notify({ job, status: "failure", msg: failedReason });
  }
});

const doTask = (data: any) => {
  tasksQueue.add(queueName, data, {
    attempts: 3,
  });
};

export { doTask, tasksQueue };
