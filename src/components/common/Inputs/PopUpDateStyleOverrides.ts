import { Overrides } from "./DatePickerStyleOverrides";

export const PopUpStyles = {
  Wrapper: {
    ...Overrides.Picker,
    minWidth: 0,
    position: "relative" as any,
    padding: "0 !important",
    alignSelf: "stretch",
    display: "flex",
    alignItems: "center",
  },
  Pop: Overrides.Pop,
  Button: {
    position: "absolute" as any,
    opacity: 0,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    "& input": {
      cursor: "pointer",
    },
  },
  Container: {
    background: "var(--bg-color)",
  },
};
