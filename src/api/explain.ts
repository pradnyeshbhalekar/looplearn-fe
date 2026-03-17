import { api } from "./axios";

export const explainApi = {
  fetchExplanation: async (highlightedText: string, surroundingContext: string) => {
    const response = await api.post("/api/explain/", {
      highlightedText,
      surroundingContext,
    });
    return response.data;
  },
};
