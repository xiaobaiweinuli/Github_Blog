addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const headers = new Headers({
    'Access-Control-Allow-Origin': 'https://bxiao.github.io',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Credentials': 'true'
  });

  // 处理预检请求
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  // 处理初始授权请求
  if (url.pathname === '/') {
    const state = crypto.randomUUID();
    const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
    githubAuthUrl.searchParams.set('client_id', GITHUB_CLIENT_ID);
    githubAuthUrl.searchParams.set('redirect_uri', `${url.origin}/auth/token`);
    githubAuthUrl.searchParams.set('scope', 'read:user');
    githubAuthUrl.searchParams.set('state', state);
    headers.set('Location', githubAuthUrl.toString());
    headers.set('Set-Cookie', `github_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=300`);
    return new Response(null, { status: 302, headers });
  }

  // 处理回调验证
  if (url.pathname === '/auth/token') {
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const cookies = request.headers.get('Cookie');
    const savedState = cookies?.split('; ').find(c => c.trim().startsWith('github_state='))?.split('=')[1]?.trim();

    if (!code) {
      return new Response(JSON.stringify({ error: 'missing_code' }), { status: 400, headers });
    }
    if (!state || !savedState || state !== savedState) {
      headers.set('Set-Cookie', 'github_state=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
      return new Response(JSON.stringify({ error: 'invalid_state' }), { status: 400, headers });
    }
    headers.set('Set-Cookie', 'github_state=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');

    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code: code
      })
    });

    const tokenData = await tokenResponse.json();
    return new Response(JSON.stringify(tokenData), { headers: { 'Content-Type': 'application/json' } });
  }
  return new Response('未找到路径', { status: 404 });
}