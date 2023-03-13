import { fontStyles } from "assets/scss/consts";

export const Overrides = {
  Pagination: {
    "& .MuiPaginationItem-page": {
      minWidth: "24px",
      height: "24px",
      margin: "0 8px",
      padding: 0,
      fontFamily: "var(--secondary-font)",
      fontSize: "14px",
      lineHeight: "20px",
      fontWeight: 600,
      color: "var(--text-color)",
    },


    "& .MuiPaginationItem-page.Mui-selected": {
      background: "var(--text-senary)",
      color: "var(--bg-primary)",
    },

    "& .MuiPaginationItem-ellipsis": {
      minWidth: "24px",
      height: "24px",
      margin: "0 8px",
      padding: 0,
    },

    "& .MuiPaginationItem-icon": {
      fill: "var(--text-quaternary)"
    },
  },

};
