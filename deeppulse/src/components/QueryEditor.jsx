// components/QueryEditor.jsx
import React, { useState } from "react";


export default function QueryEditor() {
  const [query, setQuery] = useState("");
  const [output, setOutput] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  // sample queries 
  const sampleQueries = [
    {
      label: "Sentiment Analysis",
      query: "Give me overall sentiment analysis.",
    },
    {
      label: "Response Rate",
      query: "What is the response rate ?"
    },
    {
      label: "Top Issues",
      query: "What are the top issues mentioned in the feedback?",
    },
  ];

  // Handler for tile click
  const handleTileClick = (q) => {
    setQuery(q);
    setIsFocused(true);   // make the editor "active"
  };

  const runQuery = async() => {
    let data = "";
    if (!query.trim()) return;
    try {
      const res = await fetch("http://localhost:8000/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      data = await res.json();

      
    } catch (error) {
      console.error("Error calling MCP:", error);
      // setResponse({ error: "Failed to connect to MCP" });
      data = "Failed to connect MCP";
    }

    const response = data;
    console.log("Success!");
    // Add to output messages
    // setOutput((prev) => [...prev, { query, response }]);
    setOutput([{ query, response }]); 
    console.log("Success!!")
    setQuery(""); // clear input
    setIsFocused(false);
  };
  // Example function to add a query and response
  const addQuery = (query, response) => {
    setOutput((prev) => [...prev, { query, response }]);
  };



return (
    <div className="flex flex-col items-center p-10 w-full">
      {/* Quick Access Tiles */}
      <div className="flex gap-4 mb-6 flex-wrap justify-center">
        {sampleQueries.map((q, i) => (
          <button
            key={i}
            onClick={() => handleTileClick(q.query)}
            className="px-4 py-3 bg-primary text-white rounded-xl shadow hover:bg-primary/80 transition w-52 text-left"
          >
            {/* {q.length > 40 ? q.slice(0, 40) + "..." : q} */}
            {q.label}
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
          onClick={runQuery}
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

      {/* OUtput Box */}
      <div className="mt-8 w-3/4 max-h-96 overflow-y-auto flex flex-col gap-4">
        {output.map((o, i) => (
          <div key={i} className="flex flex-col space-y-2 animate-slide-up">
            <div className="bg-gray-100 p-3 rounded-xl shadow test-gray-800">
              <strong>You:</strong> {o.query}
            </div>
            <div className="bg-primary text-white p-3 rounded-xl shadow">
              <strong>Result:</strong> {o.response} 
              {/* <pre>{o.response}</pre> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}