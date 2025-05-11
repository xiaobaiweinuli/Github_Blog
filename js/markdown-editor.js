
// github_blog_system/frontend/js/markdown-editor.js
document.addEventListener('DOMContentLoaded', function() {
    // 获取编辑器相关元素
    const editor = document.getElementById('markdown-editor');
    const preview = document.getElementById('markdown-preview');
    const toolbarButtons = document.querySelectorAll('.toolbar button');
    
    // 初始化marked.js配置
    marked.setOptions({
        breaks: true,
        gfm: true,
        highlight: function(code, lang) {
            if (lang && hljs.getLanguage(lang)) {
                return hljs.highlight(lang, code).value;
            }
            return hljs.highlightAuto(code).value;
        }
    });

    // 实时预览功能
    function updatePreview() {
        if (editor && preview) {
            preview.innerHTML = marked.parse(editor.value);
            // 为预览区域的代码块添加高亮
            document.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightBlock(block);
            });
        }
    }

    // 初始化预览
    if (editor && preview) {
        updatePreview();
    }
    
    // 监听编辑器输入事件
    if (editor) {
        editor.addEventListener('input', updatePreview);
    }

    // 工具栏按钮功能
    toolbarButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const command = this.getAttribute('data-command');
            const startPos = editor.selectionStart;
            const endPos = editor.selectionEnd;
            const selectedText = editor.value.substring(startPos, endPos);
            let newText = '';
            let cursorOffset = 0;

            switch(command) {
                case 'bold':
                    newText = `**${selectedText}**`;
                    cursorOffset = 2;
                    break;
                case 'italic':
                    newText = `*${selectedText}*`;
                    cursorOffset = 1;
                    break;
                case 'heading':
                    newText = `# ${selectedText}`;
                    cursorOffset = 2;
                    break;
                case 'quote':
                    newText = `> ${selectedText}`;
                    cursorOffset = 2;
                    break;
                case 'link':
                    newText = `[${selectedText}](url)`;
                    cursorOffset = 1;
                    break;
                case 'image':
                    newText = `![alt text](${selectedText})`;
                    cursorOffset = 11;
                    break;
                case 'code':
                    newText = `\`\`\`\n${selectedText}\n\`\`\``;
                    cursorOffset = 3;
                    break;
                case 'unordered-list':
                    newText = selectedText.split('\n').map(line => `- ${line}`).join('\n');
                    break;
                case 'ordered-list':
                    newText = selectedText.split('\n').map((line, i) => `${i+1}. ${line}`).join('\n');
                    break;
            }

            // 更新编辑器内容
            editor.value = editor.value.substring(0, startPos) + newText + editor.value.substring(endPos);
            
            // 设置光标位置
            if (selectedText.length === 0) {
                editor.setSelectionRange(startPos + cursorOffset, startPos + cursorOffset);
            } else {
                editor.setSelectionRange(startPos, startPos + newText.length);
            }
            
            // 更新预览
            updatePreview();
            editor.focus();
        });
    });

    // 重置表单功能
    function resetForm(formId) {
        const form = document.getElementById(`${formId}-form`);
        if (form) {
            form.reset();
            
            // 重置图片预览
            switch(formId) {
                case 'article':
                    document.getElementById('cover-preview').src = 'https://picsum.photos/800/400';
                    break;
                case 'movie':
                    document.getElementById('movie-poster-preview').src = 'https://picsum.photos/200/300';
                    break;
                case 'book':
                    document.getElementById('book-cover-preview').src = 'https://picsum.photos/200/300';
                    break;
                case 'music':
                    document.getElementById('music-cover-preview').src = 'https://picsum.photos/200/200';
                    break;
            }
            
            // 重置隐藏的ID字段
            const idField = document.getElementById(`${formId}-id`);
            if (idField) idField.value = '';
            
            // 重置Markdown编辑器
            if (formId === 'article' && editor && preview) {
                editor.value = '';
                preview.innerHTML = '';
            }
            
            alert('表单已重置');
        }
    }

    // 绑定重置按钮
    document.getElementById('reset-article-form')?.addEventListener('click', () => resetForm('article'));
    document.getElementById('reset-movie-form')?.addEventListener('click', () => resetForm('movie'));
    document.getElementById('reset-book-form')?.addEventListener('click', () => resetForm('book'));
    document.getElementById('reset-music-form')?.addEventListener('click', () => resetForm('music'));

    // 图片上传和URL加载功能
    function setupImageUpload(inputId, previewId, urlInputId, loadUrlBtnId) {
        const input = document.getElementById(inputId);
        const preview = document.getElementById(previewId);
        const urlInput = document.getElementById(urlInputId);
        const loadUrlBtn = document.getElementById(loadUrlBtnId);
        
        // 本地图片上传
        if (input && preview) {
            input.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        preview.src = event.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
        
        // URL图片加载
        if (loadUrlBtn && urlInput && preview) {
            loadUrlBtn.addEventListener('click', function() {
                if (urlInput.value) {
                    preview.src = urlInput.value;
                } else {
                    alert('请输入有效的图片URL');
                }
            });
        }
    }

    // 设置所有图片上传功能
    setupImageUpload('local-cover', 'cover-preview', 'cover-url', 'load-cover-url');
    setupImageUpload('local-movie-poster', 'movie-poster-preview', 'movie-poster-url', 'load-movie-poster-url');
    setupImageUpload('local-book-cover', 'book-cover-preview', 'book-cover-url', 'load-book-cover-url');
    setupImageUpload('local-music-cover', 'music-cover-preview', 'music-cover-url', 'load-music-cover-url');
});
