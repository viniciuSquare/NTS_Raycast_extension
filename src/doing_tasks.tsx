import { Icon, MenuBarExtra, open } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { Page } from "./notionAPI/base/Page";
import { DayPage, DaysDatabase } from "./notionAPI/databases/DaysDatabase";
import { TasksDatabase } from "./notionAPI/databases/TasksDatabase";

export default function Command() {
  const tasksDatabase = new TasksDatabase();
  const daysDatabase = new DaysDatabase();
  let tasksPages: Page[] = [];
  let daysPages: Page[] = [];

  const { isLoading, data: pages } = usePromise(async () => {
    const promises = [
      await tasksDatabase.getData(tasksDatabase.doingFilter),
      await daysDatabase.getData(daysDatabase.activeDaysFilter)
    ]
    return await Promise.all(promises)
  });

  function setPages() {
    if(pages) {
      tasksPages = pages[0];
      daysPages = pages[1];
    } else console.log("There are no pages")

    // console.log(daysPages[0].titleObjectProperty.title);
    // console.log(daysDatabase.templates)
  }

  if (!isLoading) setPages();

  return (
    <MenuBarExtra icon={Icon.CircleProgress}>
      <TodayPage pages={daysPages}></TodayPage>
      {!isLoading || tasksPages?.length ? (
        <>
          <MenuBarExtra.Section title="Tasks">
            <PagesList pages={tasksPages}></PagesList>
          </MenuBarExtra.Section>
        </>
      ) : (
        <MenuBarExtra.Item icon={Icon.ChevronRightSmall} title="Carregando" />
      )}
    </MenuBarExtra>
  );
}

interface PageListProps {
  pages: Page[];
}

function TodayPage(props: PageListProps) {
  const { pages } = props;

  if (pages.length > 0) {
    return <PagesList pages={pages} />;
  }
  return (
    <MenuBarExtra.Item
      icon={Icon.Plus}
      title="Create today page"
      onAction={() => DayPage.createTodayPage()}
    />
  );
}

function PagesList(props: PageListProps) {
  const { pages } = props;

  return (
    <>
      {pages?.map((page: Page) => {
        return (
          <MenuBarExtra.Item
            icon={page.icon}
            title={page.title}
            key={page.id}
            onAction={() => open(page.urlToNotionOnNewTab)}
          />
        );
      })}
    </>
  );
}
