import { QueryDatabaseParameters } from "@notionhq/client/build/src/api-endpoints";
import { DateTime } from "luxon";
import { Database } from "../base/Database";
import { Page } from "../base/Page";

export class TasksDatabase extends Database {
  databaseId = "f1abd3b9a124474aa43c5a6478ce9057";

  pageModel = TaskPage;

  constructor() {
    super();
    this.setQueryFilter(this.nowDaysFilter);
    this.setPageModel(TaskPage);
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
        and: [
          {
            property: "done",
            checkbox: {
              equals: false,
            },
          },
          {
            or: [
              {
                property: "Status",
                status: {
                  equals: "Doing",
                },
              },
              {
                property: "Session",
                formula: {
                  string: {
                    contains: "🔥",
                  },
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
}

export class TaskPage extends Page {
  public dateProperty = "Due to";
}
