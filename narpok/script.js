// Enhanced NARPOK NAROK Website JavaScript
// Modern JavaScript with ES6+ features, accessibility improvements, and performance optimizations

'use strict';

// Global configuration
const CONFIG = {
    ANIMATION_DURATION: 300,
    SCROLL_THRESHOLD: 100,
    FORM_VALIDATION_DELAY: 500,
    AOS_SETTINGS: {
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
        offset: 50
    }
};

// Utility functions
const Utils = {
    // Debounce function for performance optimization
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
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
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
    },

    // Smooth scroll to element
    smoothScrollTo(element, offset = 0) {
        const targetPosition = element.offsetTop - offset;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    },

    // Format phone number for display
    formatPhoneNumber(phone) {
        return phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
    },

    // Sanitize HTML to prevent XSS
    sanitizeHTML(str) {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    }
};

// DOM Ready function
function domReady(fn) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fn);
    } else {
        fn();
    }
}

// Initialize AOS (Animate On Scroll)
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init(CONFIG.AOS_SETTINGS);
    }
}

// Navigation functionality
const Navigation = {
    init() {
        this.setupScrollEffect();
        this.setupActiveNavigation();
        this.setupMobileNavigation();
        this.setupSmoothScrolling();
    },

    setupScrollEffect() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        const handleScroll = Utils.throttle(() => {
            if (window.scrollY > CONFIG.SCROLL_THRESHOLD) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }, 100);

        window.addEventListener('scroll', handleScroll);
    },

    setupActiveNavigation() {
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        const sections = document.querySelectorAll('section[id]');

        const handleScroll = Utils.throttle(() => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.clientHeight;
                
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }, 100);

        window.addEventListener('scroll', handleScroll);
    },

    setupMobileNavigation() {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        const navLinks = document.querySelectorAll('.nav-link');

        // Close mobile menu when clicking on nav links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                    bsCollapse.hide();
                }
            });
        });
    },

    setupSmoothScrolling() {
        const navLinks = document.querySelectorAll('a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    const navbarHeight = document.querySelector('.navbar').offsetHeight;
                    Utils.smoothScrollTo(targetElement, navbarHeight + 20);
                }
            });
        });
    }
};

// Back to top functionality
const BackToTop = {
    init() {
        this.createButton();
        this.setupScrollListener();
    },

    createButton() {
        this.button = document.getElementById('backToTop');
        if (!this.button) return;

        this.button.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Add keyboard support
        this.button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.button.click();
            }
        });
    },

    setupScrollListener() {
        if (!this.button) return;

        const handleScroll = Utils.throttle(() => {
            if (window.scrollY > CONFIG.SCROLL_THRESHOLD * 3) {
                this.button.style.display = 'block';
                this.button.style.opacity = '1';
            } else {
                this.button.style.opacity = '0';
                setTimeout(() => {
                    if (this.button.style.opacity === '0') {
                        this.button.style.display = 'none';
                    }
                }, CONFIG.ANIMATION_DURATION);
            }
        }, 100);

        window.addEventListener('scroll', handleScroll);
    }
};

// Modal functionality
const ModalManager = {
    init() {
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
    },

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const openModals = document.querySelectorAll('.modal.show');
                openModals.forEach(modal => {
                    const bsModal = bootstrap.Modal.getInstance(modal);
                    if (bsModal) {
                        bsModal.hide();
                    }
                });
            }
        });
    },

    setupFocusManagement() {
        const modals = document.querySelectorAll('.modal');
        
        modals.forEach(modal => {
            modal.addEventListener('shown.bs.modal', () => {
                const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                if (firstFocusable) {
                    firstFocusable.focus();
                }
            });
        });
    }
};

