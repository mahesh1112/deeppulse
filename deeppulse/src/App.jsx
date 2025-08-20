import { useState, useEffect } from "react";
// for the icons ;)
import { Menu, X, Search, BarChart3, ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "./components/ui/Button.jsx";
import { Card, CardContent } from "./components/ui/Card.jsx";
import { Textarea } from "./components/ui/Textarea.jsx";

// import ResponseDashboard from "./components/ResponseDashboard";
// // import AnalysisDashboard from "./components/AnalysisDashboard";
// import SubmittedQuery from "./components/SubmitQuery"; 
// import "./App.css";
// import { createClient } from "@supabase/supabase-js";

// const SUPABASE_URL = "https://dvadfkbnzwgaktrwbzcy.supabase.co";
// const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2YWRma2JuendnYWt0cndiemN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NjMxMTgsImV4cCI6MjA3MDAzOTExOH0.nVuyxZ4c3CNKRTpE0MaEIf35OGWnldKkxC2MCfymwB4";
// const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function App () {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState("home");
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [welcomeAnimated, setWelcomeAnimated] = useState(false);

  useEffect( () => {
    const timer = setTimeout(() => setWelcomeAnimated(true), 100);
    const shrinkTimer = setTimeout(() => setShowWelcome(false), 3000);
    return () => {
      clearTimeout(timer);
      clearTimeout(shrinkTimer);
    };
  }, []);

  const handleQuickAccess = (type) => {
    setSidebarOpen(true);
    if (type === "query") {
      setActiveView("query");
      setDashboardOpen(false);
    } else {
      setActiveView("dashboard");
      setDashboardOpen(true);
    }
  };


  const renderMainContent = () => {
    if (activeView === "query") {
      return (
        <div className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-card-foreground mb-4">Query Interface</h2>
            <div className="space-y-4">
              <label htmlFor="query" className="block text-sm font-medium text-muted-foreground">
                What's your query, enter here...
              </label>
              <Textarea
                id="query"
                placeholder="Type your HR query here"
                className="min-h-[200px] bg-input border-border focus:ring-ring" />
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Execute Queryy</Button>
            </div>
          </div>
        </div>
      );
    }

    if (activeView === "dashboard") {
      return (
        <div className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-card-foreground mb-4">Response Dashboard</h2>
            <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
              <BarChart3 className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground">Response Dashboard goes here</p>
              <p className="text-sm text-muted-foreground mt-2">
                This area will display analytics, charts, and response data
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Default Home View
    return (
      <div className="space-y-8">
        {/* Welcome Message */}
        <div className={`transition-all duration-1000 ease-out ${
            showWelcome
              ? "transform translate-y-0 opacity-100 scale-100"
              : "transform -translate-y-4 opacity-80 scale-95"
          }`}
        >
          <div className={`bg-gradient-to-r from-muted to-muted/50 rounded-lg p-8 text-center ${
              welcomeAnimated ? "animate-fade-in-up" : "opacity-0"
            }`}
          >
            <h1 className={`font-bold text-primary transition-all duration-1000 ${
                showWelcome ? "text-4xl md:text-5xl" : "text-2xl"
              }`}>
              Happy Monday, Aisha! 🌟
            </h1>
            {showWelcome && (
              <p className="text-muted-foreground mt-4 text-lg animate-fade-in delay-500">
                Ready to make today productive?
              </p>
            )}
          </div>
        </div>

        {/* Quick Access Tiles */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-border bg-card"
            onClick={() => handleQuickAccess("query")}>
            <CardContent className="p-8 text-center">
              <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-card-foreground mb-2">Query</h3>
              <p className="text-muted-foreground">
                Search and analyze employee data with powerful queries
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-border bg-card"
            onClick = {() => handleQuickAccess("dashboard")}>
            <CardContent className="p-8 text-center">
              <div className="bg-secondary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <BarChart3 className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold text-card-foreground mb-2">Dashboard</h3>
              <p className="text-muted-foreground">
                View comprehensive analytics and response insights
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className={`bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out ${
          sidebarOpen ? "w-64" : "w-16"
        }`}>
        <div className="p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full justify-start hover:bg-sidebar-accent">
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            {sidebarOpen && <span className="ml-2">Close</span>}
          </Button>
        </div>

        <nav className="px-4 space-y-2">

          {/* Query Menu */}
          <Button
            variant={activeView === "query" ? "default" : "ghost"}
            className={`w-full justify-start transition-colors ${
              activeView === "query"
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "hover:bg-sidebar-accent text-sidebar-foreground"
            }`}
            onClick={() => {
              setActiveView("query");
              setDashboardOpen(false);
            }}
          >
            <Search className="h-5 w-5" />
            {sidebarOpen && <span className="ml-2">Query</span>}
          </Button>

          {/* Dashboard Menu */}
          <div>
            <Button
              variant={activeView === "dashboard" ? "default" : "ghost"}
              className={`w-full justify-start transition-colors ${
                activeView === "dashboard"
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "hover:bg-sidebar-accent text-sidebar-foreground"
              }`}
              onClick={() => {
                setActiveView("dashboard");
                setDashboardOpen(!dashboardOpen);
              }}
            >
              <BarChart3 className="h-5 w-5" />
              {sidebarOpen && (
                <>
                  <span className="ml-2 flex-1 text-left">Dashboard</span>
                  {dashboardOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </>
              )}
            </Button>

            {/* Dashboard Submenu */}
            {sidebarOpen && dashboardOpen && (
              <div className="ml-4 mt-2 space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-sm bg-sidebar-accent/50 text-sidebar-accent-foreground"
                >
                  Response Dashboard
                </Button>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* --- Side bar ended here --- tada! */}
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">{renderMainContent()}</div>
      </div>
    </div>
  );
}

// function App() {
//   const [query, setQuery] = useState("");
//   const [activeDashboard, setActiveDashboard] = useState(null);
//   const [submittedQuery, setSubmittedQuery] = useState("");
//   const [response, setResponse] = useState(null);

//   const handleResponseDashboard = () => {
//     setActiveDashboard("response");
//   };

//   const handleAnalysisDashboard = () => {
//     setActiveDashboard("submitted"); 
//   };

//   const handleReloadData = async () => {
//     try {
//       // Fetch data from Supabase table
//       const { data, error } = await supabase
//         .from("responses")
//         .select("*");

//       if (error) {
//         console.error("Error fetching data:", error);
//         alert("Failed to fetch data from Supabase");
//         return;
//       }

//       // Convert data to JSON string
//       const jsonString = JSON.stringify(data, null, 2);

//       // Create a blob and trigger download
//       const blob = new Blob([jsonString], { type: "application/json" });
//       const link = document.createElement("a");
//       link.href = URL.createObjectURL(blob);
//       link.download = "responses.json";
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       alert(`Downloaded responses.json with ${data.length} rows!`);
//     } catch (err) {
//       console.error("Error reloading data:", err);
//       alert("Something went wrong while downloading data");
//     }
//   };


//   const handleSubmit = async () => {
//     setSubmittedQuery(query);
//     setActiveDashboard("submitted"); // switch to submitted screen

//     try {
//       const res = await fetch("http://localhost:8000/query", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ query }),
//       });

//       const data = await res.json();
//       setResponse(data);
//     } catch (error) {
//       console.error("Error calling MCP:", error);
//       setResponse({ error: "Failed to connect to MCP" });
//     }
//   };

//   return (
//     <div className="app-container">
//       {/* Sidebar */}
//       <div className="sidebar">
//         <h2 style={{ color: "white" }}>Query System</h2>
//         <div className="button-container">
//           <button onClick={handleResponseDashboard}>Response Dashboard</button>
//           {<button onClick={handleAnalysisDashboard}>Query Dashboard</button>}
//         </div>

//         <textarea
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           placeholder="Enter your query here..."
//           rows="10"
//           className="query-editor"
//         />
//         <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
//     <button onClick={handleSubmit} className="submit-button">
//       Submit Query
//     </button>

//     <button onClick={handleReloadData} className="reload-button">
//       Reload Data
//     </button>
//   </div>
//       </div>

//       {/* Main content */}
//       <div className="main-content">
//         {activeDashboard === "response" && <ResponseDashboard />}
//         {/* {activeDashboard === "analysis" && <AnalysisDashboard />} */}

//         {activeDashboard === "submitted" && (
//           <SubmittedQuery data={response} />
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;
