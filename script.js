// ===== CONFIGURATION & CONSTANTS =====
const CONFIG = {
    pdfPath: './assets/pdf/portfolio-showcase.pdf',
    skillLevels: {
        webDev: 90,
        uiUx: 70,
        backend: 50
    },
    animation: {
        pageTransition: 400,
        skillAnimation: 1000,
        staggerDelay: 200
    }
};

// ===== STATE MANAGEMENT =====
const AppState = {
    currentPage: 'home',
    pdfLoaded: false,
    skillsAnimated: false
};

// ===== DOM ELEMENTS =====
const DOM = {
    pages: {
        home: document.getElementById('home-page'),
        portfolio: document.getElementById('portfolio-page'),
        profile: document.getElementById('profile-page'),
        services: document.getElementById('services-page')
    },
    navButtons: document.querySelectorAll('.nav-btn'),
    ctaButtons: document.querySelectorAll('.cta-btn'),
    healthFills: document.querySelectorAll('.health-fill')
};

// ===== CORE APPLICATION INITIALIZATION =====
class RetroPortfolio {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.initializeSkills();
        this.preloadPDF();
        this.setActivePage('home');
        
        // Initialize any animations that should run immediately
        requestAnimationFrame(() => {
            this.animateElements();
        });
    }

    // ===== EVENT HANDLING =====
    bindEvents() {
        // Navigation buttons
        DOM.navButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const targetPage = e.target.getAttribute('data-page');
                this.navigateToPage(targetPage);
            });
        });

        // CTA buttons
        DOM.ctaButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const targetPage = e.target.getAttribute('data-page');
                this.navigateToPage(targetPage);
            });
        });

        // Handle browser navigation
        window.addEventListener('popstate', (e) => {
            const page = e.state?.page || 'home';
            this.setActivePage(page, false);
        });

        // Intersection Observer for animations
        this.setupIntersectionObserver();
    }

    // ===== PAGE MANAGEMENT =====
    navigateToPage(pageId) {
        if (pageId === AppState.currentPage) return;
        
        this.animatePageTransition(() => {
            this.setActivePage(pageId);
            this.updateBrowserHistory(pageId);
            
            // Page-specific initializations
            this.handlePageSpecificFeatures(pageId);
        });
    }

    setActivePage(pageId, animate = true) {
        // Hide all pages
        Object.values(DOM.pages).forEach(page => {
            page.classList.remove('active');
        });

        // Show target page
        const targetPage = DOM.pages[pageId];
        if (targetPage) {
            if (animate) {
                targetPage.style.opacity = '0';
                targetPage.style.transform = 'translateY(20px)';
            }
            
            targetPage.classList.add('active');
            AppState.currentPage = pageId;

            if (animate) {
                requestAnimationFrame(() => {
                    targetPage.style.transition = 'all 0.4s ease';
                    targetPage.style.opacity = '1';
                    targetPage.style.transform = 'translateY(0)';
                    
                    // Clean up inline styles after animation
                    setTimeout(() => {
                        targetPage.style.transition = '';
                        targetPage.style.opacity = '';
                        targetPage.style.transform = '';
                    }, 400);
                });
            }
        }
    }

    animatePageTransition(callback) {
        const currentPage = DOM.pages[AppState.currentPage];
        if (currentPage) {
            currentPage.style.transition = 'all 0.3s ease';
            currentPage.style.opacity = '0';
            currentPage.style.transform = 'translateY(-10px)';
        }

        setTimeout(callback, 300);
    }

    updateBrowserHistory(pageId) {
        const pageTitle = `Kgosi Amani - ${pageId.charAt(0).toUpperCase() + pageId.slice(1)}`;
        const url = `/${pageId === 'home' ? '' : `#${pageId}`}`;
        
        window.history.pushState(
            { page: pageId },
            pageTitle,
            url
        );
        document.title = pageTitle;
    }

    // ===== PAGE-SPECIFIC FEATURES =====
    handlePageSpecificFeatures(pageId) {
        switch (pageId) {
            case 'portfolio':
                this.initializePDFViewer();
                break;
            case 'profile':
                this.animateSkillBars();
                break;
            case 'services':
                this.animateServiceCards();
                break;
        }
    }

    // ===== PDF VIEWER =====
    async initializePDFViewer() {
        if (AppState.pdfLoaded) return;

        const pdfViewer = document.getElementById('pdf-viewer');
        if (!pdfViewer) return;

        try {
            // Show loading state
            pdfViewer.innerHTML = `
                <div class="pdf-loading pixel-text">
                    <div class="loading-spinner"></div>
                    <p>INITIALIZING_PORTFOLIO_VIEWER...</p>
                </div>
            `;

            // Simple PDF embedding - can be enhanced with PDF.js later
            pdfViewer.innerHTML = `
                <div class="pdf-embed-container">
                    <iframe 
                        src="${CONFIG.pdfPath}#view=FitH" 
                        width="100%" 
                        height="100%"
                        frameborder="0"
                        class="pdf-iframe"
                    >
                    </iframe>
                    <div class="pdf-controls pixel-border">
                        <a href="${CONFIG.pdfPath}" download class="pixel-btn">
                            DOWNLOAD_PDF
                        </a>
                    </div>
                </div>
            `;

            AppState.pdfLoaded = true;
        } catch (error) {
            console.error('PDF loading failed:', error);
            pdfViewer.innerHTML = `
                <div class="pdf-error pixel-text">
                    <p>ERROR_LOADING_PORTFOLIO</p>
                    <a href="${CONFIG.pdfPath}" class="pixel-btn" download>
                        DOWNLOAD_INSTEAD
                    </a>
                </div>
            `;
        }
    }

    preloadPDF() {
        // Preload PDF for faster access
        fetch(CONFIG.pdfPath)
            .then(response => {
                if (response.ok) {
                    console.log('PDF preloaded successfully');
                }
            })
            .catch(error => {
                console.warn('PDF preload failed:', error);
            });
    }

    // ===== SKILLS ANIMATION =====
    initializeSkills() {
        // Set initial skill levels to 0
        DOM.healthFills.forEach(fill => {
            fill.style.width = '0%';
        });
    }

    animateSkillBars() {
        if (AppState.skillsAnimated) return;

        const skillElements = {
            webDev: DOM.healthFills[0],
            uiUx: DOM.healthFills[1],
            backend: DOM.healthFills[2]
        };

        // Animate with stagger effect
        setTimeout(() => {
            this.animateSkillBar(skillElements.webDev, CONFIG.skillLevels.webDev);
        }, CONFIG.animation.staggerDelay * 0);

        setTimeout(() => {
            this.animateSkillBar(skillElements.uiUx, CONFIG.skillLevels.uiUx);
        }, CONFIG.animation.staggerDelay * 1);

        setTimeout(() => {
            this.animateSkillBar(skillElements.backend, CONFIG.skillLevels.backend);
        }, CONFIG.animation.staggerDelay * 2);

        AppState.skillsAnimated = true;
    }

    animateSkillBar(element, targetLevel) {
        if (!element) return;

        const duration = CONFIG.animation.skillAnimation;
        const startTime = performance.now();
        const startWidth = 0;
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeProgress = this.easeOutCubic(progress);
            const currentWidth = startWidth + (targetLevel * easeProgress);
            
            element.style.width = `${currentWidth}%`;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    // ===== SERVICE CARDS ANIMATION =====
    animateServiceCards() {
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 150);
        });
    }

    // ===== INTERSECTION OBSERVER FOR SCROLL ANIMATIONS =====
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Animate skill bars when profile section comes into view
                    if (entry.target.id === 'profile-page' && entry.intersectionRatio > 0.3) {
                        this.animateSkillBars();
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe all pages for scroll animations
        Object.values(DOM.pages).forEach(page => {
            if (page) observer.observe(page);
        });
    }

    // ===== PERFORMANCE OPTIMIZATIONS =====
    animateElements() {
        // Initialize any elements that need immediate animation
        const animatedElements = document.querySelectorAll('[data-animate]');
        
        animatedElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.6s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // ===== ERROR HANDLING =====
    handleError(error, context) {
        console.error(`Error in ${context}:`, error);
        
        // Graceful error handling - show user-friendly messages
        if (context === 'pdf') {
            const pdfViewer = document.getElementById('pdf-viewer');
            if (pdfViewer) {
                pdfViewer.innerHTML = `
                    <div class="error-state pixel-border">
                        <p class="pixel-text">PORTFOLIO_UNAVAILABLE</p>
                        <a href="${CONFIG.pdfPath}" class="pixel-btn" download>
                            DOWNLOAD_PORTFOLIO
                        </a>
                    </div>
                `;
            }
        }
    }
}

