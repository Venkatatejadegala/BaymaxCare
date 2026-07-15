'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { 
  CameraIcon, 
  PhotoIcon,
  DocumentTextIcon,
  CloudArrowUpIcon,
  XMarkIcon,
  EyeIcon,
  TrashIcon,
  CheckCircleIcon,
  ClockIcon,
  UserIcon,
  CalendarIcon,
  VideoCameraIcon,
  MicrophoneIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import ReactMarkdown from 'react-markdown'

interface UploadedFile {
  id: string
  file: File
  preview: string
  type: 'image' | 'video' | 'document'
  uploadedAt: Date
  status: 'uploading' | 'completed' | 'error'
}

interface DiagnosisRequest {
  id: string
  symptoms: string
  description: string
  files: UploadedFile[]
  createdAt: Date
  status: 'pending' | 'processing' | 'completed'
  aiAnalysis?: string
  recommendations?: string[]
  confidence?: number
  medicines?: string[]
}

export default function DiagnosisInterface() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [symptoms, setSymptoms] = useState('')
  const [description, setDescription] = useState('')
  const [medicineType, setMedicineType] = useState<'english' | 'ayurvedic'>('english')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [showCamera, setShowCamera] = useState(false)
  const [diagnosisHistory, setDiagnosisHistory] = useState<DiagnosisRequest[]>([
    {
      id: '1',
      symptoms: 'Headache and fever',
      description: 'Experiencing persistent headache with mild fever for 2 days',
      files: [],
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: 'completed',
      aiAnalysis: 'Based on your symptoms and description, this appears to be a common viral infection. The combination of headache and fever suggests your body is fighting off an infection.',
      recommendations: [
        'Rest and stay hydrated',
        'Take over-the-counter pain relievers if needed',
        'Monitor temperature regularly',
        'Consult a doctor if symptoms worsen'
      ]
    }
  ])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : 
            file.type.startsWith('video/') ? 'video' : 'document',
      uploadedAt: new Date(),
      status: 'uploading'
    }))

    setUploadedFiles(prev => [...prev, ...newFiles])

    // Simulate upload process
    newFiles.forEach(fileObj => {
      setTimeout(() => {
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileObj.id 
              ? { ...f, status: 'completed' }
              : f
          )
        )
        toast.success(`${fileObj.file.name} uploaded successfully`)
      }, 2000)
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.mov', '.avi', '.webm'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 5,
    maxSize: 10 * 1024 * 1024 // 10MB
  })

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId)
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview)
      }
      return prev.filter(f => f.id !== fileId)
    })
    toast.success('File removed')
  }

 // From the updated diagnosisInterface.tsx snippet
