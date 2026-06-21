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

describe("useAnecdoteActions", () => {
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
});
