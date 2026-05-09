const Notification = ({ message }) => {
  if (message === null) return null;

  return (
    <div
      style={{
        borderWidth: 3,
        borderColor: "black",
        borderStyle: "solid",
        padding: "1rem",
        margin: "1rem",
      }}
    >
      {message}
    </div>
  );
};

export default Notification;
