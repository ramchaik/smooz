import { SandboxedJob } from "bullmq";

module.exports = async (job: SandboxedJob) => {
  console.log(" ------ Tasks process -----");

  if (Math.random() * 10 > 5) {
    throw new Error("job failed - test failing");
  }

  // for (let i = 0; i < 1000; i++) {}

  return { done: true };
};
