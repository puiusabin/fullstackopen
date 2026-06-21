import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

vi.mock("./services/anecdotes", () => ({
  default: {
    getAll: vi.fn(),
    createNew: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

import anecdoteService from "./services/anecdotes";
import useAnecdoteStore, {
  useAnecdotes,
  useAnecdoteActions,
  useFilter,
} from "./store";
console.log(useAnecdoteStore);
beforeEach(() => {
  useAnecdoteStore.setState({ anecdotes: [], filter: "" });
  vi.clearAllMocks();
});

describe("anecdotes", () => {
  it("initialize loads anecdotes from service", async () => {
    const mockAnecdotes = [{ id: 1, votes: 0, content: "Test" }];
    anecdoteService.getAll.mockResolvedValue(mockAnecdotes);

    const { result } = renderHook(() => useAnecdoteActions());

    await act(async () => {
      result.current.initialize();
    });

    const { result: anecdoteResult } = renderHook(() => useAnecdotes());
    expect(anecdoteResult.current).toEqual(mockAnecdotes);
  });

  it("anecdotes are sorted by votes", () => {
    const anecdotes = [
      { id: 1, votes: 3, content: "middle" },
      { id: 2, votes: 1, content: "bottom" },
      { id: 3, votes: 5, content: "top" },
    ];
    useAnecdoteStore.setState({
      anecdotes: anecdotes,
    });

    const { result } = renderHook(() => useAnecdotes());

    expect(result.current[0].content).toEqual("top");
    expect(result.current[1].content).toEqual("middle");
    expect(result.current[2].content).toEqual("bottom");
  });

  it("anecdotes are filtered", async () => {
    const anecdotes = [
      { id: 1, votes: 0, content: "test1" },
      { id: 2, votes: 0, content: "test12" },
      { id: 3, votes: 0, content: "test2" },
    ];
    useAnecdoteStore.setState({ anecdotes, filter: "" });

    const { result } = renderHook(() => useAnecdotes());
    expect(result.current).toHaveLength(3);

    act(() => {
      useAnecdoteStore.setState({ filter: "1" });
    });

    expect(result.current).toHaveLength(2);
    expect(result.current.map((a) => a.content)).toEqual(["test1", "test12"]);

    act(() => {
      useAnecdoteStore.setState({ filter: "test2" });
    });

    expect(result.current).toHaveLength(1);
    expect(result.current[0].content).toBe("test2");
  });

  it("voting increases the number of votes for an anecdote", async () => {
    const anecdotes = [{ id: 1, votes: 0, content: "test" }];
    useAnecdoteStore.setState({ anecdotes: anecdotes });
    anecdoteService.update.mockResolvedValue({
      ...anecdotes[0],
      votes: anecdotes[0].votes + 1,
    });

    const { result } = renderHook(() => useAnecdoteActions());

    await act(() => {
      result.current.addVote(anecdotes[0].id);
    });

    const { result: anecdoteResult } = renderHook(() => useAnecdotes());
    expect(anecdoteResult.current[0].votes).toEqual(1);
  });
});
