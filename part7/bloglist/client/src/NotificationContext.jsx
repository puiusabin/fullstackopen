import { createContext, useReducer } from "react";

const NotificationContext = createContext();

export default NotificationContext;

const reducer = (state, action) => {
  switch (action.type) {
    case "SET":
      return { message: action.message, severity: action.severity };
    case "CLEAR":
      return { message: null, severity: null };
    default:
      return state;
  }
};

export const NotificationContextProvider = (props) => {
  const [notification, dispatch] = useReducer(reducer, {
    message: null,
    severity: null,
  });

  const notify = (message, severity, duration = 5000) => {
    dispatch({ type: "SET", message, severity });
    setTimeout(() => dispatch({ type: "CLEAR" }), duration);
  };

  const clearNotification = () => dispatch({ type: "CLEAR" });

  return (
    <NotificationContext.Provider
      value={{ notification, notify, clearNotification }}
    >
      {props.children}
    </NotificationContext.Provider>
  );
};
