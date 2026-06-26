import { createContext, useState, useEffect } from "react";
import anecdoteService from "./services/anecdotes";

const AnecdoteContext = createContext();

export default AnecdoteContext;

export const AnecdoteContextProvider = (props) => {
  const [anecdotes, setAnecdotes] = useState([]);

  useEffect(() => {
    anecdoteService.getAll().then((data) => setAnecdotes(data));
  }, []);

  const addAnecdote = async (newAnecdote) => {
    const anecdote = await anecdoteService.createNew(newAnecdote);
    console.log(anecdote);
    setAnecdotes(anecdotes.concat(anecdote));
  };

  const deleteAnecdote = async (id) => {
    await anecdoteService.deleteOne(id);
    setAnecdotes(anecdotes.filter((a) => a.id !== id));
  };

  return (
    <AnecdoteContext.Provider
      value={{ anecdotes, setAnecdotes, addAnecdote, deleteAnecdote }}
    >
      {props.children}
    </AnecdoteContext.Provider>
  );
};
