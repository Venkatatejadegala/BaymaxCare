'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  HeartIcon, 
  ExclamationTriangleIcon, 
  ChatBubbleLeftRightIcon,
  CameraIcon,
  DocumentTextIcon,
  NewspaperIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  CalendarIcon,
  UserIcon,
  PlusIcon,
  ChartBarIcon,
  VideoCameraIcon,
  TrophyIcon as TargetIcon,
  BellIcon,
  ArrowTrendingUpIcon as TrendingUpIcon,
  ArrowTrendingDownIcon as TrendingDownIcon
} from '@heroicons/react/24/outline'

interface HealthMetric {
  id: string
  title: string
  value: string
  change: string
  trend: 'up' | 'down' | 'stable'
  icon: React.ComponentType<any>
  color: string
}

interface QuickAction {
  id: string
  title: string
  description: string
  href: string
  icon: React.ComponentType<any>
  color: string
  badge?: string
}

interface RecentActivity {
  id: string
  title: string
  time: string
  type: 'consultation' | 'prescription' | 'emergency' | 'chat' | 'goal' | 'appointment'
  status?: 'completed' | 'pending' | 'in_progress'
}

interface UpcomingEvent {
  id: string
  title: string
  time: string
  type: 'appointment' | 'medication' | 'goal' | 'checkup'
  priority: 'high' | 'medium' | 'low'
}

