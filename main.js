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
        
        // RSS feeds to pull from (AI/Tech focused)
        const rssFeeds = [
            { url: 'https://www.wired.com/feed/tag/ai/latest/rss', source: 'Wired' },
            { url: 'https://techcrunch.com/category/artificial-intelligence/feed/', source: 'TechCrunch' },
            { url: 'https://feeds.arstechnica.com/arstechnica/technology-lab', source: 'Ars Technica' },
            { url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml', source: 'The Verge' }
        ];
        
        // Fallback sample data in case feeds fail
        const fallbackNews = [
            { source: "AI News", headline: "Latest developments in artificial intelligence and machine learning", time: "Recently", url: "#" },
            { source: "Tech Update", headline: "Enterprise AI adoption continues to accelerate across industries", time: "Recently", url: "#" },
            { source: "AI Research", headline: "New breakthroughs in multimodal AI models show promise", time: "Recently", url: "#" }
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
            if (newsItems.length === 0) {
                newsItems = fallbackNews;
            }
            // Double the items for seamless infinite scroll
            const allItems = [...newsItems, ...newsItems];
            tickerTrack.innerHTML = allItems.map(createNewsItem).join('');
        }
        
        function getTimeAgo(dateString) {
            const now = new Date();
            const past = new Date(dateString);
            const diffMs = now - past;
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);
            
            if (diffMins < 60) return `${diffMins} min ago`;
            if (diffHours < 24) return `${diffHours} hours ago`;
            return `${diffDays} days ago`;
        }
        
        async function fetchRSSFeed(feedUrl, sourceName) {
            try {
                const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;
                const response = await fetch(apiUrl);
                const data = await response.json();
                
                if (data.status === 'ok' && data.items) {
                    return data.items.slice(0, 3).map(item => ({
                        source: sourceName,
                        headline: item.title,
                        time: getTimeAgo(item.pubDate),
                        url: item.link
                    }));
                }
                return [];
            } catch (error) {
                console.error(`Error fetching ${sourceName}:`, error);
                return [];
            }
        }
        
        async function fetchAllNews() {
            tickerTrack.innerHTML = `
                <div class="ai-loading">
                    <div class="ai-loading-spinner"></div>
                    Loading latest AI news...
                </div>
            `;
            
            try {
                const allPromises = rssFeeds.map(feed => fetchRSSFeed(feed.url, feed.source));
                const results = await Promise.all(allPromises);
                
                // Flatten and shuffle the results
                let allNews = results.flat();
                
                // Shuffle to mix sources
                allNews = allNews.sort(() => Math.random() - 0.5);
                
                renderNews(allNews);
            } catch (error) {
                console.error('Error fetching news:', error);
                renderNews(fallbackNews);
            }
        }

        function togglePause() {
            isPaused = !isPaused;
            tickerTrack.style.animationPlayState = isPaused ? 'paused' : 'running';
            if (pauseIcon && playIcon) {
                pauseIcon.style.display = isPaused ? 'none' : 'block';
                playIcon.style.display = isPaused ? 'block' : 'none';
            }
        }

        // Event listeners
        if (pauseBtn) pauseBtn.addEventListener('click', togglePause);
        if (refreshBtn) refreshBtn.addEventListener('click', fetchAllNews);

        // Initial fetch
        fetchAllNews();
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
