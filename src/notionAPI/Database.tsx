import { Client } from "@notionhq/client"
import { QueryDatabaseParameters, QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";

export class Database {
    private notion;
    
    private queryFilter: QueryDatabaseParameters = {
        database_id: this.databaseId,
    };

    private databasePages!: QueryDatabaseResponse;

    constructor( 
        private databaseId: string, 
        private token: string 
    ) {
        this.setId(databaseId);
        this.setToken(token);

        this.notion = new Client({
            auth: this.token,
        })       
    }

    private setId( databaseId: string ) {
        this.databaseId = databaseId;
    }

    private setToken( token: string ) {
        this.token = token;
    }

    setQueryFilter( queryFilter: any ) {
        this.queryFilter = {
            database_id: this.databaseId,
            ...queryFilter
        };
        console.log(this.queryFilter)
    }

    async getData( queryFilter = null ) {
        this.databasePages = await this.notion.databases.query( queryFilter ? queryFilter: this.queryFilter )
            .then( ( databaseData: QueryDatabaseResponse ) => databaseData );

        return this.databasePages;
    }
}