// aichat.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { PaperAirplaneIcon, MicrophoneIcon, StopIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import ReactMarkdown from 'react-markdown'

interface Message {
  id: string
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
  type?: 'text' | 'symptom' | 'emergency'
  suggestedMedicines?: string[]
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm Baymax, your AI health companion. How can I help you today? You can ask me about symptoms, general health questions, or request emergency assistance.",
      sender: 'ai',
      timestamp: new Date()
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getFallbackResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    
    // Enhanced fallback responses for when API is not available
    const fallbackResponses = {
      // Medicine and medication questions
      medicine: {
        keywords: ['medicine', 'medication', 'drug', 'pill', 'tablet', 'capsule', 'dose', 'dosage', 'side effect', 'interaction', 'prescription', 'otc', 'over the counter'],
        response: "I'd be happy to help you with medication questions! Here's what I can assist with:\n\nCommon Medication Topics:\n• Drug interactions and side effects\n• Proper dosing and administration\n• Prescription vs over-the-counter options\n• Generic vs brand name medications\n• Storage and safety guidelines\n• When to contact your pharmacist\n\nImportant Safety Notes:\n• Always consult your healthcare provider before starting new medications\n• Never share prescription medications\n• Keep medications in their original containers\n• Check expiration dates regularly\n\nWhat specific medication information are you looking for? I can provide detailed information about dosages, side effects, interactions, and proper usage for most common medications."
      },
      
      // Symptoms and health conditions
      symptoms: {
        keywords: ['symptom', 'pain', 'ache', 'fever', 'headache', 'nausea', 'dizziness', 'fatigue', 'rash', 'swelling', 'cough', 'sore throat', 'stomach', 'back pain'],
        response: "I understand you're experiencing some symptoms. Let me help you understand what might be going on and what you can do.\n\nTo give you the best advice, please tell me:\n• How long you've had these symptoms\n• The severity (mild, moderate, severe)\n• Any triggers or patterns you've noticed\n• Other symptoms you might be experiencing\n• Any medications you're currently taking\n\nGeneral Self-Care Tips:\n• Stay hydrated and get plenty of rest\n• Monitor your symptoms and note any changes\n• Keep a symptom diary if helpful\n• Practice good hygiene\n\nWhen to Seek Medical Help:\n• Symptoms worsen or persist\n• New concerning symptoms appear\n• You're worried about your health\n• Symptoms interfere with daily activities\n\nWhat specific symptoms are you experiencing? I can provide detailed information about potential causes, treatments, and when to seek professional help."
      },
      
      // General health and wellness
      wellness: {
        keywords: ['health', 'wellness', 'fitness', 'diet', 'nutrition', 'exercise', 'sleep', 'stress', 'mental health', 'prevention', 'lifestyle'],
        response: "Great question about health and wellness! I'm here to help you with comprehensive health information.\n\nAreas I can help with:\n• Nutrition and dietary advice\n• Exercise and fitness guidance\n• Sleep optimization\n• Stress management techniques\n• Preventive care strategies\n• Mental health support\n• Lifestyle modifications\n• Health screening recommendations\n\nGeneral Wellness Tips:\n• Maintain a balanced diet with plenty of fruits and vegetables\n• Get regular physical activity (150 minutes/week)\n• Prioritize quality sleep (7-9 hours/night)\n• Manage stress through relaxation techniques\n• Stay hydrated and limit processed foods\n• Regular health check-ups and screenings\n\nWhat specific aspect of health and wellness would you like to know more about? I can provide detailed, evidence-based information to help you make informed decisions about your health."
      },
      
      // Emergency and urgent care
      urgent: {
        keywords: ['urgent', 'severe', 'intense', 'unbearable', 'can\'t sleep', 'can\'t eat', 'high fever', 'persistent', 'worsening'],
        response: "I'm concerned about the severity of your symptoms. Based on what you've described, I'd recommend seeking medical attention soon.\n\nHere's what I suggest:\n• Schedule an urgent appointment with your doctor\n• Consider visiting urgent care if you can't get a same-day appointment\n• Keep track of your symptoms and any changes\n• Avoid self-medicating without professional guidance\n• Have someone check on you if you're feeling very unwell\n\nWhen to seek immediate help:\n• Symptoms get worse quickly\n• New concerning symptoms appear\n• Pain becomes unbearable\n• You can't perform daily activities\n• You're feeling very worried about your health\n\nRemember: It's always better to be safe and get checked out by a healthcare professional. Your health and safety are the top priority.\n\nCan you tell me more about your symptoms? I can provide more specific guidance based on what you're experiencing."
      }
    }
    
