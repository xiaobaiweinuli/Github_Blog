// 认证验证逻辑
async function checkAuth() {
    try {
        const authData = JSON.parse(localStorage.getItem('gh_auth') || '{}');
        
        // 检查有效期
        if (!authData.expires || authData.expires < Date.now()) {
            throw new Error('登录已过期');
        }

        // 通过OAuthProvider验证token
        const res = await fetch('/admin', {
            headers: { 'Authorization': `Bearer ${authData.token}` }
        });
        
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || 'Token验证失败');
        }
        
        // 获取用户数据
        const userData = await res.json();
        
        // 显示用户信息
        if (document.getElementById('user-info')) {
            document.getElementById('user-info').textContent = `欢迎，${userData.login || authData.user}`;
        }
        
        // 显示管理界面
        if (document.getElementById('auth-check')) {
            document.getElementById('auth-check').style.display = 'none';
        }
        if (document.getElementById('admin-content')) {
            document.getElementById('admin-content').classList.remove('hidden');
        }
        return true;
    } catch (error) {
        console.warn('验证失败:', error);
        logout();
        return false;
    }
}

// 退出登录
function logout() {
    // 获取当前token
    const authData = JSON.parse(localStorage.getItem('gh_auth') || '{}');
    
    // 清除本地存储
    localStorage.removeItem('gh_auth');
    
    // 调用OAuthProvider的退出端点
    if (authData.token) {
        fetch('/oauth/revoke', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: authData.token
            })
        }).catch(err => console.warn('Token撤销失败:', err));
    }
    
    // 重定向到登录页
    window.location.href = '/Github_Blog/login.html';
}

// 页面加载时自动验证
checkAuth();