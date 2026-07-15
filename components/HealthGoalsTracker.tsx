'use client'

import { useState, useEffect } from 'react'
import { 
  PlusIcon, 
  CheckCircleIcon, 
  ClockIcon,
  CalendarIcon,
  PencilIcon,
  TrashIcon,
  HeartIcon,
  DocumentTextIcon,
  TrophyIcon,
  FireIcon,
  ScaleIcon,
  ArrowTrendingUpIcon as TrendingUpIcon
} from '@heroicons/react/24/outline'
const TargetIcon = TrophyIcon
import toast from 'react-hot-toast'

interface HealthGoal {
  id: string
  title: string
  description: string
  category: 'fitness' | 'nutrition' | 'mental' | 'medical' | 'lifestyle'
  targetValue: number
  currentValue: number
  unit: string
  targetDate: Date
  startDate: Date
  isCompleted: boolean
  progress: number
  streak: number
  milestones: Milestone[]
}

interface Milestone {
  id: string
  title: string
  targetValue: number
  isCompleted: boolean
  completedDate?: Date
}

export default function HealthGoalsTracker() {
  const [goals, setGoals] = useState<HealthGoal[]>([
    {
      id: '1',
      title: 'Lose Weight',
      description: 'Achieve healthy weight through diet and exercise',
      category: 'fitness',
      targetValue: 65,
      currentValue: 70,
      unit: 'kg',
      targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      isCompleted: false,
      progress: 71,
      streak: 12,
      milestones: [
        { id: '1', title: 'First 2kg', targetValue: 68, isCompleted: true, completedDate: new Date() },
        { id: '2', title: 'Halfway point', targetValue: 67.5, isCompleted: false },
        { id: '3', title: 'Final goal', targetValue: 65, isCompleted: false }
      ]
    },
    {
      id: '2',
      title: 'Daily Steps',
      description: 'Walk 10,000 steps every day',
      category: 'fitness',
      targetValue: 10000,
      currentValue: 7500,
      unit: 'steps',
      targetDate: new Date(),
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      isCompleted: false,
      progress: 75,
      streak: 5,
      milestones: [
        { id: '1', title: '5,000 steps', targetValue: 5000, isCompleted: true, completedDate: new Date() },
        { id: '2', title: '7,500 steps', targetValue: 7500, isCompleted: true, completedDate: new Date() },
        { id: '3', title: '10,000 steps', targetValue: 10000, isCompleted: false }
      ]
    },
    {
      id: '3',
      title: 'Meditation Practice',
      description: 'Meditate for 20 minutes daily',
      category: 'mental',
      targetValue: 20,
      currentValue: 15,
      unit: 'minutes',
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      isCompleted: false,
      progress: 75,
      streak: 8,
      milestones: [
        { id: '1', title: '5 minutes', targetValue: 5, isCompleted: true, completedDate: new Date() },
        { id: '2', title: '10 minutes', targetValue: 10, isCompleted: true, completedDate: new Date() },
        { id: '3', title: '20 minutes', targetValue: 20, isCompleted: false }
      ]
    }
  ])

  const [showAddGoal, setShowAddGoal] = useState(false)
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'fitness' as HealthGoal['category'],
    targetValue: '',
    unit: '',
    targetDate: ''
  })

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fitness': return ScaleIcon
      case 'nutrition': return HeartIcon
      case 'mental': return HeartIcon
      case 'medical': return HeartIcon
      case 'lifestyle': return TargetIcon
      default: return TargetIcon
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'fitness': return 'text-blue-600'
      case 'nutrition': return 'text-green-600'
      case 'mental': return 'text-purple-600'
      case 'medical': return 'text-red-600'
      case 'lifestyle': return 'text-orange-600'
      default: return 'text-gray-600'
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 60) return 'bg-yellow-500'
    if (progress >= 40) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const addGoal = () => {
    if (!newGoal.title || !newGoal.targetValue || !newGoal.unit || !newGoal.targetDate) {
      toast.error('Please fill in all required fields')
      return
    }

    const goal: HealthGoal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description,
      category: newGoal.category,
      targetValue: parseFloat(newGoal.targetValue),
      currentValue: 0,
      unit: newGoal.unit,
      targetDate: new Date(newGoal.targetDate),
      startDate: new Date(),
      isCompleted: false,
      progress: 0,
      streak: 0,
      milestones: []
    }

    setGoals(prev => [goal, ...prev])
    setNewGoal({ title: '', description: '', category: 'fitness', targetValue: '', unit: '', targetDate: '' })
    setShowAddGoal(false)
    toast.success('Health goal added successfully')
  }

  const updateGoalProgress = (goalId: string, newValue: number) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        const progress = Math.min((newValue / goal.targetValue) * 100, 100)
        const isCompleted = progress >= 100
        
        return {
          ...goal,
          currentValue: newValue,
          progress,
          isCompleted,
          streak: isCompleted ? goal.streak + 1 : goal.streak
        }
      }
      return goal
    }))
    toast.success('Progress updated')
  }

  const deleteGoal = (goalId: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId))
    toast.success('Goal deleted')
  }

  const getDaysRemaining = (targetDate: Date) => {
    const now = new Date()
    const diffTime = targetDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return '🔥'
    if (streak >= 14) return '⭐'
    if (streak >= 7) return '💪'
    if (streak >= 3) return '👍'
    return '🌱'
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <TargetIcon className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Health Goals Tracker</h1>
              <p className="text-green-100">Track your progress and achieve your health goals</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddGoal(true)}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Add Goal</span>
          </button>
        </div>
      </div>

      {/* Add Goal Modal */}
      {showAddGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Health Goal</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Goal Title
                </label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                  className="w-full input-field"
                  placeholder="e.g., Lose Weight, Run 5K"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                  className="w-full input-field"
                  rows={3}
                  placeholder="Describe your goal..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({...newGoal, category: e.target.value as HealthGoal['category']})}
                  className="w-full input-field"
                >
                  <option value="fitness">Fitness</option>
                  <option value="nutrition">Nutrition</option>
                  <option value="mental">Mental Health</option>
                  <option value="medical">Medical</option>
                  <option value="lifestyle">Lifestyle</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Value
                  </label>
                  <input
                    type="number"
                    value={newGoal.targetValue}
                    onChange={(e) => setNewGoal({...newGoal, targetValue: e.target.value})}
                    className="w-full input-field"
                    placeholder="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={newGoal.unit}
                    onChange={(e) => setNewGoal({...newGoal, unit: e.target.value})}
                    className="w-full input-field"
                    placeholder="kg, steps, minutes"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Date
                </label>
                <input
                  type="date"
                  value={newGoal.targetDate}
                  onChange={(e) => setNewGoal({...newGoal, targetDate: e.target.value})}
                  className="w-full input-field"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={addGoal}
                className="flex-1 btn-primary"
              >
                Add Goal
              </button>
              <button
                onClick={() => setShowAddGoal(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Goals Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center space-x-3">
            <TrophyIcon className="w-8 h-8 text-yellow-500" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Completed Goals</h3>
              <p className="text-2xl font-bold text-yellow-600">
                {goals.filter(goal => goal.isCompleted).length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <FireIcon className="w-8 h-8 text-orange-500" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Best Streak</h3>
              <p className="text-2xl font-bold text-orange-600">
                {Math.max(...goals.map(goal => goal.streak), 0)} days
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <TrendingUpIcon className="w-8 h-8 text-green-500" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Avg Progress</h3>
              <p className="text-2xl font-bold text-green-600">
                {Math.round(goals.reduce((acc, goal) => acc + goal.progress, 0) / goals.length)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Goals List */}
      <div className="space-y-6">
        {goals.map((goal) => {
          const CategoryIcon = getCategoryIcon(goal.category)
          const daysRemaining = getDaysRemaining(goal.targetDate)
          
          return (
            <div key={goal.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg bg-gray-100`}>
                    <CategoryIcon className={`w-6 h-6 ${getCategoryColor(goal.category)}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{goal.title}</h3>
                    <p className="text-gray-600">{goal.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-1">
                        <span className="text-sm text-gray-500">Streak:</span>
                        <span className="text-sm font-medium">{getStreakEmoji(goal.streak)} {goal.streak} days</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CalendarIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          {daysRemaining > 0 ? `${daysRemaining} days left` : 'Overdue'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress: {goal.currentValue} / {goal.targetValue} {goal.unit}</span>
                  <span>{Math.round(goal.progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(goal.progress)}`}
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Milestones */}
              {goal.milestones.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Milestones</h4>
                  <div className="flex space-x-2">
                    {goal.milestones.map((milestone) => (
                      <div
                        key={milestone.id}
                        className={`px-3 py-1 rounded-full text-xs ${
                          milestone.isCompleted
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {milestone.isCompleted && <CheckCircleIcon className="w-3 h-3 inline mr-1" />}
                        {milestone.title}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Update Progress */}
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  placeholder="Update progress"
                  className="flex-1 input-field"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const value = parseFloat((e.target as HTMLInputElement).value)
                      if (!isNaN(value)) {
                        updateGoalProgress(goal.id, value)
                        ;(e.target as HTMLInputElement).value = ''
                      }
                    }
                  }}
                />
                <button
                  onClick={() => {
                    const input = document.querySelector(`input[placeholder="Update progress"]`) as HTMLInputElement
                    const value = parseFloat(input.value)
                    if (!isNaN(value)) {
                      updateGoalProgress(goal.id, value)
                      input.value = ''
                    }
                  }}
                  className="btn-primary"
                >
                  Update
                </button>
              </div>

              {/* Completion Status */}
              {goal.isCompleted && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="w-5 h-5 text-green-600" />
                    <span className="text-green-800 font-medium">Goal Completed! 🎉</span>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Motivational Quote */}
      <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Daily Motivation</h3>
          <p className="text-blue-800 italic">
            &quot;The secret of getting ahead is getting started. Your health journey begins with a single step.&quot;
          </p>
        </div>
      </div>
    </div>
  )
}
