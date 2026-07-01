import Alert from "@mui/material/Alert";
import useNotify from "../hooks/useNotify";

const Notification = () => {
  const { notification } = useNotify();
  if (notification.message === null) return null;

  return <Alert severity={notification.severity}>{notification.message}</Alert>;
};

export default Notification;
