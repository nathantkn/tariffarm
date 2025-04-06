'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [query, setQuery] = useState('');
  const [trending, setTrending] = useState([
    { name: 'Wheat', price: 231.42 },
    { name: 'Soybeans', price: 318.29 },
    { name: 'Corn', price: 187.56 }
  ]);
  const router = useRouter();

  const [geminiResponse, setGeminiResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://127.0.0.1:5050/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      });

      const data = await res.json();
      
      if (res.ok) {
        alert('Gemini Response:\n' + data.result);
        // Navigate to /results page and pass JSON as a string in query
        // router.push(`/results?data=${encodeURIComponent(JSON.stringify(data.result))}`);

        //BACKUP: use local storage to store JSON data
        localStorage.setItem('geminiResponse', JSON.stringify(data.result));
        router.push('/result');

      } else {
        alert('Gemini Error:\n' + (data.message || data.body || 'Something went wrong.'));
      }
    } catch (err) {
      alert('Request failed:\n' + err.message);
    }
  };

  return (
    <div style={styles.body}>
      <header style={styles.header}>
        <img src="/logo.svg" alt="App Logo" height="42" />
      </header>

      <main style={styles.container}>
        <div style={styles.formWrapper}>
          <label htmlFor="query">What produce would you like to buy?</label>
          <form onSubmit={handleSubmit} style={{ display: 'flex', marginTop: '0.5rem' }}>
            <input
              type="text"
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="I'm importing 100 kilograms of avocado from Mexico"
              required
              style={styles.input}
            />
            <button type="submit" style={styles.button}>Search</button>
          </form>
        </div>

        <section>
          <h2 style={{ textAlign: 'center' }}>Trending Commodities</h2>
          <div style={styles.trending}>
            {trending.map((item, idx) => (
              <div key={idx} style={styles.card}>
                <h3>{item.name}</h3>
                <p style={styles.muted}>${item.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer style={styles.footer}>
        Powered by AgriIntel · <a href="https://nextjs.org" target="_blank">Learn Next.js</a>
      </footer>
    </div>
  );
}

const styles = {
  body: {
    fontFamily: 'Inter, sans-serif',
    backgroundColor: '#f9fafb',
    color: '#111',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    margin: 0
  },
  header: {
    textAlign: 'center',
    padding: '1rem'
  },
  container: {
    flex: 1,
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2rem'
  },
  formWrapper: {
    maxWidth: '500px',
    width: '100%'
  },
  input: {
    flex: 1,
    padding: '0.75rem',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '8px',
    marginRight: '1rem'
  },
  button: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#0070f3',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  trending: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '1rem',
    maxWidth: '800px',
    width: '100%'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '1rem',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    textAlign: 'center'
  },
  muted: {
    color: '#666',
    fontSize: '0.9rem'
  },
  footer: {
    textAlign: 'center',
    fontSize: '0.85rem',
    color: '#666',
    paddingBottom: '2rem'
  }
};
