import { Job, Queue, QueueScheduler, Worker } from "bullmq";
import IORedis from "ioredis";
import path from "path";

const connection = new IORedis();

const queueName = "updates";

const updatesQueueSchedule = new QueueScheduler(queueName);
const updatesQueue = new Queue(queueName, { connection });

const processorFile = path.join(__dirname, "../processes/updates.process.ts");
const updatesWorker = new Worker(queueName, processorFile, {
  concurrency: 10,
});

updatesWorker.on("completed", (job: Job, returnvalue: any) => {
  console.log("BULLMQ `completed` the job");
});

updatesWorker.on("progress", (job: Job, progress: number | object) => {
  console.log("BULLMQ `progress` the job");
});

updatesWorker.on("failed", (job: Job, failedReason: string) => {
  console.log("BULLMQ `failed` the job");
});

const notify = (data: any) => {
  updatesQueue.add(queueName, data, {
    attempts: 3,
  });
};

export { notify, updatesQueue };
