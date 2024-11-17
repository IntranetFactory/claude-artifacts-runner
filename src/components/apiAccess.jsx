import React, { useState, useEffect } from "react";

export const ApiAccess = ({ url, children, ...params }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const queryString = new URLSearchParams(params).toString();
        const fullUrl = queryString ? `${url}?${queryString}` : url;

        const response = await fetch(fullUrl, {
          headers: {
            'Content-Type': 'application/json',            
          },
        });

        if (!response.ok) {
          const errorMessage = `HTTP error! status: ${response.status}`;
          setError(errorMessage);
          setLoading(false);
          return; // Exit function early
        }

        const data = await response.json();
        setData(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [url, ...Object.values(params)]); // Re-trigger when URL or params change

  if (loading && !data) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      {loading && <div>Loading new data...</div>}
      {children(data)}
    </>
  );
};
