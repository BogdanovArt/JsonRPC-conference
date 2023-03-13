import { useEffect, useRef, useState } from "react";
import { useIndexedDB } from "react-indexed-db";
import { useDispatch } from "react-redux";
import { format } from "date-fns";
import HTMLtoDOCX from "html-to-docx";
import { EditorContent, JSONContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";

import RecordBlockExt from "components/pages/blocks/SelectorPage/Tabs/Notes/RecordBlockExt";
import { Button } from "../UI/Button";
import { DropDown } from "./Select";

import { requestContentData } from "store/content/actions";

import { IBasicObject } from "types/index";
import { ActionTypes, ButtonEntities } from "types/enums";

import { download } from "utils/index";
import { defaultParticipant, recordUser } from "utils/consts";
import { DBNotes, DBRecords } from "utils/DBConfig";

import styles from "./TextEditor.module.scss";
import { RecordProps } from "components/pages/blocks/SelectorPage/Tabs/Notes/RecordBlock";

const exportImport = [
  {
    title: "txt",
    value: "txt",
  },
  {
    title: "json",
    value: "json",
  },
  {
    title: "html",
    value: "html",
  },
  {
    title: "docx",
    value: "docx",
  },
];

interface Props {
  id?: string;
  name?: string;
  initial?: JSONContent;
  allowRecord?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  style?: IBasicObject;
}

export const Editor = ({
  id,
  name,
  initial,
  readonly,
  allowRecord,
  disabled,
  style,
}: Props) => {
  const { add, update, getAll } = useIndexedDB(DBNotes);
  const recordStore = useIndexedDB(DBRecords);

  const [created, setCreated] = useState(false);
  const [imported, setImported] = useState(null);
  const [restored, setRestored] = useState(false);
  const [currentRecords, setCurrentRecords] = useState<number[]>([]);
  const [restoredRecords, setRestoredRecords] = useState<number[]>([]);
  const [selectorIndex, setSelectorIndex] = useState<number | null>(null);
  const [currentContent, setCurrentContent] = useState("");

  const indexRef = useRef(selectorIndex);
  const contentRef = useRef(currentContent);
  const oldIds = useRef(restoredRecords);
  const newIds = useRef(currentRecords);

  const dispatch = useDispatch();
  // const content =
  //   initial && JSON.stringify(initial) !== "{}" ? initial : imported;

  const editorChangeHandler = ({ editor }: any) => {
    setCurrentContent(editor.getHTML());
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      RecordBlockExt,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: "",
    onUpdate: editorChangeHandler,
    onCreate: () => setCreated(true),
  });

  const updateContent = (
    content: string,
    index: number,
    records?: number[]
  ) => {
    const PL: IBasicObject = {
      id: index,
      selector_id: id,
      selector_content: content,
    };
    if (records) {
      PL.selector_record_ids = records;
    }
    update(PL).then(
      (event) => {
        // console.log("Entity updated", index);
      },
      (error) => {
        console.warn("error adding entity", error);
      }
    );
  };

  const saveContent = (content: string) => {
    add({
      selector_id: id,
      selector_content: content,
    }).then(
      (index) => {
        setSelectorIndex(index);
        // console.log("Entity added", index);
      },
      (error) => {
        console.warn("error adding entity", error);
      }
    );
  };

  const restoreDBData = () => {
    return getAll().then((selectors) => {
      const match = selectors.find((entity) => entity.selector_id === id);

      if (match && !readonly) {
        // console.log("restored", editor, match);
        setSelectorIndex(match.id || null);
        setImported(match.selector_content || "");
        setRestoredRecords(match.selector_record_ids || []);
        editor.commands.setContent(match.selector_content || "");
        setCurrentContent(match.selector_content || "");
        setRestored(true);
      }
    });
  };

  const insertRecord = async () => {
    const timeStart = format(new Date(), "yyyy-MM-dd HH:mm:ss");

    const recordId = await addRecordUser();

    editor
      .chain()
      .insertContent(
        `<record-block blockId="" id="${id}" recordId="${recordId}"  timeStart="${timeStart}" />`
      )
      .run();
  };

  const addRecordUser = async (): Promise<string | null> => {
    const participant = { ...defaultParticipant };
    participant.name = participant.number = recordUser;

    const request = {
      entity: ButtonEntities.SELECTOR_ADD_PARTICIPANT,
      action: ActionTypes.add,
      options: {
        selector_id: id,
        participant,
      },
    };

    const selectorData: any = await dispatch(requestContentData(request));
    return getRecordUserId(selectorData?.selector?.participants);
  };

  const getRecordUserId = (participants: Array<IBasicObject> = []) => {
    const match = participants.find((user) => user.number === recordUser);
    return (match?.id as string) || null;
  };

  const getRecordIds = () => {
    if (editor) {
      // editor.commands.setContent(content);
      const blocks = editor.getJSON();
      const records = blocks.content?.filter(
        (block: JSONContent) => block.type === "recordBlock"
      );
      // console.log("blocks", blocks);
      const ids = records.length
        ? records.map((record: JSONContent) => record.attrs.savedId)
        : [];
      setCurrentRecords(ids);
      return ids;
    }
    return [];
  };

  const changeHandler = (name: string, value: string) => {
    let pl: string;
    const fileName =
      "Selector notes " + format(new Date(), "yyyy-MM-dd HH-mm") + "." + value;
    switch (value) {
      case "txt":
        pl = editor.getText();
        download(pl, fileName, "text/plain");
        break;
      case "json":
        pl = JSON.stringify(editor.getJSON());
        download(pl, fileName, "application/plain");
        break;
      case "html":
        pl = editor.getHTML();
        download(pl, fileName, "application/plain");
        break;
      case "docx":
        const html = editor.getHTML();
        HTMLtoDOCX(html).then((res: Blob) => {
          download("", fileName, "", res);
        });
        break;
      default:
        break;
    }
  };

  const contentChangeHandler = (content: string) => {
    if (content) {
      getRecordIds();
      if (selectorIndex !== null) {
        if (imported !== content) updateContent(content, selectorIndex);
      } else if (!restored) {
        setRestored(true);
        saveContent(content);
      }
    }
  };

  const clearUnusedRecords = () => {
    const restored = oldIds.current;
    const current = newIds.current;
    restored.forEach((id) => {
      if (!current.includes(id)) {
        // console.log("remove set for removal", id);
        recordStore.deleteRecord(id);
      }
    });
    if (indexRef.current) {
      updateContent(contentRef.current, indexRef.current, current);
    }
  };

  useEffect(() => {
    if (editor && (disabled || readonly)) editor.setEditable(false);
  }, [editor]);

  useEffect(() => {
    if (created) {
      const initialContent =
        initial && JSON.stringify(initial) !== "{}" ? initial : "";
      if (initialContent) {
        // @TODO create initial content handlers
      } else {
        restoreDBData();
      }
    }
  }, [created]);

  useEffect(() => {
    contentChangeHandler(currentContent);
    contentRef.current = currentContent;
  }, [currentContent]);

  useEffect(() => {
    indexRef.current = selectorIndex;
  }, [selectorIndex]);

  useEffect(() => {
    newIds.current = currentRecords;
  }, [currentRecords]);

  useEffect(() => {
    oldIds.current = restoredRecords;
  }, [restoredRecords]);

  useEffect(() => {
    return () => {
      if (!readonly) clearUnusedRecords();
    };
  }, []);

  return (
    <div className={styles.Wrapper} style={style}>
      {!readonly ? (
        <div className={styles.Controls}>
          <Button
            disabled={disabled || !allowRecord}
            dark
            onClick={insertRecord}
          >
            <>Вставить запись</>
          </Button>
          <DropDown
            items={exportImport}
            onChange={changeHandler}
            placeholder="Экспорт"
            menu
          />
        </div>
      ) : null}
      <div className={styles.Editor}>
        {!readonly ? (
          <div
            className={[
              styles.EditorControls,
              disabled && styles.EditorControlsDisabled,
            ].join(" ")}
          >
            <div className={styles.EditorControlsBlock}>
              <div
                style={{ fontWeight: 600 }}
                className={styles.EditorButton}
                onClick={() => editor.chain().focus().toggleBold().run()}
              >
                B
              </div>

              <div
                style={{ textDecoration: "underline" }}
                className={styles.EditorButton}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
              >
                U
              </div>

              <div
                style={{ fontStyle: "italic", fontFamily: "Times New Roman" }}
                className={styles.EditorButton}
                onClick={() => editor.chain().focus().toggleItalic().run()}
              >
                I
              </div>
            </div>

            <div className={styles.EditorControlsBlock}>
              <div
                className={styles.EditorButton}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
              >
                <img src="svg/orderedlist.svg" />
              </div>

              <div
                className={styles.EditorButton}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
              >
                <img src="svg/bulletlist.svg" />
              </div>

              <div className={styles.Divider} />

              <div
                className={styles.EditorButton}
                onClick={() =>
                  editor.chain().focus().setTextAlign("left").run()
                }
              >
                <img src="svg/alignment.svg" />
              </div>

              <div
                className={styles.EditorButton}
                onClick={() =>
                  editor.chain().focus().setTextAlign("right").run()
                }
              >
                <img
                  style={{ transform: "rotate(180deg)" }}
                  src="svg/alignment.svg"
                />
              </div>
            </div>
          </div>
        ) : null}
        <EditorContent editor={editor} className={styles.Editable} />
      </div>
    </div>
  );
};
