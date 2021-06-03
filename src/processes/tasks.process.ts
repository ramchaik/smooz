import { Job } from "bull";

const tasksProcess = async (job: Job) => {
  if (Math.random() * 10 > 5) {
    throw new Error("job failed - test failing");
  }

  for (let i = 0; i < 1000; i++) {
    console.log(i + "processing");
    console.log(job.data);
  }

  return { done: true };
};

export default tasksProcess;
