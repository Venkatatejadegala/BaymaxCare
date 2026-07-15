'use client'

import { useState, useEffect } from 'react'
import { 
  HeartIcon,
  CalendarIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon as TrendingUpIcon,
  ArrowTrendingDownIcon as TrendingDownIcon,
  ScaleIcon,
  BeakerIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface HealthMetric {
  id: string
  type: 'weight' | 'blood_pressure' | 'heart_rate' | 'temperature' | 'blood_sugar' | 'cholesterol'
  value: number
  unit: string
  date: Date
  notes?: string
  trend?: 'up' | 'down' | 'stable'
}

interface HealthGoal {
  id: string
  title: string
  targetValue: number
  currentValue: number
  unit: string
  targetDate: Date
  progress: number
  category: string
}

export default function HealthAnalytics() {
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([
    {
      id: '1',
      type: 'weight',
      value: 70,
      unit: 'kg',
      date: new Date(),
      trend: 'down'
    },
    {
      id: '2',
      type: 'blood_pressure',
      value: 120,
      unit: 'mmHg',
      date: new Date(),
      trend: 'stable'
    },
    {
      id: '3',
      type: 'heart_rate',
      value: 72,
      unit: 'bpm',
      date: new Date(),
      trend: 'stable'
    }
  ])

  const [healthGoals, setHealthGoals] = useState<HealthGoal[]>([
    {
      id: '1',
      title: 'Weight Loss',
      targetValue: 65,
      currentValue: 70,
      unit: 'kg',
      targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      progress: 71,
      category: 'fitness'
    },
    {
      id: '2',
      title: 'Daily Steps',
      targetValue: 10000,
      currentValue: 7500,
      unit: 'steps',
      targetDate: new Date(),
      progress: 75,
      category: 'activity'
    }
  ])

  const [showAddMetric, setShowAddMetric] = useState(false)
  const [newMetric, setNewMetric] = useState({
    type: 'weight' as HealthMetric['type'],
    value: '',
    unit: '',
    notes: ''
  })

  const getMetricIcon = (type: string) => {
    switch (type) {
      case 'weight': return ScaleIcon
      case 'blood_pressure': return HeartIcon
      case 'heart_rate': return HeartIcon
      case 'temperature': return HeartIcon // Fallback to HeartIcon (ThermometerIcon is not available in Heroicons v2)
      case 'blood_sugar': return BeakerIcon
      case 'cholesterol': return BeakerIcon
      default: return ChartBarIcon
    }
  }

  const getMetricColor = (type: string) => {
    switch (type) {
      case 'weight': return 'text-blue-600'
      case 'blood_pressure': return 'text-red-600'
      case 'heart_rate': return 'text-pink-600'
      case 'temperature': return 'text-orange-600'
      case 'blood_sugar': return 'text-green-600'
      case 'cholesterol': return 'text-purple-600'
      default: return 'text-gray-600'
    }
  }

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up': return TrendingUpIcon
      case 'down': return TrendingDownIcon
      default: return ChartBarIcon
    }
  }

  const getTrendColor = (trend?: string) => {
    switch (trend) {
      case 'up': return 'text-green-600'
      case 'down': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const addHealthMetric = () => {
    if (!newMetric.value || !newMetric.unit) {
      toast.error('Please fill in all required fields')
      return
    }

    const metric: HealthMetric = {
      id: Date.now().toString(),
      type: newMetric.type,
      value: parseFloat(newMetric.value),
      unit: newMetric.unit,
      date: new Date(),
      notes: newMetric.notes,
      trend: 'stable'
    }

    setHealthMetrics(prev => [metric, ...prev])
    setNewMetric({ type: 'weight', value: '', unit: '', notes: '' })
    setShowAddMetric(false)
    toast.success('Health metric added successfully')
  }

  const deleteHealthMetric = (id: string) => {
    setHealthMetrics(prev => prev.filter(metric => metric.id !== id))
    toast.success('Health metric deleted')
  }

  const getGoalProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 60) return 'bg-yellow-500'
    if (progress >= 40) return 'bg-orange-500'
    return 'bg-red-500'
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ChartBarIcon className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Health Analytics</h1>
              <p className="text-indigo-100">Track your health metrics and progress</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddMetric(true)}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Add Metric</span>
          </button>
        </div>
      </div>

      {/* Add Metric Modal */}
      {showAddMetric && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Health Metric</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Metric Type
                </label>
                <select
                  value={newMetric.type}
                  onChange={(e) => setNewMetric({...newMetric, type: e.target.value as HealthMetric['type']})}
                  className="w-full input-field"
                >
                  <option value="weight">Weight</option>
                  <option value="blood_pressure">Blood Pressure</option>
                  <option value="heart_rate">Heart Rate</option>
                  <option value="temperature">Temperature</option>
                  <option value="blood_sugar">Blood Sugar</option>
                  <option value="cholesterol">Cholesterol</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Value
                </label>
                <input
                  type="number"
                  value={newMetric.value}
                  onChange={(e) => setNewMetric({...newMetric, value: e.target.value})}
                  className="w-full input-field"
                  placeholder="Enter value"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit
                </label>
                <input
                  type="text"
                  value={newMetric.unit}
                  onChange={(e) => setNewMetric({...newMetric, unit: e.target.value})}
                  className="w-full input-field"
                  placeholder="e.g., kg, mmHg, bpm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={newMetric.notes}
                  onChange={(e) => setNewMetric({...newMetric, notes: e.target.value})}
                  className="w-full input-field"
                  rows={3}
                  placeholder="Additional notes..."
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={addHealthMetric}
                className="flex-1 btn-primary"
              >
                Add Metric
              </button>
              <button
                onClick={() => setShowAddMetric(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Health Metrics */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Health Metrics</h2>
            
            <div className="space-y-4">
              {healthMetrics.map((metric) => {
                const IconComponent = getMetricIcon(metric.type)
                const TrendIcon = getTrendIcon(metric.trend)
                
                return (
                  <div key={metric.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg bg-gray-100`}>
                          <IconComponent className={`w-6 h-6 ${getMetricColor(metric.type)}`} />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 capitalize">
                            {metric.type.replace('_', ' ')}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {metric.date.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-xl font-bold text-gray-900">
                            {metric.value} {metric.unit}
                          </p>
                          {metric.trend && (
                            <div className="flex items-center space-x-1">
                              <TrendIcon className={`w-4 h-4 ${getTrendColor(metric.trend)}`} />
                              <span className={`text-sm ${getTrendColor(metric.trend)}`}>
                                {metric.trend}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => deleteHealthMetric(metric.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {metric.notes && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">{metric.notes}</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Health Goals */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Health Goals</h2>
            
            <div className="space-y-4">
              {healthGoals.map((goal) => (
                <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900">{goal.title}</h3>
                    <span className="text-sm text-gray-500">
                      {goal.currentValue} / {goal.targetValue} {goal.unit}
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{goal.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getGoalProgressColor(goal.progress)}`}
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <CalendarIcon className="w-4 h-4" />
                      <span>Target: {goal.targetDate.toLocaleDateString()}</span>
                    </div>
                    <span className="capitalize">{goal.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <HeartIcon className="w-6 h-6 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Avg Heart Rate</span>
                </div>
                <span className="text-lg font-bold text-blue-900">72 bpm</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <ScaleIcon className="w-6 h-6 text-green-600" />
                  <span className="text-sm font-medium text-green-900">Weight Trend</span>
                </div>
                <span className="text-lg font-bold text-green-900">-2.5 kg</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <ChartBarIcon className="w-6 h-6 text-purple-600" />
                  <span className="text-sm font-medium text-purple-900">Records This Month</span>
                </div>
                <span className="text-lg font-bold text-purple-900">24</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
