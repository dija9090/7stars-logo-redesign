// Interactive logo functionality
document.addEventListener('DOMContentLoaded', () => {
    const logoSvg = document.querySelector('.logo-svg');
    const container = document.querySelector('.container');
    
    // Mouse tracking for enhanced interactivity
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        container.style.setProperty('--mouse-x', x);
        container.style.setProperty('--mouse-y', y);
    });
    
    // Logo click interaction
    logoSvg.addEventListener('click', () => {
        logoSvg.style.animation = 'none';
        setTimeout(() => {
            logoSvg.style.animation = 'star-float 6s ease-in-out infinite';
        }, 10);
        
        // Trigger burst effect
        createParticleBurst(logoSvg);
    });
    
    // Logo hover effects
    logoSvg.addEventListener('mouseenter', () => {
        const starMain = document.querySelector('.star-main');
        starMain.style.animation = 'star-float 3s ease-in-out infinite';
    });
    
    logoSvg.addEventListener('mouseleave', () => {
        const starMain = document.querySelector('.star-main');
        starMain.style.animation = 'star-float 6s ease-in-out infinite';
    });
    
    // Create particle burst effect
    function createParticleBurst(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const colors = ['#00D9FF', '#FFD700', '#00DD00', '#FF6B00'];
        const particleCount = 12;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'burst-particle';
            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            
            document.body.appendChild(particle);
            
            const angle = (i / particleCount) * Math.PI * 2;
            const velocity = 5 + Math.random() * 5;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            animateParticle(particle, vx, vy);
        }
    }
    
    function animateParticle(particle, vx, vy) {
        let x = parseFloat(particle.style.left);
        let y = parseFloat(particle.style.top);
        let gravity = 0.1;
        
        function animate() {
            x += vx;
            y += vy;
            vy += gravity;
            
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            
            const opacity = parseFloat(particle.style.opacity) || 1;
            particle.style.opacity = opacity - 0.02;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        }
        
        animate();
    }
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === ' ') {
            e.preventDefault();
            logoSvg.click();
        }
        
        // 'R' to rotate
        if (e.key.toLowerCase() === 'r') {
            logoSvg.style.transform = logoSvg.style.transform === '' ? 'rotate(360deg)' : '';
            setTimeout(() => {
                logoSvg.style.transform = '';
            }, 1000);
        }
    });
    
    // Create dynamic background elements
    createDynamicElements();
    
    function createDynamicElements() {
        const starfield = document.querySelector('.starfield');
        
        // Add occasional light streaks
        setInterval(() => {
            const streak = document.createElement('div');
            streak.className = 'light-streak';
            streak.style.position = 'absolute';
            streak.style.width = Math.random() * 200 + 100 + 'px';
            streak.style.height = '2px';
            streak.style.background = 'linear-gradient(90deg, transparent, #00D9FF, transparent)';
            streak.style.left = Math.random() * 100 + '%';
            streak.style.top = Math.random() * 100 + '%';
            streak.style.opacity = '0.3';
            streak.style.pointerEvents = 'none';
            streak.style.animation = 'streak-move 2s ease-in-out';
            
            starfield.appendChild(streak);
            
            setTimeout(() => streak.remove(), 2000);
        }, 3000);
    }
});

// CSS for burst particles (added dynamically)
const style = document.createElement('style');
style.textContent = `
    .burst-particle {
        position: fixed;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        pointer-events: none;
        box-shadow: 0 0 10px currentColor;
        opacity: 1;
        z-index: 1000;
    }
    
    @keyframes streak-move {
        0% {
            transform: translateX(-100px);
            opacity: 0;
        }
        50% {
            opacity: 0.3;
        }
        100% {
            transform: translateX(100px);
            opacity: 0;
        }
    }
    
    @keyframes rotate-logo {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
    
    /* Touch device optimizations */
    @media (hover: none) {
        .logo-svg {
            width: 300px;
            height: 300px;
        }
        
        .info {
            display: none;
        }
    }
`;
document.head.appendChild(style);

// Add accessibility features
function improveAccessibility() {
    const logoSvg = document.querySelector('.logo-svg');
    logoSvg.setAttribute('role', 'img');
    logoSvg.setAttribute('aria-label', '7STARS Logo - Interactive animated logo featuring a sun, water elements, and a leaf accent');
    logoSvg.setAttribute('tabindex', '0');
    
    // Allow keyboard interaction
    logoSvg.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            logoSvg.click();
        }
    });
}

improveAccessibility();

// Performance optimization - throttle mouse tracking
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Optional: Add sound effect (optional enhancement)
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playTone(frequency = 440, duration = 100) {
    try {
        const now = audioContext.currentTime;
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(audioContext.destination);
        
        osc.frequency.value = frequency;
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + duration / 1000);
        
        osc.start(now);
        osc.stop(now + duration / 1000);
    } catch (e) {
        console.log('Audio context not available');
    }
}

// Play tone on logo click (optional)
document.querySelector('.logo-svg').addEventListener('click', () => {
    playTone(528, 100); // Healing frequency
});

// Console message
console.log('%c🌟 Welcome to 7STARS Logo 🌟', 'font-size: 20px; color: #00D9FF; font-weight: bold;');
console.log('%cClick the logo or press SPACE for effects | Press R to rotate', 'font-size: 12px; color: #FFD700;');
