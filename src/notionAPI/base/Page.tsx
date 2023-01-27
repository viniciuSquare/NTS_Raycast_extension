import {
  PageObjectResponse,
  PartialPageObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { Icon } from "@raycast/api";

export class Page {
  // private notion: Client;

  public dateProperty = "Date";

  constructor(private notionPage: PageObjectResponse | PartialPageObjectResponse) {
    console.log();
  }

  get id() {
    return this.notionPage.id;
  }

  get title() {
    return this.titleObjectProperty.title.map(({ plain_text }) => plain_text).join("");
  }
  get titleObjectProperty(): {
    type: "title";
    title: Array<RichTextItemResponse>;
  } {
    return this.properties[this.getKeyToTitleProperty];
  }

  get getKeyToTitleProperty(): string {
    return Object.keys(this.properties).filter((key) => this.properties[key].type == "title")[0];
  }

  get icon() {
    if (this.notionPage.icon) {
      switch (this.notionPage.icon.type) {
        case "external":
          return this.notionPage.icon[this.notionPage.icon.type].url;
        case "emoji":
          return this.notionPage.icon.emoji;
      }
    }
    return Icon.ChevronRightSmall;
  }

  public getDate(databasePage: Page, datePropertyKey: string | null = null) {
    if (!datePropertyKey) datePropertyKey = this.dateProperty;

    const taskDueTo = databasePage.properties[datePropertyKey];

    if (!taskDueTo) {
      return;
    }

    return taskDueTo.date.start;
  }

  // async getContent(token: string) {
  //   this.notion = new Client({
  //     auth: token,
  //   });

  //   const blocks = await this.notion.blocks.children.list({
  //     block_id: this.notionPage.id,
  //   });

  //   console.log(blocks);

  //   return blocks;
  // }

  get url() {
    return this.notionPage.url;
  }

  get urlToNotionOnNewTab() {
    return `notion:${this.url.replace("https:", "")}?deepLinkOpenNewTab=true`;
  }

  get properties() {
    return this.notionPage.properties;
  }
}
