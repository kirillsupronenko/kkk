// Main JavaScript for Chrono Agency - Living Website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initBackgroundAnimation();
    initThemeSwitcher();
    initMoodSwitcher();
    initTimeBasedTheme();
    initDeviceDetection();
    initScrollAnimations();
    initCounterAnimation();
    initFormHandler();
    initMobileMenu();
    initAudioEffects();
    updateCurrentYear();
    
    // Initial UI updates
    updateTimeDisplay();
    updateDynamicContent();
    
    // Setup periodic updates
    setInterval(updateTimeDisplay, 60000); // Update time every minute
    setInterval(updateDynamicContent, 300000); // Update dynamic content every 5 minutes
});

// ========== MODULE 1: Background Animation ==========
function initBackgroundAnimation() {
    const bgAnimation = document.getElementById('bgAnimation');
    if (!bgAnimation) return;
    
    // Clear any existing particles
    bgAnimation.innerHTML = '';
    
    // Create particles based on screen size
    const particleCount = Math.min(50, Math.floor(window.innerWidth * window.innerHeight / 10000));
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(bgAnimation);
    }
    
    // Recreate particles on window resize
    window.addEventListener('resize', function() {
        bgAnimation.innerHTML = '';
        const newCount = Math.min(50, Math.floor(window.innerWidth * window.innerHeight / 10000));
        for (let i = 0; i < newCount; i++) {
            createParticle(bgAnimation);
        }
    });
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random size between 5 and 20px
    const size = Math.random() * 15 + 5;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Random position
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    
    // Random color opacity
    const opacity = Math.random() * 0.1 + 0.05;
    particle.style.opacity = opacity;
    
    // Random animation delay and duration
    const delay = Math.random() * 10;
    const duration = Math.random() * 10 + 15;
    particle.style.animationDelay = `${delay}s`;
    particle.style.animationDuration = `${duration}s`;
    
    container.appendChild(particle);
}

// ========== MODULE 2: Theme Switcher (Time of Day) ==========
function initThemeSwitcher() {
    const themeButtons = document.querySelectorAll('.theme-btn');
    const themeLinks = document.querySelectorAll('.change-theme');
    
    // Function to set theme
    function setTheme(themeName) {
        // Remove all theme classes
        document.body.classList.remove('theme-day', 'theme-morning', 'theme-evening', 'theme-night');
        
        // Add selected theme class
        document.body.classList.add(`theme-${themeName}`);
        
        // Update active button state
        themeButtons.forEach(btn => {
            if (btn.dataset.theme === themeName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Save to localStorage
        localStorage.setItem('preferredTheme', themeName);
        
        // Play sound effect
        playSound('themeSound');
        
        // Update dynamic content based on theme
        updateDynamicContent();
    }
    
    // Add click handlers to theme buttons
    themeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            setTheme(this.dataset.theme);
        });
    });
    
    // Add click handlers to theme links in footer
    themeLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            setTheme(this.dataset.theme);
            scrollToTop();
        });
    });
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('preferredTheme');
    if (savedTheme) {
        setTheme(savedTheme);
    }
}

// ========== MODULE 3: Mood Switcher ==========
function initMoodSwitcher() {
    const moodButtons = document.querySelectorAll('.mood-btn');
    const moodLinks = document.querySelectorAll('.change-mood');
    const moodOptions = document.querySelectorAll('.mood-option');
    
    // Function to set mood
    function setMood(moodName) {
        // Remove all mood classes
        document.body.classList.remove('mood-peaceful', 'mood-energetic', 'mood-mysterious');
        
        // Add selected mood class
        document.body.classList.add(`mood-${moodName}`);
        
        // Update active button state
        moodButtons.forEach(btn => {
            if (btn.dataset.mood === moodName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Update form mood options
        moodOptions.forEach(option => {
            if (option.dataset.mood === moodName) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
        
        // Save to localStorage
        localStorage.setItem('preferredMood', moodName);
        
        // Play sound effect
        playSound('themeSound');
        
        // Update animation speed based on mood
        updateAnimationSpeed();
    }
    
    // Add click handlers to mood buttons
    moodButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            setMood(this.dataset.mood);
        });
    });
    
    // Add click handlers to mood links in footer
    moodLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            setMood(this.dataset.mood);
            scrollToTop();
        });
    });
    
    // Add click handlers to mood options in form
    moodOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Set all options to inactive
            moodOptions.forEach(opt => opt.classList.remove('active'));
            // Set this option to active
            this.classList.add('active');
            // Change the site mood
            setMood(this.dataset.mood);
        });
    });
    
    // Check for saved mood preference
    const savedMood = localStorage.getItem('preferredMood');
    if (savedMood) {
        setMood(savedMood);
    }
}