// ===== ADDITIONAL UTILITY FUNCTIONS =====
const Utilities = {
    // Debounce function for performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for scroll events
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Check if element is in viewport
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

// ===== PERFORMANCE MONITORING =====
const PerformanceMonitor = {
    init() {
        if ('performance' in window) {
            this.metrics = {
                navigationStart: performance.timing.navigationStart,
                domContentLoaded: null,
                windowLoad: null
            };

            this.setupPerformanceObserver();
        }
    },

    setupPerformanceObserver() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    console.log(`Performance: ${entry.name}`, entry);
                });
            });

            observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] });
        }
    }
};

// ===== APPLICATION STARTUP =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize performance monitoring
    PerformanceMonitor.init();

    // Initialize the main application
    window.RetroPortfolioApp = new RetroPortfolio();

    // Handle initial page load from URL hash
    const initialPage = window.location.hash.replace('#', '') || 'home';
    if (initialPage && initialPage !== 'home') {
        window.RetroPortfolioApp.setActivePage(initialPage, false);
    }

    console.log('🎮 Retro Portfolio initialized successfully');
});

// ===== ERROR BOUNDARY =====
window.addEventListener('error', (event) => {
    console.error('Global error caught:', event.error);
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RetroPortfolio, Utilities, PerformanceMonitor };
}