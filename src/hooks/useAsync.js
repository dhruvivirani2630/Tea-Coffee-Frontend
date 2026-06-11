import { useCallback, useState } from "react";

export const useAsync = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const run = useCallback(async (task) => {
    setLoading(true);
    setError("");
    try {
      return await task();
    } catch (err) {
      setError(err?.message || "Something went wrong.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, setError, run };
};
