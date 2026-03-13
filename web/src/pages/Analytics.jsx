export default function Analytics() {
  const metrics = [
    { label: 'Total Appointments', value: '582', change: '+12%', trend: 'up' },
    { label: 'Confirmation Rate', value: '78%', change: '+5%', trend: 'up' },
    { label: 'SMS Delivered', value: '1,245', change: '-2%', trend: 'down' },
  ]

  const analyticsData = [
    { label: 'Week 1', value: 45 },
    { label: 'Week 2', value: 52 },
    { label: 'Week 3', value: 48 },
    { label: 'Week 4', value: 61 },
    { label: 'Week 5', value: 55 },
    { label: 'Week 6', value: 67 },
    { label: 'Week 7', value: 62 },
  ]

  const tableData = [
    { metric: 'Appointments', current: 58, previous: 48, change: '+21%', trend: 'up' },
    { metric: 'Customers', current: 342, previous: 315, change: '+8.6%', trend: 'up' },
    { metric: 'SMS Delivered', current: 1245, previous: 1260, change: '-1.2%', trend: 'down' },
    { metric: 'Confirmation Rate', current: 78, previous: 73, change: '+5%', trend: 'up' },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((metric, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500">{metric.label}</p>
            <div className="flex items-baseline mt-1">
              <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
              <span className={`ml-2 text-sm ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {metric.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Appointments Over Time</h3>
        <div className="h-64 flex items-end justify-between space-x-2">
          {analyticsData.map((data, i) => (
            <div key={i} className="flex flex-col items-center w-full">
              <div
                className="w-full bg-indigo-500 rounded-t-md hover:bg-indigo-600 transition-colors"
                style={{ height: `${(data.value / 100) * 100}%` }}
              />
              <span className="text-xs text-gray-500 mt-2">{data.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Analytics Table */}
      <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Metric</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Previous</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Change</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tableData.map((row, i) => (
            <tr key={i}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.metric}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.current}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.previous}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm ${row.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {row.change}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
