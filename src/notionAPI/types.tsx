import { PageObjectResponse, PartialPageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export interface ListProps {
    isLoading: boolean,
    databasePages: undefined | (PageObjectResponse | PartialPageObjectResponse)[],
    token?: string
}