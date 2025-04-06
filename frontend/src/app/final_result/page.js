"use client";
import { useEffect, useState } from 'react';

export default function FinalResult() {
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    const rawData = localStorage.getItem('totalResult');
    console.log("📦 Raw from localStorage:", rawData);

    if (rawData) {
      try {
        // Step 1: Extract JSON part from the string
        const jsonStart = rawData.indexOf('{');
        const jsonEnd = rawData.lastIndexOf('}') + 1;
        const jsonString = rawData.slice(jsonStart, jsonEnd);

        // Step 2: Parse JSON safely
        const parsed = JSON.parse(jsonString);

        // Step 3: Extract text from Gemini response
        const rawText = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
        console.log("📄 Extracted Gemini text:", rawText);

        if (!rawText) {
          setHtmlContent('<p>No summary found in Gemini response.</p>');
          return;
        }

        // Step 4: Clean the text
        let cleaned = rawText
          .replace(/```json\n?|```/g, '')           // remove ```json blocks
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // markdown bold -> <strong>
          .replace(/\n/g, '<br/>');                // line breaks -> <br/>

        setHtmlContent(cleaned);
      } catch (err) {
        console.error("❌ Error parsing Gemini summary:", err);
        setHtmlContent('<p>Error loading Gemini summary.</p>');
      }
    }
  }, []);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-4xl border border-black p-8 bg-white shadow-xl rounded-lg">
        <h1 className="text-3xl font-extrabold border-b-4 border-black pb-2 mb-6 text-center">
          📦 AI-Generated Technical Summary
        </h1>

        <div
          className="text-base leading-relaxed"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        <p className="mt-6 text-center text-sm italic text-gray-500">
          Summary auto-generated using Gemini's export estimation logic.
        </p>
      </div>
    </div>
  );
}
