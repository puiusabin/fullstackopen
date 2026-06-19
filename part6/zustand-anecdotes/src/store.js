import { create } from "zustand";
import anecdoteService from "./services/anecdotes";

const useAnecdoteStore = create((set, get) => ({
  anecdotes: [],
  filter: "",
  actions: {
    initialize: async () => {
      const anecdotes = await anecdoteService.getAll();
      set(() => ({
        anecdotes,
      }));
    },
    addVote: async (id) => {
      const anecdote = get().anecdotes.find((a) => a.id === id);

      const updated = await anecdoteService.update(id, {
        ...anecdote,
        votes: anecdote.votes + 1,
      });

      set((state) => ({
        anecdotes: state.anecdotes.map((a) => (a.id === id ? updated : a)),
      }));
    },
    add: async (content) => {
      const newAnecdote = await anecdoteService.createNew(content);
      set((state) => ({ anecdotes: state.anecdotes.concat(newAnecdote) }));
    },
    setFilter: (filter) => set(() => ({ filter: filter })),
  },
}));

const useNotificationStore = create((set) => ({
  visible: false,
  message: "",
  actions: {
    setVisibility: (value) =>
      set(() => ({
        visible: value,
      })),
    setMessage: (message) =>
      set(() => ({
        message,
      })),
  },
}));

export const useAnecdotes = () => useAnecdoteStore((state) => state.anecdotes);
export const useFilter = () => useAnecdoteStore((state) => state.filter);
export const useAnecdoteActions = () =>
  useAnecdoteStore((state) => state.actions);
export const useNotification = () => ({
  visible: useNotificationStore((state) => state.visible),
  message: useNotificationStore((state) => state.message),
});
export const useNotificationActions = () =>
  useNotificationStore((state) => state.actions);
