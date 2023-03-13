import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import { ScrollContainer } from "components/common/UI/ScrollContainer";
import { MobileSlideModal } from "components/pages/blocks/CalendarPage/blocks/CalendarModal/MobileSlideModal";
import { SlideModal } from "components/common/Modal/SlideModal";
import { Button } from "components/common/UI/Button";
import { CreateVotingForm } from "./CreateVotingForm";

import { IBasicObject } from "types/index";
import { ActionHandler, Voting } from "../../types";

import { getBreakPoint } from "store/core/getters";

import styles from "./VotingNew.module.scss";

interface Field {
  id: string;
}

interface Props {
  shadow?: boolean;
  edit?: boolean;
  show?: boolean;
  voting?: Voting; // selector.votings[n]
  toggle?: (state: boolean) => void;
  actionHandler?: ActionHandler;
  removeHandler: (voting: Voting) => void;
}

const Field = (id: string) => ({ id });

const initialOptions = [{ id: "1" }, { id: "2" }, { id: "3" }];

export const CreateVotingModal: React.FC<Props> = ({
  shadow,
  edit,
  show,
  voting,
  toggle,
  removeHandler,
  actionHandler = () => null,
}) => {
  const [form, setForm] = useState<IBasicObject>({});
  const [options, setOptions] = useState<Field[]>(initialOptions);

  const breakpoint = useSelector(getBreakPoint);

  const disabled = useMemo(() => {
    if (!form.displayname) return true;
    const state = Object.values(form).filter((value) => !!value).length;
    return state < 2;
  }, [form]);

  const saveHandler = async () => {
    const voting: {
      id?: string;
      name?: string;
      subject?: string;
      cases: IBasicObject;
    } = {
      // id: Date.now().toString(),
      name: form.displayname as string,
      subject: form.displayname as string,
      cases: {},
    };
    const filledOptions = options.filter((option) => !!form[option.id]);
    filledOptions.forEach((item, index) => {
      voting.cases[(index + 1).toString()] = form[item.id];
    });

    await actionHandler(edit ? "save_voting" : "add_voting", { voting });
    toggle(false);
    setForm({});
    setOptions(initialOptions);
  };

  const restoreInitialState = (voting: Voting) => {
    const options = Object.keys(voting.cases).map((id: string) => ({ id }));
    setOptions(options);
    setForm({ displayname: voting.name, ...voting.cases });
  };

  useEffect(() => {
    if (voting) restoreInitialState(voting);
  }, [voting]);

  const renderModalWrapper = (content: JSX.Element | JSX.Element[]) => {
    return ["xs", "md"].includes(breakpoint) ? (
      <MobileSlideModal
        title={voting?.name || "Новый опрос"}
        show={show}
        leftIconAction={() => toggle(false)}
        footer={
          edit ? (
            <div className={styles.MobileFooter}>
              <div onClick={() => removeHandler(voting)}>Удалить из селектора</div>
            </div>
          ) : null
        }
        rightIcon="check"
        rightIconAction={saveHandler}
      >
        <ScrollContainer>
          <div className={styles.MobileContent}>{content}</div>
        </ScrollContainer>
      </MobileSlideModal>
    ) : (
      <SlideModal
        shadow={shadow}
        show={show}
        header={
          <div className={styles.AddHeader}>
            {edit ? "Редактировать опрос" : "Новый опрос"}
            <span>
              <span className="required">*</span> обязательные поля
            </span>
          </div>
        }
        footer={
          <>
            {edit ? (
              <>
                <Button
                  color="var(--color-red)"
                  className={styles.Button}
                  onClick={() => removeHandler(voting)}
                >
                  Удалить
                </Button>
                <div style={{ flex: 1 }} />
              </>
            ) : null}
            <Button
              color="var(--accent-color)"
              className={styles.Button}
              onClick={() => toggle(false)}
            >
              Отмена
            </Button>
            <Button dark disabled={disabled} onClick={saveHandler}>
              {edit ? " Сохранить" : "Создать"}
            </Button>
          </>
        }
        onClose={() => toggle(false)}
        className="CreateVotingModal"
      >
        {content}
      </SlideModal>
    );
  };

  return renderModalWrapper(
    <CreateVotingForm
      form={form}
      options={options}
      returnForm={setForm}
      returnOptions={setOptions}
    />
  );
};
