import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for API keys (in production, use a database)
let apiKeys: { [key: string]: string } = {}

export async function POST(request: NextRequest) {
  try {
    const { key, value } = await request.json()
    
    if (!key || !value) {
      return NextResponse.json(
        { error: 'Key and value are required' },
        { status: 400 }
      )
    }
    
    // Store the API key
    apiKeys[key] = value
    
    console.log(`API key stored: ${key}`)
    
    return NextResponse.json({ 
      success: true, 
      message: 'API key stored successfully' 
    })
    
  } catch (error) {
    console.error('Error storing API key:', error)
    return NextResponse.json(
      { error: 'Failed to store API key' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')
    
    if (!key) {
      return NextResponse.json(
        { error: 'Key parameter is required' },
        { status: 400 }
      )
    }
    
    const value = apiKeys[key]
    
    if (!value) {
      return NextResponse.json(
        { error: 'API key not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ 
      key, 
      value: value.substring(0, 10) + '...' // Only show first 10 characters for security
    })
    
  } catch (error) {
    console.error('Error retrieving API key:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve API key' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')
    
    if (!key) {
      return NextResponse.json(
        { error: 'Key parameter is required' },
        { status: 400 }
      )
    }
    
    delete apiKeys[key]
    
    return NextResponse.json({ 
      success: true, 
      message: 'API key deleted successfully' 
    })
    
  } catch (error) {
    console.error('Error deleting API key:', error)
    return NextResponse.json(
      { error: 'Failed to delete API key' },
      { status: 500 }
    )
  }
}
