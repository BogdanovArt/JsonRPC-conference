import ReactDOM from "react-dom";

export function Portal({ component, id = "portal" }: any) {
  const root = document.getElementById(id);
  return root ? ReactDOM.createPortal(component, root) : null;
};

