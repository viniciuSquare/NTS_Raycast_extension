import { ActionPanel, Detail, List, Action, getPreferenceValues, Icon } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { TasksDatabase } from "./notionAPI/databases/TasksDatabase";
import { Database } from "./notionAPI/base/Database";
import { ListProps } from "./notionAPI/types";
import { PageDetails } from "./components/PageDetails";

export default function Command() {
  const preferences = getPreferenceValues<any>();

  const tasksDatabase = new TasksDatabase(preferences.personalAccessToken);

  const { isLoading, data: tasksPages } = usePromise(async () => {
    const pages = await tasksDatabase.getData();
    return pages;
  });

  return <TasksList isLoading={isLoading} databasePages={tasksPages} token={preferences.personalAccessToken} />;
}

function TasksList(props: ListProps) {
  return (
    <List isLoading={props.isLoading}>
      {props.databasePages?.map((page) => {
        return (
          <List.Item
            icon={page.icon}
            title={page.title}
            key={page.id}
            actions={
              <ActionPanel>
                <Action.Open title="Open" target={page.url} />
                <Action.Open title="Open on Notion" target={page.urlToNotionOnNewTab} />
                <Action.Push title="Show Details" target={<PageDetails page={page} token={props.token} />} />
              </ActionPanel>
            }
            accessories={[
              { text: page.properties.Status.status.name },
              { date: new Date(page.getDate(page)) },
            ]}
          />
        );
      })}
    </List>
  );
}
