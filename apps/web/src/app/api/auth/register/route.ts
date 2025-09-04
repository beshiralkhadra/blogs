import { NextResponse } from 'next/server';
import { getApiEndpoint } from '../../_config/backend';

export const runtime = 'nodejs';
const AUTH_COOKIE = process.env.AUTH_COOKIE_NAME ?? 'auth';

const AUTH_MAX_AGE = 60 * 15;

export async function POST(req: Request) {
  console.log('Registration request received');
  const { name, email, password } = await req.json().catch(() => ({
    name: '',
    email: '',
    password: ''
  }));

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  if (!name || name.trim().length < 2) {
    return NextResponse.json({ error: 'Name is required and must be at least 2 characters' }, { status: 400 });
  }

  console.log('Registration data:', { name: name.trim(), email, passwordLength: password?.length });

  const upstream = await fetch(getApiEndpoint('/auth/register'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({name: name.trim(), email, password }),
    cache: 'no-store',
  });

  console.log({upstream});


  if (!upstream.ok) {
    const errorData = await upstream.json().catch(() => ({}));
    console.log('Registration error:', { status: upstream.status, errorData });

    // Handle validation errors
    let message = errorData.message || errorData.error || 'Registration failed';
    if (errorData.errors && Array.isArray(errorData.errors)) {
      const validationErrors = errorData.errors.map((err: { msg?: string; message?: string } | string) => 
        typeof err === 'string' ? err : err.msg || err.message || 'Unknown error'
      ).join(', ');
      message = `Validation error: ${validationErrors}`;
      console.log('Validation errors:', errorData.errors);
    }

    const status = upstream.status === 409 || upstream.status === 400 || upstream.status === 422 ? upstream.status : 502;
    return NextResponse.json({ error: message }, { status });
  }

  const responseData = await upstream.json();
  console.log('Registration success:', responseData);

  // API returns { success: true, message: "Registration successful", data: { user, token } }
  const { data } = responseData;
  const { token, user } = data || {};

  const res = NextResponse.json({ ok: true, message: 'Account created successfully', user });

  res.cookies.set({
    name: AUTH_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: AUTH_MAX_AGE,
  });

  // Note: API doesn't return refreshToken, only access token

  return res;
}
