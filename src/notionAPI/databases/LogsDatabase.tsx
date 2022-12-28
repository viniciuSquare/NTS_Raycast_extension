import { DateTime } from "luxon";
import { Database } from "../base/Database";

export class LogsDatabase extends Database {
  /***
   * Filter to today`s logs
   */
  private baseQueryFilter = {
    database_id : "6ccd1c56c75348ac98157e6080087276",
    filter: {
      and: [
        {
          property: "Date",
          date: {
            equals: DateTime.now().toISODate(),
          },
        }
      ],
    },
    sorts: [
      {
        property: "Date",
        direction: "descending"
      }
    ]
  };

  constructor(connectionToken: string) {
    super(connectionToken);
    this.setQueryFilter(this.baseQueryFilter);
  }
}
