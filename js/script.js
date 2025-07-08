
// Mobile Navigation
function initMobileMenu() {
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    if (!mobileBtn || !navMenu) return;
    
    // Toggle menu
    mobileBtn.addEventListener('click', () => {
        mobileBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileBtn.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileBtn.contains(e.target) && !navMenu.contains(e.target)) {
            mobileBtn.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Simple DOM ready initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM loaded, initializing...');
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Add active state to current page navigation
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });
});

// Premium Scroll to Top Button
function createScrollToTopButton() {
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
    scrollToTopBtn.addEventListener('click', smoothScrollToTop);
    document.body.appendChild(scrollToTopBtn);
    return scrollToTopBtn;
}

const scrollToTopBtn = createScrollToTopButton();

// Enhanced scroll effects with throttling
let ticking = false;

function updateScrollEffects() {
    const scrollY = window.pageYOffset;
    const header = document.querySelector('.header');
    
    // Header scroll effect
    if (scrollY > 100) {
        header.classList.add('scrolled');
        scrollToTopBtn.classList.add('visible');
    } else {
        header.classList.remove('scrolled');
        scrollToTopBtn.classList.remove('visible');
    }
    
    // Parallax effect for hero
    const hero = document.querySelector('.hero-bg-image');
    if (hero && scrollY < window.innerHeight) {
        hero.style.transform = `translateY(${scrollY * 0.5}px)`;
    }
    
    ticking = false;
}

function requestScrollUpdate() {
    if (!ticking) {
        requestAnimationFrame(updateScrollEffects);
        ticking = true;
    }
}

// Smooth scroll to top function
function smoothScrollToTop() {
    const startY = window.pageYOffset;
    const startTime = performance.now();
    const duration = 1000;
    
    function animateScroll(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out cubic)
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        
        window.scrollTo(0, startY * (1 - easeOutCubic));
        
        if (progress < 1) {
            requestAnimationFrame(animateScroll);
        }
    }
    
    requestAnimationFrame(animateScroll);
}

// Simplified Animation System (no scroll animations)
function initializeAnimations() {
    // Just show all elements immediately without fade-in effects
    const animatedElements = document.querySelectorAll(
        '.trust-item, .stat-card, .program-card, .card, h2, h3, .section-subtitle'
    );
    
    animatedElements.forEach((el) => {
        el.classList.add('visible');
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
    });
    
    // Counter animations (keep these as they're useful)
    initializeCounters();
    
    // Initialize program statistics if on programs page
    if (window.location.pathname.includes('programs.html')) {
        initializeProgramStats();
    }
}

// Premium Counter Animation
function initializeCounters() {
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('.stat-number').forEach(counter => {
        counterObserver.observe(counter);
    });
    
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target')) || parseInt(element.textContent);
    const duration = 2000;
    const startTime = performance.now();
    const startValue = 0;
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 2);
        const currentValue = Math.floor(startValue + (target * easeOut));
        
        element.textContent = currentValue + (target > 10 ? '+' : '');
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + (target > 10 ? '+' : '');
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Program Statistics Animation
function initializeProgramStats() {
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateProgramProgress(entry.target);
                progressObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('.progress-fill').forEach(bar => {
        progressObserver.observe(bar);
    });
}

function animateProgramProgress(element) {
    const progressValue = parseInt(element.getAttribute('data-progress')) || 0;
    
    // Calculate percentage based on the specific targets
    let percentage = 0;
    const parentItem = element.closest('.statistic-item');
    const title = parentItem.querySelector('h4').textContent;
    
    if (title.includes('Households')) {
        percentage = Math.min((progressValue / 750) * 100, 100);
    } else if (title.includes('Students')) {
        percentage = Math.min((progressValue / 100) * 100, 100);
    } else if (title.includes('Communities')) {
        percentage = Math.min((progressValue / 100) * 100, 100);
    } else if (title.includes('Daily Support')) {
        percentage = Math.min((progressValue / 24) * 100, 100);
    }
    
    // Ensure minimum width for visibility even at 0%
    const finalWidth = Math.max(percentage, 0.5);
    
    // Animate the progress bar fill
    setTimeout(() => {
        element.style.width = finalWidth + '%';
    }, 300);
    
    // Update the percentage text
    const progressText = parentItem.querySelector('.progress-text');
    if (progressText) {
        const duration = 1500;
        const startTime = performance.now();
        const startPercent = 0;
        
        function updateProgressText(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOut = 1 - Math.pow(1 - progress, 2);
            const currentPercent = Math.floor(startPercent + (percentage * easeOut));
            
            progressText.textContent = currentPercent + '% of target reached';
            
            if (progress < 1) {
                requestAnimationFrame(updateProgressText);
            } else {
                progressText.textContent = Math.round(percentage) + '% of target reached';
            }
        }
        
        requestAnimationFrame(updateProgressText);
    }
}

