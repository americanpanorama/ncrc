import { useEffect, useRef, useState } from 'react';

const useFetch = (url, options) => {
  const lastQuery = useRef(null);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(url, options);
        const json = await res.json();
        setResponse(json);
        setIsLoading(false)
      } catch (error) {
        setError(error);
      }
    };
    if (url !== lastQuery.current) {
      lastQuery.current = url;
      fetchData();
    }
  });
  return { response, error, isLoading };
};

export default useFetch;
