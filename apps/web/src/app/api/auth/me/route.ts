import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getApiEndpoint } from '../../_config/backend';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(process.env.AUTH_COOKIE_NAME ?? 'auth')?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const response = await fetch(getApiEndpoint('/auth/me'), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const data = await response.json();
    console.log('Me endpoint response:', data);

    return NextResponse.json({ user: data.data || data.user || null });
  } catch (error) {
    console.error('Error in me endpoint:', error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
