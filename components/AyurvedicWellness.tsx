'use client'

import { useState } from 'react'
import { 
  HeartIcon, 
  SunIcon, 
  MoonIcon,
  SparklesIcon,
  BookOpenIcon,
  PlayIcon,
  ClockIcon,
  StarIcon,
  ChevronRightIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface AyurvedicTip {
  id: string
  title: string
  description: string
  category: 'morning' | 'evening' | 'diet' | 'exercise' | 'meditation'
  duration?: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

interface DoshaType {
  id: string
  name: string
  description: string
  characteristics: string[]
  recommendations: string[]
  color: string
}

interface AyurvedicRecipe {
  id: string
  name: string
  description: string
  ingredients: string[]
  instructions: string[]
  benefits: string[]
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'beverage'
}

export default function AyurvedicWellness() {
  const [activeTab, setActiveTab] = useState<'tips' | 'doshas' | 'recipes' | 'consultation'>('tips')
  const [ayurvedicInsights, setAyurvedicInsights] = useState<any>(null)
  const [isLoadingInsights, setIsLoadingInsights] = useState(false)

  const doshaTypes: DoshaType[] = [
    {
      id: 'vata',
      name: 'Vata',
      description: 'Air & Space elements - Creative, energetic, quick-thinking',
      characteristics: ['Light', 'Dry', 'Cold', 'Rough', 'Subtle', 'Mobile'],
      recommendations: ['Warm, cooked foods', 'Regular routine', 'Gentle exercise', 'Oil massage'],
      color: 'bg-blue-500'
    },
    {
      id: 'pitta',
      name: 'Pitta',
      description: 'Fire & Water elements - Intelligent, focused, determined',
      characteristics: ['Hot', 'Sharp', 'Light', 'Liquid', 'Oily', 'Penetrating'],
      recommendations: ['Cooling foods', 'Avoid spicy foods', 'Swimming', 'Meditation'],
      color: 'bg-red-500'
    },
    {
      id: 'kapha',
      name: 'Kapha',
      description: 'Earth & Water elements - Calm, loving, patient',
      characteristics: ['Heavy', 'Slow', 'Cool', 'Oily', 'Smooth', 'Dense'],
      recommendations: ['Light, warm foods', 'Regular exercise', 'Dry massage', 'Stimulating activities'],
      color: 'bg-green-500'
    }
  ]

  const ayurvedicTips: AyurvedicTip[] = [
    {
      id: '1',
      title: 'Morning Oil Pulling',
      description: 'Swish coconut oil in your mouth for 10-15 minutes to improve oral health and detoxify.',
      category: 'morning',
      duration: '15 minutes',
      difficulty: 'beginner'
    },
    {
      id: '2',
      title: 'Sun Salutation',
      description: 'Perform 12 rounds of Surya Namaskar to energize your body and mind.',
      category: 'exercise',
      duration: '20 minutes',
      difficulty: 'intermediate'
    },
    {
      id: '3',
      title: 'Evening Meditation',
      description: 'Practice mindfulness meditation to calm your mind before sleep.',
      category: 'evening',
      duration: '10 minutes',
      difficulty: 'beginner'
    },
    {
      id: '4',
      title: 'Warm Water with Lemon',
      description: 'Start your day with warm water and lemon to stimulate digestion.',
      category: 'morning',
      duration: '5 minutes',
      difficulty: 'beginner'
    },
    {
      id: '5',
      title: 'Abhyanga Self-Massage',
      description: 'Massage your body with warm sesame oil before showering.',
      category: 'morning',
      duration: '15 minutes',
      difficulty: 'intermediate'
    },
    {
      id: '6',
      title: 'Pranayama Breathing',
      description: 'Practice alternate nostril breathing to balance your nervous system.',
      category: 'meditation',
      duration: '10 minutes',
      difficulty: 'intermediate'
    }
  ]

  const recipes: AyurvedicRecipe[] = [
    {
      id: '1',
      name: 'Golden Milk (Turmeric Latte)',
      description: 'A warming, anti-inflammatory beverage perfect for evening',
      ingredients: ['1 cup milk', '1 tsp turmeric powder', '1/2 tsp ginger powder', 'Pinch of black pepper', '1 tsp honey'],
      instructions: [
        'Heat milk in a saucepan',
        'Add turmeric, ginger, and black pepper',
        'Simmer for 5 minutes',
        'Strain and add honey',
        'Serve warm'
      ],
      benefits: ['Anti-inflammatory', 'Improves sleep', 'Boosts immunity', 'Supports digestion'],
      category: 'beverage'
    },
    {
      id: '2',
      name: 'Kitchari',
      description: 'A healing one-pot meal that balances all doshas',
      ingredients: ['1/2 cup basmati rice', '1/4 cup mung dal', '1 tsp ghee', '1/2 tsp cumin', '1/2 tsp turmeric', 'Salt to taste'],
      instructions: [
        'Rinse rice and dal together',
        'Heat ghee in a pot',
        'Add spices and sauté briefly',
        'Add rice and dal with water',
        'Cook until soft and creamy'
      ],
      benefits: ['Easy to digest', 'Detoxifying', 'Balances doshas', 'Nutritious'],
      category: 'lunch'
    },
    {
      id: '3',
      name: 'Ayurvedic Chai',
      description: 'A warming spice blend tea',
      ingredients: ['2 cups water', '1 cup milk', '2 tsp black tea', '1 inch ginger', '2 cardamom pods', '1 cinnamon stick'],
      instructions: [
        'Boil water with spices',
        'Add tea leaves',
        'Simmer for 3 minutes',
        'Add milk and boil',
        'Strain and serve'
      ],
      benefits: ['Digestive aid', 'Warming', 'Antioxidant', 'Energizing'],
      category: 'beverage'
    }
  ]

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'morning':
        return SunIcon
      case 'evening':
        return MoonIcon
      case 'diet':
        return HeartIcon
      case 'exercise':
        return SparklesIcon
      case 'meditation':
        return BookOpenIcon
      default:
        return HeartIcon
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const generateAyurvedicInsights = async () => {
    setIsLoadingInsights(true)
    try {
      const response = await fetch('/api/ayurvedic-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'daily_insights',
          season: 'winter', // Could be dynamic based on current season
          focus: 'immunity'
        }),
      })
      
      if (response.ok) {
        const data = await response.json()
        setAyurvedicInsights(data)
      }
    } catch (error) {
      console.log('AI insights not available, using fallback')
      // Fallback insights
      setAyurvedicInsights({
        dailyTip: "Winter is the perfect time for warming spices like ginger, cinnamon, and turmeric. These help balance Vata dosha and boost immunity.",
        herbOfTheDay: {
          name: "Ashwagandha",
          benefits: ["Stress relief", "Energy enhancement", "Immune support"],
          usage: "Take 1-2 capsules with warm milk before bed"
        },
        seasonalAdvice: "Focus on warm, cooked foods and avoid cold, raw foods during winter months.",
        doshaBalance: "Vata tends to be aggravated in winter. Focus on grounding practices and warm foods."
      })
    }
    setIsLoadingInsights(false)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <HeartIcon className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Ayurvedic Wellness</h1>
              <p className="text-purple-100">Traditional healing wisdom for modern health</p>
            </div>
          </div>
          <button
            onClick={generateAyurvedicInsights}
            disabled={isLoadingInsights}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50"
          >
            <SparklesIcon className="w-4 h-4" />
            <span>{isLoadingInsights ? 'Generating...' : 'AI Insights'}</span>
          </button>
        </div>
        
        {/* AI Insights Display */}
        {ayurvedicInsights && (
          <div className="mt-6 bg-white bg-opacity-10 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">🤖 AI-Powered Ayurvedic Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Daily Tip:</h4>
                <p className="text-sm text-purple-100">{ayurvedicInsights.dailyTip}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Herb of the Day: {ayurvedicInsights.herbOfTheDay?.name}</h4>
                <p className="text-sm text-purple-100">{ayurvedicInsights.herbOfTheDay?.usage}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'tips', label: 'Daily Tips', icon: SparklesIcon },
          { id: 'doshas', label: 'Dosha Types', icon: HeartIcon },
          { id: 'recipes', label: 'Recipes', icon: BookOpenIcon },
          { id: 'consultation', label: 'Consultation', icon: PlayIcon }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content based on active tab */}
      {activeTab === 'tips' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Daily Ayurvedic Practices</h2>
            <button className="btn-secondary flex items-center space-x-1">
              <PlusIcon className="w-4 h-4" />
              <span>Add Custom Tip</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ayurvedicTips.map((tip) => {
              const IconComponent = getCategoryIcon(tip.category)
              return (
                <div key={tip.id} className="card hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <IconComponent className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{tip.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{tip.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <ClockIcon className="w-4 h-4 text-gray-500" />
                          <span className="text-xs text-gray-500">{tip.duration}</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(tip.difficulty)}`}>
                          {tip.difficulty}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => toast.success(`Started ${tip.title}`)}
                        className="mt-3 w-full btn-primary text-sm"
                      >
                        Start Practice
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {activeTab === 'doshas' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Understanding Your Dosha</h2>
          <p className="text-gray-600">Discover your Ayurvedic constitution and personalized recommendations</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {doshaTypes.map((dosha) => (
              <div key={dosha.id} className="card">
                <div className={`w-full h-2 ${dosha.color} rounded-t-lg mb-4`}></div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{dosha.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{dosha.description}</p>
                
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Characteristics:</h4>
                  <div className="flex flex-wrap gap-1">
                    {dosha.characteristics.map((char, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {char}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Recommendations:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {dosha.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <ChevronRightIcon className="w-3 h-3 text-gray-400" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => toast.success(`Dosha assessment started for ${dosha.name}`)}
                  className="w-full btn-primary"
                >
                  Take Assessment
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'recipes' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Ayurvedic Recipes</h2>
          <p className="text-gray-600">Nourishing recipes that support your dosha and overall health</p>

          <div className="space-y-6">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="card">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center">
                    <BookOpenIcon className="w-8 h-8 text-purple-600" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{recipe.name}</h3>
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                        {recipe.category}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{recipe.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Ingredients:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {recipe.ingredients.map((ingredient, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <ChevronRightIcon className="w-3 h-3 text-gray-400" />
                              <span>{ingredient}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Instructions:</h4>
                        <ol className="text-sm text-gray-600 space-y-1">
                          {recipe.instructions.map((instruction, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <span className="text-purple-600 font-medium">{index + 1}.</span>
                              <span>{instruction}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Benefits:</h4>
                        <div className="flex flex-wrap gap-1">
                          {recipe.benefits.map((benefit, index) => (
                            <span key={index} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => toast.success(`Added ${recipe.name} to favorites`)}
                      className="mt-4 btn-primary"
                    >
                      Save Recipe
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'consultation' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Ayurvedic Consultation</h2>
          <p className="text-gray-600">Get personalized Ayurvedic guidance from certified practitioners</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <StarIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Dr. Priya Sharma</h3>
                  <p className="text-sm text-gray-600">Certified Ayurvedic Practitioner</p>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2">
                  <ClockIcon className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Available: Mon-Fri, 9AM-6PM</span>
                </div>
                <div className="flex items-center space-x-2">
                  <StarIcon className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-600">Rating: 4.9/5 (127 reviews)</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Specializes in dosha balancing, digestive health, and stress management through traditional Ayurvedic practices.
              </p>
              
              <button
                onClick={() => toast.success('Consultation booked with Dr. Priya Sharma')}
                className="w-full btn-primary"
              >
                Book Consultation
              </button>
            </div>

            <div className="card">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <StarIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Dr. Rajesh Kumar</h3>
                  <p className="text-sm text-gray-600">Ayurvedic Medicine Specialist</p>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2">
                  <ClockIcon className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Available: Tue-Sat, 10AM-7PM</span>
                </div>
                <div className="flex items-center space-x-2">
                  <StarIcon className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-600">Rating: 4.8/5 (89 reviews)</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Expert in herbal medicine, panchakarma treatments, and lifestyle modifications for chronic conditions.
              </p>
              
              <button
                onClick={() => toast.success('Consultation booked with Dr. Rajesh Kumar')}
                className="w-full btn-primary"
              >
                Book Consultation
              </button>
            </div>
          </div>

          <div className="card bg-purple-50 border-purple-200">
            <h3 className="font-semibold text-purple-900 mb-2">Virtual Consultation Benefits</h3>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• Personalized dosha assessment and recommendations</li>
              <li>• Customized diet and lifestyle plans</li>
              <li>• Herbal remedy suggestions</li>
              <li>• Follow-up support and guidance</li>
              <li>• Integration with modern healthcare practices</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

