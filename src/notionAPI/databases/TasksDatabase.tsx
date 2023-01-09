import { QueryDatabaseParameters } from "@notionhq/client/build/src/api-endpoints";
import { DateTime } from "luxon";
import { Database } from "../base/Database";

export class TasksDatabase extends Database {
  databaseId = "f1abd3b9a124474aa43c5a6478ce9057";

  constructor(connectionToken: string) {
    super(connectionToken);
    this.setQueryFilter(this.nowDaysFilter);
  }

  /***
   * Filter between yesterday and today
   * */
  get nowDaysFilter(): QueryDatabaseParameters {
    return {
      database_id: this.databaseId,
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
      sorts: [
        {
          property: "Due to",
          direction: "descending",
        },
      ],
    };
  }

  get doingFilter(): QueryDatabaseParameters {
    return {
      database_id: this.databaseId,
      filter: {
        property: "State",
        status: {
          equals: "Doing",
        },
      },
      sorts: [
        {
          property: "Due to",
          direction: "descending",
        },
      ],
    };
  }
}
