import { useAnecdotes, useAnecdoteActions } from "./store";

const App = () => {
  const anecdotes = useAnecdotes();
  const { addVote, add } = useAnecdoteActions();

  const getId = () => (100000 * Math.random()).toFixed(0);

  const addAnecdote = (e) => {
    e.preventDefault();
    const content = e.target.anecdote.value;
    add({ content: content, id: getId(), votes: 0 });
    e.target.reset();
  };

  return (
    <div>
      <h2>Anecdotes</h2>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => addVote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
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

export default App;
