// github_blog_system/frontend/js/storage.js
document.addEventListener('DOMContentLoaded', function() {
    // 检查管理员权限
    function checkAdminPermission() {
        const username = localStorage.getItem('adminUsername');
        const password = localStorage.getItem('adminPassword');
        return username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_SECRET;
    }

    // 保存草稿功能
    const saveDraftBtn = document.getElementById('save-draft');
    if (saveDraftBtn) {
        saveDraftBtn.addEventListener('click', function() {
            if (!checkAdminPermission()) {
                alert('请先登录管理员账号！');
                return;
            }
            saveArticle(true);
        });
    }

    // 发布文章功能
    const publishBtn = document.getElementById('publish-article');
    if (publishBtn) {
        publishBtn.addEventListener('click', function() {
            if (!checkAdminPermission()) {
                alert('请先登录管理员账号！');
                return;
            }
            saveArticle(false);
        });
    }

    // 保存文章函数
    function saveArticle(isDraft) {
        const id = document.getElementById('article-id').value || Date.now().toString();
        const title = document.getElementById('article-title').value;
        const tags = document.getElementById('article-tags').value.split(',').map(tag => tag.trim());
        const cover = document.getElementById('cover-preview').src;
        const content = document.getElementById('markdown-editor').value;
        const date = new Date().toISOString().split('T')[0];

        if (!title || !content) {
            alert('标题和内容不能为空！');
            return;
        }

        const article = { id, title, tags, cover, content, date, isDraft };
        let articles = JSON.parse(localStorage.getItem('articles')) || [];
        
        // 更新或添加文章
        const index = articles.findIndex(a => a.id === id);
        if (index !== -1) {
            articles[index] = article;
        } else {
            articles.push(article);
        }

        localStorage.setItem('articles', JSON.stringify(articles));
        alert(isDraft ? '草稿保存成功！' : '文章发布成功！');
        loadArticlesList();
    }

    // 添加电影功能
    const addMovieBtn = document.getElementById('add-movie');
    if (addMovieBtn) {
        addMovieBtn.addEventListener('click', function() {
            if (!checkAdminPermission()) {
                alert('请先登录管理员账号！');
                return;
            }
            saveMovie();
        });
    }

    // 保存电影函数
    function saveMovie() {
        const id = document.getElementById('movie-id').value || Date.now().toString();
        const title = document.getElementById('movie-title').value;
        const director = document.getElementById('movie-director').value;
        const year = document.getElementById('movie-year').value;
        const url = document.getElementById('movie-url').value;
        const rating = document.getElementById('movie-rating').value;
        const review = document.getElementById('movie-review').value;
        const poster = document.getElementById('movie-poster-preview').src;
        const date = new Date().toISOString().split('T')[0];

        if (!title || !director || !year) {
            alert('电影名称、导演和年份不能为空！');
            return;
        }

        const movie = { id, title, director, year, url, rating, review, poster, date };
        let movies = JSON.parse(localStorage.getItem('movies')) || [];
        
        // 更新或添加电影
        const index = movies.findIndex(m => m.id === id);
        if (index !== -1) {
            movies[index] = movie;
        } else {
            movies.push(movie);
        }

        localStorage.setItem('movies', JSON.stringify(movies));
        alert('电影保存成功！');
        loadMoviesList();
    }

    // 添加书籍功能
    const addBookBtn = document.getElementById('add-book');
    if (addBookBtn) {
        addBookBtn.addEventListener('click', function() {
            if (!checkAdminPermission()) {
                alert('请先登录管理员账号！');
                return;
            }
            saveBook();
        });
    }

    // 保存书籍函数
    function saveBook() {
        const id = document.getElementById('book-id').value || Date.now().toString();
        const title = document.getElementById('book-title').value;
        const author = document.getElementById('book-author').value;
        const year = document.getElementById('book-year').value;
        const url = document.getElementById('book-url').value;
        const status = document.getElementById('book-status').value;
        const review = document.getElementById('book-review').value;
        const cover = document.getElementById('book-cover-preview').src;
        const date = new Date().toISOString().split('T')[0];

        if (!title || !author) {
            alert('书名和作者不能为空！');
            return;
        }

        const book = { id, title, author, year, url, status, review, cover, date };
        let books = JSON.parse(localStorage.getItem('books')) || [];
        
        // 更新或添加书籍
        const index = books.findIndex(b => b.id === id);
        if (index !== -1) {
            books[index] = book;
        } else {
            books.push(book);
        }

        localStorage.setItem('books', JSON.stringify(books));
        alert('书籍保存成功！');
        loadBooksList();
    }

    // 添加音乐功能
    const addMusicBtn = document.getElementById('add-music');
    if (addMusicBtn) {
        addMusicBtn.addEventListener('click', function() {
            if (!checkAdminPermission()) {
                alert('请先登录管理员账号！');
                return;
            }
            saveMusic();
        });
    }

    // 保存音乐函数
    function saveMusic() {
        const id = document.getElementById('music-id').value || Date.now().toString();
        const title = document.getElementById('music-title').value;
        const artist = document.getElementById('music-artist').value;
        const album = document.getElementById('music-album').value;
        const year = document.getElementById('music-year').value;
        const url = document.getElementById('music-url').value;
        const cover = document.getElementById('music-cover-preview').src;
        const date = new Date().toISOString().split('T')[0];

        if (!title || !artist || !url) {
            alert('歌曲名称、艺术家和音乐URL不能为空！');
            return;
        }

        const music = { id, title, artist, album, year, url, cover, date };
        let musicList = JSON.parse(localStorage.getItem('music')) || [];
        
        // 更新或添加音乐
        const index = musicList.findIndex(m => m.id === id);
        if (index !== -1) {
            musicList[index] = music;
        } else {
            musicList.push(music);
        }

        localStorage.setItem('music', JSON.stringify(musicList));
        alert('音乐保存成功！');
        loadMusicList();
    }

    // 删除电影功能
    window.deleteMovie = function(id) {
        if (!checkAdminPermission()) {
            alert('请先登录管理员账号！');
            return;
        }
        if (confirm('确定要删除这部电影吗？')) {
            let movies = JSON.parse(localStorage.getItem('movies')) || [];
            movies = movies.filter(movie => movie.id !== id);
            localStorage.setItem('movies', JSON.stringify(movies));
            loadMoviesList();
        }
    };

    // 删除书籍功能
    window.deleteBook = function(id) {
        if (!checkAdminPermission()) {
            alert('请先登录管理员账号！');
            return;
        }
        if (confirm('确定要删除这本书籍吗？')) {
            let books = JSON.parse(localStorage.getItem('books')) || [];
            books = books.filter(book => book.id !== id);
            localStorage.setItem('books', JSON.stringify(books));
            loadBooksList();
        }
    };

    // 删除文章功能
    window.deleteArticle = function(id) {
        if (!checkAdminPermission()) {
            alert('请先登录管理员账号！');
            return;
        }
        if (confirm('确定要删除这篇文章吗？')) {
            let articles = JSON.parse(localStorage.getItem('articles')) || [];
            articles = articles.filter(article => article.id !== id);
            localStorage.setItem('articles', JSON.stringify(articles));
            loadArticlesList();
        }
    };

    // 删除音乐功能
    window.deleteMusic = function(id) {
        if (!checkAdminPermission()) {
            alert('请先登录管理员账号！');
            return;
        }
        if (confirm('确定要删除这首音乐吗？')) {
            let music = JSON.parse(localStorage.getItem('music')) || [];
            music = music.filter(m => m.id !== id);
            localStorage.setItem('music', JSON.stringify(music));
            loadMusicList();
        }
    };

    // 检查URL的有效性
    function isValidUrl(url) {
        if (!url) return false;
        try {
            new URL(url);
            return true;
        } catch (e) {
            return false;
        }
    }

    // 处理电影卡片点击事件
    window.handleMovieClick = function(id) {
        const movies = JSON.parse(localStorage.getItem('movies')) || [];
        const movie = movies.find(m => m.id === id);
        
        if (!movie) return;
        
        if (isValidUrl(movie.url)) {
            window.open(movie.url, '_blank');
        } else {
            alert('该电影没有设置有效的链接或链接无效！');
        }
    };

    // 处理书籍卡片点击事件
    window.handleBookClick = function(id) {
        const books = JSON.parse(localStorage.getItem('books')) || [];
        const book = books.find(b => b.id === id);
        
        if (!book) return;
        
        if (isValidUrl(book.url)) {
            window.open(book.url, '_blank');
        } else {
            alert('该书籍没有设置有效的链接或链接无效！');
        }
    };

    // 处理音乐卡片点击事件
    window.handleMusicClick = function(id) {
        const musicList = JSON.parse(localStorage.getItem('music')) || [];
        const music = musicList.find(m => m.id === id);
        
        if (!music) return;
        
        if (isValidUrl(music.url)) {
            window.open(music.url, '_blank');
        } else {
            alert('该音乐没有设置有效的链接或链接无效！');
        }
    };

    // 加载文章列表
    window.loadArticlesList = function() {
        const articlesList = document.getElementById('articles-list');
        if (!articlesList) return;
        
        articlesList.innerHTML = '';
        
        const articles = JSON.parse(localStorage.getItem('articles') || '[]')
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        
        if (articles.length === 0) {
            articlesList.innerHTML = '<p class="text-gray-600 dark:text-gray-300">暂无文章，请添加新文章。</p>';
            return;
        }
        
        articles.forEach(article => {
            const articleElement = document.createElement('div');
            articleElement.className = 'bg-gray-100 p-4 rounded-lg flex justify-between items-center dark:bg-gray-700 article-list-item';
            articleElement.innerHTML = `
                <div>
                    <h4 class="font-bold text-gray-800 dark:text-white">${article.title}</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-300">${article.date}</p>
                </div>
                <div class="flex space-x-2">
                    <button onclick="editArticle('${article.id}')" class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition edit-btn">编辑</button>
                    <button onclick="deleteArticle('${article.id}')" class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition">删除</button>
                </div>
            `;
            articlesList.appendChild(articleElement);
        });
    };

    // 加载电影列表
    window.loadMoviesList = function() {
        const moviesList = document.getElementById('movies-list');
        if (!moviesList) return;
        
        moviesList.innerHTML = '';
        
        const movies = JSON.parse(localStorage.getItem('movies') || '[]')
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        
        if (movies.length === 0) {
            moviesList.innerHTML = '<p class="text-gray-600 dark:text-gray-300">暂无电影，请添加新电影。</p>';
            return;
        }
        
        movies.forEach(movie => {
            const movieElement = document.createElement('div');
            movieElement.className = 'bg-gray-100 p-4 rounded-lg flex justify-between items-center dark:bg-gray-700 movie-list-item';
            movieElement.innerHTML = `
                <div>
                    <h4 class="font-bold text-gray-800 dark:text-white">${movie.title}</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-300">导演: ${movie.director} · ${movie.year}</p>
                </div>
                <div class="flex space-x-2">
                    <button onclick="editMovie('${movie.id}')" class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition edit-btn">编辑</button>
                    <button onclick="deleteMovie('${movie.id}')" class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition">删除</button>
                </div>
            `;
            moviesList.appendChild(movieElement);
        });
    };

    // 加载书籍列表
    window.loadBooksList = function() {
        const booksList = document.getElementById('books-list');
        if (!booksList) return;
        
        booksList.innerHTML = '';
        
        const books = JSON.parse(localStorage.getItem('books') || '[]')
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        
        if (books.length === 0) {
            booksList.innerHTML = '<p class="text-gray-600 dark:text-gray-300">暂无书籍，请添加新书籍。</p>';
            return;
        }
        
        books.forEach(book => {
            const bookElement = document.createElement('div');
            bookElement.className = 'bg-gray-100 p-4 rounded-lg flex justify-between items-center dark:bg-gray-700 book-list-item';
            bookElement.innerHTML = `
                <div>
                    <h4 class="font-bold text-gray-800 dark:text-white">${book.title}</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-300">作者: ${book.author} · 状态: ${book.status}</p>
                </div>
                <div class="flex space-x-2">
                    <button onclick="editBook('${book.id}')" class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition edit-btn">编辑</button>
                    <button onclick="deleteBook('${book.id}')" class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition">删除</button>
                </div>
            `;
            booksList.appendChild(bookElement);
        });
    };

    // 加载音乐列表
    window.loadMusicList = function() {
        const musicList = document.getElementById('music-list');
        if (!musicList) return;
        
        musicList.innerHTML = '';
        
        const music = JSON.parse(localStorage.getItem('music') || '[]')
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        
        if (music.length === 0) {
            musicList.innerHTML = '<p class="text-gray-600 dark:text-gray-300">暂无音乐，请添加新音乐。</p>';
            return;
        }
        
        music.forEach(m => {
            const musicElement = document.createElement('div');
            musicElement.className = 'bg-gray-100 p-4 rounded-lg flex justify-between items-center dark:bg-gray-700 music-list-item';
            musicElement.innerHTML = `
                <div>
                    <h4 class="font-bold text-gray-800 dark:text-white">${m.title}</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-300">艺术家: ${m.artist} · ${m.year || ''}</p>
                </div>
                <div class="flex space-x-2">
                    <button onclick="editMusic('${m.id}')" class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition edit-btn">编辑</button>
                    <button onclick="deleteMusic('${m.id}')" class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition">删除</button>
                </div>
            `;
            musicList.appendChild(musicElement);
        });
    };

    // 编辑功能
    window.editArticle = function(id) {
        const articles = JSON.parse(localStorage.getItem('articles')) || [];
        const article = articles.find(a => a.id === id);
        
        if (!article) {
            alert('未找到该文章');
            return;
        }
        
        // 填充表单
        document.getElementById('article-id').value = article.id;
        document.getElementById('article-title').value = article.title;
        document.getElementById('article-tags').value = article.tags.join(', ');
        document.getElementById('cover-preview').src = article.cover;
        document.getElementById('markdown-editor').value = article.content;
        
        // 更新预览
        const previewElement = document.getElementById('markdown-preview');
        if (previewElement && typeof marked !== 'undefined') {
            previewElement.innerHTML = marked.parse(article.content);
            
            // 高亮代码块
            if (typeof hljs !== 'undefined') {
                document.querySelectorAll('pre code').forEach((block) => {
                    hljs.highlightBlock(block);
                });
            }
        }
        
        // 切换到文章标签
        const articleTab = document.querySelector('[data-tab="article-tab"]');
        if (articleTab) {
            articleTab.click();
        }
        
        // 滚动到表单顶部
        window.scrollTo(0, 0);
    };

    window.editMovie = function(id) {
        const movies = JSON.parse(localStorage.getItem('movies')) || [];
        const movie = movies.find(m => m.id === id);
        
        if (!movie) {
            alert('未找到该电影');
            return;
        }
        
        // 填充表单
        document.getElementById('movie-id').value = movie.id;
        document.getElementById('movie-title').value = movie.title;
        document.getElementById('movie-director').value = movie.director;
        document.getElementById('movie-year').value = movie.year;
        document.getElementById('movie-url').value = movie.url || '';
        document.getElementById('movie-rating').value = movie.rating || '';
        document.getElementById('movie-review').value = movie.review || '';
        document.getElementById('movie-poster-preview').src = movie.poster;
        
        // 切换到电影标签
        const movieTab = document.querySelector('[data-tab="movie-tab"]');
        if (movieTab) {
            movieTab.click();
        }
        
        // 滚动到表单顶部
        window.scrollTo(0, 0);
    };

    window.editBook = function(id) {
        const books = JSON.parse(localStorage.getItem('books')) || [];
        const book = books.find(b => b.id === id);
        
        if (!book) {
            alert('未找到该书籍');
            return;
        }
        
        // 填充表单
        document.getElementById('book-id').value = book.id;
        document.getElementById('book-title').value = book.title;
        document.getElementById('book-author').value = book.author;
        document.getElementById('book-year').value = book.year || '';
        document.getElementById('book-url').value = book.url || '';
        document.getElementById('book-status').value = book.status;
        document.getElementById('book-review').value = book.review || '';
        document.getElementById('book-cover-preview').src = book.cover;
        
        // 切换到书籍标签
        const bookTab = document.querySelector('[data-tab="book-tab"]');
        if (bookTab) {
            bookTab.click();
        }
        
        // 滚动到表单顶部
        window.scrollTo(0, 0);
    };

    window.editMusic = function(id) {
        const music = JSON.parse(localStorage.getItem('music')) || [];
        const m = music.find(item => item.id === id);
        
        if (!m) {
            alert('未找到该音乐');
            return;
        }
        
        // 填充表单
        document.getElementById('music-id').value = m.id;
        document.getElementById('music-title').value = m.title;
        document.getElementById('music-artist').value = m.artist;
        document.getElementById('music-album').value = m.album || '';
        document.getElementById('music-year').value = m.year || '';
        document.getElementById('music-url').value = m.url;
        document.getElementById('music-cover-preview').src = m.cover;
        
        // 切换到音乐标签
        const musicTab = document.querySelector('[data-tab="music-tab"]');
        if (musicTab) {
            musicTab.click();
        }
        
        // 滚动到表单顶部
        window.scrollTo(0, 0);
    };

    // 管理员登录功能
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_SECRET) {
                localStorage.setItem('adminLoggedIn', 'true');
                document.getElementById('login-container').classList.add('hidden');
                document.getElementById('admin-content').classList.remove('hidden');
                
                // 加载管理数据
                loadArticlesList();
                loadMoviesList();
                loadBooksList();
                loadMusicList();
            } else {
                alert('用户名或密码错误');
            }
        });
    }

    // 检查是否已登录
    if (localStorage.getItem('adminLoggedIn') === 'true') {
        const loginContainer = document.getElementById('login-container');
        const adminContent = document.getElementById('admin-content');
        
        if (loginContainer && adminContent) {
            loginContainer.classList.add('hidden');
            adminContent.classList.remove('hidden');
            
            // 加载管理数据
            loadArticlesList();
            loadMoviesList();
            loadBooksList();
            loadMusicList();
        }
    }
});
