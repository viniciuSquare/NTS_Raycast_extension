import { Client } from "@notionhq/client";
import {
  DatabaseObjectResponse,
  PageObjectResponse,
  PartialPageObjectResponse,
  QueryDatabaseParameters,
  QueryDatabaseResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { notion } from "../lib/notion";
import { Page } from "./Page";

export abstract class Database {
  private notion = notion;

  abstract databaseId: string;

  private databasePages!: DatabaseObjectResponse | QueryDatabaseResponse;
  private queryFilter!: QueryDatabaseParameters;

  public pageModel: typeof Page = Page;

  setQueryFilter(queryFilter: QueryDatabaseParameters) {
    this.queryFilter = queryFilter;
  }

  setPageModel(pageModel: typeof Page) {
    this.pageModel = pageModel;
  }

  /***
   * Get database pages
   * */
  async getData(queryFilter: QueryDatabaseParameters | null = null) {
    this.databasePages = (await this.notion.databases.query(
      queryFilter ? queryFilter : this.queryFilter
    )) as unknown as DatabaseObjectResponse | QueryDatabaseResponse;
    
    return this.pages;
  }

  get properties() {
    return this.databasePages?.properties;
  }

  get pages(): Page[] {
    return this.databasePages.results
      .map((notionPage: PageObjectResponse | PartialPageObjectResponse) => new this.pageModel(notionPage));
  }

  get templates() {
    return this.notion
      .pages.retrieve({
        page_id: this.databaseId,
        filter_properties: [`template = true`]
      }).then( res => {
        console.log(res)
      } )
      // ({
      //   filter: {
      //     property: "object",
      //     value: "page",
      //   },
      //   query: "template = true",

      // },

      // )
      // .then((results) => {
      //   console.log("Templates: ", results);
      // })
      // .catch((error) => {
      //   console.log("Error searching templates: ", error);
      // });
  }
}
