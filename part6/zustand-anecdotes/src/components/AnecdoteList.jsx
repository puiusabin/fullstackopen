import {
  useAnecdotes,
  useAnecdoteActions,
  useFilter,
  useNotificationActions,
} from "../store";

const AnecdoteList = () => {
  const anecdotes = useAnecdotes();
  const filter = useFilter();
  const { addVote, deleteOne } = useAnecdoteActions();
  const { setVisibility, setMessage } = useNotificationActions();

  const anecdotesToShow = anecdotes
    .filter((anecdote) =>
      anecdote.content.toLowerCase().includes(filter.toLowerCase()),
    )
    .toSorted((a, b) => b.votes - a.votes);

  const handleVote = (anecdote) => {
    addVote(anecdote.id);
    setMessage(`You voted ${anecdote.content}`);
    setVisibility(true);
    setTimeout(() => {
      setVisibility(false);
    }, 5000);
  };

  return (
    <div>
      {anecdotesToShow.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
            {anecdote.votes === 0 && (
              <button onClick={() => deleteOne(anecdote.id)}>delete</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnecdoteList;
