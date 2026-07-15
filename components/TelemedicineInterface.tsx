'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  MicrophoneIcon, 
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  ClockIcon,
  CalendarIcon,
  CheckCircleIcon,
  XMarkIcon,
  CameraIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  ShareIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Doctor {
  id: string
  name: string
  specialty: string
  rating: number
  experience: string
  avatar: string
  isOnline: boolean
  nextAvailable: string
}

interface Appointment {
  id: string
  doctor: Doctor
  date: Date
  duration: number
  type: 'video' | 'audio' | 'chat'
  status: 'scheduled' | 'active' | 'completed' | 'cancelled'
  notes?: string
}

interface ChatMessage {
  id: string
  sender: 'user' | 'doctor'
  message: string
  timestamp: Date
  type: 'text' | 'image' | 'file'
}

export default function TelemedicineInterface() {
  const [doctors, setDoctors] = useState<Doctor[]>([
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      specialty: 'General Medicine',
      rating: 4.9,
      experience: '10+ years',
      avatar: 'SJ',
      isOnline: true,
      nextAvailable: 'Available now'
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      specialty: 'Cardiology',
      rating: 4.8,
      experience: '15+ years',
      avatar: 'MC',
      isOnline: false,
      nextAvailable: 'Tomorrow 9:00 AM'
    },
    {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      specialty: 'Dermatology',
      rating: 4.9,
      experience: '8+ years',
      avatar: 'ER',
      isOnline: true,
      nextAvailable: 'Available now'
    }
  ])

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      doctor: doctors[0],
      date: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      duration: 30,
      type: 'video',
      status: 'scheduled'
    }
  ])

  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [isVideoCallActive, setIsVideoCallActive] = useState(false)
  const [isAudioCallActive, setIsAudioCallActive] = useState(false)
  const [isChatActive, setIsChatActive] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'doctor',
      message: 'Hello! I\'m Dr. Johnson. How can I help you today?',
      timestamp: new Date(),
      type: 'text'
    }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [bookingDetails, setBookingDetails] = useState({
    date: '',
    time: '',
    type: 'video' as 'video' | 'audio' | 'chat',
    notes: ''
  })

  const videoRef = useRef<HTMLVideoElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const startVideoCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      
      setIsVideoCallActive(true)
      toast.success('Video call started')
    } catch (error) {
      toast.error('Failed to start video call. Please check camera permissions.')
    }
  }

  const startAudioCall = () => {
    setIsAudioCallActive(true)
    toast.success('Audio call started')
  }

  const endCall = () => {
    setIsVideoCallActive(false)
    setIsAudioCallActive(false)
    toast.success('Call ended')
  }

  const startChat = () => {
    setIsChatActive(true)
    toast.success('Chat session started')
  }

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const message: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      message: newMessage,
      timestamp: new Date(),
      type: 'text'
    }

    setChatMessages(prev => [...prev, message])
    setNewMessage('')

    // Simulate doctor response
    setTimeout(() => {
      const doctorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'doctor',
        message: 'Thank you for sharing that information. Let me provide you with some guidance...',
        timestamp: new Date(),
        type: 'text'
      }
      setChatMessages(prev => [...prev, doctorResponse])
    }, 2000)
  }

  const bookAppointment = () => {
    if (!selectedDoctor || !bookingDetails.date || !bookingDetails.time) {
      toast.error('Please fill in all required fields')
      return
    }

    const appointment: Appointment = {
      id: Date.now().toString(),
      doctor: selectedDoctor,
      date: new Date(`${bookingDetails.date}T${bookingDetails.time}`),
      duration: 30,
      type: bookingDetails.type,
      status: 'scheduled',
      notes: bookingDetails.notes
    }

    setAppointments(prev => [appointment, ...prev])
    setShowBookingModal(false)
    setBookingDetails({ date: '', time: '', type: 'video', notes: '' })
    toast.success('Appointment booked successfully')
  }

  const joinScheduledCall = (appointment: Appointment) => {
    setSelectedDoctor(appointment.doctor)
    if (appointment.type === 'video') {
      startVideoCall()
    } else if (appointment.type === 'audio') {
      startAudioCall()
    } else {
      startChat()
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3">
          <VideoCameraIcon className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold">Telemedicine</h1>
            <p className="text-blue-100">Connect with healthcare professionals remotely</p>
          </div>
        </div>
      </div>

      {/* Active Call Interface */}
      {(isVideoCallActive || isAudioCallActive || isChatActive) && selectedDoctor && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                {selectedDoctor.avatar}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedDoctor.name}</h2>
                <p className="text-gray-600">{selectedDoctor.specialty}</p>
              </div>
            </div>
            <button
              onClick={endCall}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <XMarkIcon className="w-5 h-5" />
              <span>End Call</span>
            </button>
          </div>

          {isVideoCallActive && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-gray-900 rounded-lg p-4 aspect-video">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="flex justify-center space-x-4">
                  <button className="bg-gray-500 hover:bg-gray-600 text-white p-3 rounded-full">
                    <MicrophoneIcon className="w-6 h-6" />
                  </button>
                  <button className="bg-gray-500 hover:bg-gray-600 text-white p-3 rounded-full">
                    <CameraIcon className="w-6 h-6" />
                  </button>
                  <button className="bg-gray-500 hover:bg-gray-600 text-white p-3 rounded-full">
                    <ShareIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Call Notes</h3>
                <textarea
                  className="w-full input-field"
                  rows={8}
                  placeholder="Take notes during the call..."
                />
                <div className="flex space-x-3">
                  <button className="flex-1 btn-primary">
                    Save Notes
                  </button>
                  <button className="flex-1 btn-secondary">
                    Share Screen
                  </button>
                </div>
              </div>
            </div>
          )}

          {isAudioCallActive && (
            <div className="text-center space-y-6">
              <div className="w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto">
                {selectedDoctor.avatar}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{selectedDoctor.name}</h3>
                <p className="text-gray-600">Audio Call in Progress</p>
              </div>
              <div className="flex justify-center space-x-4">
                <button className="bg-gray-500 hover:bg-gray-600 text-white p-4 rounded-full">
                  <MicrophoneIcon className="w-8 h-8" />
                </button>
                <button className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-full">
                  <PhoneIcon className="w-8 h-8" />
                </button>
              </div>
            </div>
          )}

          {isChatActive && (
            <div className="space-y-4">
              <div className="h-96 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-white text-gray-800 border border-gray-200'
                    }`}>
                      <p className="text-sm">{message.message}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 input-field"
                />
                <button
                  onClick={sendMessage}
                  className="btn-primary"
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Available Doctors */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Doctors</h2>
            
            <div className="space-y-4">
              {doctors.map((doctor) => (
                <div key={doctor.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                        {doctor.avatar}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                        <p className="text-sm text-gray-600">{doctor.specialty}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm text-yellow-600">★ {doctor.rating}</span>
                          <span className="text-sm text-gray-500">• {doctor.experience}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                        doctor.isOnline 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${
                          doctor.isOnline ? 'bg-green-500' : 'bg-gray-400'
                        }`}></div>
                        <span>{doctor.isOnline ? 'Online' : 'Offline'}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{doctor.nextAvailable}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3 mt-4">
                    <button
                      onClick={() => {
                        setSelectedDoctor(doctor)
                        startVideoCall()
                      }}
                      disabled={!doctor.isOnline}
                      className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      <VideoCameraIcon className="w-4 h-4" />
                      <span>Video Call</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedDoctor(doctor)
                        startAudioCall()
                      }}
                      disabled={!doctor.isOnline}
                      className="flex-1 btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      <PhoneIcon className="w-4 h-4" />
                      <span>Audio Call</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedDoctor(doctor)
                        setShowBookingModal(true)
                      }}
                      className="flex-1 btn-secondary flex items-center justify-center space-x-2"
                    >
                      <CalendarIcon className="w-4 h-4" />
                      <span>Book</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Appointments */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Appointments</h2>
            
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {appointment.doctor.avatar}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{appointment.doctor.name}</h3>
                      <p className="text-sm text-gray-600">{appointment.doctor.specialty}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{appointment.date.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <ClockIcon className="w-4 h-4" />
                      <span>{appointment.date.toLocaleTimeString()}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      {appointment.type === 'video' && <VideoCameraIcon className="w-4 h-4" />}
                      {appointment.type === 'audio' && <PhoneIcon className="w-4 h-4" />}
                      {appointment.type === 'chat' && <ChatBubbleLeftRightIcon className="w-4 h-4" />}
                      <span className="capitalize">{appointment.type} consultation</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => joinScheduledCall(appointment)}
                      className="flex-1 btn-primary text-sm"
                    >
                      Join Now
                    </button>
                    <button className="btn-secondary text-sm">
                      Reschedule
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            
            <div className="space-y-3">
              <button className="w-full btn-primary flex items-center justify-center space-x-2">
                <VideoCameraIcon className="w-5 h-5" />
                <span>Emergency Consultation</span>
              </button>
              <button className="w-full btn-secondary flex items-center justify-center space-x-2">
                <DocumentTextIcon className="w-5 h-5" />
                <span>Upload Medical Records</span>
              </button>
              <button className="w-full btn-secondary flex items-center justify-center space-x-2">
                <UserIcon className="w-5 h-5" />
                <span>Find Specialist</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Book Appointment</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Doctor
                </label>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {selectedDoctor.avatar}
                  </div>
                  <div>
                    <p className="font-medium">{selectedDoctor.name}</p>
                    <p className="text-sm text-gray-600">{selectedDoctor.specialty}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={bookingDetails.date}
                  onChange={(e) => setBookingDetails({...bookingDetails, date: e.target.value})}
                  className="w-full input-field"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  value={bookingDetails.time}
                  onChange={(e) => setBookingDetails({...bookingDetails, time: e.target.value})}
                  className="w-full input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Consultation Type
                </label>
                <select
                  value={bookingDetails.type}
                  onChange={(e) => setBookingDetails({...bookingDetails, type: e.target.value as 'video' | 'audio' | 'chat'})}
                  className="w-full input-field"
                >
                  <option value="video">Video Call</option>
                  <option value="audio">Audio Call</option>
                  <option value="chat">Chat</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={bookingDetails.notes}
                  onChange={(e) => setBookingDetails({...bookingDetails, notes: e.target.value})}
                  className="w-full input-field"
                  rows={3}
                  placeholder="Describe your symptoms or concerns..."
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={bookAppointment}
                className="flex-1 btn-primary"
              >
                Book Appointment
              </button>
              <button
                onClick={() => setShowBookingModal(false)}
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
