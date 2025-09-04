import { NextResponse } from 'next/server';
import { getApiEndpoint } from '../../_config/backend';

export const runtime = 'nodejs';
const AUTH_COOKIE = process.env.AUTH_COOKIE_NAME ?? 'auth';
const REFRESH_COOKIE = process.env.REFRESH_COOKIE_NAME ?? 'refresh';

const REFRESH_MAX_AGE = 60 * 60 * 24 * 7;

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password are required' },
      { status: 400 }
    );
  }

  const upstream = await fetch(getApiEndpoint('/auth/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ email, password }),
    cache: 'no-store',
  });
console.log({upstream});

  if (!upstream.ok) {
    const status =
      upstream.status === 401 || upstream.status === 400
        ? upstream.status
        : 502;
    return NextResponse.json({ error: 'Login failed' }, { status });
  }

  const response = await upstream.json();
  const { token, refreshToken } = response.data || response;

  const res = NextResponse.json({ ok: true });

  res.cookies.set({
    name: AUTH_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  if (refreshToken) {
    res.cookies.set({
      name: REFRESH_COOKIE,
      value: refreshToken,
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: REFRESH_MAX_AGE,
    });
  }

  return res;
}
