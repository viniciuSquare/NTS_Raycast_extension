import { Client } from "@notionhq/client";
import { getPreferenceValues, PreferenceValues } from "@raycast/api";

const preferences = getPreferenceValues<PreferenceValues>();


export const notion = new Client({
        auth: preferences.personalAccessToken,
})