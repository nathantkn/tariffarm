'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Apple, Route, Truck} from 'lucide-react';
import '../globals.css';

export default function Home() {
  const [query, setQuery] = useState('');
  const router = useRouter();

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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white">
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header Section */}
        <header className="text-center mb-16">
          <h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-green-400">
            Tariffarm
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Your intelligent companion in navigating global food commodity markets
          </p>
        </header>

        {/* Search Section */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-emerald-100 transition-all duration-300 hover:shadow-emerald-100/50">
            <label htmlFor="query" className="block text-lg text-gray-700 mb-3">
              Enter produce details to get comprehensive insights
            </label>
            <form onSubmit={handleSubmit} className="flex">
              <input
                type="text"
                id="query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. 100 kilograms of avocado (08044000) from Mexico"
                className="flex-grow px-4 py-3 text-gray-700 border-2 border-emerald-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                required
              />
              <button 
                type="submit" 
                className="bg-emerald-600 text-white px-6 py-3 rounded-r-lg hover:bg-emerald-700 transition-colors duration-300 ease-in-out transform hover:scale-105"
              >
                Explore
              </button>
            </form>
            <p className="text-sm text-gray-500 mt-3 italic">
              Pro tip: Use HS codes for precise commodity classification
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: <Apple size={48} className="text-emerald-600" />,
              title: "AI-Powered Insights",
              description: "Leverage Gemini's advanced intelligence for comprehensive market predictions."
            },
            {
              icon: <Truck size={48} className="text-blue-600" />,
              title: "Precise Calculations",
              description: "Get accurate estimates of total food costs, including tariffs and logistics."
            },
            {
              icon: <Route size={48} className="text-purple-600" />,
              title: "Strategic Routing",
              description: "Discover optimal import routes to minimize costs and maximize efficiency."
            }
          ].map((feature, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 transform transition duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-8 text-center">
        <p className="text-gray-600 mb-2">
          © 2025 Tariffarm. All rights reserved.
        </p>
        <p className="text-sm text-gray-500">
          Powered by Google's Gemini API and our passion for global food markets
        </p>
      </footer>
    </div>
  );
}