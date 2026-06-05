import { useState } from "react";

function App() {
  const [message, setMessage] = useState(
    "Checkout failures are increasing. What should we do?"
  );

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeIncident = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/workflow/incident",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
        }
      );

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        answer: "Unable to connect to backend. Make sure FastAPI is running.",
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-5">
        <h1 className="text-4xl font-bold text-purple-400">Enterprise AI</h1>
        <p className="text-slate-400 mt-2">Operations Copilot</p>

        <div className="mt-10 space-y-4">
          <div className="bg-slate-800 rounded-xl p-4">🚨 Incident Copilot</div>
          <div className="p-4">📚 Knowledge Base</div>
          <div className="p-4">🎫 Tickets</div>
          <div className="p-4">📈 Logs</div>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-6xl font-bold">AI Operations Dashboard</h1>
            <p className="text-slate-400 mt-2">
              RAG + LangGraph + Service Tools + Ticket Automation
            </p>
          </div>

          <div className="bg-emerald-900 text-emerald-300 px-5 py-3 rounded-full">
            System Online
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mt-8">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <p className="text-slate-400 text-sm">Incidents Today</p>
            <h3 className="text-3xl font-bold mt-2">12</h3>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <p className="text-slate-400 text-sm">Open Tickets</p>
            <h3 className="text-3xl font-bold mt-2">5</h3>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <p className="text-slate-400 text-sm">Critical Alerts</p>
            <h3 className="text-3xl font-bold text-red-400 mt-2">1</h3>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <p className="text-slate-400 text-sm">System Health</p>
            <h3 className="text-3xl font-bold text-emerald-400 mt-2">98%</h3>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mt-8">
          <div className="col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-3xl font-bold">Incident Assistant</h2>
            <p className="text-slate-400 mt-2">
              Ask the copilot to investigate an operational issue.
            </p>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full h-36 bg-black border border-slate-700 rounded-xl p-4 mt-6"
            />

            <button
              onClick={analyzeIncident}
              disabled={loading}
              className="mt-6 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 px-6 py-3 rounded-xl font-semibold"
            >
              {loading ? "Analyzing..." : "Analyze Incident"}
            </button>

            {result && (
              <div className="mt-8 space-y-5">
                <h3 className="text-2xl font-bold text-purple-300">
                  Incident Insights
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black border border-slate-800 rounded-xl p-5">
                    <p className="text-slate-400 text-sm">Summary</p>
                    <p className="text-slate-200 mt-3">
                      Checkout failures are increasing due to degraded
                      payment-api performance.
                    </p>
                  </div>

                  <div className="bg-black border border-slate-800 rounded-xl p-5">
                    <p className="text-slate-400 text-sm">Root Cause</p>
                    <p className="text-slate-200 mt-3">
                      The payment-api service is degraded and impacting checkout
                      transactions.
                    </p>
                  </div>

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
                  <p className="text-slate-400 text-sm">Recommended Actions</p>

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
                  {
                    title: "Retrieved Documents",
                    detail: "Searched enterprise knowledge base",
                    time: "10:24:31",
                  },
                  {
                    title: "Checked Service Status",
                    detail: "Verified payment-api health",
                    time: "10:24:33",
                  },
                  {
                    title: "Created Incident Ticket",
                    detail: result?.ticket?.ticket_id || "Waiting for ticket",
                    time: "10:24:35",
                  },
                  {
                    title: "Generated AI Response",
                    detail: "Produced recommended actions",
                    time: "10:24:37",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-emerald-500 text-black flex items-center justify-center text-sm font-bold">
                      ✓
                    </div>

                    <div>
                      <p className="font-semibold text-slate-200">
                        {item.title}
                      </p>
                      <p className="text-sm text-slate-400">{item.detail}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {item.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 text-center text-slate-500 text-sm border-t border-slate-800 pt-6">
  Powered by FastAPI • LangGraph • OpenAI • ChromaDB • React
</div>
      </main>
    </div>
  );
}

export default App;