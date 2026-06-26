import { useAnecdoteActions, useNotificationActions } from "../store";

const AnecdoteForm = () => {
  const { add } = useAnecdoteActions();
  const { setMessage, setVisibility } = useNotificationActions();

  const addAnecdote = (e) => {
    e.preventDefault();
    const content = e.target.anecdote.value;
    add(content);
    setMessage(`You crated a new anecdotee ${content}`);
    setVisibility(true);
    setTimeout(() => {
      setVisibility(false);
    }, 5000);
    e.target.reset();
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input name="anecdote" />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
