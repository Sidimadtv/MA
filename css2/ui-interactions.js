document.addEventListener('DOMContentLoaded', function () {
    // --- Fullscreen Mode ---
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const appContainer = document.querySelector('.app-container');
    let isFullscreen = false;

    function toggleFullscreen() {
        isFullscreen = !isFullscreen;
        if (appContainer) appContainer.classList.toggle('fullscreen', isFullscreen);

        // Update button icon
        if (fullscreenBtn) {
            const icon = fullscreenBtn.querySelector('i');
            if (isFullscreen) {
                icon.className = 'fas fa-compress';
                fullscreenBtn.setAttribute('title', 'Exit Fullscreen (Esc)');
            } else {
                icon.className = 'fas fa-expand';
                fullscreenBtn.setAttribute('title', 'Toggle Fullscreen (F11)');
            }
        }

        // Refresh CodeMirror to adjust to new size
        if (window.editor) {
            setTimeout(() => window.editor.refresh(), 100);
        }
    }

    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', toggleFullscreen);
    }

    // Keyboard shortcuts for fullscreen
    document.addEventListener('keydown', (e) => {
        if (e.key === 'F11') {
            e.preventDefault();
            toggleFullscreen();
        }
        if (e.key === 'Escape' && isFullscreen) {
            toggleFullscreen();
        }
    });

    // --- Download Code ---
    const downloadBtn = document.getElementById('download-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            if (!window.editor) return;
            const code = window.editor.getValue();
            const language = document.getElementById('run-btn')?.getAttribute('data-language') || 'txt';

            // Determine file extension
            const extensionMap = {
                'c': 'c',
                'cpp': 'cpp',
                'python': 'py',
                'java': 'java',
                'javascript': 'js',
                'html': 'html',
                'sql': 'sql',
                'php': 'php',
                'markdown': 'md',
                'text': 'txt'
            };

            const extension = extensionMap[language] || 'txt';
            const filename = `code.${extension}`;

            // Create blob and download
            const blob = new Blob([code], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }

    // --- AI Toggle (if exists) ---
    const aiToggle = document.getElementById('ai-toggle');
    const aiContainer = document.querySelector('.ai-prompt-container');
    if (aiToggle && aiContainer) {
        aiToggle.addEventListener('click', () => {
            aiContainer.classList.toggle('visible');
        });
    }

    // --- Tab Handling (Editor/Note/Tool) ---
    const tabs = document.querySelectorAll('.tab');
    // Try to find the container in different templates
    const editorContainer = document.getElementById('workspace-wrapper') || document.getElementById('editor-container-wrapper');
    const noteContainer = document.getElementById('note-container');
    const toolToolbar = document.querySelector('.tool-toolbar');

    if (tabs.length > 0) {
        tabs.forEach(tab => {
            tab.addEventListener('click', function () {
                // Only handle tabs that have data-tab attribute
                const tabType = this.getAttribute('data-tab');
                if (!tabType) return;

                // Remove active class from all tabs with data-tab
                document.querySelectorAll('.tab[data-tab]').forEach(t => t.classList.remove('active'));
                // Add active class to clicked tab
                this.classList.add('active');

                if (tabType === 'note') {
                    if (editorContainer) editorContainer.style.display = 'none';
                    if (toolToolbar) toolToolbar.style.display = 'none';
                    if (noteContainer) noteContainer.style.display = 'block';
                } else {
                    if (editorContainer) editorContainer.style.display = 'flex';
                    if (toolToolbar) toolToolbar.style.display = 'flex';
                    if (noteContainer) noteContainer.style.display = 'none';

                    // Refresh CodeMirror if it exists
                    if (window.editor && window.editor.refresh) {
                        window.editor.refresh();
                    }
                }
            });
        });
    }

    // --- Global tryExample Helper ---
    window.tryExample = function (code) {
        if (window.editor) {
            window.editor.setValue(code);
            // Switch back to editor tab
            const editorTab = document.querySelector('.tab[data-tab="editor"]');
            if (editorTab) editorTab.click();
            
            // If on a tool page, scroll to top or specific element
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
});
