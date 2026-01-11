// =============================================
// First Over the Line Strategies
// Main JavaScript
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add scroll class to nav
    const nav = document.querySelector('.nav');
    if (nav) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });
    }
    
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.value-card, .service-block, .contact-method').forEach(el => {
        el.classList.add('animate-item');
        observer.observe(el);
    });
    
    // Contact form handling (if exists)
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // For now, create mailto link
            const subject = encodeURIComponent('Inquiry from FirstOver.ai');
            const body = encodeURIComponent(
                `Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`
            );
            
            window.location.href = `mailto:colin@firstover.ai?subject=${subject}&body=${body}`;
        });
    }
    
    // =============================================
    // AI News Ticker Functionality
    // =============================================
    const tickerTrack = document.getElementById('tickerTrack');
    const pauseBtn = document.getElementById('pauseBtn');
    const refreshBtn = document.getElementById('refreshBtn');
    const pauseIcon = document.getElementById('pauseIcon');
    const playIcon = document.getElementById('playIcon');
    
    if (tickerTrack) {
        let isPaused = false;
        
        // Sample news data - In production, this would come from an RSS feed or API
        const sampleNews = [
            {
                source: "MIT Tech Review",
                headline: "New breakthrough in multimodal AI models shows unprecedented reasoning",
                time: "2 hours ago",
                url: "https://www.technologyreview.com/"
            },
            {
                source: "The Verge",
                headline: "OpenAI announces major updates to GPT architecture",
                time: "4 hours ago",
                url: "https://www.theverge.com/ai-artificial-intelligence"
            },
            {
                source: "Wired",
                headline: "How AI is transforming drug discovery and medical research",
                time: "5 hours ago",
                url: "https://www.wired.com/tag/artificial-intelligence/"
            },
            {
                source: "Ars Technica",
                headline: "Google DeepMind releases new open-source AI safety tools",
                time: "6 hours ago",
                url: "https://arstechnica.com/ai/"
            },
            {
                source: "VentureBeat",
                headline: "Enterprise AI adoption reaches new heights in 2025",
                time: "8 hours ago",
                url: "https://venturebeat.com/ai/"
            },
            {
                source: "TechCrunch",
                headline: "Anthropic raises new funding round for AI safety research",
                time: "10 hours ago",
                url: "https://techcrunch.com/category/artificial-intelligence/"
            },
            {
                source: "Reuters",
                headline: "EU passes comprehensive AI regulation framework",
                time: "12 hours ago",
                url: "https://www.reuters.com/technology/artificial-intelligence/"
            },
            {
                source: "Bloomberg",
                headline: "AI chip demand drives record semiconductor sales",
                time: "14 hours ago",
                url: "https://www.bloomberg.com/technology"
            }
        ];

        function createNewsItem(news) {
            return `
                <a href="${news.url}" target="_blank" rel="noopener noreferrer" class="ai-news-item">
                    <div class="ai-news-source">${news.source}</div>
                    <div class="ai-news-content">
                        <div class="ai-news-headline">${news.headline}</div>
                        <div class="ai-news-meta">${news.time}</div>
                    </div>
                </a>
            `;
        }

        function renderNews(newsItems) {
            // Double the items for seamless infinite scroll
            const allItems = [...newsItems, ...newsItems];
            tickerTrack.innerHTML = allItems.map(createNewsItem).join('');
        }

        function togglePause() {
            isPaused = !isPaused;
            tickerTrack.style.animationPlayState = isPaused ? 'paused' : 'running';
            if (pauseIcon && playIcon) {
                pauseIcon.style.display = isPaused ? 'none' : 'block';
                playIcon.style.display = isPaused ? 'block' : 'none';
            }
        }

        function refresh() {
            tickerTrack.innerHTML = `
                <div class="ai-loading">
                    <div class="ai-loading-spinner"></div>
                    Refreshing news...
                </div>
            `;
            
            // Simulate API call delay
            setTimeout(() => {
                renderNews(sampleNews);
            }, 1000);
        }

        // Event listeners
        if (pauseBtn) pauseBtn.addEventListener('click', togglePause);
        if (refreshBtn) refreshBtn.addEventListener('click', refresh);

        // Initial render
        renderNews(sampleNews);
    }
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .animate-item {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .animate-item.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .nav.scrolled {
        background: rgba(15, 17, 21, 0.98);
    }
    
    .nav-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .nav-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .nav-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(5px, -5px);
    }
`;
document.head.appendChild(style);
