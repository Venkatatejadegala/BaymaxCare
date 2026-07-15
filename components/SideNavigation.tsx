// SideNavigation.tsx
'use client'

import { useState, useEffect } from 'react' // <-- Import useEffect
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
  HeartIcon,
  CameraIcon,
  DocumentTextIcon,
  NewspaperIcon,
  CreditCardIcon,
  BookOpenIcon,
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChartBarIcon,
  VideoCameraIcon,
  TrophyIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'AI Chat', href: '/chat', icon: ChatBubbleLeftRightIcon },
  { name: 'Emergency', href: '/emergency', icon: ExclamationTriangleIcon },
  { name: 'Ayurveda', href: '/ayurveda', icon: HeartIcon },
  { name: 'Diagnosis', href: '/diagnosis', icon: CameraIcon },
  { name: 'Health Analytics', href: '/analytics', icon: ChartBarIcon },
  { name: 'Telemedicine', href: '/telemedicine', icon: VideoCameraIcon },
  { name: 'Health Goals', href: '/goals', icon: TrophyIcon },
  { name: 'Prescriptions', href: '/prescriptions', icon: DocumentTextIcon },
  { name: 'Health News', href: '/news', icon: NewspaperIcon },
  { name: 'Payments', href: '/payments', icon: CreditCardIcon },
  { name: 'Documentation', href: '/documentation', icon: BookOpenIcon },
]

const userMenu = [
  { name: 'Profile', href: '/profile', icon: UserIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
]

export default function SideNavigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [userName, setUserName] = useState('John Doe'); // <-- New state for the user's name
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // Read the user's name from localStorage on component mount
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userSession')
    localStorage.removeItem('userName') // <-- Clear the user's name on logout
    toast.success('Logged out successfully.')
    router.push('/login')
    setIsOpen(false)
    setIsUserMenuOpen(false)
  }

  return (
    <>
      {/* Mobile menu button and overlay remain the same */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          type="button"
          className="bg-white p-2 rounded-md shadow-lg text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>

      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0 lg:z-auto lg:flex-shrink-0
      `}>
        <div className="flex flex-col h-full">
          {/* Logo remains the same */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <Link href="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="text-lg font-bold text-gray-900">BaymaxCare</span>
            </Link>
            <button
              className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-600"
              onClick={() => setIsOpen(false)}
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation remains the same */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors
                    ${isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* User menu */}
          <div className="border-t border-gray-200 p-4">
            <div className="relative">
              <button
                className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <UserIcon className="w-5 h-5 mr-3" />
                <span className="flex-1 text-left">{userName}</span> {/* <-- Display the dynamic name */}
                <ArrowRightOnRectangleIcon className="w-4 h-4" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                  {userMenu.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      onClick={() => {
                        setIsUserMenuOpen(false)
                        setIsOpen(false)
                      }}
                    >
                      <item.icon className="w-4 h-4 mr-3" />
                      {item.name}
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}