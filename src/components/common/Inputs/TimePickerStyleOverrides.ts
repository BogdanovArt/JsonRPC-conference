import { fontStyles } from "assets/scss/consts";

export const Overrides = {
  Picker: {
    minWidth: 150,
    "& .MuiInputBase-root": {
      height: 45,
      paddingRight: 5,
    },
    "& .MuiIconButton-root": {
      pointerEvents: "none",
      backgroundColor: "transparent",
    },
    "& .MuiTouchRipple-root": {
      display: "none",
    },

    "& .MuiOutlinedInput-root": {
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
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "var(--border-color)",
      "&:focus": {
        borderColor: "var(--accent-color)",
        borderWidth: 1,
      },
    },
  },
  Input: {
    ...fontStyles,
    "&::placeholder": {
      color: "var(--hint-color)",
    }
  },
};
