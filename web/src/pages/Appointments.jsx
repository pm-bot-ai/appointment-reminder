import { useState } from 'react'

export default function Appointments() {
  const [appointments, setAppointments] = useState([
    { id: 1, customer: 'John Smith', service: 'Haircut', date: 'Mar 15, 2026', time: '10:00 AM', status: 'Scheduled' },
    { id: 2, customer: 'Jane Doe', service: 'Massage', date: 'Mar 14, 2026', time: '2:00 PM', status: 'Scheduled' },
    { id: 3, customer: 'Bob Johnson', service: 'Consultation', date: 'Mar 13, 2026', time: '11:00 AM', status: 'Confirmed' },
  ])
  const [showAddModal, setShowAddModal] = useState(false)
  const [newAppointment, setNewAppointment] = useState({ customer: '', service: '', date: '', time: '' })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Appointments</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Schedule Appointment
        </button>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Calendar</h3>
        <div className="grid grid-cols-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
            <div key={i} className="text-center font-medium text-gray-500">{day}</div>
          ))}
          {Array.from({ length: 35 }, (_, i) => {
            const dayNum = i - 4
            return (
              <div key={i} className={`h-20 border rounded-md p-1 ${dayNum > 0 && dayNum <= 31 ? 'hover:bg-gray-50' : 'opacity-20'}`}>
                {dayNum > 0 && dayNum <= 31 ? (
                  <div className="text-sm font-medium">{dayNum}</div>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>

      {/* Appointments List */}
      <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {appointments.map((appt) => (
            <tr key={appt.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{appt.customer}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appt.service}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {appt.date} at {appt.time}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  appt.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                  appt.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {appt.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button className="text-indigo-600 hover:text-indigo-900 mr-2">Edit</button>
                <button className="text-red-600 hover:text-red-900">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Appointment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Schedule Appointment</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Customer Name"
                value={newAppointment.customer}
                onChange={(e) => setNewAppointment({...newAppointment, customer: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
              />
              <input
                type="text"
                placeholder="Service"
                value={newAppointment.service}
                onChange={(e) => setNewAppointment({...newAppointment, service: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
              />
              <input
                type="date"
                value={newAppointment.date}
                onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
              />
              <input
                type="time"
                value={newAppointment.time}
                onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => { setShowAddModal(false); setNewAppointment({ customer: '', service: '', date: '', time: '' }) }}
                className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
