import { QueryDatabaseParameters } from "@notionhq/client/build/src/api-endpoints";

import { DateTime } from "luxon";
import { Database } from "../base/Database";
import { Page } from "../base/Page";
import { notion } from "../lib/notion";

export class DaysDatabase extends Database {
  static databaseId = "453d57108ca443f58f0ef19d592d9b08";
  databaseId = "453d57108ca443f58f0ef19d592d9b08";

  pageModel = DayPage;

  constructor() {
    super();
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
      database_id: DaysDatabase.databaseId,
      filter: {
        property: "Date",
        date: {
          equals: DateTime.now().toISODate(),
        },
      },
    };
  }

  /**
   * Days Undone or in Inbox state 
   * */ 
  get activeDaysFilter(): QueryDatabaseParameters {
    return {
      database_id: DaysDatabase.databaseId,
      filter: {
        or: [
          {
            property: "Done",
            checkbox: {
              equals: false,
            },
          },
          {
            property: "📥",
            checkbox: {
              equals: true,
            },
          },
        ],
      },
      sorts: [
        {
          property: "Date",
          direction: "descending",
        },
      ],
    };
  }
}

export class DayPage extends Page {
  database = DaysDatabase;

  static async createTodayPage() {
    console.log("Creating page");
    const todayProp = {
      date: {
        start: DateTime.now().startOf(`day`).toISODate(),
      },
    };



    try {
      const todayPage = await notion.pages.create({
        parent: { database_id: "453d57108ca443f58f0ef19d592d9b08" },
        properties: {
          title: {
            type: "title",
            title: [
              {
                mention: todayProp,
              },
            ],
          },
          Date: todayProp,
        },
      });

      return todayPage;
    } catch (error) {
      console.log(error);
    }
  }
}
