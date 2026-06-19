import { useNotification } from "../store";

const Notification = () => {
  const { message, visible } = useNotification();

  const style = {
    border: "solid",
    padding: 10,
    borderWidth: 1,
    marginBottom: 10,
  };
  if (visible) {
    return <div style={style}>{message}</div>;
  } else {
    return null;
  }
};

export default Notification;
