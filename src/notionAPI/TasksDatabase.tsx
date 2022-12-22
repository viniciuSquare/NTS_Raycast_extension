import { DateTime } from "luxon";
import { Database } from "./Database";

export class TasksDatabase extends Database {
  /***
   * Filter to tasks between yesterday and today
   */
  private baseQueryFilter = {
    filter: {
      and: [
        {
          property: "done",
          checkbox: {
            equals: false,
          },
        },
        {
          and: [
            {
              property: "Due to",
              date: {
                on_or_after: DateTime.now().minus({ days: 1 }).toISODate(),
              },
            },
            {
              property: "Due to",
              date: {
                on_or_before: DateTime.now().toISODate(),
              },
            },
          ],
        },
      ],
    },
  };

  constructor(connectionToken: string) {
    super("f1abd3b9a124474aa43c5a6478ce9057", connectionToken);
    this.setQueryFilter(this.baseQueryFilter);
  }
}
