import React, { useState } from "react";
import "./Sidebar.css";
import HistoryPanel from "./HistorySidebar";

const Sidebar = ({ history = [], onSelect, onDelete, onClear }) => {
  const [activePanel, setActivePanel] = useState(null);

  const togglePanel = (panelName) => {
    setActivePanel(activePanel === panelName ? null : panelName);
  };

  return (
    <div className="sidebar-container">
      <div className="sidebar-small">
        <button
          className={`sidebar-btn ${activePanel === "history" ? "active" : ""}`}
          onClick={() => togglePanel("history")}
        >
          📜
          <span className="tooltip">History</span>
        </button>

        <button
          className={`sidebar-btn ${activePanel === "flows" ? "active" : ""}`}
          onClick={() => togglePanel("flows")}
        >
          🔀
          <span className="tooltip">Flows</span>
        </button>
      </div>

      {activePanel && (
        <div className="sidebar-large">
          {activePanel === "history" && (
            <HistoryPanel
              items={history}  // already formatted history
              onSelect={onSelect}
              onDelete={onDelete}
              onClear={onClear}
            />
          )}

          {activePanel === "flows" && (
            <div className="placeholder">Flows coming soon...</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