export default function EnhancedDashboard() {
  const [aiInsights, setAiInsights] = useState<string>('')
  const [isLoadingInsights, setIsLoadingInsights] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  
  const [healthMetrics] = useState<HealthMetric[]>([
    {
      id: '1',
      title: 'Health Score',
      value: '85%',
      change: '+5%',
      trend: 'up',
      icon: HeartIcon,
      color: 'text-green-600'
    },
    {
      id: '2',
      title: 'Active Prescriptions',
      value: '0',
      change: '0',
      trend: 'stable',
      icon: DocumentTextIcon,
      color: 'text-blue-600'
    },
    {
      id: '3',
      title: 'Consultations',
      value: '12',
      change: '+2',
      trend: 'up',
      icon: ChatBubbleLeftRightIcon,
      color: 'text-purple-600'
    },
    {
      id: '4',
      title: 'Goals Progress',
      value: '78%',
      change: '+12%',
      trend: 'up',
      icon: TargetIcon,
      color: 'text-orange-600'
    }
  ])

  const [quickActions] = useState<QuickAction[]>([
    {
      id: '1',
      title: 'AI Health Chat',
      description: 'Get instant health advice',
      href: '/chat',
      icon: ChatBubbleLeftRightIcon,
      color: 'bg-blue-500',
      badge: 'Popular'
    },
    {
      id: '2',
      title: 'Emergency Response',
      description: 'Quick emergency assistance',
      href: '/emergency',
      icon: ExclamationTriangleIcon,
      color: 'bg-red-500'
    },
    {
      id: '3',
      title: 'Upload Symptoms',
      description: 'Share photos for diagnosis',
      href: '/diagnosis',
      icon: CameraIcon,
      color: 'bg-green-500'
    },
    {
      id: '4',
      title: 'Ayurvedic Wellness',
      description: 'Traditional healing methods',
      href: '/ayurveda',
      icon: HeartIcon,
      color: 'bg-purple-500'
    },
    {
      id: '5',
      title: 'Health Analytics',
      description: 'Track your health metrics',
      href: '/analytics',
      icon: ChartBarIcon,
      color: 'bg-indigo-500'
    },
    {
      id: '6',
      title: 'Telemedicine',
      description: 'Video consultations',
      href: '/telemedicine',
      icon: VideoCameraIcon,
      color: 'bg-teal-500'
    },
    {
      id: '7',
      title: 'Health Goals',
      description: 'Track your progress',
      href: '/goals',
      icon: TargetIcon,
      color: 'bg-orange-500'
    },
    {
      id: '8',
      title: 'Prescriptions',
      description: 'Manage medications',
      href: '/prescriptions',
      icon: DocumentTextIcon,
      color: 'bg-pink-500'
    }
  ])

  const [recentActivities] = useState<RecentActivity[]>([
    {
      id: '1',
      title: 'AI consultation about headache',
      time: '2 hours ago',
      type: 'chat',
      status: 'completed'
    },
    {
      id: '2',
      title: 'Prescription renewed: Vitamin D',
      time: '1 day ago',
      type: 'prescription',
      status: 'completed'
    },
    {
      id: '3',
      title: 'Weight loss goal: 75% complete',
      time: '2 days ago',
      type: 'goal',
      status: 'in_progress'
    },
    {
      id: '4',
      title: 'Video consultation with Dr. Smith',
      time: '3 days ago',
      type: 'appointment',
      status: 'completed'
    },
    {
      id: '5',
      title: 'Emergency contact added',
      time: '1 week ago',
      type: 'emergency',
      status: 'completed'
    }
  ])

  const [upcomingEvents] = useState<UpcomingEvent[]>([
    {
      id: '1',
      title: 'Take Metformin',
      time: 'In 30 minutes',
      type: 'medication',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Doctor Appointment',
      time: 'Tomorrow 2:00 PM',
      type: 'appointment',
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Daily Steps Goal',
      time: 'Today',
      type: 'goal',
      priority: 'medium'
    },
    {
      id: '4',
      title: 'Blood Pressure Check',
      time: 'This weekend',
      type: 'checkup',
      priority: 'low'
    }
  ])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'chat': return ChatBubbleLeftRightIcon
      case 'prescription': return DocumentTextIcon
      case 'emergency': return ExclamationTriangleIcon
      case 'consultation': return CameraIcon
      case 'goal': return TargetIcon
      case 'appointment': return CalendarIcon
      default: return ClockIcon
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'chat': return 'text-blue-500'
      case 'prescription': return 'text-green-500'
      case 'emergency': return 'text-red-500'
      case 'consultation': return 'text-purple-500'
      case 'goal': return 'text-orange-500'
      case 'appointment': return 'text-indigo-500'
      default: return 'text-gray-500'
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in_progress': return 'bg-yellow-100 text-yellow-800'
      case 'pending': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'medication': return DocumentTextIcon
      case 'appointment': return CalendarIcon
      case 'goal': return TargetIcon
      case 'checkup': return HeartIcon
      default: return ClockIcon
    }
  }

  const generateAIInsights = async (forceRefresh = false) => {
    if (!forceRefresh) {
      const cachedInsights = sessionStorage.getItem('aiHealthInsights')
      if (cachedInsights) {
        setAiInsights(cachedInsights)
        return
      }
    }

    setIsLoadingInsights(true)
    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Provide 3-5 short bullet points: top health insight, likely cause(s), and 2-3 actionable recommendations for today. Keep it crisp and clear. Expand only if I ask.',
          context: 'dashboard_insights'
        }),
      })
      
      if (response.ok) {
        const data = await response.json()
        setAiInsights(data.response)
        sessionStorage.setItem('aiHealthInsights', data.response)
      }
    } catch (error) {
      console.error('Error generating AI insights:', error)
      const fallback = '• Stay hydrated\n• Aim for 7–9 hours of sleep\n• Keep meds on schedule\n• Add a 15–20 min walk today'
      setAiInsights(fallback)
      sessionStorage.setItem('aiHealthInsights', fallback)
    }
    setIsLoadingInsights(false)
  }

  useEffect(() => {
    generateAIInsights()
  }, [])

  return (
    <div className="space-y-6">
      {/* Welcome Section with Time */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-4 sm:p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold mb-2">Welcome back!</h1>
            <p className="text-blue-100 text-sm sm:text-base">Your AI health companion is ready to assist you</p>
          </div>
          <div className="text-right">
            <div className="text-2xl sm:text-3xl font-bold">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-blue-100 text-sm">
              {currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>
      </div>

      {/* Health Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {healthMetrics.map((metric) => (
          <div key={metric.id} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                <div className="flex items-center space-x-1">
                  {metric.trend === 'up' ? (
                    <TrendingUpIcon className="w-4 h-4 text-green-600" />
                  ) : metric.trend === 'down' ? (
                    <TrendingDownIcon className="w-4 h-4 text-red-600" />
                  ) : (
                    <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                  )}
                  <p className={`text-sm ${
                    metric.trend === 'up' ? 'text-green-600' : 
                    metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {metric.change} from last week
                  </p>
                </div>
              </div>
              <div className="p-3 bg-primary-100 rounded-lg">
                <metric.icon className={`w-6 h-6 ${metric.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.id}
              href={action.href}
              className="card hover:shadow-md transition-all duration-200 group relative"
            >
              {action.badge && (
                <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                  {action.badge}
                </div>
              )}
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${action.color}`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
                <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const IconComponent = getActivityIcon(activity.type)
                return (
                  <div key={activity.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className={`p-2 rounded-lg bg-gray-100`}>
                      <IconComponent className={`w-5 h-5 ${getActivityColor(activity.type)}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                    {activity.status && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                        {activity.status.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* AI Health Insights */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">AI Health Insights</h2>
              <button
                onClick={() => generateAIInsights(true)}
                disabled={isLoadingInsights}
                className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
              >
                {isLoadingInsights ? 'Generating...' : 'Refresh'}
              </button>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">B</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-blue-900 mb-1">Personalized Health Guidance</h3>
                  <p className="text-sm text-blue-800 whitespace-pre-wrap">
                    {isLoadingInsights ? 'Generating personalized insights...' : aiInsights}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Events & Health Tips */}
        <div className="space-y-6">
          {/* Upcoming Events */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
              <BellIcon className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {upcomingEvents.map((event) => {
                const EventIcon = getEventIcon(event.type)
                return (
                  <div key={event.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-white rounded-lg">
                      <EventIcon className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{event.title}</p>
                      <p className="text-xs text-gray-500">{event.time}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(event.priority)}`}>
                      {event.priority}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Health Tips */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Today&apos;s Health Tip</h2>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <CheckCircleIcon className="w-6 h-6 text-green-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-green-900">Stay Hydrated</h3>
                  <p className="text-sm text-green-700 mt-1">
                    Drink at least 8 glasses of water today. Proper hydration helps maintain energy levels and supports overall health.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <HeartIcon className="w-6 h-6 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-900">Ayurvedic Reminder</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Consider incorporating turmeric in your evening routine for its anti-inflammatory properties.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">This Week&apos;s Consultations</span>
                <span className="font-semibold text-gray-900">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Goals Completed</span>
                <span className="font-semibold text-gray-900">2/5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Medications Taken</span>
                <span className="font-semibold text-gray-900">12/15</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Health Score Trend</span>
                <div className="flex items-center space-x-1">
                  <TrendingUpIcon className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-green-600">+5%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
