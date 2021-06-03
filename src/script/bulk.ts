import _ from "lodash";
import { v4 } from "uuid";
import { validate } from "../queue/validation.queue";

_.each(Array(10), (_, i) => {
  const job = {
    jobId: v4(),
    type: "bulk-action",
    payload: {
      data: [{ a: "a" }, { b: "b" }, { c: "c" }],
    },
  };

  console.log("Pushing job ", i);
  validate(job);
});
