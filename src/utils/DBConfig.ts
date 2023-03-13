export const DBNotes = "selector_notes";
export const DBRecords = "selector_recordings";

export const DBConfig = {
  name: "SelectorsDB",
  version: 3,
  objectStoresMeta: [
    {
      store: DBNotes,
      storeConfig: { keyPath: "id", autoIncrement: true },
      storeSchema: [
        {
          name: "selector_id",
          keypath: "selector_id",
          options: { unique: false },
        },
        {
          name: "selector_content",
          keypath: "selector_content",
          options: { unique: false },
        },
        {
          name: "selector_record_ids",
          keypath: "selector_record_ids",
          options: { unique: false },
        },
      ],
    },
    {
      store: DBRecords,
      storeConfig: { keyPath: "id", autoIncrement: true },
      storeSchema: [
        {
          name: "record_id",
          keypath: "record_id",
          options: { unique: false },
        },
        {
          name: "record_content",
          keypath: "record_content",
          options: { unique: false },
        },
      ],
    },
  ],
};

