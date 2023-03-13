import { fontStyles } from "assets/scss/consts";

export const Overrides = {
  Wrapper: {
    border: "none",
    boxShadow: "none",
    "&.MuiPaper-root": {
      color: "var(--text-color)",
      backgroundColor: "var(--bg-primary)",
    },
    "& .MuiAccordionSummary-root": {
      maxWidth: "100%",
      padding: 0,
      minHeight: 0,
    },    
    "& .MuiAccordionSummary-content": {
      maxWidth: "100%",
      margin: "12px 0",
      alignItems: "center",
    },
    "& .MuiAccordionDetails-root": {
      padding: 0,
    },
  },
};
