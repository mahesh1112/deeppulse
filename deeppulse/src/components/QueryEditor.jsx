// components/QueryEditor.jsx
import React, { useState } from "react";


export default function QueryEditor() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // sample queries 
  const sampleQueries = [
    "Sentiment analysis",
    "Reponse rate",
    "Retrieve info when ...",
  ];

  // Handler for tile click
  const handleTileClick = (q) => {
    setQuery(q);
    setIsFocused(true);   // make the editor "active"
  };

//   const runQuery = () => {
//     console.log("Running query:", query);
//     // later: connect this to backend
//   };



return (
    <div className="flex flex-col items-center p-40">
      {/* Quick Access Tiles */}
      <div className="flex gap-4 mb-6">
        {sampleQueries.map((q, i) => (
          <button
            key={i}
            onClick={() => handleTileClick(q)}
            className="px-4 py-3 bg-primary text-white rounded-xl shadow hover:bg-primary/80 transition w-52 text-left"
          >
            {q.length > 40 ? q.slice(0, 40) + "..." : q}
          </button>
        ))}
      </div>

      {/* Query Editor Box */}
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => !query && setIsFocused(false)} // reset if empty
        placeholder="Type your query here..."
        className={`w-3/4 h-48 rounded-xl p-4 font-mono transition 
          ${isFocused || query
            ? "bg-white border-2 border-primary"
            : "bg-gray-100 border border-gray-300"}
        `}
      />

      {/* Action Buttons */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => console.log("Running query:", query)}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition"
        >
          Run
        </button>
        <button
          onClick={() => { setQuery(""); setIsFocused(false); }}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
        >
          Clear
        </button>
      </div>
    </div>
  );
}