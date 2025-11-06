// Add this at the VERY TOP of public/js/script.js
const currentPath = window.location.pathname;

// Search functionality enhancements
document.addEventListener('DOMContentLoaded', function() {
    // Focus search input when page loads if there's a search query
    const searchInput = document.querySelector('.search-input');
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('q');
    
    if (searchQuery && searchInput) {
        searchInput.focus();
        searchInput.setSelectionRange(searchQuery.length, searchQuery.length);
    }
    
    // Add keyboard shortcut for search (Ctrl+K or Cmd+K)
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // Escape key to clear search and go home
        if (e.key === 'Escape' && searchQuery) {
            window.location.href = '/';
        }
    });
    
    // Auto-submit search when pressing Enter (useful for single field forms)
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                // The form will automatically submit since it's a proper form
            }
        });
    }
    
    // Add loading indicator for search (optional enhancement)
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function() {
            const searchButton = this.querySelector('.search-button');
            if (searchButton) {
                searchButton.innerHTML = '⏳';
                searchButton.disabled = true;
            }
        });
    }
});


// Search functionality enhancements
document.addEventListener('DOMContentLoaded', function() {
    // Focus search input when page loads if there's a search query
    const searchInput = document.querySelector('.search-input');
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('q');
    
    if (searchQuery && searchInput) {
        searchInput.focus();
        searchInput.setSelectionRange(searchQuery.length, searchQuery.length);
    }
    
    // Add keyboard shortcut for search (Ctrl+K or Cmd+K)
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // Escape key to clear search and go home
        if (e.key === 'Escape' && searchQuery) {
            window.location.href = '/';
        }
    });
    
    // Auto-submit search when pressing Enter (useful for single field forms)
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                // The form will automatically submit since it's a proper form
            }
        });
    }
    
    // Add loading indicator for search (optional enhancement)
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function() {
            const searchButton = this.querySelector('.search-button');
            if (searchButton) {
                searchButton.innerHTML = '⏳';
                searchButton.disabled = true;
                
                // Re-enable after 3 seconds in case of error
                setTimeout(() => {
                    searchButton.innerHTML = '🔍';
                    searchButton.disabled = false;
                }, 3000);
            }
        });
    }
    
    // Anime-specific search placeholder
    const currentPath = window.location.pathname;
    if (currentPath === '/anime' && searchInput) {
        searchInput.placeholder = 'Search anime movies...';
    }
    
    // Add smooth scrolling for anime page
    if (currentPath === '/anime') {
        // Add any anime-specific JavaScript here
        console.log('🎌 Anime page loaded');
    }
    
    // Enhance movie cards with hover effects
    const movieCards = document.querySelectorAll('.movie-card');
    movieCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05) translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) translateY(0)';
        });
    });
});

// Add to the existing DOMContentLoaded function

