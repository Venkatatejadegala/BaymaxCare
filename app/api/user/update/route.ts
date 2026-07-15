import { NextRequest, NextResponse } from 'next/server'
import { findUserById, updateUser } from '../../../../lib/userStore'

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, name } = body

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const user = await findUserById(userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const updated = await updateUser(userId, { name })

    if (!updated) {
      return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
    }

    return NextResponse.json({ user: { id: updated.id, email: updated.email, name: updated.name } })
  } catch (error: any) {
    console.error('Update user error', error)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}


