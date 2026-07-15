'use client'
// app/(main)/settings/page.tsx
import MainLayout from '../../../components/MainLayout';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [userId, setUserId] = useState<string | null>(typeof window !== 'undefined' ? localStorage.getItem('userId') : null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [bloodType, setBloodType] = useState('')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleUpdateProfile = async () => {
    if (!userId) {
      toast.error('User not logged in')
      return
    }
    try {
      const res = await fetch('/api/user/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, name, phone, dateOfBirth, bloodType })
      })
      if (!res.ok) throw new Error('Update failed')
      toast.success('Profile updated')
      if (name) localStorage.setItem('userName', name)
    } catch (e) {
      toast.error('Failed to update profile')
    }
  }

  const handleChangePassword = async () => {
    if (!userId) {
      toast.error('User not logged in')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    try {
      const res = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, currentPassword, newPassword })
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Change password failed')
      }
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      toast.success('Password changed successfully')
    } catch (e: any) {
      toast.error(e.message || 'Failed to change password')
    }
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center space-x-3">
          <Cog6ToothIcon className="w-8 h-8 text-gray-500" />
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input className="input-field" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input type="date" className="input-field" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
                <input className="input-field" value={bloodType} onChange={(e) => setBloodType(e.target.value)} placeholder="e.g., O+" />
              </div>
              <button onClick={handleUpdateProfile} className="btn-primary">Save Changes</button>
            </div>
          </div>

          {/* Change Password */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input type="password" className="input-field" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Current password" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input type="password" className="input-field" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input type="password" className="input-field" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" />
              </div>
              <button onClick={handleChangePassword} className="btn-primary">Update Password</button>
              <p className="text-xs text-gray-500">Password must be at least 8 characters.</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-2">Security Tips</h2>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            <li>Use a strong, unique password</li>
            <li>Do not share your credentials with anyone</li>
            <li>Update your password regularly</li>
          </ul>
        </div>
      </div>
    </MainLayout>
  );
}