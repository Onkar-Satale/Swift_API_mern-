// import { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import ReactJson from "react-json-view";

// import MethodDropdown from "./MethodDropdown";
// import HeadersTab from "./HeadersTab";
// import BodyTab from "./BodyTab";
// import AccountPage from "./AccountPage";
// import HistorySidebar from "../components/HistorySidebar";

// import { getHistory, deleteHistoryItem, clearHistory } from "../services/historyService";

// import "./PostmanClone.css";

// export default function PostmanClone() {
//   const [method, setMethod] = useState("GET");
//   const [url, setUrl] = useState("");
//   const [response, setResponse] = useState("");
//   const [status, setStatus] = useState(null);
//   const [activeTab, setActiveTab] = useState("Params");
//   const [history, setHistory] = useState([]);
//   const [activePanel, setActivePanel] = useState(null);
//   const [viewMode, setViewMode] = useState("pretty");
//   const [loading, setLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");
//   const [bodyContent, setBodyContent] = useState("");
//   const [headersObj, setHeadersObj] = useState([]);
//   const [paramsObj, setParamsObj] = useState([]);

//   const navigate = useNavigate();
//   const responseRef = useRef(null);

//   // ----------------------------
//   // SAFELY GET userId
//   // ----------------------------
//   const storedUserId = localStorage.getItem("userId");
//   const userId = storedUserId && storedUserId !== "guest" ? storedUserId : null;

//   // -------------------------------------------
//   // LOAD HISTORY
//   // -------------------------------------------
//   const loadUserHistory = async () => {
//     try {
//       const h = await getHistory();
//       setHistory(Array.isArray(h) ? [...h].reverse() : []);
//     } catch (err) {
//       console.error("Failed to load history:", err);
//       setHistory([]);
//     }
//   };

//   useEffect(() => {
//     loadUserHistory();
//   }, []);

//   // -------------------------------------------
//   // URL Validator
//   // -------------------------------------------
//   const isValidUrl = (str) => {
//     try {
//       new URL(str);
//       return true;
//     } catch {
//       return false;
//     }
//   };

//   // -------------------------------------------
//   // SEND REQUEST
//   // -------------------------------------------
//   const handleSend = async () => {
//     setErrorMsg("");
//     setResponse("");
//     setStatus(null);

//     if (!userId) {
//       setErrorMsg("You must be logged in to send requests.");
//       return;
//     }

//     if (!url.trim()) {
//       setErrorMsg("Please enter a URL.");
//       return;
//     }

//     if (!isValidUrl(url)) {
//       setErrorMsg("Invalid URL format.");
//       return;
//     }

//     setLoading(true);
//     const start = performance.now();

//     try {
//       let bodyPayload;
//       if (["POST", "PUT", "PATCH", "DELETE"].includes(method) && bodyContent?.trim()) {
//         try {
//           bodyPayload = JSON.parse(bodyContent);
//         } catch (err) {
//           setErrorMsg("Invalid JSON in body: " + err.message);
//           setLoading(false);
//           return;
//         }
//       }

//       const res = await fetch("/api/request", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: JSON.stringify({
//           userId,
//           url,
//           method,
//           headers: headersObj,
//           params: paramsObj,
//           body: bodyPayload,
//         }),
//       });

//       const data = await res.json();

//       if (!data.success) {
//         setErrorMsg(data.error || "Request failed.");
//         setStatus("ERR");
//         setResponse({ error: data.error });
//         return;
//       }

//       setStatus(data.status ?? res.status ?? "OK");
//       setResponse(data.body ?? data);

//       await loadUserHistory();
//     } catch (err) {
//       console.error("Request failed:", err);
//       setErrorMsg("Request failed: " + err.message);
//       setStatus("ERR");
//       setResponse({ error: err.message });
//     } finally {
//       setLoading(false);
//       responseRef.current?.scrollIntoView({ behavior: "smooth" });
//       console.log("Request duration:", Math.round(performance.now() - start), "ms");
//     }
//   };

//   // -------------------------------------------
//   // HISTORY HANDLERS
//   // -------------------------------------------
//   const handleHistoryDelete = async (historyId) => {
//     if (!userId) return;
//     try {
//       await deleteHistoryItem(historyId);
//       await loadUserHistory();
//     } catch (err) {
//       console.error("Failed to delete history item:", err);
//     }
//   };

