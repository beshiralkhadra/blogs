import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getApiEndpoint } from '../../_config/backend';
const AUTH_COOKIE = process.env.AUTH_COOKIE_NAME ?? 'access_token';
const REFRESH_COOKIE = process.env.REFRESH_COOKIE_NAME ?? 'refresh_token';
const AUTH_MAX_AGE = 60 * 15; // 15 minutes

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get(REFRESH_COOKIE)?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: 'No refresh token found' }, { status: 401 });
  }

  try {
    const upstream = await fetch(getApiEndpoint('/auth/refresh-token'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
      cache: 'no-store',
    });

    if (!upstream.ok) {
      return NextResponse.json({ error: 'Failed to refresh token' }, { status: upstream.status });
    }

    const { token: newAccessToken } = await upstream.json();

    const res = NextResponse.json({ ok: true });

    res.cookies.set({
      name: AUTH_COOKIE,
      value: newAccessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: AUTH_MAX_AGE,
    });

    return res;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
