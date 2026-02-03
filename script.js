// ================================
// SMOOTH SCROLL & NAVBAR
// ================================

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ================================
// HERO SECTION
// ================================

// CTA Button - Scroll to overview
const exploreBtn = document.getElementById('exploreBtn');
exploreBtn.addEventListener('click', () => {
    document.getElementById('overview').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
});

// Floating animation for processor cards
const floatingCards = document.querySelectorAll('.floating');
floatingCards.forEach((card, index) => {
    const speed = card.dataset.floatSpeed || 2;
    card.style.animationDuration = `${speed * 3}s`;
    card.style.animationDelay = `${index * 0.5}s`;
});

// ================================
// SCROLL ANIMATIONS (AOS)
// ================================

// Simple scroll animation observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
            
            // Animate stat bars
            if (entry.target.classList.contains('feature-card')) {
                animateStatBars(entry.target);
            }
            
            // Animate benchmark bars
            if (entry.target.classList.contains('benchmark-card')) {
                animateBenchmarkBars(entry.target);
            }
        }
    });
}, observerOptions);

// Observe all elements with data-aos attribute
document.querySelectorAll('[data-aos]').forEach(el => {
    observer.observe(el);
});

// Observe feature cards
document.querySelectorAll('.feature-card').forEach(el => {
    observer.observe(el);
});

// Observe benchmark cards
document.querySelectorAll('.benchmark-card').forEach(el => {
    observer.observe(el);
});

// Observe comparison table
const comparisonTable = document.querySelector('.comparison-table-wrapper');
if (comparisonTable) {
    observer.observe(comparisonTable);
}

// ================================
// STAT BAR ANIMATIONS
// ================================

function animateStatBars(card) {
    const statFills = card.querySelectorAll('.stat-fill');
    
    statFills.forEach(fill => {
        const value = fill.dataset.value;
        fill.style.setProperty('--stat-width', `${value}%`);
    });
}

// ================================
// BENCHMARK ANIMATIONS
// ================================

function animateBenchmarkBars(card) {
    const bars = card.querySelectorAll('.bar-fill');
    
    bars.forEach(bar => {
        const value = bar.dataset.value;
        const parentBar = bar.closest('.chart-bar');
        const isReverse = card.classList.contains('reverse');
        
        // Get max value in the chart for normalization
        const allValues = Array.from(card.querySelectorAll('.bar-fill'))
            .map(b => parseFloat(b.dataset.value));
        const maxValue = Math.max(...allValues);
        
        // Calculate percentage
        let percentage = (value / maxValue) * 100;
        
        // For reverse charts (lower is better), invert the visualization
        if (isReverse) {
            // Keep the actual value display, but invert the bar width for visual comparison
            const minValue = Math.min(...allValues);
            percentage = ((maxValue - value + minValue) / maxValue) * 100;
        }
        
        bar.style.setProperty('--bar-width', `${percentage}%`);
    });
}

// ================================
// BENCHMARK FILTERS
// ================================

const benchmarkFilters = document.querySelectorAll('.benchmark-filter');
const benchmarkCards = document.querySelectorAll('.benchmark-card');

benchmarkFilters.forEach(filter => {
    filter.addEventListener('click', () => {
        // Remove active class from all filters
        benchmarkFilters.forEach(f => f.classList.remove('active'));
        
        // Add active class to clicked filter
        filter.classList.add('active');
        
        // Get filter category
        const category = filter.dataset.filter;
        
        // Show/hide cards
        benchmarkCards.forEach(card => {
            const cardCategory = card.dataset.category;
            
            if (category === 'all' || cardCategory === category) {
                card.classList.remove('hidden');
                card.style.display = 'block';
                
                // Re-trigger animation
                setTimeout(() => {
                    card.classList.add('aos-animate');
                    animateBenchmarkBars(card);
                }, 50);
            } else {
                card.classList.add('hidden');
                card.classList.remove('aos-animate');
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
});

// ================================
// FLIP CARDS
// ================================

const flipCards = document.querySelectorAll('.flip-card');

// Add click event for mobile devices
flipCards.forEach(card => {
    let isFlipped = false;
    
    card.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            isFlipped = !isFlipped;
            const inner = card.querySelector('.flip-card-inner');
            
            if (isFlipped) {
                inner.style.transform = 'rotateY(180deg)';
            } else {
                inner.style.transform = 'rotateY(0deg)';
            }
        }
    });
});

// ================================
// RECOMMENDATION SELECTOR
// ================================

const selectorBtns = document.querySelectorAll('.selector-btn');
const resultCards = document.querySelectorAll('.result-card');

selectorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        selectorBtns.forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked button
        btn.classList.add('active');
        
        // Get use case
        const useCase = btn.dataset.use;
        
        // Show corresponding result card
        resultCards.forEach(card => {
            card.classList.remove('active');
            
            if (card.classList.contains(`${useCase}-result`)) {
                setTimeout(() => {
                    card.classList.add('active');
                }, 100);
            }
        });
        
        // Add ripple effect
        createRipple(btn, event);
    });
});

// Ripple effect function
function createRipple(element, event) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.classList.add('ripple-effect');
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add ripple CSS dynamically
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .selector-btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// ================================
// COMPARISON TABLE HIGHLIGHTS
// ================================

