import React, { useEffect, useRef, useState } from 'react';

const useFetch = (url, options) => {
  const lastQuery = useRef(null);
  const [response, setResponse] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  React.useEffect(() => {
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
