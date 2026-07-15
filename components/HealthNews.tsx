'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { 
  NewspaperIcon, 
  ClockIcon,
  UserIcon,
  TagIcon,
  BookmarkIcon,
  ShareIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  BellIcon,
  HeartIcon,
  ChartBarIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface NewsArticle {
  id: string
  title: string
  summary: string
  content: string
  author: string
  publishedAt: Date
  category: 'general' | 'research' | 'nutrition' | 'fitness' | 'mental-health' | 'ayurveda' | 'emergency'
  tags: string[]
  imageUrl?: string
  source: string
  readTime: number
  isBookmarked: boolean
  isTrending: boolean
}

interface NewsCategory {
  id: string
  name: string
  icon: React.ComponentType<any>
  color: string
}

export default function HealthNews() {
  const [articles, setArticles] = useState<NewsArticle[]>([
    {
      id: '1',
      title: 'New Study Shows Benefits of Mediterranean Diet for Heart Health',
      summary: 'Recent research confirms that following a Mediterranean diet can significantly reduce the risk of cardiovascular disease.',
      content: 'A comprehensive study involving over 10,000 participants has shown that adherence to a Mediterranean diet pattern is associated with a 30% reduction in cardiovascular disease risk. The study, published in the Journal of Nutrition, followed participants for over 5 years and found significant improvements in cholesterol levels, blood pressure, and inflammatory markers.',
      author: 'Dr. Sarah Chen',
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      category: 'research',
      tags: ['mediterranean diet', 'heart health', 'nutrition', 'cardiovascular'],
      imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400',
      source: 'Health Research Journal',
      readTime: 5,
      isBookmarked: false,
      isTrending: true
    },
    {
      id: '2',
      title: 'Ayurvedic Practices for Better Sleep Quality',
      summary: 'Traditional Ayurvedic techniques can help improve sleep patterns and overall rest quality.',
      content: 'Ayurveda offers several time-tested practices for improving sleep quality. These include establishing a consistent bedtime routine, practicing gentle yoga before bed, using calming essential oils like lavender, and avoiding heavy meals close to bedtime. The ancient practice emphasizes the importance of aligning with natural circadian rhythms.',
      author: 'Dr. Priya Sharma',
      publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      category: 'ayurveda',
      tags: ['ayurveda', 'sleep', 'wellness', 'traditional medicine'],
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
      source: 'Ayurvedic Wellness Today',
      readTime: 4,
      isBookmarked: true,
      isTrending: false
    },
    {
      id: '3',
      title: 'Mental Health Awareness: Recognizing Early Warning Signs',
      summary: 'Understanding the early signs of mental health issues can lead to better outcomes and timely intervention.',
      content: 'Mental health professionals emphasize the importance of recognizing early warning signs of mental health issues. These can include changes in sleep patterns, appetite, mood, energy levels, and social behavior. Early intervention and support can significantly improve treatment outcomes and quality of life.',
      author: 'Dr. Michael Rodriguez',
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      category: 'mental-health',
      tags: ['mental health', 'awareness', 'early intervention', 'wellness'],
      imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
      source: 'Mental Health Today',
      readTime: 6,
      isBookmarked: false,
      isTrending: true
    },
    {
      id: '4',
      title: 'Emergency Preparedness: First Aid Essentials for Home',
      summary: 'Essential first aid knowledge and supplies every household should have for emergency situations.',
      content: 'Being prepared for medical emergencies at home is crucial. Every household should have a well-stocked first aid kit including bandages, antiseptic, pain relievers, and emergency contact information. Family members should also be trained in basic first aid techniques like CPR and the Heimlich maneuver.',
      author: 'Emergency Medical Services',
      publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      category: 'emergency',
      tags: ['first aid', 'emergency preparedness', 'safety', 'home health'],
      imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400',
      source: 'Emergency Health Guide',
      readTime: 7,
      isBookmarked: false,
      isTrending: false
    },
    {
      id: '5',
      title: 'The Science Behind Intermittent Fasting and Metabolic Health',
      summary: 'Research explores how intermittent fasting patterns can improve metabolic markers and overall health.',
      content: 'Intermittent fasting has gained attention for its potential metabolic benefits. Studies suggest that time-restricted eating can improve insulin sensitivity, reduce inflammation, and support weight management. However, it\'s important to approach fasting safely and consult healthcare providers, especially for individuals with certain medical conditions.',
      author: 'Dr. Lisa Wang',
      publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      category: 'nutrition',
      tags: ['intermittent fasting', 'metabolism', 'nutrition', 'research'],
      imageUrl: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=400',
      source: 'Nutrition Science Review',
      readTime: 8,
      isBookmarked: true,
      isTrending: false
    }
  ])

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showBookmarked, setShowBookmarked] = useState(false)

  const categories: NewsCategory[] = [
    { id: 'all', name: 'All News', icon: NewspaperIcon, color: 'bg-gray-500' },
    { id: 'research', name: 'Research', icon: ChartBarIcon, color: 'bg-blue-500' },
    { id: 'nutrition', name: 'Nutrition', icon: HeartIcon, color: 'bg-green-500' },
    { id: 'fitness', name: 'Fitness', icon: ChartBarIcon, color: 'bg-orange-500' },
    { id: 'mental-health', name: 'Mental Health', icon: HeartIcon, color: 'bg-purple-500' },
    { id: 'ayurveda', name: 'Ayurveda', icon: GlobeAltIcon, color: 'bg-yellow-500' },
    { id: 'emergency', name: 'Emergency', icon: BellIcon, color: 'bg-red-500' }
  ]

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory
    const matchesBookmark = !showBookmarked || article.isBookmarked
    
    return matchesSearch && matchesCategory && matchesBookmark
  })

  const toggleBookmark = (articleId: string) => {
    setArticles(prev => 
      prev.map(article => 
        article.id === articleId 
          ? { ...article, isBookmarked: !article.isBookmarked }
          : article
      )
    )
    toast.success('Bookmark updated')
  }

  const shareArticle = (article: NewsArticle) => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(`${article.title} - ${article.summary}`)
      toast.success('Article link copied to clipboard')
    }
  }

  const trendingArticles = articles.filter(article => article.isTrending)
  const bookmarkedArticles = articles.filter(article => article.isBookmarked)

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3">
          <NewspaperIcon className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold">Health News & Updates</h1>
            <p className="text-indigo-100">Stay informed with the latest health research and wellness trends</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles, topics, or tags..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowBookmarked(!showBookmarked)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                showBookmarked 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <BookmarkIcon className="w-4 h-4 mr-2 inline" />
              Bookmarks
            </button>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const IconComponent = category.icon
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === category.id
                  ? `${category.color} text-white`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              <span className="font-medium">{category.name}</span>
            </button>
          )
        })}
      </div>

      {/* Trending Articles */}
      {trendingArticles.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <ChartBarIcon className="w-5 h-5 text-orange-500" />
            <span>Trending Now</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trendingArticles.map((article) => (
              <div key={article.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-3">
                  {article.imageUrl && (
                    <Image 
                      src={article.imageUrl} 
                      alt={article.title}
                      width={64}
                      height={64}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{article.title}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{article.summary}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <ClockIcon className="w-3 h-3" />
                        <span>{article.readTime} min read</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => toggleBookmark(article.id)}
                          className={`p-1 rounded ${
                            article.isBookmarked ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
                          }`}
                        >
                          <BookmarkIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => shareArticle(article)}
                          className="p-1 rounded text-gray-400 hover:text-gray-600"
                        >
                          <ShareIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Articles */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {showBookmarked ? 'Bookmarked Articles' : 'Latest Articles'}
          </h2>
          <span className="text-sm text-gray-500">
            {filteredArticles.length} articles
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <div key={article.id} className="card hover:shadow-md transition-shadow">
              {article.imageUrl && (
                <Image 
                  src={article.imageUrl} 
                  alt={article.title}
                  width={400}
                  height={192}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    categories.find(c => c.id === article.category)?.color || 'bg-gray-500'
                  } text-white`}>
                    {categories.find(c => c.id === article.category)?.name}
                  </span>
                  {article.isTrending && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                      Trending
                    </span>
                  )}
                </div>
                
                <h3 className="font-semibold text-gray-900 line-clamp-2">{article.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-3">{article.summary}</p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-2">
                    <UserIcon className="w-3 h-3" />
                    <span>{article.author}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="w-3 h-3" />
                    <span>{article.readTime} min</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {article.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => toggleBookmark(article.id)}
                    className={`flex items-center space-x-1 text-sm ${
                      article.isBookmarked ? 'text-yellow-600' : 'text-gray-500 hover:text-yellow-600'
                    }`}
                  >
                    <BookmarkIcon className="w-4 h-4" />
                    <span>{article.isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
                  </button>
                  
                  <button
                    onClick={() => shareArticle(article)}
                    className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
                  >
                    <ShareIcon className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter Subscription */}
      <div className="card bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Stay Updated</h3>
          <p className="text-gray-600 mb-4">Get the latest health news and wellness tips delivered to your inbox</p>
          
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              onClick={() => toast.success('Newsletter subscription successful!')}
              className="btn-primary"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

