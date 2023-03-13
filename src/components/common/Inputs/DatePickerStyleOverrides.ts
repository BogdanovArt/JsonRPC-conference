import { fontStyles } from "assets/scss/consts";

export const Overrides = {
  Picker: {
    minWidth: 126,
    "& .MuiInputBase-root": {
      height: 48,
      paddingRight: 0,
    },
    "& .MuiOutlinedInput-input": {
      fontFamily: "var(--secondary-font)",
      padding: "14px 0 14px 12px",
    },
    "& .MuiIconButton-root:hover": {
      backgroundColor: "transparent",
    },
    "& .MuiTouchRipple-root": {
      display: "none",
    },

    "& .MuiOutlinedInput-root": {
      "& .MuiOutlinedInput-input.Mui-disabled": {
        color: "var(--text-color)",
      },
      "&.Mui-focused": {
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "var(--accent-color)",
          borderWidth: 1,
        },
      },
      "&:hover": {
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "var(--text-tetriary)",
        },
      },
      "&.Mui-disabled": {
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "var(--border-color)",
        },
      },
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "var(--text-tetriary)",
      "&:focus": {
        borderColor: "var(--text-tetriary)",
        borderWidth: 1,
      },
    },

    "& .MuiInputAdornment-root": {
      width: "20px",
      height: "20px",

      "& .MuiIconButton-root": {
        padding: 0,
        width: "20px",
        height: "20px",
      }
    },

    "& .MuiInputAdornment-positionEnd": {
      marginLeft: 0,
      marginRight: "12px",
    }
  },
  Pop: {
    marginTop: 5,
    "& .MuiPaper-root": {
      border: "1px solid var(--border-color)",
      color: "var(--text-color)",
      backgroundColor: "var(--bg-primary)",
      boxShadow: "var(--shadow-primary)",
    },
    "& .MuiIconButton-root": {
      backgroundColor: "transparent",
    },
    "& .MuiPickersCalendarHeader-switchHeader": {
      "& p": fontStyles,
    },
    "& .MuiPickersCalendarHeader-iconButton": {
      // filter: "var(--icon-filter)",
    },
    "& .MuiPickersYear": {
      "&-yearSelected": {
        color: "var(--accent-color)",
      },
      "&-root:focus": {
        color: "var(--accent-color)",
      },
    },
    "& .MuiPickersDay": {
      "&-day": {
        color: "var(--text-color)",
      },
      "&-current": {
        color: "var(--accent-color)",
        fontWeight: 600,
      },
      "&-daySelected": {
        backgroundColor: "transparent",
        borderRadius: 4,
        border: "1px solid var(--accent-color)",
      },
    },
    "& .MuiPickersCalendarHeader-dayLabel": {
      color: "var(--accent-color)",
    },
    "& .MuiTouchRipple-root": {
      display: "none",
    },
  },
  Input: fontStyles,
  Dimmed: {
    color: "var(--hint-color) !important",
  },
  Wrapper: {
    paddingRight: "0 !important",
  },
  Img: {
    verticalAlign: "middle",
  },

};
