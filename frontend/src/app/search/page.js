'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import '../globals.css';
import { Apple, Route, Truck} from 'lucide-react';
import Link from 'next/link';

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
        // debugging purposes
        // alert('Gemini Response:\n' + data.result);

        // Navigate to /results page and pass JSON as a string in query
        // router.push(`/results?data=${encodeURIComponent(JSON.stringify(data.result))}`);

        //BACKUP: use local storage to store JSON data
        console.log('Saving data to localStorage:', data.result); // Debugging line
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


      <main style={styles.container}>
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-green-400">Tariffarm</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            helping you find the best prices for your food
          </p>
        </header>


        <div class="max-w-2xl mx-auto mb-16">
          <div class="bg-white p-6 rounded-lg shadow-md">
          <label htmlFor="query">Enter produce name or HS code, followed by quantity and location of origin.</label>
          <form onSubmit={handleSubmit} style={{ display: 'flex', marginTop: '0.5rem' }}>
            <input
              type="text"
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g.100 kilograms of avocado (08044000) from Mexico"
              className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-r-md hover:bg-blue-700 transition">Search</button>
          </form>
          <p class="text-sm text-gray-500 mt-2">
              An HS code is a harmony system code used to classify goods for international trade. 
          </p>
          </div>
        </div>

        {/* <section>
          <h1 className="text-x1 font-bold mb-4">Trending Commodities</h1>
          <div style={styles.trending}>
            {trending.map((item, idx) => (
              <div key={idx} className="rounded-2x1 p-4 shadow-md border bg-white dark:bg-gray-950">
                <h3>{item.name}</h3>
                <p style={styles.muted}>${item.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
          
        </section> */}

      <div class="grid md:grid-cols-3 gap-8 mb-16">
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="text-red-600 text-3xl mb-4">
              <Apple size={48} />
            </div>
            <h3 class="text-lg font-semibold mb-2">Let Gemini be your guide</h3>
            <p class="text-gray-600">
              Ask Gemini to help you with food commodity predictions.
            </p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="text-blue-600 text-3xl mb-4">
              <Truck size={48} />
            </div>
            <h3 class="text-lg font-semibold mb-2">Accurate Results</h3>
            <p class="text-gray-600">
              Get accurate and up-to-date estimates of total food cost, including tariffs and transportation.
            </p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="text-purple-600 text-3xl mb-4">
              <Route size={48} />
            </div>
            <h3 class="text-lg font-semibold mb-2">Explore Options</h3>
            <p class="text-gray-600">
              Find quicker and cheaper routes to import food from different countries.
            </p>
          </div>
      </div>


      </main>

      <footer class="text-center text-gray-500 text-sm pt-8 border-t border-gray-200">
        <p>© 2025 Tariffarm. All rights reserved.</p>
        <p class="mt-2">Powered by Google's Gemini API and our love for food from home.</p>
      </footer>
    </div>
  );
}

const styles = {
  body: {
    fontFamily: 'Helvetica-Neue, sans-serif',
    backgroundColor: '#FFFAED',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    margin: 0
  },
  header: {
    textAlign: 'center',
    padding: '1rem',
    fontSize: '1.5rem',
  },
  container: {
    flex: 1,
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '3rem'
  },
  formWrapper: {
    maxWidth: '500px',
    width: '100%',
    marginBottom: '1rem', // Add space below the form
    alignItems: 'flex-start'
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
    gap: '2rem',
    maxWidth: '800px',
    width: '100%'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '2rem', // Increase padding for larger content
    boxShadow: '0 4px 15px rgba(76, 74, 74, 0.1)', // Slightly stronger shadow for emphasis
    textAlign: 'center',
    fontSize: '1.2rem', // Increase font size for card content
    height: '150px', // Optional: Set a fixed height for uniformity
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  muted: {
    color: '#666',
    fontSize: '0.9rem'
  },
};
