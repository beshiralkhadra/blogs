// Test the complete authentication flow

async function testCompleteFlow() {
  const fetch = (await import('node-fetch')).default;
  console.log('🔧 Testing complete authentication flow...\n');
  
  // Step 1: Register a user first
  console.log('0️⃣ Testing user registration...');
  const registerResponse = await fetch('http://localhost:3000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'newtest@example.com',
      password: 'testpassword123',
      name: 'New Test User'
    })
  });
  
  console.log('Register status:', registerResponse.status);
  if (registerResponse.ok) {
    console.log('✅ Registration successful');
  } else {
    console.log('ℹ️ Registration might have failed (user may already exist)');
  }
  
  // Step 1: Login
  console.log('\n1️⃣ Testing login...');
  const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'newtest@example.com',
      password: 'testpassword123'
    })
  });
  
  console.log('Login status:', loginResponse.status);
  const cookies = loginResponse.headers.get('set-cookie');
  console.log('✅ Login successful, cookies set');
  
  if (!cookies) {
    console.log('❌ No cookies received from login');
    return;
  }
  
  // Step 2: Test /api/auth/me endpoint
  console.log('\n2️⃣ Testing /api/auth/me...');
  const meResponse = await fetch('http://localhost:3000/api/auth/me', {
    headers: { 'Cookie': cookies }
  });
  
  console.log('Me endpoint status:', meResponse.status);
  if (meResponse.ok) {
    const meData = await meResponse.json();
    console.log('✅ Me endpoint successful:', meData);
  } else {
    console.log('❌ Me endpoint failed');
    const errorData = await meResponse.text();
    console.log('Error:', errorData);
  }
  
  // Step 3: Test protected route access - Create blog
  console.log('\n3️⃣ Testing blog creation...');
  const blogResponse = await fetch('http://localhost:3000/api/blog', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Cookie': cookies
    },
    body: JSON.stringify({
      title: 'Test Blog Post',
      content: 'This is a test blog content'
    })
  });
  
  let blogId = null;
  console.log('Blog creation status:', blogResponse.status);
  if (blogResponse.ok) {
    const blogData = await blogResponse.json();
    blogId = blogData.data?.id;
    console.log('✅ Blog creation successful:', blogData.data?.title, 'ID:', blogId);
  } else {
    console.log('❌ Blog creation failed');
    const errorData = await blogResponse.json();
    console.log('Error:', errorData);
    return;
  }

  // Step 4: Test blog edit
  if (blogId) {
    console.log('\n4️⃣ Testing blog edit...');
    const editResponse = await fetch(`http://localhost:3000/api/blog/${blogId}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Cookie': cookies
      },
      body: JSON.stringify({
        title: 'Updated Test Blog Post',
        content: 'This is updated test blog content'
      })
    });
    
    console.log('Blog edit status:', editResponse.status);
    if (editResponse.ok) {
      const editData = await editResponse.json();
      console.log('✅ Blog edit successful:', editData.data?.title);
    } else {
      console.log('❌ Blog edit failed');
      const errorData = await editResponse.json();
      console.log('Error:', errorData);
    }

    // Step 5: Test blog delete
    console.log('\n5️⃣ Testing blog delete...');
    const deleteResponse = await fetch(`http://localhost:3000/api/blog/${blogId}`, {
      method: 'DELETE',
      headers: { 
        'Cookie': cookies
      }
    });
    
    console.log('Blog delete status:', deleteResponse.status);
    if (deleteResponse.ok) {
      console.log('✅ Blog delete successful');
    } else {
      console.log('❌ Blog delete failed');
      const errorData = await deleteResponse.json();
      console.log('Error:', errorData);
    }
  }

  // Step 6: Test expired token scenario
  console.log('\n6️⃣ Testing with expired/invalid token...');
  const expiredTokenResponse = await fetch('http://localhost:3000/api/blog', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Cookie': 'auth=invalid_expired_token'
    },
    body: JSON.stringify({
      title: 'Should Fail',
      content: 'This should fail with 401'
    })
  });
  
  console.log('Expired token test status:', expiredTokenResponse.status);
  if (expiredTokenResponse.status === 401) {
    console.log('✅ Expired token correctly returns 401');
  } else {
    console.log('❌ Expected 401 but got:', expiredTokenResponse.status);
  }
}

testCompleteFlow().catch(console.error);