// Weird category specific functionality
if (currentPath === '/weird') {
    console.log('🔮 Weird movies page loaded');
    
    // Add glitch effect to section title
    const sectionTitle = document.querySelector('.section-header h2');
    if (sectionTitle) {
        sectionTitle.classList.add('weird-title');
        sectionTitle.setAttribute('data-text', sectionTitle.textContent);
    }
    
    // Add random hover effects to movie cards
    const weirdCards = document.querySelectorAll('.weird-card');
    weirdCards.forEach((card, index) => {
        card.addEventListener('mouseenter', function() {
            const rotations = ['rotate(1deg)', 'rotate(-1deg)', 'skew(2deg, 1deg)'];
            const randomRotation = rotations[Math.floor(Math.random() * rotations.length)];
            this.style.transform = `scale(1.05) ${randomRotation} translateY(-5px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg) skew(0deg, 0deg) translateY(0)';
        });
    });
}

// Update search placeholder for weird page
if (currentPath === '/weird' && searchInput) {
    searchInput.placeholder = 'Search weird, surreal, bizarre movies...';
}

// GIF background preloading and optimization
document.addEventListener('DOMContentLoaded', function() {
    // Preload GIFs for better performance
    const gifUrls = [
        'https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif',
        'https://media.giphy.com/media/3o7aD2s1YvV7YjxJg4/giphy.gif',
        'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif',
        'https://media.giphy.com/media/3o7TKSha51g5fWw2fe/giphy.gif',
        'https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif',
        'https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif',
        'https://media.giphy.com/media/l0HlSRsxGgcQTq6rS/giphy.gif',
        'https://media.giphy.com/media/l0HlNqhO06kOq8rW8/giphy.gif'
    ];

    // Preload GIFs
    gifUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });

    // Category-specific enhancements
    const currentPath = window.location.pathname;
    
    // Anime page enhancements
    if (currentPath === '/anime') {
        console.log('🎌 Anime page with GIF background loaded');
        
        // Add anime-specific interactions
        const animeCards = document.querySelectorAll('.anime-card');
        animeCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-15px) scale(1.05)';
                this.style.boxShadow = '0 15px 40px rgba(255, 107, 107, 0.4)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
                this.style.boxShadow = '0 10px 30px rgba(255, 107, 107, 0.3)';
            });
        });
    }
    
    // Weird page enhancements
    if (currentPath === '/weird') {
        console.log('🔮 Weird page with trippy GIF background loaded');
        
        // Add weird glitch effect to titles
        const weirdTitle = document.querySelector('.weird-title');
        if (weirdTitle) {
            setInterval(() => {
                weirdTitle.style.transform = `translateX(${Math.random() * 4 - 2}px) translateY(${Math.random() * 4 - 2}px)`;
            }, 100);
        }
    }
    
    // Weed page enhancements
    if (currentPath === '/weed') {
        console.log('🌿 Weed page with smoke GIF background loaded');
        
        // Add smoke effect to cards
        const weedCards = document.querySelectorAll('.weed-card');
        weedCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                const badge = this.querySelector('.weed-badge');
                if (badge) {
                    badge.style.animation = 'smoke 2s ease-in-out infinite';
                    badge.style.transform = 'scale(1.2)';
                }
            });
            
            card.addEventListener('mouseleave', function() {
                const badge = this.querySelector('.weed-badge');
                if (badge) {
                    badge.style.animation = 'none';
                    badge.style.transform = 'scale(1)';
                }
            });
        });
    }

    // Rest of your existing JavaScript...
    const searchInput = document.querySelector('.search-input');
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('q');
    
    if (searchQuery && searchInput) {
        searchInput.focus();
    }
    
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            if (searchInput) {
                searchInput.focus();
            }
        }
    });
});

// Footer interactions and animations
document.addEventListener('DOMContentLoaded', function() {
    // Social link click tracking (for analytics)
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const platform = this.className.includes('github') ? 'GitHub' :
                           this.className.includes('linkedin') ? 'LinkedIn' :
                           this.className.includes('twitter') ? 'Twitter' :
                           this.className.includes('instagram') ? 'Instagram' :
                           this.className.includes('portfolio') ? 'Portfolio' : 'Unknown';
            
            console.log(`🌐 Social link clicked: ${platform}`);
            
            // You can add analytics here later
            // Example: gtag('event', 'social_click', { platform: platform });
        });
    });

    // Footer scroll animation
    const footer = document.querySelector('.site-footer');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    if (footer) {
        footer.style.opacity = '0';
        footer.style.transform = 'translateY(20px)';
        footer.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(footer);
    }

    // Current year for copyright
    const yearElement = document.querySelector('.copyright');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.innerHTML = yearElement.innerHTML.replace('2024', currentYear);
    }

    // Add pulse animation to your name
    const yourName = document.querySelector('.copyright strong');
    if (yourName) {
        setInterval(() => {
            yourName.style.transform = 'scale(1.05)';
            setTimeout(() => {
                yourName.style.transform = 'scale(1)';
            }, 500);
        }, 3000);
    }
});