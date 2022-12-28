import { Client } from "@notionhq/client";
import { PageObjectResponse, PartialPageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { Detail } from "@raycast/api";
import { useFetch, usePromise } from "@raycast/utils";
import { Page } from "../notionAPI/base/Page";

interface PageDetailsProps {
    token?: string,
    page: Page
}
export function PageDetails(props: PageDetailsProps) {
    const { page, token }= props;

    const { isLoading, data: blocks } = usePromise( async () => {
        return await page.getContent(token);
        }
    )
    console.log(blocks);

    if(!token) 
        return <Detail markdown={"Token is not informed"} />

    return (
        <Detail markdown="### Page data" />
    )
}