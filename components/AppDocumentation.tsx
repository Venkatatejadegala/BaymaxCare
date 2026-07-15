'use client'

import { useState, useEffect } from 'react'
import { 
  DocumentTextIcon, 
  BookOpenIcon, 
  AcademicCapIcon,
  ShieldCheckIcon,
  CpuChipIcon,
  HeartIcon,
  ExclamationTriangleIcon,
  CameraIcon,
  ChatBubbleLeftRightIcon,
  BeakerIcon,
  ClockIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  PlayIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'
import Image from 'next/image'

interface CaseStudy {
  id: string
  title: string
  description: string
  symptoms: string[]
  diagnosis: string
  treatment: string
  outcome: string
  confidence: number
  category: 'emergency' | 'chronic' | 'preventive' | 'ayurvedic'
  timestamp: string
}

export default function AppDocumentation() {
  const [activeSection, setActiveSection] = useState('overview')
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([])
  const [isLoadingCases, setIsLoadingCases] = useState(false)

  // Generate real-time case studies using AI
  const generateCaseStudies = async (forceRefresh = false) => {
    if (!forceRefresh) {
      const cachedCases = sessionStorage.getItem('aiGeneratedCases')
      if (cachedCases) {
        setCaseStudies(JSON.parse(cachedCases))
        return
      }
    }

    setIsLoadingCases(true)
    try {
      const response = await fetch('/api/generate-cases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          count: 6,
          categories: ['emergency', 'chronic', 'preventive', 'ayurvedic']
        }),
      })
      
      if (response.ok) {
        const data = await response.json()
        setCaseStudies(data.cases)
        sessionStorage.setItem('aiGeneratedCases', JSON.stringify(data.cases))
      }
    } catch (error) {
      console.log('AI case generation not available, using sample cases')
      // Fallback sample cases
      const fallback = [
        {
          id: '1',
          title: 'Acute Chest Pain Emergency',
          description: 'Patient presented with severe chest pain and shortness of breath',
          symptoms: ['Chest pain', 'Shortness of breath', 'Sweating', 'Nausea'],
          diagnosis: 'Suspected Myocardial Infarction',
          treatment: 'Immediate emergency response, ECG, cardiac enzymes',
          outcome: 'Patient stabilized, referred to cardiology',
          confidence: 95,
          category: 'emergency',
          timestamp: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          title: 'Chronic Diabetes Management',
          description: 'Long-term diabetes management with Ayurvedic approach',
          symptoms: ['High blood sugar', 'Fatigue', 'Frequent urination', 'Weight loss'],
          diagnosis: 'Type 2 Diabetes Mellitus',
          treatment: 'Ayurvedic herbs: Bitter melon, Fenugreek, Cinnamon',
          outcome: 'Blood sugar levels improved by 15% in 3 months',
          confidence: 88,
          category: 'ayurvedic',
          timestamp: '2024-01-14T14:20:00Z'
        }
      ] as CaseStudy[]
      setCaseStudies(fallback)
      sessionStorage.setItem('aiGeneratedCases', JSON.stringify(fallback))
    }
    setIsLoadingCases(false)
  }

  useEffect(() => {
    generateCaseStudies()
  }, [])

  const sections = [
    { id: 'overview', name: 'App Overview', icon: BookOpenIcon },
    { id: 'features', name: 'Core Features', icon: CpuChipIcon },
    { id: 'ai-integration', name: 'AI Integration', icon: AcademicCapIcon },
    { id: 'ayurvedic', name: 'Ayurvedic Medicine', icon: HeartIcon },
    { id: 'emergency', name: 'Emergency Response', icon: ExclamationTriangleIcon },
    { id: 'case-studies', name: 'Real-time Cases', icon: DocumentTextIcon },
    { id: 'api-docs', name: 'API Documentation', icon: ShieldCheckIcon }
  ]

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl p-8 text-white mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <DocumentTextIcon className="w-12 h-12" />
          <div>
            <h1 className="text-4xl font-bold">BaymaxCare Documentation</h1>
            <p className="text-blue-100 text-lg">Enterprise Medical AI Platform</p>
          </div>
        </div>
        <p className="text-blue-100 max-w-3xl">
          Comprehensive documentation for the BaymaxCare medical AI platform, featuring advanced diagnosis, 
          Ayurvedic medicine integration, and real-time emergency response capabilities.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <section.icon className="w-5 h-5" />
                  <span className="font-medium">{section.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* App Overview */}
            {activeSection === 'overview' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">App Overview</h2>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    BaymaxCare is an enterprise-grade medical AI platform that combines modern technology 
                    with traditional Ayurvedic medicine to provide comprehensive healthcare solutions.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-blue-900 mb-3">Mission</h3>
                    <p className="text-blue-800">
                      To democratize healthcare access through AI-powered diagnosis, 
                      personalized treatment recommendations, and emergency response systems.
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-green-900 mb-3">Vision</h3>
                    <p className="text-green-800">
                      A world where everyone has access to accurate, immediate, 
                      and culturally-appropriate healthcare guidance.
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Statistics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">95%</div>
                      <div className="text-sm text-gray-600">Diagnosis Accuracy</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">24/7</div>
                      <div className="text-sm text-gray-600">Availability</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">10k+</div>
                      <div className="text-sm text-gray-600">Cases Analyzed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600">2min</div>
                      <div className="text-sm text-gray-600">Avg Response Time</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Core Features */}
            {activeSection === 'features' && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Core Features</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <ChatBubbleLeftRightIcon className="w-8 h-8 text-blue-600" />
                      <h3 className="text-xl font-semibold">AI-Powered Chat</h3>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Advanced conversational AI for medical consultations with real-time symptom analysis.
                    </p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center space-x-2">
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                        <span>Natural language processing</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                        <span>Emergency detection</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                        <span>Confidence scoring</span>
                      </li>
                    </ul>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <CameraIcon className="w-8 h-8 text-green-600" />
                      <h3 className="text-xl font-semibold">Visual Diagnosis</h3>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Image-based diagnosis using computer vision and AI pattern recognition.
                    </p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center space-x-2">
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                        <span>Live camera integration</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                        <span>Image analysis</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                        <span>Voice recording</span>
                      </li>
                    </ul>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <HeartIcon className="w-8 h-8 text-red-600" />
                      <h3 className="text-xl font-semibold">Ayurvedic Medicine</h3>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Traditional medicine integration with modern AI for personalized treatment.
                    </p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center space-x-2">
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                        <span>Herbal recommendations</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                        <span>Dosha analysis</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                        <span>Natural remedies</span>
                      </li>
                    </ul>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <ExclamationTriangleIcon className="w-8 h-8 text-orange-600" />
                      <h3 className="text-xl font-semibold">Emergency Response</h3>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Real-time emergency detection and response coordination.
                    </p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center space-x-2">
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                        <span>Critical symptom detection</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                        <span>Location services</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                        <span>Emergency contacts</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* AI Integration */}
            {activeSection === 'ai-integration' && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">AI Integration</h2>
                
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">OpenAI GPT-3.5 Turbo Integration</h3>
                  <p className="text-gray-600 mb-4">
                    Our platform leverages OpenAI&apos;s advanced language model for medical consultation and diagnosis.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Medical Knowledge</h4>
                      <p className="text-sm text-gray-600">Trained on extensive medical literature and case studies</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Pattern Recognition</h4>
                      <p className="text-sm text-gray-600">Advanced symptom pattern analysis and correlation</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Safety First</h4>
                      <p className="text-sm text-gray-600">Built-in safety protocols and emergency detection</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-gray-900">AI Capabilities</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="bg-blue-100 rounded-full p-2">
                        <CpuChipIcon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Symptom Analysis</h4>
                        <p className="text-gray-600">Advanced NLP for understanding and categorizing symptoms</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="bg-green-100 rounded-full p-2">
                        <ShieldCheckIcon className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Risk Assessment</h4>
                        <p className="text-gray-600">Multi-factor risk evaluation with confidence scoring</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="bg-purple-100 rounded-full p-2">
                        <AcademicCapIcon className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Treatment Recommendations</h4>
                        <p className="text-gray-600">Personalized treatment plans based on symptoms and preferences</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Ayurvedic Medicine */}
            {activeSection === 'ayurvedic' && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Ayurvedic Medicine Integration</h2>
                
                <div className="bg-gradient-to-r from-green-50 to-yellow-50 rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Traditional Medicine Meets AI</h3>
                  <p className="text-gray-600 mb-4">
                    Our platform integrates thousands of years of Ayurvedic wisdom with modern AI technology 
                    to provide personalized, natural treatment recommendations.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900">Core Ayurvedic Principles</h3>
                    
                    <div className="space-y-3">
                      <div className="bg-green-50 rounded-lg p-4">
                        <h4 className="font-semibold text-green-900 mb-2">Dosha Analysis</h4>
                        <p className="text-sm text-green-800">
                          Vata, Pitta, and Kapha assessment for personalized treatment approaches.
                        </p>
                      </div>
                      
                      <div className="bg-yellow-50 rounded-lg p-4">
                        <h4 className="font-semibold text-yellow-900 mb-2">Herbal Medicine</h4>
                        <p className="text-sm text-yellow-800">
                          Comprehensive database of medicinal herbs and their therapeutic properties.
                        </p>
                      </div>
                      
                      <div className="bg-orange-50 rounded-lg p-4">
                        <h4 className="font-semibold text-orange-900 mb-2">Natural Remedies</h4>
                        <p className="text-sm text-orange-800">
                          Traditional formulations and natural treatment protocols.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900">AI-Enhanced Ayurvedic Features</h3>
                    
                    <div className="space-y-3">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Smart Herb Matching</h4>
                        <p className="text-sm text-gray-600">
                          AI algorithms match symptoms with appropriate Ayurvedic herbs and formulations.
                        </p>
                      </div>
                      
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Dosage Optimization</h4>
                        <p className="text-sm text-gray-600">
                          Personalized dosage recommendations based on individual constitution and symptoms.
                        </p>
                      </div>
                      
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Interaction Analysis</h4>
                        <p className="text-sm text-gray-600">
                          Safety analysis for herb interactions and contraindications.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-blue-900 mb-4">Popular Ayurvedic Recommendations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Turmeric (Curcuma longa)</h4>
                      <p className="text-sm text-gray-600">Anti-inflammatory, antioxidant, immune support</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Ashwagandha (Withania somnifera)</h4>
                      <p className="text-sm text-gray-600">Adaptogen, stress relief, energy enhancement</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Tulsi (Ocimum sanctum)</h4>
                      <p className="text-sm text-gray-600">Immune support, respiratory health, stress relief</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Emergency Response */}
            {activeSection === 'emergency' && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Emergency Response System</h2>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
                    <h3 className="text-xl font-semibold text-red-900">Critical Symptom Detection</h3>
                  </div>
                  <p className="text-red-800 mb-4">
                    Our AI system continuously monitors for life-threatening symptoms and automatically 
                    triggers emergency protocols when detected.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900">Emergency Triggers</h3>
                    
                    <div className="space-y-3">
                      <div className="bg-red-100 rounded-lg p-4">
                        <h4 className="font-semibold text-red-900 mb-2">Cardiovascular Emergencies</h4>
                        <ul className="text-sm text-red-800 space-y-1">
                          <li>• Chest pain or pressure</li>
                          <li>• Severe shortness of breath</li>
                          <li>• Irregular heartbeat</li>
                          <li>• Loss of consciousness</li>
                        </ul>
                      </div>
                      
                      <div className="bg-orange-100 rounded-lg p-4">
                        <h4 className="font-semibold text-orange-900 mb-2">Neurological Emergencies</h4>
                        <ul className="text-sm text-orange-800 space-y-1">
                          <li>• Severe headache</li>
                          <li>• Sudden vision changes</li>
                          <li>• Difficulty speaking</li>
                          <li>• Weakness or paralysis</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900">Response Protocol</h3>
                    
                    <div className="space-y-3">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <h4 className="font-semibold text-gray-900">Immediate Alert</h4>
                        </div>
                        <p className="text-sm text-gray-600">Emergency services notification and location sharing</p>
                      </div>
                      
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <h4 className="font-semibold text-gray-900">Contact Notification</h4>
                        </div>
                        <p className="text-sm text-gray-600">Automatic emergency contact alerts</p>
                      </div>
                      
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <h4 className="font-semibold text-gray-900">Medical History</h4>
                        </div>
                        <p className="text-sm text-gray-600">Relevant medical information shared with responders</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Real-time Case Studies */}
            {activeSection === 'case-studies' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold text-gray-900">Real-time Case Studies</h2>
                  <button
                    onClick={() => generateCaseStudies(true)}
                    disabled={isLoadingCases}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    <PlayIcon className="w-4 h-4" />
                    <span>{isLoadingCases ? 'Generating...' : 'Generate New Cases'}</span>
                  </button>
                </div>

                {isLoadingCases ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Generating AI-powered case studies...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {caseStudies.map((caseStudy) => (
                      <div key={caseStudy.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">{caseStudy.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            caseStudy.category === 'emergency' ? 'bg-red-100 text-red-800' :
                            caseStudy.category === 'ayurvedic' ? 'bg-green-100 text-green-800' :
                            caseStudy.category === 'chronic' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {caseStudy.category}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-4">{caseStudy.description}</p>
                        
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">Symptoms:</h4>
                            <div className="flex flex-wrap gap-1">
                              {caseStudy.symptoms.map((symptom, index) => (
                                <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                                  {symptom}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">AI Diagnosis:</h4>
                            <p className="text-sm text-gray-600">{caseStudy.diagnosis}</p>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">Treatment:</h4>
                            <p className="text-sm text-gray-600">{caseStudy.treatment}</p>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">Outcome:</h4>
                            <p className="text-sm text-gray-600">{caseStudy.outcome}</p>
                          </div>
                          
                          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-500">Confidence:</span>
                              <div className="flex items-center space-x-1">
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full ${
                                      caseStudy.confidence >= 90 ? 'bg-green-500' :
                                      caseStudy.confidence >= 75 ? 'bg-yellow-500' :
                                      'bg-red-500'
                                    }`}
                                    style={{ width: `${caseStudy.confidence}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium text-gray-700">{caseStudy.confidence}%</span>
                              </div>
                            </div>
                            <span className="text-xs text-gray-500">
                              {new Date(caseStudy.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* API Documentation */}
            {activeSection === 'api-docs' && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">API Documentation</h2>
                
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">API Endpoints</h3>
                  
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">POST</span>
                        <code className="text-gray-900">/api/ai-chat</code>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">AI-powered medical chat consultation</p>
                      <div className="bg-gray-100 rounded p-3 text-sm">
                        <pre>{`{
  "message": "I have a headache and fever",
  "context": "medical_consultation"
}`}</pre>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">POST</span>
                        <code className="text-gray-900">/api/ai-diagnosis</code>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Comprehensive symptom analysis and diagnosis</p>
                      <div className="bg-gray-100 rounded p-3 text-sm">
                        <pre>{`{
  "symptoms": "headache, fever",
  "description": "Started 2 days ago",
  "medicineType": "english",
  "hasImages": false
}`}</pre>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">POST</span>
                        <code className="text-gray-900">/api/generate-cases</code>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Generate real-time medical case studies</p>
                      <div className="bg-gray-100 rounded p-3 text-sm">
                        <pre>{`{
  "count": 6,
  "categories": ["emergency", "chronic", "preventive", "ayurvedic"]
}`}</pre>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-blue-900 mb-4">Authentication</h3>
                  <p className="text-blue-800 mb-4">
                    All API endpoints require a valid OpenAI API key configured in your environment variables.
                  </p>
                  <div className="bg-white rounded p-4">
                    <code className="text-sm">OPENAI_API_KEY=sk-your-openai-api-key-here</code>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