//   const handleHistoryClear = async () => {
//     if (!userId) return;
//     try {
//       await clearHistory();
//       await loadUserHistory();
//     } catch (err) {
//       console.error("Failed to clear history:", err);
//     }
//   };

//   const handleHistorySelect = (item) => {
//     setMethod(item.method || "GET");
//     setUrl(item.url || "");
//     setResponse("");
//     setStatus(item.status ?? null);
//   };

//   // -------------------------------------------
//   // Copy to clipboard
//   // -------------------------------------------
//   const copyToClipboard = (text) => {
//     navigator.clipboard.writeText(typeof text === "string" ? text : JSON.stringify(text, null, 2));
//     const toast = document.createElement("div");
//     toast.textContent = "Copied to clipboard!";
//     toast.className = "toast";
//     document.body.appendChild(toast);
//     setTimeout(() => toast.remove(), 1200);
//   };

//   // -------------------------------------------
//   // RENDER
//   // -------------------------------------------
//   return (
//     <div className="layout">
//       {/* Sidebar */}
//       <div className="sidebar-small">
//         <button className="sidebar-btn" onClick={() => navigate("/account")}>👤<span className="tooltip">Account</span></button>

//         <button
//           className={`sidebar-btn ${activePanel === "history" ? "active" : ""}`}
//           onClick={() => setActivePanel(activePanel === "history" ? null : "history")}
//         >
//           🕒<span className="tooltip">History</span>
//         </button>

//         <button
//           className={`sidebar-btn ${activePanel === "flows" ? "active" : ""}`}
//           onClick={() => setActivePanel(activePanel === "flows" ? null : "flows")}
//         >
//           🔀<span className="tooltip">Flows</span>
//         </button>
//       </div>

//       {activePanel === "history" && (
//         <div className="sidebar-large">
//           <HistorySidebar
//             items={history}
//             onSelect={handleHistorySelect}
//             onDelete={handleHistoryDelete}
//             onClear={handleHistoryClear}
//           />
//         </div>
//       )}

//       {activePanel === "account" && (
//         <div className="sidebar-large">
//           <AccountPage />
//         </div>
//       )}

//       {/* Main App Area */}
//       <div className="app">
//         {/* Top bar */}
//         <div className="top-bar">
//           <MethodDropdown method={method} setMethod={setMethod} />
//           <input
//             className="url-input"
//             placeholder="Enter URL or describe the request"
//             value={url}
//             onChange={(e) => setUrl(e.target.value)}
//           />
//           <button
//             className="send-btn"
//             onClick={handleSend}
//             disabled={loading}
//             style={{ opacity: loading ? 0.6 : 1 }}
//           >
//             {loading ? "Sending..." : "Send"}
//           </button>
//         </div>

//         {errorMsg && <div className="error-box">{errorMsg}</div>}

//         {/* Tabs */}
//         <div className="tab-list">
//           {["Params", "Headers", "Body", "Authorization", "Scripts", "Settings"].map((tab) => (
//             <button
//               key={tab}
//               className={`tab ${activeTab === tab ? "active" : ""}`}
//               onClick={() => setActiveTab(tab)}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>

//         {/* Tab Content */}
//         <div className="tab-content">
//           {activeTab === "Params" && (
//             <>
//               <h4>Query Params</h4>
//               <table className="params-table">
//                 <thead>
//                   <tr><th>Key</th><th>Value</th><th>Description</th></tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td><input placeholder="Key" /></td>
//                     <td><input placeholder="Value" /></td>
//                     <td><input placeholder="Description" /></td>
//                   </tr>
//                 </tbody>
//               </table>
//             </>
//           )}
//           {activeTab === "Headers" && <HeadersTab headers={headersObj} setHeaders={setHeadersObj} />}
//           {activeTab === "Body" && <BodyTab onBodyChange={(b) => setBodyContent(b)} />}
//           {activeTab === "Authorization" && <div>Authorization content here</div>}
//           {activeTab === "Scripts" && <div>Scripts placeholder</div>}
//           {activeTab === "Settings" && <div>Settings options</div>}
//         </div>

