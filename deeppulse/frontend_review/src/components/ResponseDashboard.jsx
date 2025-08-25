import React, { useState } from "react";
import "./ResponseDashboard.css";
import { kpiData, insightsData } from "../data/dummyData";

function ResponseDashboard() {
  // Temporary filter state
  const [triggerTemp, setTriggerTemp] = useState("Overall");
  const [timePeriodTemp, setTimePeriodTemp] = useState("Overall");

  // Applied filter state
  const [trigger, setTrigger] = useState("Overall");
  const [timePeriod, setTimePeriod] = useState("Overall");

  // Summary cards data (dummy – you can also make these dynamic later)
  const summary = {
    totalResponses: 70,
    satisfactionRate: 82,
    positiveSentiment: 68,
  };

  // Get KPI and insights based on applied filters
// Get KPI and insights based on applied filters
const kpis = (kpiData[trigger] && kpiData[trigger][timePeriod]) || [];
const insights = insightsData[trigger] || [];

  // Apply filters on Go
  const handleApplyFilters = () => {
    setTrigger(triggerTemp);
    setTimePeriod(timePeriodTemp);
  };

  return (
    <div className="dashboard-content">
      {/* Top 3 Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <h3>Response Rate</h3>
          <div className="card-value">{summary.totalResponses}%</div>
          <div className="happy-meter">
            {summary.totalResponses >= 80
              ? "😀"
              : summary.totalResponses >= 50
              ? "😐"
              : "😞"}
          </div>
        </div>
        <div className="summary-card">
          <h3>Satisfaction Rate</h3>
          <div className="card-value">{summary.satisfactionRate}%</div>
          <div className="happy-meter">
            {summary.satisfactionRate >= 80
              ? "😀"
              : summary.satisfactionRate >= 50
              ? "😐"
              : "😞"}
          </div>
        </div>
        <div className="summary-card">
          <h3>Positive Sentiment</h3>
          <div className="card-value">{summary.positiveSentiment}%</div>
          <div className="happy-meter">
            {summary.positiveSentiment >= 80
              ? "😀"
              : summary.positiveSentiment >= 50
              ? "😐"
              : "😞"}
          </div>
        </div>
      </div>

      {/* Dashboard with filters, KPI cards, and insights */}
      <div className="dashboard">
        {/* Filters */}
        <div className="filters-row">
          <div className="filter-group">
            <label>Trigger</label>
            <select
              value={triggerTemp}
              onChange={(e) => setTriggerTemp(e.target.value)}
              className="filter-select"
            >
              {Object.keys(kpiData).map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Time Period</label>
            <select
              value={timePeriodTemp}
              onChange={(e) => setTimePeriodTemp(e.target.value)}
              className="filter-select"
            >
              <option>Overall</option>
              <option>3 months</option>
              <option>6 months</option>
              <option>12 months</option>
            </select>
          </div>
          <button onClick={handleApplyFilters} className="go-button">
            Go
          </button>
        </div>

        {/* KPI Cards */}
        <div className="kpi-cards">
          {kpis.map((kpi, idx) => (
            <div key={idx} className="kpi-card">
              <h3>{kpi.title}</h3>
              <div className="kpi-value">{kpi.value}</div>
            </div>
          ))}
        </div>

        {/* Insights */}
        <div className="insights-tile">
          <h3>Insights</h3>
          <ul>
            {insights.map((insight, idx) => (
              <li key={idx}>{insight}</li>
            ))}
          </ul>
        </div>

        <hr />

        <div className="insights-tile issues">
          <h3>Issues</h3>
          <ul>
            {insights.map((insight, idx) => (
              <li key={idx}>{insight}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ResponseDashboard;
