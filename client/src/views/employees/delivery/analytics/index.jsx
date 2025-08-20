/* eslint-disable react/prop-types */
import { useMemo, useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";

// Default export: a single-file React component dashboard using Tailwind and Recharts
// Notes:
// - Tailwind must be available in the parent project (no import here)
// - Recharts, framer-motion and other libraries should be installed in the project

// eslint-disable-next-line react/prop-types
const KPI = ({ title, value, delta, icon, accent = "bg-emerald-100" }) => {
  return (
    <div className="flex-1 min-w-[180px] max-w-sm bg-[#8b8a8a47] rounded-2xl p-4 shadow-sm border border-slate-100">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm text-slate-400">{title}</div>
          <div className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {value}
          </div>
          <div className="mt-1 text-xs text-slate-500">{delta}</div>
        </div>
        <div className={`p-2 rounded-lg ${accent} text-2xl`}>{icon}</div>
      </div>
    </div>
  );
};

const DeliveryRow = ({ item }) => {
  return (
    <tr className="odd:bg-[#8b8a8ae3] even:bg-[#8b8a8a8c] ">
      <td className="px-3 py-2 text-sm">{item.id}</td>
      <td className="px-3 py-2 text-sm">{item.name}</td>
      <td className="px-3 py-2 text-sm">{item.completed}</td>
      <td className="px-3 py-2 text-sm">{item.onTime}%</td>
      <td className="px-3 py-2 text-sm">{item.rating}</td>
      <td className="px-3 py-2 text-sm">{item.status}</td>
    </tr>
  );
};

const generateDummy = () => {
  const days = Array.from({ length: 14 }).map((_, i) => {
    const day = new Date();
    day.setDate(day.getDate() - (13 - i));
    const label = `${day.getDate()}.${day.getMonth() + 1}`;
    return {
      date: label,
      deliveries: Math.round(40 + Math.sin(i / 2) * 10 + Math.random() * 8),
      distanceKm:
        Math.round((50 + Math.cos(i / 3) * 8 + Math.random() * 10) * 10) / 10,
    };
  });

  const drivers = Array.from({ length: 8 }).map((_, i) => ({
    id: `DB-${120 + i}`,
    name: ["Jonas", "Lukas", "Mia", "Sophie", "Leon", "Emilia", "Noah", "Lina"][
      i % 8
    ],
    completed: 20 + Math.floor(Math.random() * 40),
    onTime: 80 + Math.floor(Math.random() * 20),
    rating: (3 + Math.random() * 2).toFixed(1),
    status: Math.random() > 0.3 ? "Verfügbar" : "Auf Lieferung",
  }));

  const heat = [
    { name: "Pünktlich", value: drivers.filter((d) => d.onTime >= 90).length },
    {
      name: "Verspätet",
      value: drivers.filter((d) => d.onTime < 90 && d.onTime >= 80).length,
    },
    { name: "Unpünktlich", value: drivers.filter((d) => d.onTime < 80).length },
  ];

  return { days, drivers, heat };
};

export default function DeliveryBoyAnalyticsDashboard() {
  const [data] = useState(generateDummy());
  const [filterStatus, setFilterStatus] = useState("Alle");
  const [search, setSearch] = useState("");

  const totalDeliveries = useMemo(
    () => data.days.reduce((s, d) => s + d.deliveries, 0),
    [data]
  );

  const avgDistance = useMemo(
    () =>
      (
        data.days.reduce((s, d) => s + d.distanceKm, 0) / data.days.length
      ).toFixed(1),
    [data]
  );

  const availableDrivers = useMemo(
    () => data.drivers.filter((d) => d.status === "Verfügbar").length,
    [data]
  );

  const filteredDrivers = useMemo(() => {
    return data.drivers.filter((d) => {
      if (filterStatus !== "Alle" && d.status !== filterStatus) return false;
      if (
        search &&
        !`${d.name} ${d.id}`.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [data.drivers, filterStatus, search]);

  useEffect(() => {
    // subtle perf: in a real app we could fetch here; animation demo only
  }, []);

  const COLORS = ["#1f2937", "#6366f1", "#06b6d4"];

  return (
    <div className="min-h-screen bg-[#8B8A8A1E] p-6">
      <header className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              Delivery Driver Dashboard
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Overview of all drivers, performance, and analytics
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm border border-slate-100">
              <input
                aria-label="Search"
                placeholder="Search driver or ID"
                className="bg-transparent outline-none text-sm w-48"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="text-xs px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-700">
                Search
              </button>
            </div>
            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm">
              Export
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* KPIs */}
        <section className="lg:col-span-4 flex flex-col gap-4">
          <div className="flex gap-4">
            <KPI
              title="Total Deliveries (14 days)"
              value={totalDeliveries}
              delta="+4.2% vs last week"
              icon="📦"
              accent="bg-indigo-100"
            />
            <KPI
              title="Avg. Distance (km)"
              value={`${avgDistance} km`}
              delta="stable"
              icon="🧭"
              accent="bg-amber-100"
            />
          </div>

          <div className="flex gap-4">
            <KPI
              title="Available Drivers"
              value={availableDrivers}
              delta="ready for dispatch"
              icon="🚴"
              accent="bg-emerald-100"
            />
            <KPI
              title="Avg. Rating"
              value={
                (
                  data.drivers.reduce((s, d) => s + parseFloat(d.rating), 0) /
                  data.drivers.length
                ).toFixed(1) ?? "—"
              }
              delta="from 8 drivers"
              icon="⭐"
              accent="bg-yellow-100"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#8b8a8a47] rounded-2xl p-4 shadow-sm border border-slate-100"
          >
            <h3 className="text-sm text-slate-500 mb-3">Driver Status</h3>
            <div className="flex items-center gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="p-2 rounded-lg border bg-transparent text-sm"
              >
                <option>All</option>
                <option>Available</option>
                <option>On Delivery</option>
              </select>
              <div className="text-sm text-slate-500">
                Drivers found:{" "}
                <strong className="text-slate-700 dark:text-slate-200">
                  {filteredDrivers.length}
                </strong>
              </div>
            </div>

            <div className="mt-4 overflow-auto">
              <table className="w-full text-left text-slate-700 dark:text-slate-200">
                <thead className="text-xs text-slate-400">
                  <tr>
                    <th className="px-3 py-2">ID</th>
                    <th className="px-3 py-2">Name</th>
                    <th className="px-3 py-2">Completed</th>
                    <th className="px-3 py-2">On Time</th>
                    <th className="px-3 py-2">Rating</th>
                    <th className="px-3 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDrivers.map((d) => (
                    <DeliveryRow key={d.id} item={d} />
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </section>

        {/* Charts */}
        <section className="lg:col-span-8 grid grid-rows-[auto,auto] gap-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#8b8a8a47] rounded-2xl p-4 shadow-sm border border-slate-100 h-80">
              <h3 className="text-sm text-slate-500 mb-3">
                Deliveries (last 14 days)
              </h3>
              <ResponsiveContainer width="100%" height="80%">
                <LineChart
                  data={data.days}
                  margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="deliveries"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-[#8b8a8a47] rounded-2xl p-4 shadow-sm border border-slate-100 h-80">
              <h3 className="text-sm text-slate-500 mb-3">
                Distance per Day (km)
              </h3>
              <ResponsiveContainer width="100%" height="80%">
                <BarChart
                  data={data.days}
                  margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="distanceKm"
                    fill="#06b6d4"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="col-span-2 bg-[#8b8a8a47] rounded-2xl p-4 shadow-sm border border-slate-100">
              <h3 className="text-sm text-slate-500 mb-3">
                Top Drivers & Trend
              </h3>
              <div className="flex gap-4 items-start">
                <div className="w-2/3">
                  <ResponsiveContainer width="100%" height={240}>
                    <LineChart
                      data={data.days}
                      margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="deliveries"
                        stroke="#1f2937"
                        strokeWidth={2}
                        dot={{ r: 2 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="distanceKm"
                        stroke="#06b6d4"
                        strokeWidth={2}
                        dot={{ r: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-1/3 pl-4 border-l">
                  <h4 className="text-sm text-slate-600 mb-2">Top Drivers</h4>
                  <ol className="text-sm list-decimal pl-4 text-slate-700 dark:text-slate-200">
                    {data.drivers.slice(0, 5).map((d) => (
                      <li key={d.id} className="mb-2">
                        <div className="font-medium">
                          {d.name}{" "}
                          <span className="text-xs text-slate-400">{d.id}</span>
                        </div>
                        <div className="text-xs text-slate-500">
                          Completed: {d.completed} • On Time: {d.onTime}%
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>

            <div className="bg-[#8b8a8a47] rounded-2xl p-4 shadow-sm border border-slate-100">
              <h3 className="text-sm text-slate-500 mb-3">
                On-Time Distribution
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={data.heat}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={70}
                    fill="#8884d8"
                    label
                  >
                    {data.heat.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#8b8a8a47] rounded-2xl p-4 shadow-sm border border-slate-100">
            <h3 className="text-sm text-slate-500 mb-3">
              Live Location Map (Placeholder)
            </h3>
            <div className="h-64 rounded-lg bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center border border-dashed">
              <div className="text-sm text-slate-500">
                Map preview — In production with TomTom/Mapbox
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Add real live positions with TomTom, Mapbox, or Leaflet. Tile and
              API key management recommended.
            </p>
          </div>
        </section>
      </main>

      <footer className="max-w-7xl mx-auto mt-6 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} NIZX Analytics • Designed for global
        operators
      </footer>
    </div>
  );
}