// Contact Form Handling
const ContactForm = {
    init() {
        this.form = document.getElementById('contactForm');
        if (!this.form) return;

        this.setupFormValidation();
        this.setupFormSubmission();
    },

    setupFormValidation() {
        const inputs = this.form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', Utils.debounce(() => this.validateField(input), 300));
        });
    },

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let message = '';

        // Clear previous validation
        field.classList.remove('is-valid', 'is-invalid');
        
        // Required validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            message = `${this.getFieldLabel(field)} is required.`;
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                message = 'Please enter a valid email address.';
            }
        }

        // Apply validation styles
        field.classList.add(isValid ? 'is-valid' : 'is-invalid');
        
        // Show/hide feedback
        let feedback = field.parentNode.querySelector('.invalid-feedback');
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.className = 'invalid-feedback';
            field.parentNode.appendChild(feedback);
        }
        feedback.textContent = message;

        return isValid;
    },

    getFieldLabel(field) {
        const label = field.parentNode.querySelector('label');
        return label ? label.textContent : field.name;
    },

    setupFormSubmission() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validate all fields
            const inputs = this.form.querySelectorAll('input, textarea, select');
            let isFormValid = true;
            
            inputs.forEach(input => {
                if (!this.validateField(input)) {
                    isFormValid = false;
                }
            });

            if (isFormValid) {
                this.submitForm();
            }
        });
    },

    async submitForm() {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
        submitBtn.disabled = true;

        try {
            // Simulate form submission (replace with actual API call)
            await this.simulateSubmission();
            
            this.showMessage('Thank you! Your message has been sent successfully.', 'success');
            this.form.reset();
            
            // Clear validation classes
            const inputs = this.form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.classList.remove('is-valid', 'is-invalid');
            });

        } catch (error) {
            this.showMessage('Sorry, there was an error sending your message. Please try again.', 'error');
        } finally {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    },

    simulateSubmission() {
        return new Promise((resolve) => {
            setTimeout(resolve, 2000);
        });
    },

    showMessage(message, type) {
        // Create or update message container
        let messageContainer = document.getElementById('form-message');
        if (!messageContainer) {
            messageContainer = document.createElement('div');
            messageContainer.id = 'form-message';
            this.form.insertBefore(messageContainer, this.form.firstChild);
        }

        const alertClass = type === 'success' ? 'alert-success' : 'alert-danger';
        messageContainer.innerHTML = `
            <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;

        // Auto-hide success messages
        if (type === 'success') {
            setTimeout(() => {
                const alert = messageContainer.querySelector('.alert');
                if (alert) {
                    const bsAlert = new bootstrap.Alert(alert);
                    bsAlert.close();
                }
            }, 5000);
        }
    }
};

// Statistics Counter Animation
const StatsCounter = {
    init() {
        this.setupCounters();
    },

    setupCounters() {
        const counters = document.querySelectorAll('.stat-number');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        counters.forEach(counter => observer.observe(counter));
    },

    animateCounter(element) {
        const target = element.textContent;
        const isPercentage = target.includes('%');
        const isTime = target.includes('/');
        
        if (isPercentage || isTime) {
            // For percentage or time values, just fade them in
            element.style.opacity = '0';
            element.animate([
                { opacity: 0, transform: 'translateY(20px)' },
                { opacity: 1, transform: 'translateY(0)' }
            ], {
                duration: 1000,
                easing: 'ease-out',
                fill: 'forwards'
            });
            return;
        }

        const numericValue = parseInt(target.replace(/\D/g, ''));
        if (isNaN(numericValue)) return;

        let current = 0;
        const increment = numericValue / 60; // 60 frames for smooth animation
        const timer = setInterval(() => {
            current += increment;
            if (current >= numericValue) {
                current = numericValue;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + (target.includes('+') ? '+' : '');
        }, 16); // ~60fps
    }
};

// Accessibility enhancements
const Accessibility = {
    init() {
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupAriaLabels();
    },

    setupKeyboardNavigation() {
        // Make card elements keyboard accessible
        const cards = document.querySelectorAll('.service-card, .training-card, .team-member-card');
        
        cards.forEach(card => {
            if (!card.hasAttribute('tabindex')) {
                card.setAttribute('tabindex', '0');
            }
            
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
            });
        });
    },

    setupFocusManagement() {
        // Show focus outline only for keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    },

    setupAriaLabels() {
        // Add missing aria-labels
        const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
        phoneLinks.forEach(link => {
            if (!link.hasAttribute('aria-label')) {
                link.setAttribute('aria-label', `Call ${link.textContent.trim()}`);
            }
        });

        const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
        emailLinks.forEach(link => {
            if (!link.hasAttribute('aria-label')) {
                link.setAttribute('aria-label', `Email ${link.textContent.trim()}`);
            }
        });
    }
};

// Performance optimizations
const Performance = {
    init() {
        this.setupLazyLoading();
        this.preloadCriticalImages();
    },

    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    },

    preloadCriticalImages() {
        const criticalImages = [
            'images/9UB4SnSJ_400x400.png',
            'images/WhatsApp Image 2025-06-27 at 11.57.33_a7961dc8.jpg'
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }
};

// Initialize everything when DOM is ready
domReady(() => {
    try {
        // Initialize all modules
        Navigation.init();
        BackToTop.init();
        ModalManager.init();
        ContactForm.init();
        StatsCounter.init();
        Accessibility.init();
        Performance.init();
        
        // Initialize AOS animations
        initAOS();

        console.log('🛡️ NARPOK NAROK website initialized successfully!');

    } catch (error) {
        console.error('Error initializing website:', error);
    }
});

// Export for global access
window.NARPOK = {
    utils: Utils,
    navigation: Navigation,
    contactForm: ContactForm
};
