export const Overrides = {
  BG: {
    "& .makeStyles-stickyElement": {
      background: "#ccc",
    },
  },
  Week: {},
  Row: {
    borderBottom: "1px solid transparent",
  },
  Event: {
    background: "#155EE12F",
    border: "1px solid transparent",
    borderLeft: "4px solid #155EE1",
    transition: "0.2s",
    cursor: "pointer",
    "&:hover": {
      background: "#155EE12F",
      transform: "translateX(4px)",
    },
    "& .VerticalAppointment-content": {
      color: "red",
    },
  },
};