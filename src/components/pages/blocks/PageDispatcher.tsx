import { useDispatch } from "react-redux";
import { JSONContent } from "@tiptap/react";

import { ErrorBlock } from "components/common/Error/Error";
import { Modal } from "components/common/Modal/Modal";
import { Editor } from "components/common/Inputs/TextEditor";

import { TablePage } from "./TablePage/TablePage";
import { CreateTemplateForm } from "./TemplateModal/CreateTemplate";
import { CreateSelectorForm } from "./SelectorModal/CreateSelector";
import { PagePoller } from "./PollingWrappers/PagePoller";

import { MenuItemTypes } from "store/menu/enums";
import {
  GenericAction,
  LogTabData,
  ModalData,
  SelectorForm,
  TemplateForm,
} from "store/content/types";
import {
  ArchivedActions,
  archivedHeaders,
  ArchivedSelectorActions,
  CommonActions,
  commonHeaders,
  CurrentActions,
  CurrentCoreActions,
  CalendarPageActions,
  currentHeaders,
  MineActions,
  mineHeaders,
  modalTitles,
  SelectorActions,
  SelectorCoreActions,
  selectorHeaders,
} from "utils/consts";
import {
  ActionTypes,
  ButtonEntities,
  CoreEntities,
  RequestCodes,
} from "types/enums";
import { setModal } from "store/content";
import { ModalContexts } from "store/content/enums";
import { requestContentData } from "store/content/actions";
import { ArchivedPage } from "./ArchivedPage/Archived";
import { SelectorPage } from "./SelectorPage/SelectorPage";
import { ArchivedSelectorPage } from "./SelectorPage/ArchivedSelectorPage";
import { CalendarPage } from "./CalendarPage/Calendar";
import { ResultsPage } from "./ResultsPage/Results";
import { ListsPage } from "./ListsPage/Lists";

export const PageDispatcher = ({
  content,
  modal,
  active,
}: {
  content: any;
  modal?: ModalData;
  active: GenericAction | null;
}) => {
  const dispatch = useDispatch();

  // console.warn(active);

  if (!active) return null;

  const contentCode = active.options?.code;
  const modalTitle = modalTitles[contentCode]?.[modal?.context];

  const MineTable = (
    <>
      <TablePage
        headers={mineHeaders}
        content={content}
        actions={MineActions}
        editable
        controls
      />
      <Modal
        show={!!modal}
        title={modalTitle}
        content={<CreateTemplateForm initial={modal as TemplateForm} />}
        onClose={() =>
          dispatch(
            requestContentData({
              action: ActionTypes.delete,
              entity: ButtonEntities.TEMPLATE_CLOSE,
            })
          )
        }
      />
    </>
  );

  const CommonTable = (
    <>
      <TablePage
        headers={commonHeaders}
        content={content}
        actions={CommonActions}
        editable
      />
      <Modal
        show={!!modal}
        title={modalTitle}
        content={<CreateTemplateForm initial={modal as TemplateForm} />}
        onClose={() => dispatch(setModal(null))}
      />
    </>
  );

  const CurrentTable = (
    <>
      <PagePoller fq={content?.fq} action={CurrentCoreActions.polling}>
        <TablePage
          headers={currentHeaders}
          content={content?.selectors}
          actions={CurrentActions}
          editable
          controls
        />
      </PagePoller>
      <Modal
        show={!!modal}
        title={modalTitle}
        content={<CreateSelectorForm initial={modal as SelectorForm} />}
        onClose={() => dispatch(setModal(null))}
      />
    </>
  );

  const SelectorTable = (
    <PagePoller
      fq={content.fq}
      action={SelectorCoreActions.polling}
      payload={{ selector: { id: content.selector?.id } }}
    >
      <SelectorPage
        returnTitle="Текущие"
        actions={SelectorActions}
        content={content.selector}
      />
    </PagePoller>
  );

  const ArchivedSelectorTable = (
    <>
      <ArchivedSelectorPage
        returnTitle="Архивные"
        actions={ArchivedSelectorActions}
        content={content?.selector}
      />
    </>
  );

  const SelectorResults = <ResultsPage content={content?.selectors} />;

  const SelectorLists = (
    <ListsPage content={content?.selectors ? content.selectors : content} />
  );

  const SelectorCalendar = (
    <>
      <PagePoller fq={content.fq} action={CalendarPageActions.polling}>
        <CalendarPage items={content?.selectors} actions={SelectorActions} />
      </PagePoller>
    </>
  );

  const ErrorPage = <ErrorBlock error="Раздел не существует" />;

  switch (active.entity) {
    case CoreEntities.selectors_grid:
      return CurrentTable;
    case CoreEntities.selector_grid:
      return content.selector ? SelectorTable : null;
    case CoreEntities.archived_grid:
      return ArchivedSelectorTable;
    case CoreEntities.content:
      switch (active.options?.code) {
        case MenuItemTypes.mine:
          return MineTable;
        case MenuItemTypes.common:
          return CommonTable;
        case MenuItemTypes.arch:
          return SelectorResults;
        case MenuItemTypes.current:
          return CurrentTable;
        case MenuItemTypes.calendar:
          return location.hash === "#old" ? CurrentTable : SelectorCalendar;
        case MenuItemTypes.lists:
          return SelectorLists;
        default:
          return ErrorPage;
      }
    default:
      return ErrorPage;
  }
};
