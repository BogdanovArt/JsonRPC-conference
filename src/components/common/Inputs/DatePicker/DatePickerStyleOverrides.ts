import { FormHelperText } from "@material-ui/core";
import { fontStyles } from "assets/scss/consts";

const offset = 12;
const shrink = 0;

export const Overrides = {
  Picker: {
    minWidth: 150,
    "& .MuiInputBase-root": {
      height: 45,
      paddingRight: 5,
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
          borderColor: "var(--border-hover)",
        },
      },
      "&.Mui-disabled": {
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "var(--border-color)",
        },
      },
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "var(--border-color)",
      "&:focus": {
        borderColor: "var(--accent-color)",
        borderWidth: 1,
      },
    },
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
      filter: "var(--icon-filter)",
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
  Header: {
    position: "absolute" as any,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    padding: offset,
    fontSize: "16px",
    fontFamily: "var(--secondary-font)",
    color: "var(--text-color)",
    "& > *": {
      display: "flex",
      alignItems: "center",
      height: 30,
      textTransform: "capitalize",
    },
  },
  Wrapper: {
    position: "relative" as any,
    paddingRight: "0 !important",
    margin: `0 -${offset}px`,
    overflow: "hidden",
    "& div[role='presentation']": {
      display: "flex",
      height: 35,
      alignItems: "center",
      justifyContent: "center",
      flex: "1 1 0",
      cursor: "pointer",
    },
    "& .MuiTypography-root": {
      fontSize: "16px",
      fontFamily: "var(--secondary-font)",
    },
    "& .MuiPickersCalendarHeader-switchHeader": {
      margin: "0 0 12px 0",
      "& button": {
        padding: 8,
        backgroundColor: "transparent",
      },
      "& .MuiTouchRipple-root": {
        display: "none",
      },
    },
    "& .MuiPickersCalendarHeader-transitionContainer": {
      order: -1,
      marginLeft: 8,
      visibility: "hidden",
      "& p": {
        textAlign: "left",
        textTransform: "capitalize",
      },
    },
    "& .MuiPickersCalendarHeader-dayLabel": {
      color: "var(--text-color)",
      textTransform: "capitalize",
    },
    "& .MuiPickersCalendarHeader-daysHeader": {
      justifyContent: "space-between",
      padding: `0 ${offset - 8}px`,
    },
    "& .MuiPickersCalendar-week": {
      justifyContent: "space-between",
    },
    "& .MuiPickersDay-current": {
      // color: "var(--accent-color)",
      color: "#D1492D",
      "& p": {
        fontWeight: "800",
      },
    },
    "& .MuiPickersDay-daySelected": {
      color: "#fff",
      backgroundColor: "#D1492D",
    },
    "& .MuiPickersSlideTransition-transitionContainer > *": {
      // transition: "none !important",
      // left: shrink,
      // right: shrink,
    },
    "& .month-arrow": {
      width: 18,
      "& .svg-shape": {
        fill: "var(--accent-color) !important",
      },
    },
    "& .left-arrow": {
      transform: "rotate(-90deg)",
    },
    "& .right-arrow": {
      transform: "rotate(90deg)",
    },
  },
};
