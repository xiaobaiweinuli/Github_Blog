
// github_blog_system/frontend/js/navigation.js
document.addEventListener('DOMContentLoaded', function() {
    // 为所有外部链接添加target="_blank"属性
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        if (!link.href.includes('#') && 
            !link.href.startsWith(window.location.origin) && 
            !link.hasAttribute('target')) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });

    // 处理写文章按钮跳转
    const writeArticleBtn = document.querySelector('a[href="admin.html"]');
    if (writeArticleBtn) {
        writeArticleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 检查是否已登录
            if (localStorage.getItem('adminLoggedIn') === 'true') {
                window.location.href = 'admin.html';
            } else {
                // 未登录则跳转到登录页
                window.location.href = 'admin.html#login';
            }
        });
    }

    // 导航菜单事件监听
    const showArticlesBtn = document.getElementById('show-articles');
    const showTagsBtn = document.getElementById('show-tags');
    const showGuestbookBtn = document.getElementById('show-guestbook');
    const showArchiveBtn = document.getElementById('show-archive');
    const showMoviesBtn = document.getElementById('show-movies');
    const showBooksBtn = document.getElementById('show-books');
    const showMusicBtn = document.getElementById('show-music');
    const viewGuestbookBtn = document.getElementById('view-guestbook');

    if (showArticlesBtn) showArticlesBtn.addEventListener('click', () => showSection('articles'));
    if (showTagsBtn) showTagsBtn.addEventListener('click', () => showSection('tags'));
    if (showGuestbookBtn) showGuestbookBtn.addEventListener('click', () => showSection('guestbook'));
    if (showArchiveBtn) showArchiveBtn.addEventListener('click', () => showSection('archive'));
    if (showMoviesBtn) showMoviesBtn.addEventListener('click', () => showSection('movies'));
    if (showBooksBtn) showBooksBtn.addEventListener('click', () => showSection('books'));
    if (showMusicBtn) showMusicBtn.addEventListener('click', () => showSection('music'));
    if (viewGuestbookBtn) viewGuestbookBtn.addEventListener('click', () => {
        window.open('guestbook.html', '_blank');
    });

    // 显示/隐藏部分
    function showSection(sectionId) {
        document.querySelectorAll('main > section').forEach(section => {
            section.classList.add('hidden');
        });
        document.getElementById(sectionId).classList.remove('hidden');
        
        // 根据显示的section加载相应内容
        switch(sectionId) {
            case 'articles':
                loadArticles();
                break;
            case 'tags':
                loadTags();
                break;
            case 'guestbook':
                // 留言板内容已在HTML中
                break;
            case 'archive':
                loadArchive();
                break;
            case 'movies':
                loadMovies();
                break;
            case 'books':
                loadBooks();
                break;
            case 'music':
                loadMusic();
                break;
        }
    }

    // 外部链接处理统一管理
    // 这个函数会被全局调用，用于处理卡片点击时的链接跳转
    window.handleExternalLink = function(url) {
        // 检查URL是否有效
        if (!url) {
            alert('链接为空，无法访问');
            return false;
        }
        
        try {
            // 尝试创建URL对象，如果失败则URL格式无效
            new URL(url);
            
            // 在新窗口打开链接
            window.open(url, '_blank');
            return true;
        } catch (e) {
            alert('链接格式无效，请检查链接地址');
            return false;
        }
    };
    
    // 卡片点击事件委托
    document.addEventListener('click', function(e) {
        // 找到最近的卡片元素
        const movieCard = e.target.closest('.movie-card');
        const bookCard = e.target.closest('.book-card');
        const musicCard = e.target.closest('.music-card');
        
        // 如果点击的是电影卡片
        if (movieCard && !e.target.closest('a') && !e.target.closest('button')) {
            const id = movieCard.getAttribute('data-id');
            if (id) {
                const movies = JSON.parse(localStorage.getItem('movies') || '[]');
                const movie = movies.find(m => m.id === id);
                if (movie && movie.url) {
                    handleExternalLink(movie.url);
                } else {
                    alert('该电影没有链接');
                }
            }
        }
        
        // 如果点击的是书籍卡片
        else if (bookCard && !e.target.closest('a') && !e.target.closest('button')) {
            const id = bookCard.getAttribute('data-id');
            if (id) {
                const books = JSON.parse(localStorage.getItem('books') || '[]');
                const book = books.find(b => b.id === id);
                if (book && book.url) {
                    handleExternalLink(book.url);
                } else {
                    alert('该书籍没有链接');
                }
            }
        }
        
        // 如果点击的是音乐卡片
        else if (musicCard && !e.target.closest('a') && !e.target.closest('button')) {
            const id = musicCard.getAttribute('data-id');
            if (id) {
                const musicList = JSON.parse(localStorage.getItem('music') || '[]');
                const music = musicList.find(m => m.id === id);
                if (music && music.url) {
                    handleExternalLink(music.url);
                } else {
                    alert('该音乐没有链接');
                }
            }
        }
    });

    // 辅助函数（这些在各自的内容加载时调用）
    function loadArticles() {
        // 加载文章列表功能
        const articlesContainer = document.getElementById('articles-container');
        if (!articlesContainer) return;
        
        articlesContainer.innerHTML = '';
        
        const articles = JSON.parse(localStorage.getItem('articles') || '[]')
            .filter(article => !article.isDraft)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        
        if (articles.length === 0) {
            articlesContainer.innerHTML = '<p class="text-center py-8 text-gray-500 dark:text-gray-400">暂无文章</p>';
            return;
        }
        
        articles.forEach(article => {
            const articleElement = document.createElement('article');
            articleElement.className = 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition dark:bg-gray-800 cursor-pointer article-card';
            articleElement.setAttribute('data-id', article.id);
            articleElement.innerHTML = `
                <img src="${article.cover}" alt="${article.title}" class="w-full h-48 object-cover">
                <div class="p-6">
                    <h3 class="text-xl font-bold mb-2 text-gray-800 dark:text-white">${article.title}</h3>
                    <p class="text-gray-600 dark:text-gray-300 mb-4">${article.content.substring(0, 60)}...</p>
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-500">${article.date}</span>
                        <a href="sample-article.html?id=${article.id}" class="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">阅读更多 →</a>
                    </div>
                </div>
            `;
            articlesContainer.appendChild(articleElement);
        });
    }

    function loadTags() {
        // 加载标签云功能
        const tagsContainer = document.getElementById('tags-container');
        if (!tagsContainer) return;
        
        tagsContainer.innerHTML = '';
        
        const articles = JSON.parse(localStorage.getItem('articles') || '[]')
            .filter(article => !article.isDraft);
        const tagCounts = {};
        
        articles.forEach(article => {
            if (article.tags && Array.isArray(article.tags)) {
                article.tags.forEach(tag => {
                    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                });
            }
        });
        
        Object.entries(tagCounts).forEach(([tag, count]) => {
            const tagElement = document.createElement('span');
            tagElement.className = 'px-3 py-1 bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition dark:bg-blue-900 dark:text-blue-200 cursor-pointer tag-filter';
            tagElement.textContent = `${tag} (${count})`;
            tagElement.addEventListener('click', () => filterByTag(tag));
            tagsContainer.appendChild(tagElement);
        });
    }

    function loadMovies() {
        // 加载电影列表功能
        const moviesContainer = document.getElementById('movies-container');
        if (!moviesContainer) return;
        
        moviesContainer.innerHTML = '';
        
        const movies = JSON.parse(localStorage.getItem('movies') || '[]')
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        
        if (movies.length === 0) {
            moviesContainer.innerHTML = '<p class="text-center py-8 text-gray-500 dark:text-gray-400">暂无电影收藏</p>';
            return;
        }
        
        movies.forEach(movie => {
            const movieElement = document.createElement('div');
            movieElement.className = 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition dark:bg-gray-800 cursor-pointer movie-card';
            movieElement.setAttribute('data-id', movie.id);
            movieElement.innerHTML = `
                <img src="${movie.poster}" alt="${movie.title}" class="w-full h-48 object-cover">
                <div class="p-6">
                    <h3 class="text-xl font-bold mb-2 text-gray-800 dark:text-white">${movie.title}</h3>
                    <p class="text-gray-600 dark:text-gray-300 mb-1">导演: ${movie.director}</p>
                    <p class="text-gray-600 dark:text-gray-300 mb-1">年份: ${movie.year}</p>
                    ${movie.rating ? `<p class="text-gray-600 dark:text-gray-300 mb-4">评分: ${movie.rating}/10</p>` : ''}
                </div>
            `;
            moviesContainer.appendChild(movieElement);
        });
    }

    function loadBooks() {
        // 加载书籍列表功能
        const booksContainer = document.getElementById('books-container');
        if (!booksContainer) return;
        
        booksContainer.innerHTML = '';
        
        const books = JSON.parse(localStorage.getItem('books') || '[]')
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        
        if (books.length === 0) {
            booksContainer.innerHTML = '<p class="text-center py-8 text-gray-500 dark:text-gray-400">暂无书籍收藏</p>';
            return;
        }
        
        books.forEach(book => {
            const bookElement = document.createElement('div');
            bookElement.className = 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition dark:bg-gray-800 cursor-pointer book-card';
            bookElement.setAttribute('data-id', book.id);
            bookElement.innerHTML = `
                <img src="${book.cover}" alt="${book.title}" class="w-full h-48 object-cover">
                <div class="p-6">
                    <h3 class="text-xl font-bold mb-2 text-gray-800 dark:text-white">${book.title}</h3>
                    <p class="text-gray-600 dark:text-gray-300 mb-1">作者: ${book.author}</p>
                    ${book.year ? `<p class="text-gray-600 dark:text-gray-300 mb-1">出版年份: ${book.year}</p>` : ''}
                    <p class="text-gray-600 dark:text-gray-300 mb-4">状态: ${book.status}</p>
                </div>
            `;
            booksContainer.appendChild(bookElement);
        });
    }

    function loadMusic() {
        // 加载音乐列表功能
        const musicContainer = document.getElementById('music-container');
        if (!musicContainer) return;
        
        musicContainer.innerHTML = '';
        
        const music = JSON.parse(localStorage.getItem('music') || '[]')
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        
        if (music.length === 0) {
            musicContainer.innerHTML = '<p class="text-center py-8 text-gray-500 dark:text-gray-400">暂无音乐收藏</p>';
            return;
        }
        
        music.forEach(m => {
            const musicElement = document.createElement('div');
            musicElement.className = 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition dark:bg-gray-800 cursor-pointer music-card';
            musicElement.setAttribute('data-id', m.id);
            musicElement.innerHTML = `
                <img src="${m.cover}" alt="${m.title}" class="w-full h-48 object-cover">
                <div class="p-6">
                    <h3 class="text-xl font-bold mb-2 text-gray-800 dark:text-white">${m.title}</h3>
                    <p class="text-gray-600 dark:text-gray-300 mb-1">艺术家: ${m.artist}</p>
                    ${m.album ? `<p class="text-gray-600 dark:text-gray-300 mb-1">专辑: ${m.album}</p>` : ''}
                    ${m.year ? `<p class="text-gray-600 dark:text-gray-300 mb-1">年份: ${m.year}</p>` : ''}
                </div>
            `;
            musicContainer.appendChild(musicElement);
        });
    }

    function loadArchive() {
        // 加载归档功能
        const archiveList = document.getElementById('archive-list');
        if (!archiveList) return;
        
        archiveList.innerHTML = '';
        
        const articles = JSON.parse(localStorage.getItem('articles') || '[]')
            .filter(article => !article.isDraft);
        const archiveData = {};
        
        articles.forEach(article => {
            const date = new Date(article.date);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            
            if (!archiveData[year]) {
                archiveData[year] = {};
            }
            
            if (!archiveData[year][month]) {
                archiveData[year][month] = [];
            }
            
            archiveData[year][month].push(article);
        });
        
        // 按年月排序
        const sortedYears = Object.keys(archiveData).sort((a, b) => b - a);
        
        sortedYears.forEach(year => {
            const sortedMonths = Object.keys(archiveData[year]).sort((a, b) => b - a);
            
            sortedMonths.forEach(month => {
                const monthName = new Date(year, month - 1, 1).toLocaleString('zh-CN', { month: 'long' });
                const count = archiveData[year][month].length;
                
                const li = document.createElement('li');
                li.innerHTML = `
                    <button class="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 archive-filter" data-year="${year}" data-month="${month}">
                        ${year}年${monthName} (${count})
                    </button>
                `;
                li.querySelector('.archive-filter').addEventListener('click', () => filterByArchive(year, month));
                archiveList.appendChild(li);
            });
        });
    }

    function filterByTag(tag) {
        // 按标签过滤文章
        const articles = JSON.parse(localStorage.getItem('articles') || '[]')
            .filter(article => !article.isDraft && article.tags && article.tags.includes(tag));
        
        // 显示文章部分
        showSection('articles');
        
        const articlesContainer = document.getElementById('articles-container');
        articlesContainer.innerHTML = '';
        
        if (articles.length === 0) {
            articlesContainer.innerHTML = `<p class="text-center py-8 text-gray-500 dark:text-gray-400">没有找到带有"${tag}"标签的文章</p>`;
            return;
        }
        
        articles.forEach(article => {
            const articleElement = document.createElement('article');
            articleElement.className = 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition dark:bg-gray-800 cursor-pointer article-card';
            articleElement.setAttribute('data-id', article.id);
            articleElement.innerHTML = `
                <img src="${article.cover}" alt="${article.title}" class="w-full h-48 object-cover">
                <div class="p-6">
                    <h3 class="text-xl font-bold mb-2 text-gray-800 dark:text-white">${article.title}</h3>
                    <p class="text-gray-600 dark:text-gray-300 mb-4">${article.content.substring(0, 60)}...</p>
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-500">${article.date}</span>
                        <a href="sample-article.html?id=${article.id}" class="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">阅读更多 →</a>
                    </div>
                </div>
            `;
            articlesContainer.appendChild(articleElement);
        });
    }

    function filterByArchive(year, month) {
        // 按归档过滤文章
        const articles = JSON.parse(localStorage.getItem('articles') || '[]')
            .filter(article => {
                const articleDate = new Date(article.date);
                return !article.isDraft && 
                       articleDate.getFullYear() === parseInt(year) && 
                       articleDate.getMonth() + 1 === parseInt(month);
            });
        
        // 显示文章部分
        showSection('articles');
        
        const articlesContainer = document.getElementById('articles-container');
        articlesContainer.innerHTML = '';
        
        if (articles.length === 0) {
            const monthName = new Date(year, month - 1, 1).toLocaleString('zh-CN', { month: 'long' });
            articlesContainer.innerHTML = `<p class="text-center py-8 text-gray-500 dark:text-gray-400">没有找到${year}年${monthName}的文章</p>`;
            return;
        }
        
        articles.forEach(article => {
            const articleElement = document.createElement('article');
            articleElement.className = 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition dark:bg-gray-800 cursor-pointer article-card';
            articleElement.setAttribute('data-id', article.id);
            articleElement.innerHTML = `
                <img src="${article.cover}" alt="${article.title}" class="w-full h-48 object-cover">
                <div class="p-6">
                    <h3 class="text-xl font-bold mb-2 text-gray-800 dark:text-white">${article.title}</h3>
                    <p class="text-gray-600 dark:text-gray-300 mb-4">${article.content.substring(0, 60)}...</p>
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-500">${article.date}</span>
                        <a href="sample-article.html?id=${article.id}" class="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">阅读更多 →</a>
                    </div>
                </div>
            `;
            articlesContainer.appendChild(articleElement);
        });
    }
});
