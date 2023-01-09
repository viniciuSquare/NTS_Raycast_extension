import { QueryDatabaseParameters } from "@notionhq/client/build/src/api-endpoints";
import { DateTime } from "luxon";
import { Database } from "../base/Database";
import { Page } from "../base/Page";

export class DaysDatabase extends Database {
  databaseId = "453d57108ca443f58f0ef19d592d9b08";

  protected pageModel: typeof Page = DayPage

  constructor(connectionToken: string) {
    super(connectionToken);
    this.setQueryFilter(this.todayFilter);
  }

  /***
   * Filter between yesterday and today
   * */
  get nowDaysFilter() {
    return {
      and: [
        {
          property: "Date",
          date: {
            on_or_after: DateTime.now().minus({ days: 1 }).toISODate(),
          },
        },
        {
          property: "Date",
          date: {
            on_or_before: DateTime.now().toISODate(),
          },
        },
      ],
    };
  }

  get todayFilter(): QueryDatabaseParameters {
    return {
      database_id: this.databaseId,
      filter: {
        property: "Date",
        date: {
          equals: DateTime.now().toISODate(),
        },
      },
    };
  }
}

export class DayPage extends Page {
  get title() {
    return this.properties["Date"].date.start
  }

  get icon() {
    return "🗓";
  }
}