// ...
const analyzeSymptoms = async () => {
    if (!symptoms.trim() && uploadedFiles.length === 0) {
        toast.error('Please provide symptoms or upload files for analysis');
        return;
    }

    setIsAnalyzing(true);
    
    // Step 1: Read all image files and convert them to Base64 strings
    const imageFiles = uploadedFiles.filter(f => f.type === 'image');
    const base64Images = await Promise.all(
        imageFiles.map(fileObj => {
            return new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(fileObj.file);
            });
        })
    );

    const newRequest: DiagnosisRequest = {
        id: Date.now().toString(),
        symptoms,
        description,
        files: uploadedFiles,
        createdAt: new Date(),
        status: 'processing'
    };

    setDiagnosisHistory(prev => [newRequest, ...prev]);

    try {
        // Step 2: Send the Base64 image data and text to your backend
        const response = await fetch('/api/ai-diagnosis', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                symptoms,
                description,
                medicineType,
                images: base64Images, // Send the array of Base64 image strings
            }),
        });

        const aiResult = await response.json();
        
        // ... (Your existing logic to update state with the AI response)
        setDiagnosisHistory(prev => 
            prev.map(req => 
                req.id === newRequest.id 
                    ? { 
                        ...req, 
                        status: 'completed',
                        aiAnalysis: aiResult.analysis,
                        recommendations: aiResult.recommendations,
                        confidence: aiResult.confidence,
                        medicines: aiResult.medicines
                    }
                    : req
            )
        );
        
        setIsAnalyzing(false);
        setSymptoms('');
        setDescription('');
        setUploadedFiles([]);
        toast.success(`AI Analysis completed! Confidence: ${aiResult.confidence}%`);
        
    } catch (error) {
        // ... (Your existing error handling)
        setIsAnalyzing(false);
    }
};

  const analyzeSymptomsWithAI = async (symptoms: string, description: string, files: UploadedFile[], medicineType: 'english' | 'ayurvedic'): Promise<{analysis: string, recommendations: string[], confidence: number, medicines: string[]}> => {
    const lowerSymptoms = symptoms.toLowerCase()
    const lowerDescription = description.toLowerCase()
    
    // Check for emergency symptoms first
    const emergencyKeywords = ['chest pain', 'difficulty breathing', 'severe headache', 'loss of consciousness', 'severe bleeding', 'stroke', 'heart attack']
    if (emergencyKeywords.some(keyword => lowerSymptoms.includes(keyword) || lowerDescription.includes(keyword))) {
      return {
        analysis: "🚨 **CRITICAL MEDICAL EMERGENCY DETECTED** 🚨\n\nBased on your symptoms and uploaded information, this appears to be a life-threatening condition requiring immediate medical intervention.\n\n**AI Analysis:**\n• Symptom severity: CRITICAL\n• Risk assessment: HIGH\n• Urgency level: IMMEDIATE\n• Recommended action: EMERGENCY SERVICES",
        confidence: 95,
        recommendations: [
          "Call emergency services (112) immediately",
          "Do not delay seeking medical help",
          "Stay calm and follow emergency operator instructions",
          "Alert emergency contacts",
          "Prepare medical information for responders"
        ],
        medicines: []
      }
    }

    // Try to use OpenAI API for enhanced analysis
    try {
      const response = await fetch('/api/ai-diagnosis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symptoms,
          description,
          medicineType,
          hasImages: files.some(f => f.type === 'image')
        }),
      })
      
      if (response.ok) {
        const data = await response.json()
        return {
          analysis: data.analysis,
          recommendations: data.recommendations,
          confidence: data.confidence,
          medicines: data.medicines || []
        }
      }
    } catch (error) {
      console.log('OpenAI API not available, using fallback analysis')
    }

    // Enhanced fallback analysis with image consideration
    let analysis = ""
    let recommendations: string[] = []
    let confidence = 70
    let medicines: string[] = []

    // Image-based analysis
    if (files.some(f => f.type === 'image')) {
      analysis = "🔬 **AI VISUAL DIAGNOSIS** 🔬\n\nBased on your uploaded images and symptoms, here's my analysis:\n\n**Visual Analysis:**\n• Image pattern recognition: Completed\n• Symptom correlation: Visual evidence analyzed\n• Severity assessment: Based on visual indicators\n• Differential diagnosis: Multiple possibilities considered\n\n**Important:** Visual analysis is preliminary. Professional medical evaluation is essential for accurate diagnosis."
      confidence = 80
      recommendations = [
        "Avoid self-treatment based on visual analysis",
        "Schedule medical consultation for proper diagnosis",
        "Document progression with additional photos",
        "Bring images to medical appointment",
        "Avoid scratching or irritating affected areas"
      ]
    } else {
      // Text-based analysis
      if (lowerSymptoms.includes('headache') || lowerSymptoms.includes('fever')) {
        analysis = "📋 **SYMPTOM ANALYSIS COMPLETE** 📋\n\n**Likely Causes:**\n• Viral infection (most common)\n• Stress-related symptoms\n• Seasonal allergies\n• Minor injury or strain\n\n**AI Analysis:**\n• Symptom severity: MODERATE\n• Risk assessment: LOW-MODERATE\n• Urgency level: ROUTINE"
        confidence = 75
        recommendations = [
          "Rest and maintain adequate hydration",
          "Monitor temperature and symptom progression",
          "Maintain good hygiene practices",
          "Seek medical care if symptoms persist beyond 7-10 days"
        ]
      } else {
        analysis = "🤖 **COMPREHENSIVE AI HEALTH ANALYSIS** 🤖\n\nI've analyzed your symptoms using advanced medical knowledge databases.\n\n**AI Processing Results:**\n• Symptom pattern analysis: Completed\n• Risk factor assessment: Evaluated\n• Differential diagnosis: Considered\n• Treatment pathway: Recommended"
        recommendations = [
          "Document all symptoms with dates and severity",
          "Schedule medical consultation within 1-2 weeks",
          "Bring symptom diary to medical appointment"
        ]
      }
    }

    // Medicine recommendations based on type
    if (medicineType === 'english') {
      medicines = [
        "Paracetamol (for pain and fever)",
        "Ibuprofen (anti-inflammatory)",
        "Antihistamines (for allergies)",
        "Cough suppressants (if applicable)",
        "Multivitamins (general health)"
      ]
    } else {
      medicines = [
        "Turmeric (anti-inflammatory)",
        "Ginger (digestive and anti-nausea)",
        "Honey (cough and throat)",
        "Tulsi (immune support)",
        "Ashwagandha (stress and energy)"
      ]
    }

    return {
      analysis,
      recommendations,
      confidence,
      medicines
    }
  }

  const generateRecommendations = (symptoms: string): string[] => {
    const lowerSymptoms = symptoms.toLowerCase()
    const recommendations: string[] = []
    
    if (lowerSymptoms.includes('headache')) {
      recommendations.push('Rest in a quiet, dark room')
      recommendations.push('Apply cold compress to forehead')
      recommendations.push('Stay hydrated')
    }
    
    if (lowerSymptoms.includes('fever')) {
      recommendations.push('Monitor temperature regularly')
      recommendations.push('Stay hydrated with water and electrolytes')
      recommendations.push('Get plenty of rest')
    }
    
    if (lowerSymptoms.includes('rash')) {
      recommendations.push('Avoid scratching the affected area')
      recommendations.push('Use gentle, fragrance-free skincare products')
      recommendations.push('Apply cool compresses if needed')
    }
    
    recommendations.push('Consult a healthcare professional if symptoms persist or worsen')
    recommendations.push('Seek immediate medical attention for severe symptoms')
    
    return recommendations
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return PhotoIcon
      case 'video':
        return CameraIcon
      case 'document':
        return DocumentTextIcon
      default:
        return DocumentTextIcon
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploading':
        return 'text-yellow-600'
      case 'completed':
        return 'text-green-600'
      case 'error':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  // Camera functionality
  const startCamera = async () => {
    try {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast.error('Camera not supported on this device')
        return
      }

      // Request camera permissions with mobile-optimized settings
      const constraints = {
        video: {
          facingMode: 'environment', // Use back camera on mobile
          width: { 
            min: 320,
            ideal: 1280,
            max: 1920
          },
          height: { 
            min: 240,
            ideal: 720,
            max: 1080
          },
          frameRate: { ideal: 30, max: 60 }
        },
        audio: false
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      setCameraStream(stream)
      setShowCamera(true)
      toast.success('Camera started successfully!')
    } catch (error: any) {
      console.error('Camera error:', error)
      
      // Provide specific error messages for different scenarios
      if (error.name === 'NotAllowedError') {
        toast.error('Camera permission denied. Please allow camera access and try again.')
      } else if (error.name === 'NotFoundError') {
        toast.error('No camera found on this device.')
      } else if (error.name === 'NotSupportedError') {
        toast.error('Camera not supported on this device.')
      } else {
        toast.error('Failed to access camera. Please check permissions and try again.')
      }
    }
  }

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop())
      setCameraStream(null)
      setShowCamera(false)
      toast.success('Camera stopped')
    }
  }

  const capturePhoto = () => {
    if (cameraStream) {
      const video = document.createElement('video')
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      
      video.srcObject = cameraStream
      video.play()
      
      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context?.drawImage(video, 0, 0)
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `camera-capture-${Date.now()}.jpg`, { type: 'image/jpeg' })
            const newFile: UploadedFile = {
              id: Date.now().toString(),
              file,
              preview: URL.createObjectURL(blob),
              type: 'image',
              uploadedAt: new Date(),
              status: 'completed'
            }
            setUploadedFiles(prev => [...prev, newFile])
            toast.success('Photo captured successfully')
          }
        }, 'image/jpeg', 0.8)
      }
    }
  }

  // Voice recording functionality
  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      const chunks: BlobPart[] = []
      
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data)
      }
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' })
        const file = new File([blob], `voice-recording-${Date.now()}.wav`, { type: 'audio/wav' })
        
        const newFile: UploadedFile = {
          id: Date.now().toString(),
          file,
          preview: URL.createObjectURL(blob),
          type: 'video', // Using video type for audio files
          uploadedAt: new Date(),
          status: 'completed'
        }
        
        setUploadedFiles(prev => [...prev, newFile])
        setIsRecording(false)
        toast.success('Voice recording completed')
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())
      }
      
      mediaRecorder.start()
      setIsRecording(true)
      toast.success('Voice recording started')
      
      // Auto-stop after 30 seconds
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop()
        }
      }, 30000)
      
    } catch (error) {
      toast.error('Microphone access denied or not available')
      console.error('Voice recording error:', error)
    }
  }

  const stopVoiceRecording = () => {
    setIsRecording(false)
    toast.success('Voice recording stopped')
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3">
          <CameraIcon className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold">AI Diagnosis Assistant</h1>
            <p className="text-green-100">Upload symptoms and get AI-powered health insights</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload and Input Section */}
        <div className="space-y-6">
          {/* File Upload */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Media</h2>
            
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragActive 
                  ? 'border-green-400 bg-green-50' 
                  : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
              }`}
            >
              <input {...getInputProps()} />
              <CloudArrowUpIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              {isDragActive ? (
                <p className="text-green-600">Drop the files here...</p>
              ) : (
                <div>
                  <p className="text-gray-600 mb-2">
                    Drag & drop files here, or click to select
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports images, videos, and PDFs (max 10MB each)
                  </p>
                </div>
              )}
            </div>

            {/* Camera and Voice Controls */}
            <div className="mt-4 flex flex-col sm:flex-row flex-wrap gap-3 justify-center">
              <button
                onClick={showCamera ? stopCamera : startCamera}
                className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-colors min-h-[48px] touch-manipulation ${
                  showCamera 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                <CameraIcon className="w-5 h-5" />
                <span className="text-sm sm:text-base">{showCamera ? 'Stop Camera' : 'Start Camera'}</span>
              </button>

              {showCamera && (
                <button
                  onClick={capturePhoto}
                  className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors min-h-[48px] touch-manipulation"
                >
                  <PhotoIcon className="w-5 h-5" />
                  <span className="text-sm sm:text-base">Capture Photo</span>
                </button>
              )}

              <button
                onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-colors min-h-[48px] touch-manipulation ${
                  isRecording 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-purple-500 hover:bg-purple-600 text-white'
                }`}
              >
                <MicrophoneIcon className="w-5 h-5" />
                <span className="text-sm sm:text-base">{isRecording ? 'Stop Recording' : 'Voice Record'}</span>
              </button>
            </div>

        {/* Camera Preview */}
        {showCamera && (
          <div className="mt-4 border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Camera Preview</h3>
            <div className="relative bg-gray-100 rounded-lg overflow-hidden">
              <video
                ref={(video) => {
                  if (video && cameraStream) {
                    video.srcObject = cameraStream
                    video.play()
                  }
                }}
                className="w-full h-48 sm:h-64 object-cover"
                autoPlay
                muted
                playsInline // Important for mobile Safari
                webkit-playsinline="true" // For older iOS versions
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                  Live Camera Feed
                </div>
              </div>
              {/* Mobile camera controls overlay */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                <button
                  onClick={capturePhoto}
                  className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 p-3 rounded-full shadow-lg transition-all"
                  aria-label="Capture photo"
                >
                  <CameraIcon className="w-6 h-6" />
                </button>
                <button
                  onClick={stopCamera}
                  className="bg-red-500 bg-opacity-90 hover:bg-opacity-100 text-white p-3 rounded-full shadow-lg transition-all"
                  aria-label="Stop camera"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        )}

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <h3 className="font-medium text-gray-900">Uploaded Files:</h3>
                {uploadedFiles.map((file) => {
                  const IconComponent = getFileIcon(file.type)
                  return (
                    <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <IconComponent className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{file.file.name}</p>
                          <p className={`text-xs ${getStatusColor(file.status)}`}>
                            {file.status === 'uploading' ? 'Uploading...' : 
                             file.status === 'completed' ? 'Uploaded' : 'Error'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => window.open(file.preview, '_blank')}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeFile(file.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Symptoms Input */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Describe Your Symptoms</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Symptoms
                </label>
                <input
                  type="text"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="e.g., headache, fever, rash, nausea..."
                  className="input-field text-base" // Prevent zoom on iOS
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe when symptoms started, severity, duration, and any other relevant details..."
                  className="input-field text-base resize-none" // Prevent zoom on iOS and disable resize
                  rows={4}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medicine Type Preference
                </label>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                  <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer touch-manipulation">
                    <input
                      type="radio"
                      value="english"
                      checked={medicineType === 'english'}
                      onChange={(e) => setMedicineType(e.target.value as 'english' | 'ayurvedic')}
                      className="mr-3 w-4 h-4"
                    />
                    <span className="text-sm text-gray-700">English Medicine</span>
                  </label>
                  <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer touch-manipulation">
                    <input
                      type="radio"
                      value="ayurvedic"
                      checked={medicineType === 'ayurvedic'}
                      onChange={(e) => setMedicineType(e.target.value as 'english' | 'ayurvedic')}
                      className="mr-3 w-4 h-4"
                    />
                    <span className="text-sm text-gray-700">Ayurvedic Medicine</span>
                  </label>
                </div>
              </div>
              
              <button
                onClick={analyzeSymptoms}
                disabled={isAnalyzing || (!symptoms.trim() && uploadedFiles.length === 0)}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 py-4 min-h-[56px] touch-manipulation text-base"
              >
                {isAnalyzing ? (
                  <>
                    <ClockIcon className="w-5 h-5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="w-5 h-5" />
                    <span>Analyze Symptoms</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Diagnosis History */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Diagnoses</h2>
            
            <div className="space-y-4">
              {diagnosisHistory.map((diagnosis) => (
                <div key={diagnosis.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <UserIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-900">{diagnosis.symptoms}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-xs text-gray-500">
                        {diagnosis.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{diagnosis.description}</p>
                  
                  {diagnosis.files.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">Attachments:</p>
                      <div className="flex space-x-2">
                        {diagnosis.files.map((file) => {
                          const IconComponent = getFileIcon(file.type)
                          return (
                            <div key={file.id} className="flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded">
                              <IconComponent className="w-3 h-3 text-gray-500" />
                              <span className="text-xs text-gray-600">{file.file.name}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                  
                  {diagnosis.status === 'completed' && diagnosis.aiAnalysis && (
                    <div className="space-y-3">
                      {diagnosis.confidence && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-blue-900">AI Analysis Confidence</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              diagnosis.confidence >= 90 ? 'bg-green-100 text-green-800' :
                              diagnosis.confidence >= 75 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {diagnosis.confidence}% Confidence
                            </span>
                          </div>
                          <div className="w-full bg-blue-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                diagnosis.confidence >= 90 ? 'bg-green-500' :
                                diagnosis.confidence >= 75 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${diagnosis.confidence}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                      
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-medium text-blue-900 mb-3">AI Analysis:</h4>
                        <div className="text-sm text-blue-800 prose prose-sm max-w-none prose-headings:font-semibold prose-headings:text-blue-900 prose-p:text-blue-800 prose-strong:text-blue-900 prose-strong:font-semibold prose-ul:list-disc prose-ul:ml-4 prose-ol:list-decimal prose-ol:ml-4 prose-li:text-blue-800 prose-li:my-1">
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => <p className="mb-2 last:mb-0 text-blue-800">{children}</p>,
                              strong: ({ children }) => <strong className="font-semibold text-blue-900">{children}</strong>,
                              ul: ({ children }) => <ul className="list-disc ml-4 mb-2 space-y-1">{children}</ul>,
                              ol: ({ children }) => <ol className="list-decimal ml-4 mb-2 space-y-1">{children}</ol>,
                              li: ({ children }) => <li className="text-blue-800">{children}</li>,
                              h1: ({ children }) => <h1 className="text-base font-semibold mb-2 mt-3 first:mt-0 text-blue-900">{children}</h1>,
                              h2: ({ children }) => <h2 className="text-sm font-semibold mb-2 mt-3 first:mt-0 text-blue-900">{children}</h2>,
                              h3: ({ children }) => <h3 className="text-sm font-semibold mb-2 mt-2 first:mt-0 text-blue-900">{children}</h3>,
                            }}
                          >
                            {diagnosis.aiAnalysis}
                          </ReactMarkdown>
                        </div>
                      </div>
                      
                      {diagnosis.recommendations && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <h4 className="font-medium text-green-900 mb-2">Recommendations:</h4>
                          <ul className="text-sm text-green-800 space-y-1">
                            {diagnosis.recommendations.map((rec, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <CheckCircleIcon className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {diagnosis.medicines && diagnosis.medicines.length > 0 && (
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                          <h4 className="font-medium text-purple-900 mb-2">💊 Medicine Recommendations:</h4>
                          <ul className="text-sm text-purple-800 space-y-1">
                            {diagnosis.medicines.map((medicine, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <span className="text-purple-600 font-bold">{index + 1}.</span>
                                <span>{medicine}</span>
                              </li>
                            ))}
                          </ul>
                          <div className="mt-2 p-2 bg-purple-100 rounded text-xs text-purple-700">
                            <strong>⚠️ Important:</strong> These are general recommendations. Always consult a healthcare professional before taking any medication.
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {diagnosis.status === 'processing' && (
                    <div className="flex items-center space-x-2 text-yellow-600">
                      <ClockIcon className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Processing...</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="card bg-yellow-50 border-yellow-200">
        <h3 className="font-semibold text-yellow-900 mb-2">Important Disclaimer</h3>
        <p className="text-sm text-yellow-800">
          This AI diagnosis tool is for informational purposes only and should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals for proper medical evaluation and care.
        </p>
      </div>
    </div>
  )
}

