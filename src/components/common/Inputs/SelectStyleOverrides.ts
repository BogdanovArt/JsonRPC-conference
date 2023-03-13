import { fontStyles } from "assets/scss/consts";

export const Overrides = {
  Select: {
    height: 48,
    "& .MuiSelect-select:focus": {
      backgroundColor: "transparent",
    },
    "& .MuiSelect-outlined": {
      padding: "10px 15px",
      paddingRight: "35px",
      color: "var(--text-color)",
      ...fontStyles,

      "& .subtitle": {
        display: "none",
      },
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "var(--border-color)",
    },
    "&.Mui-focused": {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "var(--accent-color)",
        borderWidth: 1,
      },
    },
    "&:hover": {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "var(--border-hover)",
      },
    },
  },
  Dimmed: {
    "& .MuiSelect-outlined": {
      color: "var(--text-quaternary)",
    },
  },
  Slim: {
    height: 20,
    marginLeft: -15,
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "transparent !important",
    },
  },
  Compact: {
    "& .MuiSelect-select": {
      padding: "10px 15px",
    },
  },
  Menu: {
    marginTop: 10,
    maxWidth: 0,
    "& .MuiPaper-root": {
      border: "1px solid var(--border-color)",
      color: "var(--text-color)",
      backgroundColor: "var(--bg-primary)",
      boxShadow: "var(--shadow-primary)",
    },

    "& .MuiListItem-root": {
      ...fontStyles,
      padding: "14px 16px",
      "&:hover": {
        backgroundColor: "var(--bg-secondary)",
      },
      "&.Mui-selected": {
        backgroundColor: "transparent",
        color: "var(--accent-color) !important",
      },
      "&.disabled": {
        display: "none",
      },
    },
  },

  Time: {
    marginTop: 10,
    maxWidth: 0,
    "& .MuiPaper-root": {
      padding: "10px",
      border: "1px solid var(--border-color)",
      color: "var(--text-color)",
      backgroundColor: "var(--bg-primary)",
      boxShadow: "var(--shadow-primary)",
    },

    "& .MuiMenu-list": {
      padding: 0,
      scrollbarWidth: "8px",
      scrollbarColor: "var(--bg-primary) var(--bg-selector-user)",
      maxHeight: "188px",
      overflowY: "auto",
    },

    "& .MuiMenu-list::-webkit-scrollbar": {
      width: "8px",
      backgroundColor: "var(--bg-primary)",
      color: "var(--text-color)",
    },

    "& .MuiMenu-list::-webkit-scrollbar-thumb": {
      borderRadius: "8px",
      backgroundColor: "var(--bg-selector-user)",
      cursor: "pointer",
    },

    "& .MuiListItem-root": {
      ...fontStyles,
      fontSize: "12px",
      lineHeight: "16px",
      padding: "4px 7px 4px 4px",
      "&:hover": {
        backgroundColor: "var(--bg-secondary)",
      },
      "&.Mui-selected": {
        backgroundColor: "transparent",
        color: "var(--accent-color) !important",
      },
      "&.disabled": {
        display: "none",
      },

      "& .subtitle": {
        fontSize: "10px",
        color: "var(--text-quaternary)",
      },
    },
  },
};
