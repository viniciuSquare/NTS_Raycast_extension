import { getPreferenceValues, Icon, MenuBarExtra } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { TasksDatabase } from "./notionAPI/databases/TasksDatabase";

export default function Command() {
  const preferences = getPreferenceValues<any>();

  const tasksDatabase = new TasksDatabase(preferences.personalAccessToken);
  // tasksDatabase.setQueryFilter({
  //     filter: {
  //         property: "State",
  //         equals: "Doing"
  //     }
  // })

  const { isLoading, data: tasksPages } = usePromise(async () => {
    const pages = await tasksDatabase.getData().then();
    return pages;
  });

  // console.log(!isLoading ? tasksPages?.results[0].icon.emoji : "isLoading");

  return (
    <MenuBarExtra icon="https://github.githubassets.com/favicons/favicon.png">
      {!isLoading ? (
        tasksPages?.results.map((page: any) => {
          return (
            <MenuBarExtra.Item
              icon={page.icon?.emoji ? page.icon.emoji : Icon.ChevronRightSmall}
              title={page.properties.Name.title[0].plain_text}
              key={page.id}
              onAction={() => open(page.url)}
            />
          );
        })
      ) : (
        <MenuBarExtra.Item icon={Icon.ChevronRightSmall} title="Carregando" />
      )}
    </MenuBarExtra>
  );
}
