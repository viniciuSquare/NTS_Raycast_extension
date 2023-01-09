import { Client } from "@notionhq/client"
import { PageObjectResponse, QueryDatabaseParameters, QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";
import { Page } from "./Page";

export abstract class Database {
    private notion;

    private databasePages!: QueryDatabaseResponse;
    private queryFilter: QueryDatabaseParameters;

    abstract databaseId: string;
    protected dateProperty = "Date" ;

    protected pageModel = Page;

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
    async getData( queryFilter: QueryDatabaseParameters | null = null ) {
        this.databasePages = await this.notion.databases.query( queryFilter ? queryFilter: this.queryFilter )

        return this.pages;
    }

    get properties() {
        return this.databasePages.properties;
    }

    static getDate( databasePage: Page, datePropertyKey: string ) {
        if(!datePropertyKey)
            datePropertyKey = this.dateProperty;

        const taskDueTo = databasePage.properties[datePropertyKey];
        
        if( !taskDueTo ) {
            return
        }

        return taskDueTo.date.start;
    }

    get pages() {
        return this.databasePages.results.map( 
            notionPage => new this.pageModel(notionPage)
        )
    }
}