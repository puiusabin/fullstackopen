import { useContext } from "react";
import AnecdoteContext from "../AnecdoteContext";

const useAnecdotes = () => useContext(AnecdoteContext);

export default useAnecdotes;
