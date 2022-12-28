import { 
  ActionPanel, 
  Detail, 
  List, 
  Action, 
  getPreferenceValues, 
  Icon 
} from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { LogsDatabase } from "./notionAPI/databases/LogsDatabase";
import { Database } from "./notionAPI/base/Database";
import { ListProps } from "./notionAPI/types";

export default function Command() {
  const preferences = getPreferenceValues<any>();

  const logsDatabase = new LogsDatabase(preferences.personalAccessToken);

  const { isLoading, data: logsPages } = usePromise(async () => {
    const pages = await logsDatabase.getData();
    return pages;
  });
    console.log(logsPages)
  return (
    <LogsList isLoading={isLoading}  databasePages={logsPages?.results}/>
  );
}

function LogsList(props: ListProps) {
  return (
    <List isLoading={props.isLoading}>
      {
        props.databasePages?.map( (page: any) => {
          return (
            <List.Item
              icon={ page.icon?.emoji ? page.icon.emoji : Icon.ChevronRightSmall}
              title={page.properties.Name.title[0].plain_text}
              key={page.id}
              actions={
                <ActionPanel>
                  <Action.Push title="Show Details" target={<Detail markdown="# Hey! 👋" />} />
                </ActionPanel>
              }
              accessories={[ 
                { text: page.properties.State.status.name },
                { date: new Date(Database.getDate(page, "Due to")) } 
              ]}
            />
            
            )
          }
        )
      }
    </List>
  )
}