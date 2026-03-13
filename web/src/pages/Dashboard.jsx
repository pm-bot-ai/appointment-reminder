export default function Dashboard() {
  const stats = [
    { label: 'Total Businesses', value: '12', icon: '🏢' },
    { label: 'Total Customers', value: '342', icon: '👥' },
    { label: 'Appointments', value: '58', icon: '📅' },
    { label: 'SMS Sent', value: '156', icon: '📱' },
  ]

  const recentAppointments = [
    { customer: 'John Smith', service: 'Haircut', date: 'Mar 15, 2026', status: 'Confirmed' },
    { customer: 'Jane Doe', service: 'Massage', date: 'Mar 14, 2026', status: 'Scheduled' },
    { customer: 'Bob Johnson', service: 'Consultation', date: 'Mar 13, 2026', status: 'Cancelled' },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <div className="flex items-center mt-1">
              <span className="text-3xl font-bold text-gray-900 mr-2">{stat.value}</span>
              <span className="text-lg">{stat.icon}</span>
            </div>
            <p className="mt-2 text-sm text-green-600">↑ 5% from last week</p>
          </div>
        ))}
      </div>

      {/* Recent Appointments */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Appointments</h3>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {recentAppointments.map((appt, i) => (
              <tr key={i}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{appt.customer}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appt.service}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appt.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    appt.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                    appt.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {appt.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
