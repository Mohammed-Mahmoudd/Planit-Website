document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.getElementById('toggle-nav');
    const sidebar = document.getElementById('sidebar');
    const searchInput = document.querySelector('.search-input');
    const searchIcon = document.querySelector('.search-icon');
    const modeToggle = document.querySelector('.mode-toggle');
    const sunIcon = document.querySelector('.sun');
    const moonIcon = document.querySelector('.moon');

    // Toggle sidebar
    toggleBtn.addEventListener('click', function() {
        sidebar.classList.toggle('active');
        
        if (sidebar.classList.contains('active')) {
            const overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay';
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.right = '0';
            overlay.style.bottom = '0';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            overlay.style.zIndex = '101';
            overlay.style.backdropFilter = 'blur(2px)';
            overlay.addEventListener('click', function() {
                sidebar.classList.remove('active');
                document.body.removeChild(overlay);
            });
            document.body.appendChild(overlay);
        } else {
            const overlay = document.querySelector('.sidebar-overlay');
            if (overlay) {
                document.body.removeChild(overlay);
            }
        }
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        const isClickInsideSidebar = sidebar.contains(event.target);
        const isClickOnToggleBtn = event.target === toggleBtn || toggleBtn.contains(event.target);
        
        if (window.innerWidth <= 768 && !isClickInsideSidebar && !isClickOnToggleBtn) {
            sidebar.classList.remove('active');
            const overlay = document.querySelector('.sidebar-overlay');
            if (overlay) {
                document.body.removeChild(overlay);
            }
        }
    });

    // Toggle dark/light mode
    modeToggle.addEventListener('click', function() {
        document.body.classList.toggle('light-mode');
        
        if (document.body.classList.contains('light-mode')) {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        } else {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        }
    });

    // Toggle search input on mobile
    if (searchIcon) {
        searchIcon.addEventListener('click', function() {
            if (window.innerWidth <= 576) {
                searchInput.style.display = searchInput.style.display === 'block' ? 'none' : 'block';
                if (searchInput.style.display === 'block') {
                    searchInput.focus();
                }
            }
        });
    }

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('active');
            const overlay = document.querySelector('.sidebar-overlay');
            if (overlay) {
                document.body.removeChild(overlay);
            }
        }
    });
});