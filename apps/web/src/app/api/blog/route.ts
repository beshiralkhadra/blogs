import { NextRequest, NextResponse } from 'next/server';
import { getBackendApiUrl, getApiEndpoint } from '../_config/backend';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const apiUrl = getBackendApiUrl();
    console.log('Fetching blogs from API:', apiUrl);

    const response = await fetch(getApiEndpoint('/blog/blogs'), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });
console.log({response});

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  console.log('Blog POST route called');
  const body = await req.json();
  const cookieStore = await cookies();
    const token = cookieStore.get(process.env.AUTH_COOKIE_NAME ?? 'auth')?.value;
    
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };

  if (token) {
      headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(getApiEndpoint( '/blog/blogs'), {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
}
