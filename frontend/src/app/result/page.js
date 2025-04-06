'use client';
import { useEffect, useState } from 'react';

export default function Results() {
  const [geminiResponse, setGeminiResponse] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem('geminiResponse');
    if (data) {
      setGeminiResponse(JSON.parse(data));
    }
  }, []);

  return (
    <div>
      <h1>Results</h1>
      <pre>{JSON.stringify(geminiResponse, null, 2)}</pre>
    </div>
  );
}