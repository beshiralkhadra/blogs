import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const AUTH_COOKIE = process.env.AUTH_COOKIE_NAME ?? 'auth';
const REFRESH_COOKIE = process.env.REFRESH_COOKIE_NAME ?? 'refresh';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set({ name: AUTH_COOKIE, value: '', path: '/', maxAge: 0 });
  res.cookies.set({ name: REFRESH_COOKIE, value: '', path: '/', maxAge: 0 });
  return res;
}
