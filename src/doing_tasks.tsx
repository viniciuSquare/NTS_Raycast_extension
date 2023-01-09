import { Action, getPreferenceValues, Icon, MenuBarExtra, open } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { Page } from "./notionAPI/base/Page";
import { DaysDatabase } from "./notionAPI/databases/DaysDatabase";
import { TasksDatabase } from "./notionAPI/databases/TasksDatabase";

export default function Command() {
  const preferences = getPreferenceValues<any>();

  const tasksDatabase = new TasksDatabase(preferences.personalAccessToken);
  const daysDatabase = new DaysDatabase(preferences.personalAccessToken);
  let tasksPages :Page[] = [];
  let daysPages  :Page[] = []; 

  const { isLoading, data: pages } = usePromise(async () => {
    const tasksPages = await tasksDatabase.getData(tasksDatabase.doingFilter);
    const daysPages = await daysDatabase.getData();
    return [tasksPages, daysPages];
  });
  
  function setPages() {
    tasksPages = pages[0];
    daysPages  = pages[1]; 

    console.log(daysPages)
  }
  
  if(!isLoading) setPages();

  return (
    <MenuBarExtra icon={Icon.CircleProgress}>
      {(!isLoading || tasksPages?.length) ? (
        <>
          <PagesList pages={daysPages} ></PagesList>
          <MenuBarExtra.Section title="Tasks">
            <PagesList pages={tasksPages} ></PagesList>
          </MenuBarExtra.Section>
        </>
      ) : (
        <MenuBarExtra.Item icon={Icon.ChevronRightSmall} title="Carregando" />
      )}
    </MenuBarExtra>
  );
}

function PagesList( props: { pages: Page[] } ) {
  const { pages } = props;

  return pages?.map((page: Page) => {
    return (
      <MenuBarExtra.Item
        icon={page.icon}
        title={page.title}
        key={page.id}
        onAction={() => open(page.urlToNotionOnNewTab)}
      />
    );
  });
}