//         {/* Response Section */}
//         <div className="response" ref={responseRef}>
//           <div className="response-header">
//             <div className="response-left">
//               <h4>Response</h4>
//               <div className="view-buttons">
//                 {["pretty", "raw", "preview"].map((mode) => (
//                   <button
//                     key={mode}
//                     className={`view-btn ${viewMode === mode ? "active" : ""}`}
//                     onClick={() => setViewMode(mode)}
//                   >
//                     {mode.charAt(0).toUpperCase() + mode.slice(1)}
//                   </button>
//                 ))}
//                 <button
//                   className="save-btn"
//                   onClick={() => {
//                     const blob = new Blob(
//                       [typeof response === "string" ? response : JSON.stringify(response, null, 2)],
//                       { type: "application/json" }
//                     );
//                     const url = URL.createObjectURL(blob);
//                     const link = document.createElement("a");
//                     link.href = url;
//                     link.download = "response.json";
//                     link.click();
//                   }}
//                 >
//                   Save
//                 </button>
//               </div>
//             </div>
//             <div className="response-right" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//               {status !== null && <span className={`status-badge status-${status}`}>{status}</span>}
//               <button className="copy-btn" onClick={() => response && copyToClipboard(response)}>Copy</button>
//               <button className="help-btn" onClick={() => alert("💡 Tip: Use Pretty view to visualize JSON better!")}>Help</button>
//             </div>
//           </div>
//           <div className="response-body" style={{ overflow: "auto", maxHeight: "400px" }}>
//             {!response ? (
//               <p>No response yet</p>
//             ) : viewMode === "pretty" ? (
//               <ReactJson
//                 src={typeof response === "string" ? { raw: response } : response}
//                 name={null}
//                 collapsed={1}
//                 enableClipboard={true}
//                 displayDataTypes={false}
//                 displayObjectSize={true}
//                 theme="google"
//               />
//             ) : viewMode === "raw" ? (
//               <pre>{typeof response === "string" ? response : JSON.stringify(response, null, 2)}</pre>
//             ) : viewMode === "preview" ? (
//               <div style={{ background: "#1e1e1e", color: "#ccc", fontFamily: "monospace", whiteSpace: "pre-wrap", padding: "10px" }}>
//                 <pre style={{ margin: 0 }}>{typeof response === "string" ? response : JSON.stringify(response, null, 2)}</pre>
//               </div>
//             ) : null}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




























// import { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import ReactJson from "react-json-view";

// import MethodDropdown from "./MethodDropdown";
// import HeadersTab from "./HeadersTab";
// import BodyTab from "./BodyTab";
// import AccountPage from "./AccountPage";
// import HistorySidebar from "../components/HistorySidebar";

// import { getHistory, deleteHistoryItem, clearHistory } from "../services/historyService";

// import "./PostmanClone.css";

// export default function PostmanClone() {
//   const [method, setMethod] = useState("GET");
//   const [url, setUrl] = useState("");
//   const [response, setResponse] = useState("");
//   const [status, setStatus] = useState(null);
//   const [activeTab, setActiveTab] = useState("Params");
//   const [history, setHistory] = useState([]);
//   const [activePanel, setActivePanel] = useState(null);
//   const [viewMode, setViewMode] = useState("pretty");
//   const [loading, setLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");
//   const [bodyContent, setBodyContent] = useState("");
//   const [headersObj, setHeadersObj] = useState([]);
//   const [paramsObj, setParamsObj] = useState([]);

//   const navigate = useNavigate();
//   const responseRef = useRef(null);

//   // ----------------------------
//   // SAFELY GET userId
//   // ----------------------------
//   const storedUserId = localStorage.getItem("userId");
//   const userId = storedUserId && storedUserId !== "guest" ? storedUserId : null;

//   // ----------------------------
//   // RESTORE LAST RESPONSE
//   // ----------------------------
//   const [lastResponse, setLastResponse] = useState(
//     JSON.parse(localStorage.getItem("lastResponse") || "null")
//   );
//   const [lastRequest, setLastRequest] = useState(
//     JSON.parse(localStorage.getItem("lastRequest") || "null")
//   );

