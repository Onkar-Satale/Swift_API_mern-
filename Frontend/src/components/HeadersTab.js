import React, { useState } from "react";
import "./HeadersTab.css";

const HeadersTab = ({ onHeadersChange }) => {
  const [headers, setHeaders] = useState([{ key: "", value: "" }]);

  const handleHeaderChange = (index, field, value) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
    onHeadersChange(newHeaders);
  };

  const addHeaderRow = () => {
    setHeaders([...headers, { key: "", value: "" }]);
  };

  const removeHeaderRow = (index) => {
    const newHeaders = headers.filter((_, i) => i !== index);
    setHeaders(newHeaders.length ? newHeaders : [{ key: "", value: "" }]);
    onHeadersChange(newHeaders);
  };

  return (
    <div className="headers-tab">
      {/* Table */}
      <div className="headers-table">
        {/* Table Header */}
        <div className="headers-table-header">
          <span>Key</span>
          <span>Value</span>
          <span />
        </div>

        {/* Table Rows */}
        {headers.map((header, index) => (
          <div key={index} className="headers-row">
            <input
              type="text"
              placeholder="Key"
              value={header.key}
              onChange={(e) =>
                handleHeaderChange(index, "key", e.target.value)
              }
            />
            <input
              type="text"
              placeholder="Value"
              value={header.value}
              onChange={(e) =>
                handleHeaderChange(index, "value", e.target.value)
              }
            />
            <button
              className="remove-btn"
              onClick={() => removeHeaderRow(index)}
              disabled={headers.length === 1}
              title="Remove header"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Add Header Button */}
      <button className="add-btn" onClick={addHeaderRow}>
        + Add Header
      </button>
    </div>
  );
};

export default HeadersTab;
