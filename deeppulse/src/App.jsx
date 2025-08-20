import { useState } from "react";
import ResponseDashboard from "./components/ResponseDashboard";
// import AnalysisDashboard from "./components/AnalysisDashboard";
import SubmittedQuery from "./components/SubmitQuery"; 
import "./App.css";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://dvadfkbnzwgaktrwbzcy.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2YWRma2JuendnYWt0cndiemN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NjMxMTgsImV4cCI6MjA3MDAzOTExOH0.nVuyxZ4c3CNKRTpE0MaEIf35OGWnldKkxC2MCfymwB4";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);



function App() {
  const [query, setQuery] = useState("");
  const [activeDashboard, setActiveDashboard] = useState(null);
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [response, setResponse] = useState(null);

  const handleResponseDashboard = () => {
    setActiveDashboard("response");
  };


  const handleAnalysisDashboard = () => {
    setActiveDashboard("submitted"); 
  };

  const handleReloadData = async () => {
    try {
      // Fetch data from Supabase table
      const { data, error } = await supabase
        .from("responses")
        .select("*");

      if (error) {
        console.error("Error fetching data:", error);
        alert("Failed to fetch data from Supabase");
        return;
      }

      // Convert data to JSON string
      const jsonString = JSON.stringify(data, null, 2);

      // Create a blob and trigger download
      const blob = new Blob([jsonString], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "responses.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert(`Downloaded responses.json with ${data.length} rows!`);
    } catch (err) {
      console.error("Error reloading data:", err);
      alert("Something went wrong while downloading data");
    }
  };


  const handleSubmit = async () => {
    setSubmittedQuery(query);
    setActiveDashboard("submitted"); // switch to submitted screen

    try {
      const res = await fetch("http://localhost:8000/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.error("Error calling MCP:", error);
      setResponse({ error: "Failed to connect to MCP" });
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 style={{ color: "white" }}>Query System</h2>
        <div className="button-container">
          <button onClick={handleResponseDashboard}>Response Dashboard</button>
          {<button onClick={handleAnalysisDashboard}>Query Dashboard</button>}
        </div>

        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your query here..."
          rows="10"
          className="query-editor"
        />
        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
    <button onClick={handleSubmit} className="submit-button">
      Submit Query
    </button>

    <button onClick={handleReloadData} className="reload-button">
      Reload Data
    </button>
  </div>
      </div>

      {/* Main content */}
      <div className="main-content">
        {activeDashboard === "response" && <ResponseDashboard />}
        {/* {activeDashboard === "analysis" && <AnalysisDashboard />} */}

        {activeDashboard === "submitted" && (
          <SubmittedQuery data={response} />
        )}
      </div>
    </div>
  );
}

export default App;
