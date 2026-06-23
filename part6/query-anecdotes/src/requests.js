const baseUrl = "http://localhost:3001/anecdotes";

const getAnecdotes = async () => {
  const response = await fetch(baseUrl);

  if (!response.ok) {
    throw new Error("Failed to fetch anecdotes");
  }

  return await response.json();
};

export default getAnecdotes;