//   // -------------------------------------------
//   // LOAD HISTORY
//   // -------------------------------------------
//   const loadUserHistory = async () => {
//     try {
//       const h = await getHistory();
//       setHistory(Array.isArray(h) ? [...h].reverse() : []);
//     } catch (err) {
//       console.error("Failed to load history:", err);
//       setHistory([]);
//     }
//   };

//   useEffect(() => {
//     loadUserHistory();

//     if (lastResponse) {
//       setResponse(lastResponse);
//       setStatus(lastRequest?.status ?? null);
//       setMethod(lastRequest?.method ?? "GET");
//       setUrl(lastRequest?.url ?? "");
//       if (lastRequest?.body) setBodyContent(JSON.stringify(lastRequest.body, null, 2));
//     }
//   }, []);

//   // -------------------------------------------
//   // URL Validator
//   // -------------------------------------------
//   const isValidUrl = (str) => {
//     try {
//       new URL(str);
//       return true;
//     } catch {
//       return false;
//     }
//   };

//   // -------------------------------------------
//   // SEND REQUEST
//   // -------------------------------------------
//   const handleSend = async () => {
//     setErrorMsg("");
//     setResponse("");
//     setStatus(null);

//     if (!userId) {
//       setErrorMsg("You must be logged in to send requests.");
//       return;
//     }

//     if (!url.trim()) {
//       setErrorMsg("Please enter a URL.");
//       return;
//     }

//     if (!isValidUrl(url)) {
//       setErrorMsg("Invalid URL format.");
//       return;
//     }

//     setLoading(true);
//     const start = performance.now();

//     try {
//       let bodyPayload;
//       if (["POST", "PUT", "PATCH", "DELETE"].includes(method) && bodyContent?.trim()) {
//         try {
//           bodyPayload = JSON.parse(bodyContent);
//         } catch (err) {
//           setErrorMsg("Invalid JSON in body: " + err.message);
//           setLoading(false);
//           return;
//         }
//       }

//       const res = await fetch("/api/request", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: JSON.stringify({
//           userId,
//           url,
//           method,
//           headers: headersObj,
//           params: paramsObj,
//           body: bodyPayload,
//         }),
//       });

//       const data = await res.json();

//       if (!data.success) {
//         setErrorMsg(data.error || "Request failed.");
//         setStatus("ERR");
//         setResponse({ error: data.error });
//         return;
//       }

//       const respBody = data.body ?? data;

//       // ----------------------------
//       // PERSIST LAST RESPONSE LOCALLY
//       // ----------------------------
//       setResponse(respBody);
//       setLastResponse(respBody);
//       setLastRequest({ url, method, body: bodyPayload, status: data.status ?? res.status ?? "OK" });
//       localStorage.setItem("lastResponse", JSON.stringify(respBody));
//       localStorage.setItem(
//         "lastRequest",
//         JSON.stringify({ url, method, body: bodyPayload, status: data.status ?? res.status ?? "OK" })
//       );

//       setStatus(data.status ?? res.status ?? "OK");

//       await loadUserHistory();
//     } catch (err) {
//       console.error("Request failed:", err);
//       setErrorMsg("Request failed: " + err.message);
//       setStatus("ERR");
//       setResponse({ error: err.message });
//     } finally {
//       setLoading(false);
//       responseRef.current?.scrollIntoView({ behavior: "smooth" });
//       console.log("Request duration:", Math.round(performance.now() - start), "ms");
//     }
//   };

//   // -------------------------------------------
//   // HISTORY HANDLERS
//   // -------------------------------------------
//   const handleHistoryDelete = async (historyId) => {
//     if (!userId) return;
//     try {
//       await deleteHistoryItem(historyId);
//       await loadUserHistory();
//     } catch (err) {
//       console.error("Failed to delete history item:", err);
//     }
//   };

//   const handleHistoryClear = async () => {
//     if (!userId) return;
//     try {
//       await clearHistory();
//       await loadUserHistory();
//     } catch (err) {
//       console.error("Failed to clear history:", err);
//     }
//   };

//   const handleHistorySelect = (item) => {
//     setMethod(item.method || "GET");
//     setUrl(item.url || "");
//     setResponse("");
//     setStatus(item.status ?? null);
//   };

