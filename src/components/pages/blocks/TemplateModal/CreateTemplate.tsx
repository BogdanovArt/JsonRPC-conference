import { useState } from "react";
import { useDispatch } from "react-redux";

import { Input } from "components/common/Inputs/Input";
import { AsyncInput } from "components/common/Inputs/AsyncInput";
import { NumberInput } from "components/common/Inputs/NumberInput";
import { SwitchBox } from "components/common/Inputs/SwitchBox";

import { TabWrapper } from "./blocks/TabWrapper";

import { initialForm, initialTabs } from "./consts";
import { Tab, TabProps } from "./types";
import { FormKeys, TabKeys } from "./enums";

import { GenericAction, TemplateForm } from "store/content/types";
import { ModalContexts } from "store/content/enums";

import { ActionTypes, ButtonEntities, RequestMethods } from "types/enums";
import { RequestPayload } from "types/index";

import { requestContentData } from "store/content/actions";
import { apiRequest, requestUrl } from "utils/apiRequest";

import styles from "./CreateTemplate.module.scss";

export const CreateTemplateForm = ({ initial }: TabProps) => {
  const dispatch = useDispatch();
  const [tab, setTab] = useState<Tab>(initialTabs[0]);
  const [form, setForm] = useState<TemplateForm>(initial || initialForm);

  const readonly = initial.context === ModalContexts.readonly;

  function inputHandler(name: string, value?: any) {
    const formCopy = JSON.parse(JSON.stringify(form));
    formCopy[name] = value;
    setForm(formCopy);
  }

  function saveHandler() {
    let action: GenericAction;
    switch (initial.context) {
      case ModalContexts.edit:
        action = {
          action: ActionTypes.update,
          entity: ButtonEntities.TEMPLATE_UPDATE,
        };
        break;
      default:
        action = {
          action: ActionTypes.create,
          entity: ButtonEntities.TEMPLATE_CREATE,
        };
        break;
    }
    action.options = {
      template: form,
    };
    dispatch(requestContentData(action));
  }

  function addUserRequest({ action, entity, options }: RequestPayload) {
    options.t_id = form.id || "none";
    return apiRequest({
      data: { action, entity, options },
      method: RequestMethods.POST,
      url: requestUrl,
    });
  }

  return (
    <div className={styles.Wrapper}>
      <Input
        name={FormKeys.name}
        label="Название шаблона"
        initial={form[FormKeys.name]}
        placeholder="Введите название"
        disabled={readonly}
        onChange={inputHandler}
      />
      <div className={styles.Tabs}>
        <ul className={styles.TabsMenu}>
          {initialTabs.map((item) => (
            <li
              key={item.key}
              className={[
                styles.TabsLabel,
                tab.key === item.key && styles.TabsLabelActive,
              ].join(" ")}
              onClick={() => setTab(item)}
            >
              {item.title}
            </li>
          ))}
        </ul>
        <div className={styles.Divider}></div>
        <div className={styles.TabsContent}>
          <TabWrapper
            key="1"
            title={tab.title}
            active={tab.key === TabKeys.participants}
          >
            <AsyncInput
              name={FormKeys.participants}
              placeholder="Добавить участника"
              visibleKeys={["name", "number"]}
              disabled={readonly}
              initial={form[FormKeys.participants]}
              request={addUserRequest}
              onChange={inputHandler}
            />
          </TabWrapper>
          <TabWrapper
            key="2"
            title={tab.title}
            active={tab.key === TabKeys.settings}
          >
            <div className={styles.Switches}>
              <div style={{ margin: "15px 0 30px 0" }}>
                <NumberInput
                  name={FormKeys.duration}
                  dimmed
                  label="Продолжительность дозвона, сек."
                  disabled={readonly}
                  initial={
                    form[FormKeys.duration]
                      ? parseInt(form[FormKeys.duration], 10)
                      : 0
                  }
                  max={3600}
                  width={90}
                  onChange={inputHandler}
                />
              </div>
              <SwitchBox
                name={FormKeys.mic}
                label="Включить микрофон"
                initial={form[FormKeys.mic]}
                disabled={readonly}
                reverse
                onChange={inputHandler}
              />
              <SwitchBox
                name={FormKeys.speaker}
                label="Включить динамик"
                initial={form[FormKeys.speaker]}
                disabled={readonly}
                reverse
                onChange={inputHandler}
              />
              <SwitchBox
                name={FormKeys.recall}
                label="Перезвонить"
                initial={form[FormKeys.recall]}
                disabled={readonly}
                reverse
                onChange={inputHandler}
              />
            </div>
          </TabWrapper>
          <TabWrapper
            key="3"
            title={tab.title}
            active={tab.key === TabKeys.permissions}
          >
            <AsyncInput
              name={FormKeys.permissions}
              placeholder="Добавить пользователя"
              disabled={readonly}
              initial={form[FormKeys.permissions]}
              onChange={inputHandler}
            />
          </TabWrapper>
        </div>
      </div>
      <div className={styles.Controls}>
        <button
          className={styles.Button}
          disabled={readonly}
          onClick={() => saveHandler()}
        >
          Сохранить
        </button>
      </div>
    </div>
  );
};
