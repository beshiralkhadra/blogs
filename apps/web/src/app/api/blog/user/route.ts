import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getApiEndpoint } from '../../_config/backend';

export async function GET() {
  try {
    console.log('User blogs endpoint called');
    const cookieStore = await cookies();
    const token = cookieStore.get(process.env.AUTH_COOKIE_NAME ?? 'auth')?.value;

    console.log('Token extracted:', token ? `${token.substring(0, 20)}...` : 'No token');

    if (!token) {
      console.log('No token found, returning 401');
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const endpoint = getApiEndpoint('/blog/user-blogs');
    console.log('Making request to:', endpoint);

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    console.log('Backend response status:', response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.log('Backend error response:', errorData);
      return NextResponse.json({ error: 'Failed to fetch user blogs' }, { status: response.status });
    }

    const data = await response.json();
    console.log('Backend success response:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in user blogs endpoint:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
