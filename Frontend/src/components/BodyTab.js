import React, { useState } from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-twilight"; // dark theme

import "./bodyTab.css";

export default function BodyTab({ onBodyChange }) {
  const [selected, setSelected] = useState("none");
  const [body, setBody] = useState('{\n  "example": "value"\n}');

  const handleChange = (newValue) => {
    setBody(newValue);
    onBodyChange(newValue);
  };

  return (
    <div className="body-tab">
      {/* OPTIONS ROW */}
      <div className="body-options">
        {["none", "form-data", "x-www-form-urlencoded", "raw", "binary", "GraphQL"].map(
          (option) => (
            <label key={option} className="body-option">
              <input
                type="radio"
                name="body-option"
                value={option}
                checked={selected === option}
                onChange={(e) => setSelected(e.target.value)}
              />
              <span>{option}</span>
            </label>
          )
        )}
      </div>

      {/* JSON EDITOR (only if raw selected) */}
      {selected === "raw" && (
        <div className="json-editor">
          <AceEditor
            mode="json"
            theme="twilight"
            value={body}
            onChange={handleChange}
            name="json-editor"
            editorProps={{ $blockScrolling: true }}
            fontSize={14}
            width="100%"
            height="325px"
            setOptions={{
              useWorker: false,
              showLineNumbers: true,
              tabSize: 2,
            }}
          />
        </div>
      )}
    </div>
  );
}