// Event listeners
window.addEventListener('scroll', requestScrollUpdate);
window.addEventListener('resize', () => {
    // Handle resize events
    const mobileMenu = document.querySelector('.nav-menu');
    if (window.innerWidth > 768 && mobileMenu.classList.contains('active')) {
        closeMobileMenu();
    }
});

// Premium Mobile Navigation
function initializeMobileNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navOverlay = document.querySelector('.nav-overlay') || createNavOverlay();
    const body = document.body;
    
    // Debug logging
    console.log('Initializing mobile navigation...');
    console.log('Hamburger element:', hamburger);
    console.log('Nav menu element:', navMenu);
    
    function createNavOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        document.body.appendChild(overlay);
        overlay.addEventListener('click', closeMobileMenu);
        return overlay;
    }
    
    function openMobileMenu() {
        hamburger.classList.add('active');
        navMenu.classList.add('active');
        navOverlay.classList.add('active');
        body.classList.add('menu-open');
        
        // Prevent background scrolling
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        
        // Add stagger animation to menu items
        const menuItems = navMenu.querySelectorAll('li');
        menuItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
            item.classList.add('slide-in');
        });
    }
    
    function closeMobileMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        navOverlay.classList.remove('active');
        body.classList.remove('menu-open');
        
        // Restore scrolling
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        
        // Remove animation classes
        const menuItems = navMenu.querySelectorAll('li');
        menuItems.forEach(item => {
            item.classList.remove('slide-in');
            item.style.animationDelay = '';
        });
    }
    
// Event listeners
    if (hamburger && navMenu) {
        console.log('Adding click event listener to hamburger');
        hamburger.addEventListener('click', (e) => {
            console.log('Hamburger clicked!');
            if (hamburger.classList.contains('active')) {
                console.log('Closing mobile menu');
                closeMobileMenu();
            } else {
                console.log('Opening mobile menu');
                openMobileMenu();
            }
            e.preventDefault();
            e.stopPropagation(); 
        });
        
        // Also add touch event for mobile
        hamburger.addEventListener('touchstart', (e) => {
            console.log('Hamburger touched!');
            if (hamburger.classList.contains('active')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
            e.preventDefault();
        });
        
        // Close menu when clicking on navigation links
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    const href = link.getAttribute('href');
                    if (href && href.startsWith('#')) {
                        setTimeout(closeMobileMenu, 300);
                    } else {
                        closeMobileMenu();
                        // Do not preventDefault for non-anchor links
                    }
                }
            }, { passive: true });
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }
    
    // Make closeMobileMenu globally accessible
    window.closeMobileMenu = closeMobileMenu;
}

// Enhanced smooth scrolling for anchor links
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                
                // Close mobile menu if open
                if (window.closeMobileMenu && window.innerWidth <= 768) {
                    window.closeMobileMenu();
                }
                
                // Smooth scroll
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Form enhancements
function enhanceForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Add floating label effect
            if (input.value) {
                input.classList.add('has-value');
            }
            
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                input.parentElement.classList.remove('focused');
                if (input.value) {
                    input.classList.add('has-value');
                } else {
                    input.classList.remove('has-value');
                }
            });
        });
    });
}

// Contact Form Handling
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    console.log('Initializing contact form...');
    
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        console.log('Contact form submitted!');
        
        // Get form data
        const formData = {
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            email: document.getElementById('email').value.trim(),
            subject: document.getElementById('subject').value.trim(),
            message: document.getElementById('message').value.trim()
        };
        
        console.log('Form data:', formData);
        
        // Clear previous errors
        clearFormErrors();
        
        // Validate form
        const errors = validateContactForm(formData);
        if (errors.length > 0) {
            displayFormErrors(errors);
            return;
        }
        
        // Show loading state
        setFormLoading(true);
        
        try {
            // Try PHP handler first
            const response = await fetch('contact_handler.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            console.log('Server response:', result);
            
            if (result.success) {
                // Success - show success message and reset form
                showSuccessMessage(result.message);
                contactForm.reset();
                // Remove any has-value classes
                contactForm.querySelectorAll('.has-value').forEach(el => el.classList.remove('has-value'));
            } else {
                // Server returned errors
                if (result.errors) {
                    displayFormErrors(result.errors);
                } else {
                    showErrorMessage(result.message || 'Something went wrong. Please try again.');
                }
            }
        } catch (error) {
            console.error('PHP handler not available, using mailto fallback:', error);
            
            // Fallback to mailto if PHP handler is not available
            const subject = encodeURIComponent(`R.I.S.E Foundation Contact: ${formData.subject}`);
            const body = encodeURIComponent(`Name: ${formData.firstName} ${formData.lastName}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`);
            const mailtoUrl = `mailto:contact.risefoundation@gmail.com?subject=${subject}&body=${body}`;
            
            // Open email client
            window.location.href = mailtoUrl;
            
            // Show success message
            showSuccessMessage('Your email client will open to send the message. Please send it to complete your contact request.');
            contactForm.reset();
            contactForm.querySelectorAll('.has-value').forEach(el => el.classList.remove('has-value'));
        } finally {
            setFormLoading(false);
        }
    });
}

