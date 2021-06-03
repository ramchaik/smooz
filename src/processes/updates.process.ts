import { SandboxedJob } from "bullmq";

module.exports = async (job: SandboxedJob) => {
  console.log(" ------ Updates process -----");

  console.log("notify user about job -- ", { job });

  return { done: true };
};
