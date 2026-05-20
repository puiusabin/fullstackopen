import Alert from "@mui/material/Alert";

const Notification = ({ message, severity }) => {
  if (message === null) return null;
  console.log(severity);

  return <Alert severity={severity ?? "success"}>{message}</Alert>;
};

export default Notification;