function validateContactForm(data) {
    const errors = [];
    
    if (!data.firstName) errors.push('First name is required');
    if (!data.lastName) errors.push('Last name is required');
    if (!data.email) {
        errors.push('Email is required');
    } else if (!isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }
    if (!data.subject) errors.push('Subject is required');
    if (!data.message) errors.push('Message is required');
    
    return errors;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function clearFormErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
        el.style.display = 'none';
    });
    document.querySelectorAll('.form-control').forEach(el => {
        el.classList.remove('error');
        el.setAttribute('aria-invalid', 'false');
    });
}

function displayFormErrors(errors) {
    // Show general errors
    if (errors.length > 0) {
        showErrorMessage(errors.join(', '));
    }
}

function setFormLoading(loading) {
    const submitBtn = document.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    if (loading) {
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-block';
        submitBtn.classList.add('loading');
    } else {
        submitBtn.disabled = false;
        btnText.style.display = 'inline-block';
        btnLoading.style.display = 'none';
        submitBtn.classList.remove('loading');
    }
}

function showSuccessMessage(message) {
    // Remove any existing notifications
    removeExistingNotifications();
    
    const notification = document.createElement('div');
    notification.className = 'notification success';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function showErrorMessage(message) {
    // Remove any existing notifications
    removeExistingNotifications();
    
    const notification = document.createElement('div');
    notification.className = 'notification error';
    notification.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 7 seconds for errors
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 7000);
}

function removeExistingNotifications() {
    document.querySelectorAll('.notification').forEach(notification => {
        notification.remove();
    });
}

// All other initializations combined
document.addEventListener('DOMContentLoaded', function() {
    initializeSmoothScrolling();
    enhanceForms();
    initializeContactForm();
    initializeAnimations();
});

// Fast Performance Optimization
function optimizePerformance() {
    // Handle image placeholders immediately
    initializeImagePlaceholders();
}

// Handle images - try to load real images first, show placeholders only if they fail
function initializeImagePlaceholders() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        const img = item.querySelector('img');
        const placeholder = item.querySelector('.image-placeholder');
        
        if (img && placeholder) {
            // Initially show placeholder while image loads
            img.style.display = 'none';
            placeholder.style.display = 'flex';
            
            // Try to load the actual image
            const tempImg = new Image();
            
            tempImg.onload = function() {
                // Image loaded successfully - show image, hide placeholder
                img.style.display = 'block';
                placeholder.style.display = 'none';
                console.log('Image loaded successfully:', img.src);
            };
            
            tempImg.onerror = function() {
                // Image failed to load - keep placeholder visible
                img.style.display = 'none';
                placeholder.style.display = 'flex';
                console.log('Image failed to load:', img.src);
            };
            
            // Start loading the image
            tempImg.src = img.src;
        }
    });
    
    // Handle hero background image - try to load logo.jpg
    const heroBgImg = document.querySelector('.hero-bg-image');
    if (heroBgImg) {
        heroBgImg.onerror = function() {
            // If logo.jpg fails to load, hide the image
            this.style.display = 'none';
            console.log('Hero background image (logo.jpg) failed to load');
        };
        
        heroBgImg.onload = function() {
            console.log('Hero background image (logo.jpg) loaded successfully');
        };
    }
}

// Initialize immediately when DOM is ready (not waiting for full load)
document.addEventListener('DOMContentLoaded', optimizePerformance);

// Footer dropdown functionality
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        var dropdown = document.querySelector('.footer-dropdown');
        var btn = document.querySelector('.footer-dropdown-btn');
        var menu = document.querySelector('.footer-dropdown-menu');
        if (!dropdown || !btn || !menu) return;
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            var expanded = btn.getAttribute('aria-expanded') === 'true';
            btn.setAttribute('aria-expanded', !expanded);
            dropdown.classList.toggle('open');
        });
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('open');
                btn.setAttribute('aria-expanded', 'false');
            }
        });
    });
})();

// Animate impact stats progress bars on scroll
(function() {
    function animateStatBars() {
        document.querySelectorAll('.stat-bar-fill').forEach(function(bar) {
            var value = parseInt(bar.getAttribute('data-value')) || 0;
            var target = parseInt(bar.getAttribute('data-target')) || 1;
            var percent = Math.round((value / target) * 100);
            if (percent > 100) percent = 100;
            bar.style.width = percent + '%';
        });
    }
    // Use IntersectionObserver for animation on scroll
    var observer = new window.IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                animateStatBars();
                observer.disconnect();
            }
        });
    }, { threshold: 0.3 });
    var section = document.querySelector('.impact-stats');
    if (section) observer.observe(section);
})();
