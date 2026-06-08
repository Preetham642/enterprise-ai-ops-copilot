import { useState, useEffect } from "react";

function App() {
  const [activePage, setActivePage] = useState("incident");
  const [message, setMessage] = useState(
    "Checkout failures are increasing. What should we do?"
  );
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeIncident = async () => {
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/workflow/incident", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        answer: "Unable to connect to backend. Make sure FastAPI is running.",
      });
    }

    setLoading(false);
  };

  const menuItem = (id, label) => (
    <button
      onClick={() => setActivePage(id)}
      className={`w-full text-left rounded-xl p-4 transition ${
        activePage === id
          ? "bg-slate-800 text-white"
          : "text-slate-400 hover:bg-slate-800 hover:text-white"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-5">
        <h1 className="text-4xl font-bold text-purple-400">Enterprise AI</h1>
        <p className="text-slate-400 mt-2">Operations Copilot</p>

        <div className="mt-10 space-y-3">
          {menuItem("incident", "🚨 Incident Copilot")}
          {menuItem("knowledge", "📚 Knowledge Base")}
          {menuItem("tickets", "🎫 Tickets")}
          {menuItem("logs", "📈 Logs")}
        </div>
      </aside>

      <main className="flex-1 p-8">
        {activePage === "incident" && (
          <>
            <Header title="AI Operations Dashboard" />
            <Metrics />

            <div className="grid grid-cols-3 gap-6 mt-8">
              <div className="col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h2 className="text-3xl font-bold">Incident Assistant</h2>
                <p className="text-slate-400 mt-2">
                  Ask the copilot to investigate an operational issue.
                </p>

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full h-36 bg-black border border-slate-700 rounded-xl p-4 mt-6 outline-none focus:border-purple-500"
                />

                <button
                  onClick={analyzeIncident}
                  disabled={loading}
                  className="mt-6 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 px-6 py-3 rounded-xl font-semibold transition"
                >
                  {loading ? "Analyzing..." : "Analyze Incident"}
                </button>

                {result && (
                  <div className="mt-8 space-y-5">
                    <h3 className="text-2xl font-bold text-purple-300">
                      Incident Insights
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <InfoCard
                        title="Summary"
                        text="Checkout failures are increasing due to degraded payment-api performance."
                      />

                      <InfoCard
                        title="Root Cause"
                        text="The payment-api service is degraded and impacting checkout transactions."
                      />

                      <div className="bg-black border border-slate-800 rounded-xl p-5">
                        <p className="text-slate-400 text-sm">Risk Level</p>
                        <span className="inline-block mt-3 bg-yellow-900 text-yellow-300 px-3 py-1 rounded-full">
                          Medium
                        </span>
                      </div>

                      <div className="bg-black border border-slate-800 rounded-xl p-5">
                        <p className="text-slate-400 text-sm">Confidence</p>
                        <span className="inline-block mt-3 bg-emerald-900 text-emerald-300 px-3 py-1 rounded-full">
                          High
                        </span>
                      </div>
                    </div>

                    <div className="bg-black border border-slate-800 rounded-xl p-5">
                      <p className="text-slate-400 text-sm">
                        Recommended Actions
                      </p>

                      <ul className="mt-3 space-y-2 text-slate-200">
                        <li>✅ Check payment-api service health</li>
                        <li>✅ Review recent deployments</li>
                        <li>✅ Check database latency</li>
                        <li>✅ Scale API workers if needed</li>
                        <li>✅ Escalate to Payments Engineering</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              <RightPanel result={result} />
            </div>
          </>
        )}

        {activePage === "knowledge" && <KnowledgeBase />}
        {activePage === "tickets" && <Tickets />}
        {activePage === "logs" && <Logs />}
      </main>
    </div>
  );
}

function Header({ title }) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-6xl font-bold">{title}</h1>
        <p className="text-slate-400 mt-2">
          RAG + LangGraph + Service Tools + Ticket Automation
        </p>
      </div>

      <div className="bg-emerald-900 text-emerald-300 px-5 py-3 rounded-full">
        System Online
      </div>
    </div>
  );
}

function Metrics() {
  return (
    <div className="grid grid-cols-4 gap-4 mt-8">
      <Metric title="Incidents Today" value="12" />
      <Metric title="Open Tickets" value="5" />
      <Metric title="Critical Alerts" value="1" color="text-red-400" />
      <Metric title="System Health" value="98%" color="text-emerald-400" />
    </div>
  );
}

function Metric({ title, value, color = "text-white" }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
      <p className="text-slate-400 text-sm">{title}</p>
      <h3 className={`text-3xl font-bold mt-2 ${color}`}>{value}</h3>
    </div>
  );
}

function InfoCard({ title, text }) {
  return (
    <div className="bg-black border border-slate-800 rounded-xl p-5">
      <p className="text-slate-400 text-sm">{title}</p>
      <p className="text-slate-200 mt-3">{text}</p>
    </div>
  );
}

function RightPanel({ result }) {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <h3 className="text-slate-400">Service Status</h3>
        <p className="text-3xl mt-3">
          {result?.service_status?.service || "payment-api"}
        </p>
        <div className="mt-3 inline-block bg-red-900 text-red-300 px-3 py-1 rounded-full">
          {result?.service_status?.status || "Waiting"}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <h3 className="text-slate-400">Incident Ticket</h3>
        <p className="text-3xl mt-3">
          {result?.ticket?.ticket_id || "No ticket yet"}
        </p>
        <p className="text-slate-400 mt-2">
          {result?.ticket?.assigned_team || ""}
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <h3 className="text-slate-400">Sources Used</h3>
        <ul className="mt-4 space-y-2">
          {(result?.sources || []).map((source) => (
            <li key={source}>📄 {source}</li>
          ))}
        </ul>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <h3 className="text-slate-400">Agent Activity Timeline</h3>

        <div className="mt-5 space-y-5">
          {[
            ["Retrieved Documents", "Searched enterprise knowledge base"],
            ["Checked Service Status", "Verified payment-api health"],
            ["Created Incident Ticket", result?.ticket?.ticket_id || "Waiting"],
            ["Generated AI Response", "Produced recommended actions"],
          ].map(([title, detail]) => (
            <div key={title} className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-emerald-500 text-black flex items-center justify-center text-sm font-bold">
                ✓
              </div>
              <div>
                <p className="font-semibold text-slate-200">{title}</p>
                <p className="text-sm text-slate-400">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function KnowledgeBase() {
  const [documents, setDocuments] = useState([]);
  const [query, setQuery] = useState("checkout failure");
  const [results, setResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/documents")
      .then((res) => res.json())
      .then((data) => {
        setDocuments(data.documents || []);
      })
      .catch(console.error);
  }, []);

  const searchKnowledge = async () => {
    if (!query.trim()) return;

    setLoadingSearch(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/vector/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      setResults(data.matches || []);
    } catch (error) {
      console.error(error);
      setResults([]);
    }

    setLoadingSearch(false);
  };

  return (
    <>
      <Header title="Knowledge Base" />

      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 mt-8">
        <h2 className="text-2xl font-bold mb-2">Enterprise Knowledge Base</h2>
        <p className="text-slate-400 mb-6">
          Search indexed runbooks, escalation policies, and security documents.
        </p>

        <div className="flex gap-3 mb-8">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search runbooks, policies, escalations..."
            className="flex-1 bg-black border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-purple-500"
          />

          <button
            onClick={searchKnowledge}
            className="bg-purple-600 hover:bg-purple-700 px-5 py-3 rounded-lg font-semibold transition"
          >
            {loadingSearch ? "Searching..." : "Search"}
          </button>
        </div>

        <h3 className="text-lg font-semibold mb-3">Available Documents</h3>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {documents.map((doc, idx) => (
            <div
              key={idx}
              className="bg-slate-950 border border-slate-800 rounded-xl p-4"
            >
              <p className="font-semibold">📄 {doc.source}</p>
              <p className="text-slate-400 text-sm mt-2">
                Indexed enterprise knowledge source
              </p>
            </div>
          ))}
        </div>

        <h3 className="text-lg font-semibold mb-3">Search Results</h3>

        <div className="space-y-4">
          {results.length === 0 ? (
            <p className="text-slate-500">
              No results yet. Search for something like "checkout failure".
            </p>
          ) : (
            results.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-950 border border-slate-800 rounded-xl p-4"
              >
                <div className="font-bold text-purple-400 mb-2">
                  {item.source}
                </div>

                <div className="text-slate-300 whitespace-pre-wrap leading-7">
                  {item.content}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

function Tickets() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/tickets")
      .then((res) => res.json())
      .then((data) => {
        setTickets(data.tickets || []);
      })
      .catch(console.error);
  }, []);

  return (
    <>
      <Header title="Incident Tickets" />

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-8">
        <h2 className="text-2xl font-bold">Ticket History</h2>
        <p className="text-slate-400 mt-2">
          Tickets created by the AI incident workflow are stored in SQLite.
        </p>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left border border-slate-800 rounded-xl overflow-hidden">
            <thead className="bg-slate-800 text-slate-400">
              <tr>
                <th className="p-4">Ticket ID</th>
                <th className="p-4">Summary</th>
                <th className="p-4">Severity</th>
                <th className="p-4">Status</th>
                <th className="p-4">Assigned Team</th>
                <th className="p-4">Created At</th>
              </tr>
            </thead>

            <tbody>
              {tickets.length === 0 ? (
                <tr>
                  <td className="p-4 text-slate-400" colSpan="6">
                    No tickets found.
                  </td>
                </tr>
              ) : (
                tickets.map((ticket, index) => (
                  <tr key={index} className="border-t border-slate-800">
                    <td className="p-4">{ticket.ticket_id}</td>
                    <td className="p-4">{ticket.summary}</td>
                    <td className="p-4">{ticket.severity}</td>
                    <td className="p-4 text-emerald-400">{ticket.status}</td>
                    <td className="p-4">{ticket.assigned_team}</td>
                    <td className="p-4 text-slate-400">
                      {ticket.created_at}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function Logs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/logs")
      .then((res) => res.json())
      .then((data) => {
        setLogs(data.logs || []);
      })
      .catch(console.error);
  }, []);

  return (
    <>
      <Header title="System Logs" />

      <div className="bg-black border border-slate-800 rounded-2xl p-6 mt-8 font-mono text-sm text-emerald-300 max-h-[650px] overflow-y-auto">
        {logs.length === 0 ? (
          <p>No logs found.</p>
        ) : (
          logs.map((log, index) => <p key={index}>{log}</p>)
        )}
      </div>
    </>
  );
}

export default App;