'use client'

import { useState } from 'react'
import Image from 'next/image'
import { 
  CreditCardIcon, 
  BanknotesIcon,
  HeartIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  MinusIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface PaymentMethod {
  id: string
  type: 'card' | 'upi' | 'netbanking' | 'wallet'
  name: string
  lastFour?: string
  expiry?: string
  isDefault: boolean
}

interface ConsultationPackage {
  id: string
  name: string
  description: string
  duration: string
  price: number
  features: string[]
  popular?: boolean
}

interface DonationCause {
  id: string
  title: string
  description: string
  targetAmount: number
  currentAmount: number
  imageUrl?: string
  category: 'medical' | 'research' | 'education' | 'emergency'
}

export default function PaymentIntegration() {
  const [activeTab, setActiveTab] = useState<'consultations' | 'donations' | 'history'>('consultations')
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [donationAmount, setDonationAmount] = useState(0)
  const [selectedCause, setSelectedCause] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<string>('card')

  const paymentMethods: PaymentMethod[] = [
    {
      id: '1',
      type: 'card',
      name: 'Visa **** 1234',
      lastFour: '1234',
      expiry: '12/25',
      isDefault: true
    },
    {
      id: '2',
      type: 'upi',
      name: 'UPI ID',
      isDefault: false
    }
  ]

  const consultationPackages: ConsultationPackage[] = [
    {
      id: '1',
      name: 'Basic Consultation',
      description: '15-minute consultation with AI health assistant',
      duration: '15 minutes',
      price: 299,
      features: [
        'AI-powered symptom analysis',
        'Basic health recommendations',
        'Follow-up summary',
        '24/7 chat support'
      ]
    },
    {
      id: '2',
      name: 'Premium Consultation',
      description: '30-minute consultation with certified doctor',
      duration: '30 minutes',
      price: 799,
      features: [
        'Video consultation with doctor',
        'Detailed health assessment',
        'Prescription if needed',
        'Follow-up consultation',
        'Medical records access'
      ],
      popular: true
    },
    {
      id: '3',
      name: 'Ayurvedic Consultation',
      description: 'Traditional Ayurvedic health assessment',
      duration: '45 minutes',
      price: 1299,
      features: [
        'Dosha assessment',
        'Personalized wellness plan',
        'Herbal recommendations',
        'Lifestyle guidance',
        'Follow-up sessions'
      ]
    },
    {
      id: '4',
      name: 'Emergency Consultation',
      description: 'Immediate consultation for urgent health concerns',
      duration: '20 minutes',
      price: 1999,
      features: [
        'Immediate response',
        'Emergency guidance',
        'Hospital coordination',
        'Family notification',
        'Priority support'
      ]
    }
  ]

  const donationCauses: DonationCause[] = [
    {
      id: '1',
      title: 'Rural Healthcare Initiative',
      description: 'Providing medical care to underserved rural communities',
      targetAmount: 500000,
      currentAmount: 320000,
      imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
      category: 'medical'
    },
    {
      id: '2',
      title: 'Cancer Research Fund',
      description: 'Supporting breakthrough research in cancer treatment',
      targetAmount: 1000000,
      currentAmount: 750000,
      imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400',
      category: 'research'
    },
    {
      id: '3',
      title: 'Mental Health Awareness',
      description: 'Promoting mental health education and support programs',
      targetAmount: 300000,
      currentAmount: 180000,
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      category: 'education'
    },
    {
      id: '4',
      title: 'Disaster Relief Fund',
      description: 'Emergency medical aid for disaster-affected areas',
      targetAmount: 200000,
      currentAmount: 45000,
      imageUrl: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400',
      category: 'emergency'
    }
  ]

  const quickDonationAmounts = [100, 500, 1000, 2500, 5000]

  const processPayment = (type: 'consultation' | 'donation', amount: number) => {
    // Simulate payment processing
    toast.success(`Payment of ₹${amount} processed successfully!`)
    
    if (type === 'consultation') {
      toast.success('Consultation booked! You will receive confirmation details shortly.')
    } else {
      toast.success('Thank you for your generous donation!')
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'medical':
        return 'bg-blue-500'
      case 'research':
        return 'bg-green-500'
      case 'education':
        return 'bg-purple-500'
      case 'emergency':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3">
          <CreditCardIcon className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold">Payments & Donations</h1>
            <p className="text-green-100">Secure payments for consultations and charitable giving</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'consultations', label: 'Consultations', icon: UserGroupIcon },
          { id: 'donations', label: 'Donations', icon: HeartIcon },
          { id: 'history', label: 'Payment History', icon: ClockIcon }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-green-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content based on active tab */}
      {activeTab === 'consultations' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Book a Consultation</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {consultationPackages.map((pkg) => (
              <div key={pkg.id} className={`card relative ${pkg.popular ? 'ring-2 ring-green-500' : ''}`}>
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{pkg.name}</h3>
                    <p className="text-gray-600">{pkg.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ClockIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{pkg.duration}</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">₹{pkg.price}</div>
                  </div>
                  
                  <ul className="space-y-2">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button
                    onClick={() => {
                      setSelectedPackage(pkg.id)
                      processPayment('consultation', pkg.price)
                    }}
                    className="w-full btn-primary"
                  >
                    Book Consultation
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'donations' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Support Health Causes</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {donationCauses.map((cause) => {
              const progress = (cause.currentAmount / cause.targetAmount) * 100
              return (
                <div key={cause.id} className="card">
                  {cause.imageUrl && (
                    <Image 
                      src={cause.imageUrl} 
                      alt={cause.title}
                      width={400}
                      height={192}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(cause.category)} text-white`}>
                        {cause.category}
                      </span>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">
                          ₹{cause.currentAmount.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">
                          of ₹{cause.targetAmount.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">{cause.title}</h3>
                      <p className="text-sm text-gray-600">{cause.description}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Progress</span>
                        <span>{progress.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {quickDonationAmounts.map((amount) => (
                          <button
                            key={amount}
                            onClick={() => {
                              setDonationAmount(amount)
                              setSelectedCause(cause.id)
                            }}
                            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                              donationAmount === amount && selectedCause === cause.id
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            ₹{amount}
                          </button>
                        ))}
                      </div>
                      
                      <div className="flex space-x-2">
                        <input
                          type="number"
                          value={donationAmount || ''}
                          onChange={(e) => setDonationAmount(Number(e.target.value))}
                          placeholder="Custom amount"
                          className="flex-1 input-field"
                        />
                        <button
                          onClick={() => {
                            if (donationAmount > 0) {
                              processPayment('donation', donationAmount)
                              setDonationAmount(0)
                              setSelectedCause(null)
                            } else {
                              toast.error('Please enter a donation amount')
                            }
                          }}
                          className="btn-primary"
                        >
                          Donate
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Payment History</h2>
          
          <div className="card">
            <div className="space-y-4">
              {[
                {
                  id: '1',
                  type: 'consultation',
                  description: 'Premium Consultation - Dr. Sarah Johnson',
                  amount: 799,
                  date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                  status: 'completed'
                },
                {
                  id: '2',
                  type: 'donation',
                  description: 'Rural Healthcare Initiative',
                  amount: 1000,
                  date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                  status: 'completed'
                },
                {
                  id: '3',
                  type: 'consultation',
                  description: 'Ayurvedic Consultation - Dr. Priya Sharma',
                  amount: 1299,
                  date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
                  status: 'completed'
                }
              ].map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      payment.type === 'consultation' ? 'bg-blue-100' : 'bg-green-100'
                    }`}>
                      {payment.type === 'consultation' ? (
                        <UserGroupIcon className="w-5 h-5 text-blue-600" />
                      ) : (
                        <HeartIcon className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{payment.description}</p>
                      <p className="text-sm text-gray-600">
                        {payment.date.toLocaleDateString()} • {payment.date.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">₹{payment.amount}</div>
                    <div className="flex items-center space-x-1 text-green-600">
                      <CheckCircleIcon className="w-4 h-4" />
                      <span className="text-sm">Completed</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Payment Security */}
      <div className="card bg-green-50 border-green-200">
        <div className="flex items-start space-x-3">
          <ShieldCheckIcon className="w-6 h-6 text-green-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-green-900 mb-1">Secure Payment Processing</h3>
            <p className="text-sm text-green-700 mb-2">
              All payments are processed securely using industry-standard encryption and PCI DSS compliance.
            </p>
            <div className="flex items-center space-x-4 text-xs text-green-600">
              <div className="flex items-center space-x-1">
                <LockClosedIcon className="w-3 h-3" />
                <span>SSL Encrypted</span>
              </div>
              <div className="flex items-center space-x-1">
                <ShieldCheckIcon className="w-3 h-3" />
                <span>PCI DSS Compliant</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircleIcon className="w-3 h-3" />
                <span>Fraud Protected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