//   // -------------------------------------------
//   // Copy to clipboard
//   // -------------------------------------------
//   const copyToClipboard = (text) => {
//     navigator.clipboard.writeText(typeof text === "string" ? text : JSON.stringify(text, null, 2));
//     const toast = document.createElement("div");
//     toast.textContent = "Copied to clipboard!";
//     toast.className = "toast";
//     document.body.appendChild(toast);
//     setTimeout(() => toast.remove(), 1200);
//   };

//   // -------------------------------------------
//   // RENDER
//   // -------------------------------------------
//   return (
//     <div className="layout">
//       {/* Sidebar */}
//       <div className="sidebar-small">
//         <button className="sidebar-btn" onClick={() => navigate("/account")}>👤<span className="tooltip">Account</span></button>

//         <button
//           className={`sidebar-btn ${activePanel === "history" ? "active" : ""}`}
//           onClick={() => setActivePanel(activePanel === "history" ? null : "history")}
//         >
//           🕒<span className="tooltip">History</span>
//         </button>

//         <button
//           className={`sidebar-btn ${activePanel === "flows" ? "active" : ""}`}
//           onClick={() => setActivePanel(activePanel === "flows" ? null : "flows")}
//         >
//           🔀<span className="tooltip">Flows</span>
//         </button>
//       </div>

//       {activePanel === "history" && (
//         <div className="sidebar-large">
//           <HistorySidebar
//             items={history}
//             onSelect={handleHistorySelect}
//             onDelete={handleHistoryDelete}
//             onClear={handleHistoryClear}
//           />
//         </div>
//       )}

//       {activePanel === "account" && (
//         <div className="sidebar-large">
//           <AccountPage />
//         </div>
//       )}

//       {/* Main App Area */}
//       <div className="app">
//         {/* Top bar */}
//         <div className="top-bar">
//           <MethodDropdown method={method} setMethod={setMethod} />
//           <input
//             className="url-input"
//             placeholder="Enter URL or describe the request"
//             value={url}
//             onChange={(e) => setUrl(e.target.value)}
//           />
//           <button
//             className="send-btn"
//             onClick={handleSend}
//             disabled={loading}
//             style={{ opacity: loading ? 0.6 : 1 }}
//           >
//             {loading ? "Sending..." : "Send"}
//           </button>
//         </div>

//         {errorMsg && <div className="error-box">{errorMsg}</div>}

//         {/* Tabs */}
//         <div className="tab-list">
//           {["Params", "Headers", "Body", "Authorization", "Scripts", "Settings"].map((tab) => (
//             <button
//               key={tab}
//               className={`tab ${activeTab === tab ? "active" : ""}`}
//               onClick={() => setActiveTab(tab)}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>

//         {/* Tab Content */}
//         <div className="tab-content">
//           {activeTab === "Params" && (
//             <>
//               <h4>Query Params</h4>
//               <table className="params-table">
//                 <thead>
//                   <tr><th>Key</th><th>Value</th><th>Description</th></tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td><input placeholder="Key" /></td>
//                     <td><input placeholder="Value" /></td>
//                     <td><input placeholder="Description" /></td>
//                   </tr>
//                 </tbody>
//               </table>
//             </>
//           )}
//           {activeTab === "Headers" && <HeadersTab headers={headersObj} setHeaders={setHeadersObj} />}
//           {activeTab === "Body" && <BodyTab onBodyChange={(b) => setBodyContent(b)} />}
//           {activeTab === "Authorization" && <div>Authorization content here</div>}
//           {activeTab === "Scripts" && <div>Scripts placeholder</div>}
//           {activeTab === "Settings" && <div>Settings options</div>}
//         </div>

