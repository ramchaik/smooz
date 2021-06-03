import { Job, Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import path from 'path';

const connection = new IORedis();

const queueName = "tasks";

const tasksQueue = new Queue(queueName, { connection });

const processorFile = path.join(__dirname, '../processes/tasks.process.ts');
const taskWorker = new Worker(queueName, processorFile);

taskWorker.on("completed", (job: Job, returnvalue: any) => {
  console.log('BULLMQ `completed` the job')
});

taskWorker.on("progress", (job: Job, progress: number | object) => {
  console.log('BULLMQ `progress` the job'); 
});

taskWorker.on("failed", (job: Job, failedReason: string) => {
  console.log('BULLMQ `failed` the job') 
});

const doTask = (data: any) => {
  tasksQueue.add(queueName, data, {
    attempts: 3,
  });
};

export { doTask, tasksQueue };
