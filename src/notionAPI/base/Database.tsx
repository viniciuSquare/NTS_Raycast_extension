import { Client } from "@notionhq/client"
import { PageObjectResponse, QueryDatabaseParameters, QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";
import { Page } from "./Page";

export abstract class Database {
    private notion;

    private databasePages!: QueryDatabaseResponse;
    private queryFilter: QueryDatabaseParameters;

    constructor( 
        private token: string
    ) {
        this.notion = new Client({
            auth: this.token,
        })       
    }

    setQueryFilter( queryFilter: QueryDatabaseParameters ) {
        this.queryFilter = queryFilter;
    }

    /***
     * Get database pages
     * */ 
    async getData( queryFilter = null ) {
        this.databasePages = await this.notion.databases.query( queryFilter ? queryFilter: this.queryFilter )

        return this.databasePages;
    }

    get properties() {
        return this.databasePages.properties;
    }

    static getDate( databasePage: Page, datePropertyKey: string ) {
        const taskDueTo = databasePage.properties[datePropertyKey];
        
        if( !taskDueTo ) {
            return
        }

        console.log(taskDueTo.date.start);
        return taskDueTo.date.start;
    }
}