//         {/* Response Section */}
//         {/* Response Section */}
//         <div className="response" ref={responseRef}>
//           <div className="response-header">
//             <div className="response-left">
//               <h4>Response</h4>
//               <div className="view-buttons">
//                 {["pretty", "raw", "preview"].map((mode) => (
//                   <button
//                     key={mode}
//                     className={`view-btn ${viewMode === mode ? "active" : ""}`}
//                     onClick={() => setViewMode(mode)}
//                   >
//                     {mode.charAt(0).toUpperCase() + mode.slice(1)}
//                   </button>
//                 ))}
//                 <button
//                   className="save-btn"
//                   onClick={() => {
//                     const blob = new Blob(
//                       [typeof response === "string" ? response : JSON.stringify(response, null, 2)],
//                       { type: "application/json" }
//                     );
//                     const url = URL.createObjectURL(blob);
//                     const link = document.createElement("a");
//                     link.href = url;
//                     link.download = "response.json";
//                     link.click();
//                   }}
//                 >
//                   Save
//                 </button>
//               </div>
//             </div>
//             <div className="response-right" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//               {status !== null && <span className={`status-badge status-${status}`}>{status}</span>}
//               <button className="copy-btn" onClick={() => response && copyToClipboard(response)}>Copy</button>
//               <button className="help-btn" onClick={() => alert("💡 Tip: Use Pretty view to visualize JSON better!")}>Help</button>
//             </div>
//           </div>
//           <div className="response-body" style={{ overflow: "auto", maxHeight: "400px" }}>
//             {!response ? (
//               <p>No response yet</p>
//             ) : viewMode === "pretty" ? (
//               <ReactJson
//                 src={typeof response === "string" ? { raw: response } : response}
//                 name={null}
//                 collapsed={1}
//                 enableClipboard={true}
//                 displayDataTypes={false}
//                 displayObjectSize={true}
//                 theme="google"
//               />
//             ) : viewMode === "raw" ? (
//               // Raw: literal server response
//               <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
//                 {typeof response === "string" ? response : JSON.stringify(response)}
//               </pre>
//             ) : viewMode === "preview" ? (
//               // Preview: nicely formatted / readable content
//               <div
//                 style={{
//                   background: "#1e1e1e",
//                   color: "#fff",          // make text fully white
//                   fontFamily: "monospace",
//                   whiteSpace: "pre-wrap",
//                   padding: "10px",
//                 }}
//               >
//                 <pre
//                   style={{
//                     margin: 0,
//                     color: "#fff",        // ensure <pre> text is white
//                   }}
//                 >
//                   {typeof response === "string"
//                     ? response.replace(/\\n/g, "\n") // preserve line breaks
//                     : JSON.stringify(response, null, 2) // formatted JSON
//                   }
//                 </pre>
//               </div>

//             ) : null}
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }
























import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReactJson from "react-json-view";

import MethodDropdown from "./MethodDropdown";
import HeadersTab from "./HeadersTab";
import BodyTab from "./BodyTab";
import AccountPage from "./AccountPage";
import HistorySidebar from "../components/HistorySidebar";

import { getHistory, deleteHistoryItem, clearHistory } from "../services/historyService";

import "./PostmanClone.css";