// Add star to better values in comparison table
function highlightBetterValues() {
    const rows = document.querySelectorAll('.comparison-table tbody tr');
    
    rows.forEach(row => {
        const intelValue = row.querySelector('.intel-value');
        const amdValue = row.querySelector('.amd-value');
        
        if (intelValue && amdValue) {
            // Remove existing highlights
            intelValue.classList.remove('highlight');
            amdValue.classList.remove('highlight');
            
            const intelText = intelValue.textContent.trim();
            const amdText = amdValue.textContent.trim();
            
            // Skip if values are the same
            if (intelText === amdText) return;
            
            // Extract numbers for comparison
            const intelNum = parseFloat(intelText.replace(/[^0-9.]/g, ''));
            const amdNum = parseFloat(amdText.replace(/[^0-9.]/g, ''));
            
            // Determine which is better based on context
            const specName = row.querySelector('.spec-name').textContent.toLowerCase();
            
            // For TDP and price, lower is better
            if (specName.includes('tdp') || specName.includes('price') || specName.includes('msrp')) {
                if (intelNum < amdNum) {
                    intelValue.classList.add('highlight');
                } else if (amdNum < intelNum) {
                    amdValue.classList.add('highlight');
                }
            } else {
                // For other specs, higher is usually better
                if (intelNum > amdNum) {
                    intelValue.classList.add('highlight');
                } else if (amdNum > intelNum) {
                    amdValue.classList.add('highlight');
                }
            }
        }
    });
}

// Call on page load
window.addEventListener('DOMContentLoaded', highlightBetterValues);

// ================================
// PARALLAX EFFECT FOR BACKGROUND ORBS
// ================================

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const orbs = document.querySelectorAll('.gradient-orb');
    
    orbs.forEach((orb, index) => {
        const speed = (index + 1) * 0.1;
        orb.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ================================
// PERFORMANCE OPTIMIZATION
// ================================

// Lazy loading for images (if any are added later)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ================================
// SMOOTH REVEAL ON PAGE LOAD
// ================================

window.addEventListener('load', () => {
    // Remove any loading states
    document.body.classList.add('loaded');
    
    // Trigger initial animations
    const heroElements = document.querySelectorAll('.hero-section [data-aos]');
    heroElements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('aos-animate');
        }, index * 100);
    });
});

// ================================
// CURSOR TRAIL EFFECT (Optional Enhancement)
// ================================

// Create subtle glow effect following cursor on hero section
const hero = document.querySelector('.hero-section');
let cursorGlow = null;

if (hero && window.innerWidth > 768) {
    cursorGlow = document.createElement('div');
    cursorGlow.className = 'cursor-glow';
    cursorGlow.style.cssText = `
        position: fixed;
        width: 300px;
        height: 300px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(0, 168, 255, 0.15) 0%, transparent 70%);
        pointer-events: none;
        z-index: 9999;
        transition: opacity 0.3s ease;
        opacity: 0;
        mix-blend-mode: screen;
    `;
    document.body.appendChild(cursorGlow);
    
    hero.addEventListener('mousemove', (e) => {
        cursorGlow.style.opacity = '1';
        cursorGlow.style.left = (e.clientX - 150) + 'px';
        cursorGlow.style.top = (e.clientY - 150) + 'px';
    });
    
    hero.addEventListener('mouseleave', () => {
        cursorGlow.style.opacity = '0';
    });
}

// ================================
// ACTIVE SECTION HIGHLIGHTING IN NAV
// ================================

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Add active class style
const navStyle = document.createElement('style');
navStyle.textContent = `
    .nav-link.active {
        color: var(--text-primary);
    }
    
    .nav-link.active::after {
        width: 100%;
    }
`;
document.head.appendChild(navStyle);

// ================================
// MOBILE MENU TOGGLE (if needed in future)
// ================================

// This can be expanded if a mobile hamburger menu is added

// ================================
// ACCESSIBILITY ENHANCEMENTS
// ================================

// Add keyboard navigation for interactive elements
document.querySelectorAll('.selector-btn, .benchmark-filter').forEach(btn => {
    btn.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            btn.click();
        }
    });
});

// ================================
// PERFORMANCE MONITORING
// ================================

// Log performance metrics (optional, can be removed in production)
if (window.performance) {
    window.addEventListener('load', () => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`Page Load Time: ${pageLoadTime}ms`);
    });
}

// ================================
// EASTER EGG - Konami Code
// ================================

let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        
        if (konamiIndex === konamiCode.length) {
            activateEasterEgg();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateEasterEgg() {
    // Add rainbow effect to title
    const title = document.querySelector('.title-line');
    title.style.animation = 'rainbow 2s linear infinite';
    
    // Add rainbow animation
    const rainbowStyle = document.createElement('style');
    rainbowStyle.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(rainbowStyle);
    
    // Show notification
    const notification = document.createElement('div');
    notification.textContent = '🎮 ULTRA MODE ACTIVATED! 🎮';
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 30px 60px;
        border-radius: 20px;
        font-family: 'Orbitron', sans-serif;
        font-size: 24px;
        font-weight: 900;
        color: white;
        z-index: 10000;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        animation: scaleIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    `;
    
    const scaleInStyle = document.createElement('style');
    scaleInStyle.textContent = `
        @keyframes scaleIn {
            0% { transform: translate(-50%, -50%) scale(0); }
            100% { transform: translate(-50%, -50%) scale(1); }
        }
    `;
    document.head.appendChild(scaleInStyle);
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'scaleOut 0.5s ease-out forwards';
        const scaleOutStyle = document.createElement('style');
        scaleOutStyle.textContent = `
            @keyframes scaleOut {
                0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                100% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
            }
        `;
        document.head.appendChild(scaleOutStyle);
        
        setTimeout(() => notification.remove(), 500);
    }, 2000);
}

// ================================
// CLEANUP AND OPTIMIZATION
// ================================

// Remove event listeners on page unload to prevent memory leaks
window.addEventListener('beforeunload', () => {
    // Clean up any global event listeners if necessary
    if (cursorGlow) {
        cursorGlow.remove();
    }
});

console.log('🚀 CPU Wars - Intel vs AMD comparison loaded successfully!');