import Bull from "bull";
import tasksProcess from "../processes/tasks.process";

const tasksQueue = new Bull("tasks", {
  redis: "localhost:6380",
});

tasksQueue.process(tasksProcess);

const doTask = (data: any) => {
  tasksQueue.add(data, {
    attempts: 3,
  });
};

export { doTask, tasksQueue };