export default function PostmanClone() {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  const [response, setResponse] = useState("");
  const [status, setStatus] = useState(null);
  const [activeTab, setActiveTab] = useState("Params");
  const [history, setHistory] = useState([]);
  const [activePanel, setActivePanel] = useState(null);
  const [viewMode, setViewMode] = useState("pretty");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [bodyContent, setBodyContent] = useState("");
  const [headersObj, setHeadersObj] = useState([]);
  const [paramsObj, setParamsObj] = useState([]);

  const navigate = useNavigate();
  const responseRef = useRef(null);

  // ----------------------------
  // RESTORE LAST RESPONSE
  // ----------------------------
  const [lastResponse, setLastResponse] = useState(
    JSON.parse(localStorage.getItem("lastResponse") || "null")
  );
  const [lastRequest, setLastRequest] = useState(
    JSON.parse(localStorage.getItem("lastRequest") || "null")
  );

  // -------------------------------------------
  // LOAD HISTORY
  // -------------------------------------------
  const loadUserHistory = async () => {
    try {
      const h = await getHistory(); // ✅ uses authToken internally
      setHistory(Array.isArray(h) ? [...h].reverse() : []);
    } catch (err) {
      console.error("Failed to load history:", err);
      setHistory([]);
    }
  };

  useEffect(() => {
    loadUserHistory();

    if (lastResponse) {
      setResponse(lastResponse);
      setStatus(lastRequest?.status ?? null);
      setMethod(lastRequest?.method ?? "GET");
      setUrl(lastRequest?.url ?? "");
      if (lastRequest?.body) setBodyContent(JSON.stringify(lastRequest.body, null, 2));
    }
  }, []);

  // -------------------------------------------
  // URL Validator
  // -------------------------------------------
  const isValidUrl = (str) => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  // -------------------------------------------
  // SEND REQUEST
  // -------------------------------------------
  const handleSend = async () => {
    setErrorMsg("");
    setResponse("");
    setStatus(null);

    const token = localStorage.getItem("authToken"); // ✅ use correct key
    if (!token) {
      setErrorMsg("You must be logged in to send requests.");
      return;
    }

    if (!url.trim()) {
      setErrorMsg("Please enter a URL.");
      return;
    }

    if (!isValidUrl(url)) {
      setErrorMsg("Invalid URL format.");
      return;
    }

    setLoading(true);
    const start = performance.now();

    try {
      let bodyPayload;
      if (["POST", "PUT", "PATCH", "DELETE"].includes(method) && bodyContent?.trim()) {
        try {
          bodyPayload = JSON.parse(bodyContent);
        } catch (err) {
          setErrorMsg("Invalid JSON in body: " + err.message);
          setLoading(false);
          return;
        }
      }

      const res = await fetch("/api/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ corrected
        },
        body: JSON.stringify({
          url,
          method,
          headers: headersObj,
          params: paramsObj,
          body: bodyPayload,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setErrorMsg(data.error || "Request failed.");
        setStatus("ERR");
        setResponse({ error: data.error });
        return;
      }

      const respBody = data.body ?? data;
      // ----------------------------
      // PERSIST LAST RESPONSE LOCALLY
      // ----------------------------
      setResponse(respBody);
      setLastResponse(respBody);
      setLastRequest({ url, method, body: bodyPayload, status: data.status ?? res.status ?? "OK" });
      localStorage.setItem("lastResponse", JSON.stringify(respBody));
      localStorage.setItem(
        "lastRequest",
        JSON.stringify({ url, method, body: bodyPayload, status: data.status ?? res.status ?? "OK" })
      );

      setStatus(data.status ?? res.status ?? "OK");

      await loadUserHistory(); // refresh history after request
    } catch (err) {
      console.error("Request failed:", err);
      setErrorMsg("Request failed: " + err.message);
      setStatus("ERR");
      setResponse({ error: err.message });
    } finally {
      setLoading(false);
      responseRef.current?.scrollIntoView({ behavior: "smooth" });
      console.log("Request duration:", Math.round(performance.now() - start), "ms");
    }
  };

  // -------------------------------------------
  // HISTORY HANDLERS
  // -------------------------------------------
  const handleHistoryDelete = async (historyId) => {
    try {
      await deleteHistoryItem(historyId); // ✅ uses authToken internally
      await loadUserHistory();
    } catch (err) {
      console.error("Failed to delete history item:", err);
    }
  };

  const handleHistoryClear = async () => {
    try {
      await clearHistory(); // ✅ uses authToken internally
      await loadUserHistory();
    } catch (err) {
      console.error("Failed to clear history:", err);
    }
  };

  const handleHistorySelect = (item) => {
    setMethod(item.method || "GET");
    setUrl(item.url || "");
    setResponse("");
    setStatus(item.status ?? null);
  };

  // -------------------------------------------
  // Copy to clipboard
  // -------------------------------------------
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(typeof text === "string" ? text : JSON.stringify(text, null, 2));
    const toast = document.createElement("div");
    toast.textContent = "Copied to clipboard!";
    toast.className = "toast";
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 1200);
  };

  // -------------------------------------------
  // RENDER
  // -------------------------------------------
  return (
    <div className="layout">
      {/* Sidebar */}
      <div className="sidebar-small">
        <button className="sidebar-btn" onClick={() => navigate("/account")}>👤<span className="tooltip">Account</span></button>

        <button
          className={`sidebar-btn ${activePanel === "history" ? "active" : ""}`}
          onClick={() => setActivePanel(activePanel === "history" ? null : "history")}
        >
          🕒<span className="tooltip">History</span>
        </button>

        <button
          className={`sidebar-btn ${activePanel === "flows" ? "active" : ""}`}
          onClick={() => setActivePanel(activePanel === "flows" ? null : "flows")}
        >
          🔀<span className="tooltip">Flows</span>
        </button>
      </div>

      {activePanel === "history" && (
        <div className="sidebar-large">
          <HistorySidebar
            items={history}
            onSelect={handleHistorySelect}
            onDelete={handleHistoryDelete}
            onClear={handleHistoryClear}
          />
        </div>
      )}

      {activePanel === "account" && (
        <div className="sidebar-large">
          <AccountPage />
        </div>
      )}

      {/* Main App Area */}
      <div className="app">
        {/* Top bar */}
        <div className="top-bar">
          <MethodDropdown method={method} setMethod={setMethod} />
          <input
            className="url-input"
            placeholder="Enter URL or describe the request"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            className="send-btn"
            onClick={handleSend}
            disabled={loading}
            style={{ opacity: loading ? 0.6 : 1 }}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>

        {errorMsg && <div className="error-box">{errorMsg}</div>}

        {/* Tabs */}
        <div className="tab-list">
          {["Params", "Headers", "Body", "Authorization", "Scripts", "Settings"].map((tab) => (
            <button
              key={tab}
              className={`tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === "Params" && (
            <>
              <h4>Query Params</h4>
              <table className="params-table">
                <thead>
                  <tr><th>Key</th><th>Value</th><th>Description</th></tr>
                </thead>
                <tbody>
                  <tr>
                    <td><input placeholder="Key" /></td>
                    <td><input placeholder="Value" /></td>
                    <td><input placeholder="Description" /></td>
                  </tr>
                </tbody>
              </table>
            </>
          )}
          {activeTab === "Headers" && <HeadersTab headers={headersObj} setHeaders={setHeadersObj} />}
          {activeTab === "Body" && <BodyTab onBodyChange={(b) => setBodyContent(b)} />}
          {activeTab === "Authorization" && <div>Authorization content here</div>}
          {activeTab === "Scripts" && <div>Scripts placeholder</div>}
          {activeTab === "Settings" && <div>Settings options</div>}
        </div>

        {/* Response Section */}
        <div className="response" ref={responseRef}>
          <div className="response-header">
            <div className="response-left">
              <h4>Response</h4>
              <div className="view-buttons">
                {["pretty", "raw", "preview"].map((mode) => (
                  <button
                    key={mode}
                    className={`view-btn ${viewMode === mode ? "active" : ""}`}
                    onClick={() => setViewMode(mode)}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
                <button
                  className="save-btn"
                  onClick={() => {
                    const blob = new Blob(
                      [typeof response === "string" ? response : JSON.stringify(response, null, 2)],
                      { type: "application/json" }
                    );
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = "response.json";
                    link.click();
                  }}
                >
                  Save
                </button>
              </div>
            </div>
            <div className="response-right" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {status !== null && <span className={`status-badge status-${status}`}>{status}</span>}
              <button className="copy-btn" onClick={() => response && copyToClipboard(response)}>Copy</button>
              <button className="help-btn" onClick={() => alert("💡 Tip: Use Pretty view to visualize JSON better!")}>Help</button>
            </div>
          </div>
          <div className="response-body" style={{ overflow: "auto", maxHeight: "400px" }}>
            {!response ? (
              <p>No response yet</p>
            ) : viewMode === "pretty" ? (
              <ReactJson
                src={typeof response === "string" ? { raw: response } : response}
                name={null}
                collapsed={1}
                enableClipboard={true}
                displayDataTypes={false}
                displayObjectSize={true}
                theme="google"
              />
            ) : viewMode === "raw" ? (
              <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                {typeof response === "string" ? response : JSON.stringify(response)}
              </pre>
            ) : viewMode === "preview" ? (
              <div
                style={{
                  background: "#1e1e1e",
                  color: "#fff",
                  fontFamily: "monospace",
                  whiteSpace: "pre-wrap",
                  padding: "10px",
                }}
              >
                <pre style={{ margin: 0, color: "#fff" }}>
                  {typeof response === "string"
                    ? response.replace(/\\n/g, "\n")
                    : JSON.stringify(response, null, 2)}
                </pre>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
