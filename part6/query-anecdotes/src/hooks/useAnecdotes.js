import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAnecdotes, createAnecdote, updateAnecdote } from "../requests";
import useNotification from "./useNotification";

export const useAnecdotes = () => {
  const { setMessage } = useNotification();
  const queryClient = useQueryClient();

  const result = useQuery({
    queryKey: ["anecdotes"],
    queryFn: getAnecdotes,
    retry: 1,
  });

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(["anecdotes"]);
      queryClient.setQueryData(["anecdotes"], anecdotes.concat(newAnecdote));
    },
    onError: (error) => {
      setMessage(error.toString());
      setTimeout(() => {
        setMessage("");
      }, 5000);
    },
  });

  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (anecdote) => {
      const anecdotes = queryClient.getQueryData(["anecdotes"]);
      queryClient.setQueryData(
        ["anecdotes"],
        anecdotes.map((a) => (a.id === anecdote.id ? anecdote : a)),
      );
    },
  });

  return {
    anecdotes: result.data,
    isPending: result.isPending,
    isError: result.isError,
    addAnecdote: (content) => newAnecdoteMutation.mutate({ content, votes: 0 }),
    toggleImportance: (anecdote) =>
      updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 }),
  };
};
