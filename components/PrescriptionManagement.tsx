'use client'

import { useState } from 'react'
import { 
  DocumentTextIcon, 
  PlusIcon,
  CalendarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  PencilIcon,
  TrashIcon,
  BellIcon,
  UserIcon,
  BeakerIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Prescription {
  id: string
  medicationName: string
  dosage: string
  frequency: string
  duration: string
  instructions: string
  prescribedBy: string
  prescribedDate: Date
  startDate: Date
  endDate: Date
  status: 'active' | 'completed' | 'paused' | 'expired'
  reminders: Reminder[]
}

interface Reminder {
  id: string
  time: string
  days: string[]
  isActive: boolean
}

interface MedicationHistory {
  id: string
  medicationName: string
  takenAt: Date
  status: 'taken' | 'missed' | 'skipped'
}

export default function PrescriptionManagement() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([
    {
      id: '1',
      medicationName: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      duration: '30 days',
      instructions: 'Take with food to reduce stomach upset',
      prescribedBy: 'Dr. Sarah Johnson',
      prescribedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000),
      status: 'active',
      reminders: [
        { id: '1', time: '08:00', days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'], isActive: true },
        { id: '2', time: '20:00', days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'], isActive: true }
      ]
    },
    {
      id: '2',
      medicationName: 'Vitamin D3',
      dosage: '1000 IU',
      frequency: 'Once daily',
      duration: '90 days',
      instructions: 'Take with breakfast',
      prescribedBy: 'Dr. Sarah Johnson',
      prescribedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 76 * 24 * 60 * 60 * 1000),
      status: 'active',
      reminders: [
        { id: '3', time: '09:00', days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'], isActive: true }
      ]
    }
  ])

  const [medicationHistory, setMedicationHistory] = useState<MedicationHistory[]>([
    {
      id: '1',
      medicationName: 'Metformin',
      takenAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      status: 'taken'
    },
    {
      id: '2',
      medicationName: 'Vitamin D3',
      takenAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      status: 'taken'
    }
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [newPrescription, setNewPrescription] = useState({
    medicationName: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: '',
    prescribedBy: '',
    startDate: '',
    endDate: ''
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800'
      case 'expired':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return CheckCircleIcon
      case 'completed':
        return CheckCircleIcon
      case 'paused':
        return ClockIcon
      case 'expired':
        return ExclamationTriangleIcon
      default:
        return ClockIcon
    }
  }

  const addPrescription = () => {
    if (!newPrescription.medicationName || !newPrescription.dosage) {
      toast.error('Please fill in required fields')
      return
    }

    const prescription: Prescription = {
      id: Date.now().toString(),
      medicationName: newPrescription.medicationName,
      dosage: newPrescription.dosage,
      frequency: newPrescription.frequency,
      duration: newPrescription.duration,
      instructions: newPrescription.instructions,
      prescribedBy: newPrescription.prescribedBy,
      prescribedDate: new Date(),
      startDate: new Date(newPrescription.startDate),
      endDate: new Date(newPrescription.endDate),
      status: 'active',
      reminders: []
    }

    setPrescriptions(prev => [prescription, ...prev])
    setNewPrescription({
      medicationName: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: '',
      prescribedBy: '',
      startDate: '',
      endDate: ''
    })
    setShowAddForm(false)
    toast.success('Prescription added successfully')
  }

  const markMedicationTaken = (medicationName: string) => {
    const historyEntry: MedicationHistory = {
      id: Date.now().toString(),
      medicationName,
      takenAt: new Date(),
      status: 'taken'
    }
    
    setMedicationHistory(prev => [historyEntry, ...prev])
    toast.success(`${medicationName} marked as taken`)
  }

  const deletePrescription = (id: string) => {
    setPrescriptions(prev => prev.filter(p => p.id !== id))
    toast.success('Prescription deleted')
  }

  const upcomingMedications = prescriptions
    .filter(p => p.status === 'active')
    .map(p => ({
      ...p,
      nextReminder: p.reminders.find(r => r.isActive)?.time || 'No reminder set'
    }))

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <DocumentTextIcon className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Prescription Management</h1>
              <p className="text-blue-100">Track and manage your medications</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-secondary bg-white text-blue-600 hover:bg-blue-50"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Prescription
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <BeakerIcon className="w-6 h-6 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">
              {prescriptions.filter(p => p.status === 'active').length}
            </span>
          </div>
          <p className="text-sm text-gray-600">Active Medications</p>
        </div>
        
        <div className="card text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <CheckCircleIcon className="w-6 h-6 text-green-600" />
            <span className="text-2xl font-bold text-gray-900">
              {medicationHistory.filter(h => h.status === 'taken').length}
            </span>
          </div>
          <p className="text-sm text-gray-600">Taken Today</p>
        </div>
        
        <div className="card text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <BellIcon className="w-6 h-6 text-yellow-600" />
            <span className="text-2xl font-bold text-gray-900">
              {prescriptions.reduce((acc, p) => acc + p.reminders.filter(r => r.isActive).length, 0)}
            </span>
          </div>
          <p className="text-sm text-gray-600">Active Reminders</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prescriptions List */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Your Prescriptions</h2>
          
          {prescriptions.map((prescription) => {
            const StatusIcon = getStatusIcon(prescription.status)
            return (
              <div key={prescription.id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <BeakerIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{prescription.medicationName}</h3>
                      <p className="text-sm text-gray-600">{prescription.dosage} • {prescription.frequency}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(prescription.status)}`}>
                      {prescription.status}
                    </span>
                    <button
                      onClick={() => deletePrescription(prescription.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <UserIcon className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Prescribed by: {prescription.prescribedBy}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      Duration: {prescription.duration} • Ends: {prescription.endDate.toLocaleDateString()}
                    </span>
                  </div>
                  
                  {prescription.instructions && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-700">
                        <strong>Instructions:</strong> {prescription.instructions}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <StatusIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {prescription.reminders.filter(r => r.isActive).length} active reminders
                      </span>
                    </div>
                    
                    <button
                      onClick={() => markMedicationTaken(prescription.medicationName)}
                      className="btn-primary text-sm"
                    >
                      Mark as Taken
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Medication History & Upcoming */}
        <div className="space-y-6">
          {/* Upcoming Medications */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Medications</h2>
            
            <div className="space-y-3">
              {upcomingMedications.map((medication) => (
                <div key={medication.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <ClockIcon className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">{medication.medicationName}</p>
                      <p className="text-sm text-gray-600">{medication.dosage} • Next: {medication.nextReminder}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => markMedicationTaken(medication.medicationName)}
                    className="btn-primary text-sm"
                  >
                    Take Now
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent History */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent History</h2>
            
            <div className="space-y-3">
              {medicationHistory.slice(0, 5).map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      entry.status === 'taken' ? 'bg-green-100' : 
                      entry.status === 'missed' ? 'bg-red-100' : 'bg-yellow-100'
                    }`}>
                      <BeakerIcon className={`w-4 h-4 ${
                        entry.status === 'taken' ? 'text-green-600' : 
                        entry.status === 'missed' ? 'text-red-600' : 'text-yellow-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{entry.medicationName}</p>
                      <p className="text-sm text-gray-600">
                        {entry.takenAt.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    entry.status === 'taken' ? 'bg-green-100 text-green-800' : 
                    entry.status === 'missed' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {entry.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Prescription Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Prescription</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medication Name *
                </label>
                <input
                  type="text"
                  value={newPrescription.medicationName}
                  onChange={(e) => setNewPrescription({...newPrescription, medicationName: e.target.value})}
                  className="input-field"
                  placeholder="e.g., Metformin"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dosage *
                </label>
                <input
                  type="text"
                  value={newPrescription.dosage}
                  onChange={(e) => setNewPrescription({...newPrescription, dosage: e.target.value})}
                  className="input-field"
                  placeholder="e.g., 500mg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frequency
                </label>
                <select
                  value={newPrescription.frequency}
                  onChange={(e) => setNewPrescription({...newPrescription, frequency: e.target.value})}
                  className="input-field"
                >
                  <option value="">Select frequency</option>
                  <option value="Once daily">Once daily</option>
                  <option value="Twice daily">Twice daily</option>
                  <option value="Three times daily">Three times daily</option>
                  <option value="As needed">As needed</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration
                </label>
                <input
                  type="text"
                  value={newPrescription.duration}
                  onChange={(e) => setNewPrescription({...newPrescription, duration: e.target.value})}
                  className="input-field"
                  placeholder="e.g., 30 days"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instructions
                </label>
                <textarea
                  value={newPrescription.instructions}
                  onChange={(e) => setNewPrescription({...newPrescription, instructions: e.target.value})}
                  className="input-field"
                  rows={3}
                  placeholder="Special instructions..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prescribed By
                </label>
                <input
                  type="text"
                  value={newPrescription.prescribedBy}
                  onChange={(e) => setNewPrescription({...newPrescription, prescribedBy: e.target.value})}
                  className="input-field"
                  placeholder="e.g., Dr. Sarah Johnson"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={addPrescription}
                className="flex-1 btn-primary"
              >
                Add Prescription
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

