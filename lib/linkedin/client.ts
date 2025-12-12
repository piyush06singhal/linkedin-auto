// LinkedIn API Client

const LINKEDIN_API_BASE = 'https://api.linkedin.com/v2'

export interface LinkedInProfile {
  id: string
  firstName: string
  lastName: string
  profilePicture?: string
}

export interface LinkedInPost {
  author: string
  lifecycleState: string
  specificContent: {
    'com.linkedin.ugc.ShareContent': {
      shareCommentary: {
        text: string
      }
      shareMediaCategory: string
    }
  }
  visibility: {
    'com.linkedin.ugc.MemberNetworkVisibility': string
  }
}

export class LinkedInClient {
  private accessToken: string

  constructor(accessToken: string) {
    this.accessToken = accessToken
  }

  // Get user profile
  async getProfile(): Promise<LinkedInProfile> {
    const response = await fetch(`${LINKEDIN_API_BASE}/me`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch LinkedIn profile')
    }

    return response.json()
  }

  // Create a post
  async createPost(text: string, userId: string): Promise<any> {
    const postData = {
      author: `urn:li:person:${userId}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: text,
          },
          shareMediaCategory: 'NONE',
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
      },
    }

    const response = await fetch(`${LINKEDIN_API_BASE}/ugcPosts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify(postData),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to create LinkedIn post: ${error}`)
    }

    return response.json()
  }

  // Get post statistics
  async getPostStats(postId: string): Promise<any> {
    const response = await fetch(
      `${LINKEDIN_API_BASE}/socialActions/${postId}/statistics`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch post statistics')
    }

    return response.json()
  }
}

// OAuth helper functions
export function getLinkedInAuthUrl(state: string): string {
  const clientId = process.env.LINKEDIN_CLIENT_ID
  const redirectUri = process.env.LINKEDIN_REDIRECT_URI
  
  console.log('🔑 LinkedIn OAuth Config:', {
    clientId,
    redirectUri,
    state
  })
  
  if (!clientId || !redirectUri) {
    throw new Error('LinkedIn OAuth not configured. Missing CLIENT_ID or REDIRECT_URI')
  }
  
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    state: state,
    scope: 'openid profile email w_member_social',
  })

  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`
  console.log('🔗 Generated OAuth URL:', authUrl)
  
  return authUrl
}

export async function exchangeCodeForToken(code: string): Promise<{
  access_token: string
  expires_in: number
  refresh_token?: string
}> {
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code: code,
    client_id: process.env.LINKEDIN_CLIENT_ID!,
    client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
    redirect_uri: process.env.LINKEDIN_REDIRECT_URI!,
  })

  const response = await fetch(
    'https://www.linkedin.com/oauth/v2/accessToken',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to exchange code for token: ${error}`)
  }

  return response.json()
}