// Update CSS animation speed based on mood
function updateAnimationSpeed() {
    const root = document.documentElement;
    const animationSpeed = getComputedStyle(root).getPropertyValue('--animation-speed');
    console.log(`Animation speed: ${animationSpeed}`);
}

// ========== MODULE 4: Time-Based Theme ==========
function initTimeBasedTheme() {
    // Set theme based on time of day (if no user preference)
    const savedTheme = localStorage.getItem('preferredTheme');
    if (!savedTheme) {
        const hour = new Date().getHours();
        let timeTheme;
        
        if (hour >= 5 && hour < 10) timeTheme = 'morning';
        else if (hour >= 10 && hour < 17) timeTheme = 'day';
        else if (hour >= 17 && hour < 22) timeTheme = 'evening';
        else timeTheme = 'night';
        
        document.body.classList.add(`theme-${timeTheme}`);
        
        // Update active button
        const themeBtn = document.querySelector(`.theme-btn[data-theme="${timeTheme}"]`);
        if (themeBtn) {
            document.querySelectorAll('.theme-btn').forEach(btn => btn.classList.remove('active'));
            themeBtn.classList.add('active');
        }
    }
}

// Update time display in header
function updateTimeDisplay() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    
    const timeElement = document.getElementById('currentTime');
    const labelElement = document.getElementById('timeLabel');
    
    if (timeElement) {
        timeElement.textContent = `${hours}:${minutes}`;
    }
    
    if (labelElement) {
        const hour = now.getHours();
        if (hour >= 5 && hour < 10) labelElement.textContent = 'Утро';
        else if (hour >= 10 && hour < 17) labelElement.textContent = 'День';
        else if (hour >= 17 && hour < 22) labelElement.textContent = 'Вечер';
        else labelElement.textContent = 'Ночь';
    }
}

// ========== MODULE 5: Device Detection ==========
function initDeviceDetection() {
    const deviceIndicator = document.getElementById('deviceIndicator');
    if (!deviceIndicator) return;
    
    function updateDeviceInfo() {
        const isMobile = window.innerWidth <= 768;
        const icon = deviceIndicator.querySelector('i');
        const text = deviceIndicator.querySelector('span');
        
        if (isMobile) {
            icon.className = 'fas fa-mobile-alt';
            text.textContent = 'Мобильный';
        } else if (window.innerWidth <= 1024) {
            icon.className = 'fas fa-tablet-alt';
            text.textContent = 'Планшет';
        } else {
            icon.className = 'fas fa-desktop';
            text.textContent = 'ПК';
        }
        
        // Update body class for device-specific styles
        document.body.classList.remove('device-mobile', 'device-tablet', 'device-desktop');
        if (isMobile) {
            document.body.classList.add('device-mobile');
        } else if (window.innerWidth <= 1024) {
            document.body.classList.add('device-tablet');
        } else {
            document.body.classList.add('device-desktop');
        }
    }
    
    // Initial update
    updateDeviceInfo();
    
    // Update on resize
    window.addEventListener('resize', updateDeviceInfo);
}

