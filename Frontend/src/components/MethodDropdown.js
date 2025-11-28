import { useState } from "react";
import "./MethodDropdown.css";

export default function MethodDropdown({ method, setMethod }) {
  const [open, setOpen] = useState(false);

  const methods = [
    { value: "GET", color: "#22c55e" },
    { value: "POST", color: "#3b82f6" },
    { value: "PUT", color: "#eab308" },
    { value: "DELETE", color: "#ef4444" },
  ];

  const current = methods.find((m) => m.value === method);

  return (
    <div className="method-dropdown">
      <div
        className="method-display"
        style={{ color: current.color }}
      >
        {current.value}
        <span
          className="arrow"
          onClick={() => setOpen(!open)}
        >
          ▼
        </span>
      </div>

      {open && (
        <div className="dropdown-menu">
          {methods.map((m) => (
            <div
              key={m.value}
              className="dropdown-item"
              style={{ color: m.color }}
              onClick={() => {
                setMethod(m.value);
                setOpen(false);
              }}
            >
              {m.value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
