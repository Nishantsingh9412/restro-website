import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

export default function Dashboard() {
  const pieData = [
    { name: "Orders", value: 300 },
    { name: "Dine-in", value: 150 },
    { name: "Takeaway", value: 100 },
  ];

  const barData = [
    { name: "Mon", inventory: 400 },
    { name: "Tue", inventory: 300 },
    { name: "Wed", inventory: 500 },
    { name: "Thu", inventory: 200 },
    { name: "Fri", inventory: 278 },
    { name: "Sat", inventory: 189 },
    { name: "Sun", inventory: 239 },
  ];

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl shadow p-5">
          <h2 className="text-sm text-gray-500">Total Inventory</h2>
          <p className="text-2xl font-bold">1,248</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-5">
          <h2 className="text-sm text-gray-500">Orders Delivered</h2>
          <p className="text-2xl font-bold">682</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-5">
          <h2 className="text-sm text-gray-500">Out of Stock</h2>
          <p className="text-2xl font-bold text-red-500">16</p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl text-white shadow p-5">
          <h2 className="text-sm">Upgrade Plan</h2>
          <p className="text-xl font-bold mt-1">Go Premium</p>
          <button className="mt-3 px-4 py-2 bg-white text-purple-600 font-semibold rounded-xl">
            Upgrade
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow p-5 col-span-2">
          <h3 className="text-lg font-semibold mb-4">Inventory Tracking</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="inventory"
                stroke="#8884d8"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow p-5">
          <h3 className="text-lg font-semibold mb-4">Order Insights</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-5">
        <h3 className="text-lg font-semibold mb-4">Delivery Map</h3>
        <div className="bg-gray-200 h-64 rounded-xl flex items-center justify-center text-gray-500">
          Map Component Placeholder
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow p-5">
          <h3 className="text-lg font-semibold mb-4">Contacts</h3>
          <ul className="space-y-3">
            {[
              { name: "Arif Khan", role: "Inventory Manager" },
              { name: "Sara Paul", role: "Delivery Head" },
              { name: "Nizam Shah", role: "Admin" },
            ].map((user, idx) => (
              <li key={idx} className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 text-purple-600 flex items-center justify-center rounded-full font-bold">
                  {user.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-2xl shadow p-5">
          <h3 className="text-lg font-semibold mb-4">Plan Details</h3>
          <p className="text-sm text-gray-500 mb-2">Current Plan</p>
          <p className="text-xl font-bold text-purple-600">Starter</p>
          <p className="text-sm text-gray-500 mt-4">Storage Used</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div
              className="bg-purple-600 h-2 rounded-full"
              style={{ width: "45%" }}
            ></div>
          </div>
          <p className="text-xs text-right mt-1 text-gray-400">4.5GB / 10GB</p>
        </div>
      </div>
    </div>
  );
}
