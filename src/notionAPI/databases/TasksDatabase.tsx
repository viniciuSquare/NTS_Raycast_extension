import { QueryDatabaseParameters } from "@notionhq/client/build/src/api-endpoints";
import { DateTime } from "luxon";
import { Database } from "../base/Database";

export class TasksDatabase extends Database {
  /***
   * Filter to tasks between yesterday and today
   */
  private baseQueryFilter = {
    database_id: "f1abd3b9a124474aa43c5a6478ce9057",
    filter: {
      and: [
        {
          property: "done",
          checkbox: {
            equals: false,
          },
        },
        {
          ...this.nowDaysFilter
        },
      ],
    },
    sorts: [{
      property: "Due to",
      direction: "descending"
    }]
  };

  constructor(connectionToken: string) {
    super(connectionToken);
    this.setQueryFilter(this.baseQueryFilter);
  }

  /***
   * Filter between yesterday and today
   * */ 
  get nowDaysFilter () {
    return {
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
    }
  }
}
