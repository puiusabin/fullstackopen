import { useState } from "react";
import anecdoteService from "../services/anecdotes";
import { useEffect } from "react";

export const useAnecdotes = () => {
  const [anecdotes, setAnecdotes] = useState([]);

  useEffect(() => {
    anecdoteService.getAll().then((data) => setAnecdotes(data));
  }, []);

  return {
    anecdotes,
    setAnecdotes,
  };
};
