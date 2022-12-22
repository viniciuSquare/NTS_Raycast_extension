import { 
  ActionPanel, 
  Detail, 
  List, 
  Action, 
  getPreferenceValues, 
  Icon 
} from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { TasksDatabase } from "./notionAPI/TasksDatabase";

export default function Command() {
  const preferences = getPreferenceValues<any>();

  const tasksDatabase = new TasksDatabase(preferences.personalAccessToken);

  const { isLoading, data: tasksPages } = usePromise(async () => {
    const pages = await tasksDatabase.getData();
    return pages;
  });

  console.log(!isLoading ? new Date(tasksPages?.results[0].properties["Due to"].date.start) : "isLoading");

  return (
    <List isLoading={isLoading}>
      {
        tasksPages?.results.map( (page: any) => {
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
                { date: new Date(tasksPages?.results[0].properties["Due to"].date.start) } 
              ]}
            />
            
            )
          }
        )
      }
    </List>
  );
}
