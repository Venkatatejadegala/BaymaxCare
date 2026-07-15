'use client'

import { useState, useEffect } from 'react'
import { 
  ExclamationTriangleIcon, 
  PhoneIcon, 
  MapPinIcon,
  ClockIcon,
  UserGroupIcon,
  HeartIcon,
  ShieldCheckIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface EmergencyContact {
  id: string
  name: string
  phone: string
  relationship: string
  isPrimary: boolean
}

interface EmergencyInfo {
  location: string
  medicalConditions: string[]
  allergies: string[]
  medications: string[]
  bloodType: string
}

export default function EmergencyResponse() {
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      phone: '+1-555-0123',
      relationship: 'Primary Care Doctor',
      isPrimary: true
    },
    {
      id: '2',
      name: 'John Smith',
      phone: '+1-555-0456',
      relationship: 'Emergency Contact',
      isPrimary: false
    }
  ])

  const [emergencyInfo, setEmergencyInfo] = useState<EmergencyInfo>({
    location: 'Current location detected',
    medicalConditions: ['Hypertension', 'Diabetes Type 2'],
    allergies: ['Penicillin', 'Shellfish'],
    medications: ['Metformin 500mg', 'Lisinopril 10mg'],
    bloodType: 'O+'
  })

  const [isEmergencyMode, setIsEmergencyMode] = useState(false)
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isEmergencyMode && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(countdown - 1)
      }, 1000)
    } else if (isEmergencyMode && countdown === 0) {
      handleEmergencyCall()
    }
    return () => clearInterval(interval)
  }, [isEmergencyMode, countdown])

  const handleEmergencyCall = () => {
    toast.success('Emergency services contacted!')
    setIsEmergencyMode(false)
    setCountdown(0)
  }

  const startEmergencySequence = () => {
    setIsEmergencyMode(true)
    setCountdown(10)
    toast.success('Emergency sequence initiated! Calling emergency services in 10 seconds...')
  }

  const cancelEmergency = () => {
    setIsEmergencyMode(false)
    setCountdown(0)
    toast.success('Emergency sequence cancelled')
  }

  const addEmergencyContact = () => {
    const newContact: EmergencyContact = {
      id: Date.now().toString(),
      name: '',
      phone: '',
      relationship: '',
      isPrimary: false
    }
    setEmergencyContacts([...emergencyContacts, newContact])
  }

  const updateEmergencyContact = (id: string, field: keyof EmergencyContact, value: string | boolean) => {
    setEmergencyContacts(contacts =>
      contacts.map(contact =>
        contact.id === id ? { ...contact, [field]: value } : contact
      )
    )
  }

  const deleteEmergencyContact = (id: string) => {
    setEmergencyContacts(contacts => contacts.filter(contact => contact.id !== id))
    toast.success('Emergency contact deleted')
  }

  const quickActions = [
    {
      title: 'Call 112',
      description: 'Emergency services',
      action: () => {
        toast.success('Calling 112...')
        // In a real app, this would trigger a phone call
      },
      color: 'bg-red-500 hover:bg-red-600',
      icon: PhoneIcon
    },
    {
      title: 'Share Location',
      description: 'Send location to contacts',
      action: () => {
        toast.success('Location shared with emergency contacts')
      },
      color: 'bg-blue-500 hover:bg-blue-600',
      icon: MapPinIcon
    },
    {
      title: 'Medical Info',
      description: 'Share medical information',
      action: () => {
        toast.success('Medical information shared')
      },
      color: 'bg-green-500 hover:bg-green-600',
      icon: HeartIcon
    },
    {
      title: 'Panic Button',
      description: 'Immediate emergency alert',
      action: startEmergencySequence,
      color: 'bg-red-600 hover:bg-red-700',
      icon: ExclamationTriangleIcon
    }
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Emergency Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3">
          <ExclamationTriangleIcon className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold">Emergency Response</h1>
            <p className="text-red-100">Quick access to emergency services and contacts</p>
          </div>
        </div>
      </div>

      {/* Emergency Mode */}
      {isEmergencyMode && (
        <div className="card bg-red-50 border-red-200">
          <div className="text-center">
            <ExclamationTriangleIcon className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-800 mb-2">EMERGENCY MODE ACTIVE</h2>
            <p className="text-red-700 mb-4">
              Calling emergency services in {countdown} seconds...
            </p>
            <button
              onClick={cancelEmergency}
              className="btn-primary bg-green-600 hover:bg-green-700"
            >
              Cancel Emergency
            </button>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className={`${action.color} text-white p-6 rounded-xl transition-colors duration-200 group`}
          >
            <div className="flex flex-col items-center space-y-2">
              <action.icon className="w-8 h-8" />
              <h3 className="font-semibold">{action.title}</h3>
              <p className="text-sm opacity-90">{action.description}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emergency Contacts */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Emergency Contacts</h2>
            <button
              onClick={addEmergencyContact}
              className="btn-secondary flex items-center space-x-1"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Add Contact</span>
            </button>
          </div>

          <div className="space-y-4">
            {emergencyContacts.map((contact) => (
              <div key={contact.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <UserGroupIcon className="w-5 h-5 text-gray-500" />
                    <span className="font-medium text-gray-900">{contact.name}</span>
                    {contact.isPrimary && (
                      <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                        Primary
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => deleteEmergencyContact(contact.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <PhoneIcon className="w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      value={contact.phone}
                      onChange={(e) => updateEmergencyContact(contact.id, 'phone', e.target.value)}
                      className="flex-1 input-field text-sm"
                      placeholder="Phone number"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={contact.name}
                      onChange={(e) => updateEmergencyContact(contact.id, 'name', e.target.value)}
                      className="flex-1 input-field text-sm"
                      placeholder="Contact name"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={contact.relationship}
                      onChange={(e) => updateEmergencyContact(contact.id, 'relationship', e.target.value)}
                      className="flex-1 input-field text-sm"
                      placeholder="Relationship"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        toast.success(`Calling ${contact.name}...`)
                      }}
                      className="btn-primary text-sm"
                    >
                      Call Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Medical Information */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Medical Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Location
              </label>
              <div className="flex items-center space-x-2">
                <MapPinIcon className="w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={emergencyInfo.location}
                  onChange={(e) => setEmergencyInfo({...emergencyInfo, location: e.target.value})}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blood Type
              </label>
              <div className="flex items-center space-x-2">
                <HeartIcon className="w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={emergencyInfo.bloodType}
                  onChange={(e) => setEmergencyInfo({...emergencyInfo, bloodType: e.target.value})}
                  className="input-field"
                  placeholder="e.g., O+, A-, B+, AB-"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medical Conditions
              </label>
              <textarea
                value={emergencyInfo.medicalConditions.join(', ')}
                onChange={(e) => setEmergencyInfo({
                  ...emergencyInfo, 
                  medicalConditions: e.target.value.split(', ').filter(item => item.trim())
                })}
                className="input-field"
                rows={2}
                placeholder="List your medical conditions"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Allergies
              </label>
              <textarea
                value={emergencyInfo.allergies.join(', ')}
                onChange={(e) => setEmergencyInfo({
                  ...emergencyInfo, 
                  allergies: e.target.value.split(', ').filter(item => item.trim())
                })}
                className="input-field"
                rows={2}
                placeholder="List your allergies"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Medications
              </label>
              <textarea
                value={emergencyInfo.medications.join(', ')}
                onChange={(e) => setEmergencyInfo({
                  ...emergencyInfo, 
                  medications: e.target.value.split(', ').filter(item => item.trim())
                })}
                className="input-field"
                rows={2}
                placeholder="List your current medications"
              />
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <ShieldCheckIcon className="w-6 h-6 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900">Privacy & Security</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Your medical information is encrypted and only shared with emergency services when needed. 
                  You can update this information anytime.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Instructions */}
      <div className="card bg-yellow-50 border-yellow-200">
        <h2 className="text-lg font-semibold text-yellow-800 mb-4">Emergency Instructions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-yellow-800 mb-2">In Case of Emergency:</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Stay calm and assess the situation</li>
              <li>• Call 112 immediately for life-threatening emergencies</li>
              <li>• Use the panic button for immediate assistance</li>
              <li>• Share your location with emergency contacts</li>
              <li>• Provide medical information to responders</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-yellow-800 mb-2">First Aid Tips:</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Check for breathing and pulse</li>
              <li>• Apply pressure to stop bleeding</li>
              <li>• Keep the person warm and comfortable</li>
              <li>• Do not move someone with potential spinal injury</li>
              <li>• Stay with the person until help arrives</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

