import { useState, useEffect } from "react";
// for the icons ;)
import { Menu, X, Search, BarChart3, User, ChevronDown, ChevronRight, Activity } from "lucide-react"
import { Button } from "./components/ui/Button.jsx";
import { Card, CardContent } from "./components/ui/Card.jsx";
import { Textarea } from "./components/ui/Textarea.jsx";
import QueryEditor from "./components/QueryEditor.jsx";
import Dashboard from "./components/Dashboard.jsx";

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

  // Navigation Items
  const navItems = [
    { id: "query", label: "Query", icon: <Search className="w-5 h-5" /> },
    { id: "dashboard", label: "Dashboard", icon: <BarChart3 className="w-5 h-5" /> },
    { id: "profile", label: "Profile", icon: <User className="w-5 h-5" /> },
  ];

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

  // Main content renderer
  const renderMainContent = () => {
    switch (activeView) {
      case "query":
        return <QueryEditor />;
      case "dashboard":
        return <Dashboard />;
      case "profile":
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">Profile</h2>
            <p className="text-muted-foreground">User profile details go here.</p>
          </div>
        );
      default:
        // return (
        //   <div className="p-8">
        //     <h2 className="text-3xl font-bold mb-4">Welcome to DeepPulse 🚀</h2>
        //     <p className="text-muted-foreground">Select an option from the sidebar to get started.</p>
        //   </div>
        // );
        
        return (
          <div className="flex items-center justify-center h-full p-8">
            <div className="text-center max-w-lg">
              <h2 className="text-3xl font-bold mb-4">DeepPulse 🌊</h2>
              <p className="text-muted-foreground text-lg">
                “What gets measured, gets improved.”  
                <br></br>Start exploring insights from the sidebar.
              </p>
            </div>
          </div>
        );

    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ${
          sidebarOpen ? "w-58" : "w-20"
        }`}> 

        {/* Logo + Toggle */}
        <div className="flex items-center justify-between p-5 border-b border-sidebar-border">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => !sidebarOpen && setSidebarOpen(true)} // expand only when collapsed
          >
            <Activity className="w-8 h-8 text-primary" />
            <span 
              className={`text-lg font-bold text-primary transition-opacity duration-300 ${
                sidebarOpen ? "opacity-100" : "opacity-0"
              }`}>DeepPulse
            </span>
            
          </div>

          {sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(false)}  //collapse
              className="p-2 rounded-lg hover:bg-sidebar-accent transition">
              <svg 
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col mt-4 space-y-2 px-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex items-center w-full p-2 rounded-lg transition-all duration-200 hover:bg-sidebar-accent ${
                activeView === item.id ? "bg-primary text-white" : "text-sidebar-foreground"
              }`}>
              <div className="flex-shrink-0">{item.icon}</div>
              <span
                className={`ml-3 whitespace-nowrap transition-opacity duration-300 ${
                  sidebarOpen ? "opacity-100" : "opacity-0"
                }`}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">{renderMainContent()}</main>
    </div>
  );
}