import { NextRequest, NextResponse } from 'next/server'
import { findUserById, verifyPassword, updateUserPassword } from '../../../../lib/userStore'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, currentPassword, newPassword } = body

    if (!userId || !currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const user = await findUserById(userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const valid = await verifyPassword(user, currentPassword)
    if (!valid) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 })
    }

    const success = await updateUserPassword(userId, newPassword)
    if (!success) {
      return NextResponse.json({ error: 'Failed to update password' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Change password error', error)
    return NextResponse.json({ error: 'Failed to change password' }, { status: 500 })
  }
}