// ========== MODULE 6: Scroll Animations ==========
function initScrollAnimations() {
    // Create Intersection Observer for fade-in animations
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all fade-in elements
    fadeElements.forEach(el => observer.observe(el));
    
    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(el => {
            const speed = el.dataset.speed || 0.5;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// ========== MODULE 7: Counter Animation ==========
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current);
                setTimeout(updateCounter, 20);
            } else {
                counter.textContent = target;
            }
        };
        
        // Start counter when element is in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(counter);
    });
}

// ========== MODULE 8: Form Handler ==========
function initFormHandler() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = this.querySelector('input[type="text"]').value;
        
        // Show success message
        alert(`Спасибо, ${name}! Ваше сообщение отправлено. Мы свяжемся с вами в ближайшее время.`);
        
        // Reset form
        this.reset();
        
        // Play sound
        playSound('clickSound');
    });
}

// ========== MODULE 9: Mobile Menu ==========
function initMobileMenu() {
    const burgerBtn = document.getElementById('burgerBtn');
    const nav = document.querySelector('.nav');
    
    if (burgerBtn && nav) {
        burgerBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
            burgerBtn.classList.toggle('active');
            playSound('clickSound');
        });
        
        // Close menu when clicking on a link
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                nav.classList.remove('active');
                burgerBtn.classList.remove('active');
            });
        });
    }
}

// ========== MODULE 10: Audio Effects ==========
function initAudioEffects() {
    // Add hover sound to interactive elements
    const interactiveElements = document.querySelectorAll('.btn, .theme-btn, .mood-btn, .social-link, .nav-list a');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', function() {
            playSound('hoverSound', 0.3);
        });
        
        el.addEventListener('click', function() {
            playSound('clickSound', 0.5);
        });
    });
}

function playSound(soundId, volume = 0.5) {
    const sound = document.getElementById(soundId);
    if (sound) {
        sound.volume = volume;
        sound.currentTime = 0;
        sound.play().catch(e => console.log("Audio play failed:", e));
    }
}

// ========== MODULE 11: Dynamic Content Updates ==========
function updateDynamicContent() {
    // Update hero text based on time of day and mood
    const hour = new Date().getHours();
    const titleElement = document.getElementById('dynamicTitle');
    
    if (titleElement) {
        let timeOfDay;
        if (hour >= 5 && hour < 10) timeOfDay = 'утро';
        else if (hour >= 10 && hour < 17) timeOfDay = 'день';
        else if (hour >= 17 && hour < 22) timeOfDay = 'вечер';
        else timeOfDay = 'ночь';
        
        const titles = [
            `Создаём цифровые впечатления, которые живут и дышат`,
            `Интерактивные решения для вашего бизнеса`,
            `Дизайн, который чувствует и адаптируется`,
            `Технологии, которые понимают контекст`
        ];
        
        // Change title every 5 minutes
        const titleIndex = Math.floor(hour / 6) % titles.length;
        titleElement.innerHTML = titles[titleIndex].replace('живут', `<span class="highlight">живут</span>`);
    }
    
    // Update stats with random but realistic numbers
    const projectsElement = document.getElementById('projectsCount');
    const clientsElement = document.getElementById('clientsCount');
    const yearsElement = document.getElementById('yearsCount');
    
    if (projectsElement) projectsElement.textContent = '127';
    if (clientsElement) clientsElement.textContent = '89';
    if (yearsElement) yearsElement.textContent = '5';
}

// ========== HELPER FUNCTIONS ==========
function updateCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Check for system preference (dark/light mode)
function checkSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // If system prefers dark mode and user hasn't set a preference
        if (!localStorage.getItem('preferredTheme')) {
            document.body.classList.add('theme-night');
        }
    }
}

// Initialize system theme check
checkSystemTheme();

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', checkSystemTheme);

// Add fade-in class to elements on load
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Add fade-in class to main sections
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        setTimeout(() => {
            section.classList.add('fade-in');
        }, index * 100);
    });
});