    // Check for specific question categories
    for (const [category, data] of Object.entries(fallbackResponses)) {
      if (data.keywords.some(keyword => lowerMessage.includes(keyword))) {
        return data.response
      }
    }
    
    // General health queries - comprehensive response
    return "Hi there! I'm Baymax, your comprehensive AI health assistant. I'm here to help with any health, medical, or wellness questions you might have.\n\nI can help you with:\n• Medications - Dosages, side effects, interactions, proper usage\n• Symptoms - Analysis, potential causes, treatment options\n• Health Conditions - Information, management, prevention\n• Wellness - Nutrition, exercise, sleep, stress management\n• Emergency Situations - When to seek immediate help\n• Preventive Care - Screenings, vaccinations, lifestyle advice\n• Mental Health - Stress, anxiety, depression support\n• Alternative Medicine - Natural remedies, complementary therapies\n\nTo give you the best advice, please:\n• Describe your question or concern in detail\n• Include any relevant medical history\n• Mention current medications if applicable\n• Ask specific questions\n\nRemember: While I provide comprehensive health information, I always recommend consulting healthcare professionals for proper diagnosis and treatment.\n\nWhat would you like to know about? I'm here to help with any health-related question you have!"
  }

  const analyzeSymptomsWithAI = async (userMessage: string): Promise<string> => {
    const lowerMessage = userMessage.toLowerCase()
    
    // Check for emergency symptoms first
    const emergencyKeywords = ['chest pain', 'difficulty breathing', 'severe headache', 'loss of consciousness', 'severe bleeding', 'stroke', 'heart attack', 'can\'t breathe', 'unconscious', 'emergency', 'urgent', 'dying', 'can\'t move', 'paralyzed']
    if (emergencyKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return "🚨 EMERGENCY ALERT 🚨\n\nI'm very concerned about your symptoms. This appears to be a medical emergency that requires immediate attention.\n\nPlease take these steps right now:\n1. Call emergency services (112) immediately\n2. Don't delay seeking medical help\n3. Stay calm and follow emergency operator instructions\n4. If possible, have someone stay with you\n\nI'm also alerting your emergency contacts and sharing your location with medical services.\n\nImportant: This is not something to wait on - please get medical help immediately. Your safety is the top priority."
    }
    
    // Try to use your local API for comprehensive responses
    try {
      console.log('Attempting to call local API...')
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      })
      
      console.log('API Response Status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('API Response received successfully')
        return data.response
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('API Error:', response.status, errorData)
        return `⚠️ API Error (${response.status}): ${errorData.error || 'Unable to connect to AI service. Using fallback response below.'}\n\n` + getFallbackResponse(userMessage)
      }
    } catch (error) {
      console.error('API Error:', error)
      return `⚠️ Connection Error: Unable to connect to AI service. Using fallback response below.\n\n` + getFallbackResponse(userMessage)
    }
  }

  const handleSendMessage = async () => {
    if (!inputText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = inputText
    setInputText('')
    setIsTyping(true)

    try {
      // Get AI response with proper error handling
      const aiResponseText = await analyzeSymptomsWithAI(currentInput)
      
      // Parse simple medicine suggestions from AI text (looks for a bullet list under Medicines or recommends)
      const medsMatch = aiResponseText.match(/(?:(?:medicines?|medication)s?:?|\bmedicines\b)[\s\S]*?(?:\n|^)\s*(?:[-•]\s*.+)/i)
      const bulletLines = aiResponseText.split('\n').filter(l => /^\s*[-•]\s*/.test(l))
      const extractedMeds = bulletLines
        .map(l => l.replace(/^\s*[-•]\s*/, '').trim())
        .filter(l => /(mg|ml|tablet|capsule|paracetamol|ibuprofen|antihistamine|vitamin|syrup|ointment)/i.test(l))

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        sender: 'ai',
        timestamp: new Date(),
        suggestedMedicines: extractedMeds.slice(0, 5)
      }

      setMessages(prev => [...prev, aiResponse])
    } catch (error) {
      console.error('Error getting AI response:', error)
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
        sender: 'ai',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorResponse])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleVoiceRecording = () => {
    if (isRecording) {
      setIsRecording(false)
      toast.success('Voice recording stopped')
    } else {
      setIsRecording(true)
      toast.success('Voice recording started')
      // Simulate voice recording
      setTimeout(() => {
        setIsRecording(false)
        toast.success('Voice message processed')
      }, 3000)
    }
  }

  const quickQuestions = [
    "I have a headache, what should I do?",
    "How can I improve my sleep?",
    "What are signs of dehydration?",
    "How much water should I drink daily?",
    "What are healthy breakfast options?"
  ]

  return (
    <div className="max-w-6xl mx-auto">
      <div className="card">
        <div className="flex items-center space-x-3 mb-4 sm:mb-6">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm sm:text-base">B</span>
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">Baymax AI Assistant</h1>
            <p className="text-xs sm:text-sm text-gray-600">Your AI health companion</p>
          </div>
        </div>

        {/* Quick Questions */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-3">Quick questions:</p>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => setInputText(question)}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors touch-manipulation min-h-[44px]"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="h-80 sm:h-96 overflow-y-auto border border-gray-200 rounded-lg p-3 sm:p-4 mb-4 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-6 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-4xl ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.sender === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-green-500 text-white'
                }`}>
                  {message.sender === 'user' ? 'U' : 'B'}
                </div>
                
                {/* Message Content */}
                <div className={`flex-1 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  <div
                    className={`inline-block px-4 py-3 rounded-2xl max-w-full ${
                      message.sender === 'user'
                        ? 'bg-blue-500 text-white rounded-br-md'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md shadow-sm'
                    }`}
                  >
                    {message.sender === 'ai' ? (
                      <div className="text-sm leading-relaxed prose prose-sm max-w-none prose-headings:font-semibold prose-headings:text-gray-900 prose-p:text-gray-800 prose-strong:text-gray-900 prose-strong:font-semibold prose-ul:list-disc prose-ul:ml-4 prose-ol:list-decimal prose-ol:ml-4 prose-li:text-gray-800 prose-li:my-1">
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                            strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                            ul: ({ children }) => <ul className="list-disc ml-4 mb-2 space-y-1">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal ml-4 mb-2 space-y-1">{children}</ol>,
                            li: ({ children }) => <li className="text-gray-800">{children}</li>,
                            h1: ({ children }) => <h1 className="text-base font-semibold mb-2 mt-3 first:mt-0">{children}</h1>,
                            h2: ({ children }) => <h2 className="text-sm font-semibold mb-2 mt-3 first:mt-0">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-sm font-semibold mb-2 mt-2 first:mt-0">{children}</h3>,
                          }}
                        >
                          {message.text}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
                    )}
                  </div>
                  <p className={`text-xs text-gray-500 mt-1 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start mb-6">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0">
                  B
                </div>
                <div className="bg-white text-gray-800 border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <div className="flex-1 relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about your health concerns..."
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base min-h-[44px] sm:min-h-[48px]"
              rows={2}
            />
          </div>
          
          <button
            onClick={handleVoiceRecording}
            className={`p-2 sm:p-3 rounded-lg transition-colors min-h-[44px] sm:min-h-[48px] min-w-[44px] sm:min-w-[48px] touch-manipulation ${
              isRecording
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            }`}
            title={isRecording ? 'Stop recording' : 'Start voice recording'}
          >
            {isRecording ? (
              <StopIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <MicrophoneIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>
          
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1 min-h-[44px] sm:min-h-[48px] px-3 sm:px-4 touch-manipulation text-sm sm:text-base"
          >
            <PaperAirplaneIcon className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>

        {/* Disclaimer */}
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-800">
            <strong>Disclaimer:</strong> This AI assistant provides general health information only and cannot replace professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals for medical concerns.
          </p>
        </div>

        {/* Suggested Medicines → Quick Add to Prescriptions */}
        {messages.filter(m => m.sender === 'ai' && m.suggestedMedicines && m.suggestedMedicines.length).slice(-1).map((m) => (
          <div key={m.id} className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-purple-900">Suggested medicines</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {m.suggestedMedicines!.map((med, idx) => (
                <button
                  key={idx}
                  onClick={async () => {
                    const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null
                    if (!userId) {
                      toast.error('Please login to save prescriptions')
                      return
                    }
                    const basicDosage = med.match(/\b(\d+\s?mg|\d+\s?ml)\b/i)?.[0] || 'as directed'
                    try {
                      const res = await fetch('/api/prescriptions/create', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          userId,
                          medication: med,
                          dosage: basicDosage,
                          frequency: 'as prescribed',
                          startDate: new Date().toISOString(),
                        })
                      })
                      if (!res.ok) throw new Error('Failed to add')
                      toast.success('Added to prescriptions')
                    } catch (e) {
                      toast.error('Could not add prescription')
                    }
                  }}
                  className="px-3 py-2 bg-purple-600 text-white rounded-full text-xs hover:bg-purple-700"
                  title="Add to prescriptions"
                >
                  + {med}
                </button>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-purple-700">Note: These are general suggestions. Always confirm with a healthcare professional before use.</p>
          </div>
        ))}
      </div>
    </div>
  )
}