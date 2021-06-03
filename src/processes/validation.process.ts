import { SandboxedJob } from 'bullmq';
import { doTask } from "../queue/tasks.queue";

module.exports = async (job: SandboxedJob) => {
  console.log(' ------ Validation process -----');
  
  if (Math.random() * 10 > 5) {
    throw new Error("job failed - test failing");
  }

  for (let i = 0; i < 100; i++) {
    // console.log(i + "processing");
    // console.log(job.data);
  }

  doTask(job.data);

  return { done: true };
};