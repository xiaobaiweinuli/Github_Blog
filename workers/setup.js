// OAuth客户端初始化脚本
import { OAuthHelpers } from "@cloudflare/workers-oauth-provider/helpers";

/**
 * 初始化OAuth客户端
 * 此脚本用于在Worker启动时创建OAuth客户端
 * @param {Object} env - Cloudflare Workers环境变量
 */
async function setupOAuthClient(env) {
  if (!env.BASE_URL) {
    console.warn("警告: 未设置BASE_URL环境变量，将使用默认值");
  }
  
  // 获取OAuth帮助工具
  const helpers = new OAuthHelpers();

  try {
    // 检查客户端是否已存在
    const existingClient = await helpers.getClient("github_blog_client");
    if (existingClient) {
      console.log("OAuth客户端已存在，无需重新创建");
      return existingClient;
    }

    // 创建新的OAuth客户端
    const redirectUrl = new URL("/Github_Blog/auth.html", env.BASE_URL || "http://localhost:3000").toString();
    console.log("正在创建OAuth客户端，重定向URL:", redirectUrl);
    
    const client = await helpers.createClient({
      clientId: "github_blog_client",
      clientName: "GitHub博客系统",
      redirectUris: [redirectUrl],
      allowedScopes: ["read:user"],
      // 对于公共客户端，不设置clientSecret
      isPublic: true
    });

    console.log("OAuth客户端创建成功:", client.clientId);
    return client;
  } catch (error) {
    console.error("OAuth客户端创建失败:", error.message || error);
    if (error.stack) {
      console.debug("错误堆栈:", error.stack);
    }
    throw error; // 向上传播错误，让调用者知道初始化失败
  }
}

export { setupOAuthClient };