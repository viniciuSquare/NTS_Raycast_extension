import { Client } from "@notionhq/client";
import { PageObjectResponse, PartialPageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { Icon } from "@raycast/api";

export class Page {
    private notion: Client;

    constructor( 
        private notionPage: PageObjectResponse | PartialPageObjectResponse
    ) {}

    get id() {
        return this.notionPage.id;
    }

    get title() {
        return this.notionPage.properties.Name?.title[0].plain_text ? this.notionPage.properties.Name?.title[0].plain_text : `+ Nameless > ${this.id}`;
    }

    get icon() {
        return this.notionPage.icon?.emoji ? this.notionPage.icon.emoji : Icon.ChevronRightSmall
    }

    async getContent(token: string) {
        this.notion = new Client({
            auth: token
        });

        const blocks =  await this.notion.blocks.children.list({
            block_id: this.notionPage.id
        })

        console.log(blocks);

        return blocks;
    }

    get url() {
        return this.notionPage.url
    }

    get urlToNotionOnNewTab() {
        return `notion:${this.notionPage.url.replace("https:","")}?deepLinkOpenNewTab=true`
    }

    get properties() {
        return this.notionPage.properties;
    }


}