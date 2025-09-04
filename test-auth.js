// Simple test script to check authentication flow

async function testAuth() {
  const fetch = (await import('node-fetch')).default;
  console.log('Testing authentication flow...');
  
  // Test login
  console.log('\n1. Testing login...');
  const loginResponse = await fetch('http://localhost:3002/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'test@example.com',
      password: 'testpassword123'
    })
  });
  
  console.log('Login status:', loginResponse.status);
  console.log('Login headers:', loginResponse.headers.raw());
  
  const loginData = await loginResponse.json();
  console.log('Login response:', loginData);
  
  // Extract cookies
  const cookies = loginResponse.headers.get('set-cookie');
  console.log('Set-Cookie header:', cookies);
  
  if (cookies) {
    // Test authenticated request
    console.log('\n2. Testing authenticated request...');
    const blogResponse = await fetch('http://localhost:3002/api/blog', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Cookie': cookies
      },
      body: JSON.stringify({
        title: 'Test Blog',
        content: 'This is a test blog post'
      })
    });
    
    console.log('Blog creation status:', blogResponse.status);
    const blogData = await blogResponse.json();
    console.log('Blog creation response:', blogData);
  }
}

testAuth().catch(console.error);
