import Bull from "bull";
import validationProcess from "../processes/validation.process";

const validationQueue = new Bull("validation", {
  redis: "localhost:6380",
});

validationQueue.process(validationProcess);

const validate = (data: any) => {
  validationQueue.add(data, {
    attempts: 3,
  });
};

export { validate, validationQueue };
