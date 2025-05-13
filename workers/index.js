import { OAuthProvider } from "@cloudflare/workers-oauth-provider";
import { WorkerEntrypoint } from "cloudflare:workers";
import { setupOAuthClient } from "./setup.js";

// 定义API处理程序
class ApiHandler extends WorkerEntrypoint {
  async fetch(request, env, ctx) {
    // 从上下文中获取已认证用户
    const user = ctx.get('user'); 
    const allowedUsers = env.ALLOWED_USERS?.split(',') || [];
    
    // 处理CORS预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400'
        }
      });
    }
    
    // 验证用户权限
    if (!allowedUsers.includes(user.login)) {
      return new Response(JSON.stringify({ error: '无访问权限' }), { 
        status: 403, 
        headers: { 
          'Content-Type': 'application/json', 
          'Access-Control-Allow-Origin': '*' 
        } 
      });
    }
    
    // 返回用户信息
    return new Response(JSON.stringify(user), { 
      headers: { 
        'Content-Type': 'application/json', 
        'Access-Control-Allow-Origin': '*' 
      } 
    });
  }
}

// 定义默认处理程序
const defaultHandler = {
  async fetch(request) {
    // 处理CORS预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400'
        }
      });
    }
    
    // 原有静态文件服务逻辑，添加CORS头支持跨域
    const response = await fetch(request);
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...Object.fromEntries(response.headers),
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  }
};

// 初始化OAuthProvider
const oauthProvider = new OAuthProvider({
  // API路由配置
  apiRoute: ["/admin"],
  apiHandler: ApiHandler,
  defaultHandler,
  
  // OAuth端点配置
  authorizeEndpoint: "/Github_Blog/authorize",
  tokenEndpoint: "/oauth/token",
  
  // GitHub OAuth配置
  scopesSupported: ["read:user"],
  allowImplicitFlow: false,
  
  // 禁止公共客户端注册
  disallowPublicClientRegistration: true
});

// 添加启动钩子，确保在Worker启动时初始化OAuth客户端
oauthProvider.addEventListener('start', async (event) => {
  try {
    await setupOAuthClient(event.env);
    console.log('OAuth客户端初始化完成');
  } catch (error) {
    console.error('OAuth客户端初始化失败:', error.message || error);
    // 记录详细错误堆栈以便调试
    if (error.stack) {
      console.debug('错误堆栈:', error.stack);
    }
  }
});

export default oauthProvider;