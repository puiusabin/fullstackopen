import { useAnecdotes, useAnecdoteActions, useFilter } from "../store";

const AnecdoteList = () => {
  const anecdotes = useAnecdotes();
  const filter = useFilter();
  const { addVote } = useAnecdoteActions();

  const anecdotesToShow = anecdotes
    .filter((anecdote) =>
      anecdote.content.toLowerCase().includes(filter.toLowerCase()),
    )
    .toSorted((a, b) => b.votes - a.votes);

  return (
    <div>
      {anecdotesToShow.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => addVote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnecdoteList;
