import { PageObjectResponse, PartialPageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { Page } from "./base/Page";

export interface ListProps {
    isLoading: boolean,
    databasePages: undefined | Page[],
    token?: string
}