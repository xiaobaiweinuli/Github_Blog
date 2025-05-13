addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const headers = new Headers();

  // 处理初始授权请求
  if (url.pathname === '/') {
    const state = crypto.randomUUID();
    const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
    githubAuthUrl.searchParams.set('client_id', GITHUB_CLIENT_ID);
    githubAuthUrl.searchParams.set('redirect_uri', `${url.origin}/auth/token`);
    githubAuthUrl.searchParams.set('scope', 'read:user');
    githubAuthUrl.searchParams.set('state', state);
    headers.set('Location', githubAuthUrl.toString());
    headers.set('Set-Cookie', `github_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=3600`);
    return new Response(null, { status: 302, headers });
  }

  // 处理回调验证
  if (url.pathname === '/auth/token') {
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const cookies = request.headers.get('Cookie');
    const savedState = cookies?.split('; ').find(c => c.startsWith('github_state='))?.split('=')[1];

    if (!code) {
      return new Response('缺少code参数', { status: 400 });
    }
    if (!state || !savedState || state !== savedState) {
      headers.set('Set-Cookie', 'github_state=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
      return new Response('无效的state参数', { status: 400 });
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