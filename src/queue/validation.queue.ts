import { Job, Queue, Worker } from "bullmq";
import IORedis from "ioredis";
import path from "path";
import { notify } from "./updates.queue";

const connection = new IORedis();

const queueName = "validation";

const validationQueue = new Queue(queueName, { connection });

const processorFile = path.join(
  __dirname,
  "../processes/validation.process.ts"
);
const validationWorker = new Worker(queueName, processorFile, {
  concurrency: 10,
});

validationWorker.on("completed", (job: Job, returnvalue: any) => {
  console.log("BULLMQ `completed` the job");
});

validationWorker.on("progress", (job: Job, progress: number | object) => {
  console.log("BULLMQ `progress` the job");
});

validationWorker.on("failed", (job: Job, failedReason: string) => {
  console.log("BULLMQ `failed` the job");
  if (job.attemptsMade > 3) {
    notify({ job, status: "failure", msg: failedReason });
  }
});

const validate = (data: any) => {
  validationQueue.add(queueName, data, {
    attempts: 3,
  });
};

export { validate, validationQueue };
