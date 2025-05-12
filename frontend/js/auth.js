// 认证验证逻辑
async function checkAuth() {
    try {
        const authData = JSON.parse(localStorage.getItem('gh_auth') || '{}');
        
        // 检查有效期
        if (!authData.expires || authData.expires < Date.now()) {
            throw new Error('登录已过期');
        }

        // 验证GitHub用户
        const res = await fetch('https://api.github.com/user', {
            headers: { 'Authorization': `Bearer ${authData.token}` }
        });
        
        if (!res.ok) throw new Error('Token验证失败');
        
        const userData = await res.json();
        if (userData.login !== 'ALLOWED_USER_PLACEHOLDER') {
            throw new Error('无访问权限');
        }

        // 显示管理界面
        document.getElementById('auth-check').style.display = 'none';
        document.getElementById('admin-content').classList.remove('hidden');
        return true;
    } catch (error) {
        console.warn('验证失败:', error);
        logout();
        return false;
    }
}

// 退出登录
function logout() {
    localStorage.removeItem('gh_auth');
    window.location.href = '/Github_Blog/login.html';
}

// 页面加载时自动验证
checkAuth();