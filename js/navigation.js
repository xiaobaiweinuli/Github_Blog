// github_blog_system/frontend/js/navigation.js
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all event listeners
    function initializeEventListeners() {
        // Cover image buttons
        const changeCoverBtn = document.getElementById('change-cover');
        if (changeCoverBtn) {
            changeCoverBtn.addEventListener('click', function() {
                const random = Math.floor(Math.random() * 1000);
                const coverPreview = document.getElementById('cover-preview');
                if (coverPreview) {
                    coverPreview.src = `https://picsum.photos/800/400?random=${random}`;
                }
            });
        }

        // Movie poster buttons
        const changeMoviePosterBtn = document.getElementById('change-movie-poster');
        if (changeMoviePosterBtn) {
            changeMoviePosterBtn.addEventListener('click', function() {
                const random = Math.floor(Math.random() * 1000);
                const posterPreview = document.getElementById('movie-poster-preview');
                if (posterPreview) {
                    posterPreview.src = `https://picsum.photos/200/300?random=${random}`;
                }
            });
        }

        // Book cover buttons
        const changeBookCoverBtn = document.getElementById('change-book-cover');
        if (changeBookCoverBtn) {
            changeBookCoverBtn.addEventListener('click', function() {
                const random = Math.floor(Math.random() * 1000);
                const coverPreview = document.getElementById('book-cover-preview');
                if (coverPreview) {
                    coverPreview.src = `https://picsum.photos/200/300?random=${random}`;
                }
            });
        }

        // Music cover buttons
        const changeMusicCoverBtn = document.getElementById('change-music-cover');
        if (changeMusicCoverBtn) {
            changeMusicCoverBtn.addEventListener('click', function() {
                const random = Math.floor(Math.random() * 1000);
                const coverPreview = document.getElementById('music-cover-preview');
                if (coverPreview) {
                    coverPreview.src = `https://picsum.photos/200/200?random=${random}`;
                }
            });
        }

        // Navigation buttons
        const navButtons = {
            'show-articles': 'articles',
            'show-tags': 'tags',
            'show-guestbook': 'guestbook',
            'show-archive': 'archive',
            'show-movies': 'movies',
            'show-books': 'books',
            'show-music': 'music'
        };

        Object.entries(navButtons).forEach(([btnId, sectionId]) => {
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.addEventListener('click', () => showSection(sectionId));
            }
        });

        // View guestbook button
        const viewGuestbookBtn = document.getElementById('view-guestbook');
        if (viewGuestbookBtn) {
            viewGuestbookBtn.addEventListener('click', () => {
                window.open('guestbook.html', '_blank');
            });
        }
    }

    // Initialize event listeners when DOM is ready
    initializeEventListeners();
});