/**
 * Hannah Davies Occupational Therapy - Core JavaScript
 * Handles Navigation, Mobile Menu, Scroll Animations, and Form Validation
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // 1. Navigation Header Scroll Effect
    // -------------------------------------------------------------
    const header = document.querySelector('.site-header');
    const handleHeaderScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleHeaderScroll);
    handleHeaderScroll(); // Run on startup in case page loaded scrolled

    // -------------------------------------------------------------
    // 2. Mobile Menu Drawer Navigation Toggle
    // -------------------------------------------------------------
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const primaryNav = document.querySelector('.primary-navigation');
    const navLinks = document.querySelectorAll('.nav-link');

    const toggleMenu = () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        menuToggle.classList.toggle('open');
        primaryNav.classList.toggle('open');
        
        // Prevent body scroll when menu is open on mobile
        document.body.style.overflow = !isExpanded ? 'hidden' : '';
    };

    menuToggle.addEventListener('click', toggleMenu);

    // Close menu when clicking on any navigation link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (primaryNav.classList.contains('open')) {
                toggleMenu();
            }
        });
    });

    // -------------------------------------------------------------
    // 3. Back-to-Top Button Functionality
    // -------------------------------------------------------------
    const backToTopBtn = document.getElementById('back-to-top-btn');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    // -------------------------------------------------------------
    // 4. Scroll Animations (Intersection Observer)
    // -------------------------------------------------------------
    const animationObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // trigger when 15% of the element is visible
    };

    const animateOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-active');
                // Unobserve once animation has triggered
                observer.unobserve(entry.target);
            }
        });
    }, animationObserverOptions);

    // Get all targets to animate
    const animElements = document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-left, .fade-in-right');
    animElements.forEach(el => animateOnScroll.observe(el));

    // -------------------------------------------------------------
    // 5. Active Link Highlighting on Scroll
    // -------------------------------------------------------------
    const sections = document.querySelectorAll('section[id]');
    const sectionObserverOptions = {
        root: null,
        rootMargin: '-30% 0px -60% 0px', // focused viewport zone
        threshold: 0
    };

    const highlightActiveNav = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href === '#' && sectionId === 'home') {
                        link.classList.add('active');
                    } else if (href === `#${sectionId}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, sectionObserverOptions);

    sections.forEach(section => highlightActiveNav.observe(section));

    // -------------------------------------------------------------
    // 6. Contact Form Validation and Submission
    // -------------------------------------------------------------
    const form = document.getElementById('clinical-contact-form');
    const submitBtn = document.getElementById('form-submit-btn');
    const successAlert = document.getElementById('form-success-alert');
    const errorAlert = document.getElementById('form-error-alert');

    // Input elements
    const fields = {
        fullname: {
            element: document.getElementById('fullname'),
            error: document.getElementById('fullname-error'),
            validate: (value) => value.trim().length > 1,
            errorMessage: 'Please enter your full name (minimum 2 characters).'
        },
        email: {
            element: document.getElementById('email'),
            error: document.getElementById('email-error'),
            validate: (value) => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value.trim());
            },
            errorMessage: 'Please enter a valid email address.'
        },
        message: {
            element: document.getElementById('message'),
            error: document.getElementById('message-error'),
            validate: (value) => value.trim().length > 9,
            errorMessage: 'Please describe your inquiry (minimum 10 characters).'
        },
        consent: {
            element: document.getElementById('privacy-consent'),
            error: document.getElementById('consent-error'),
            validate: (value, element) => element.checked,
            errorMessage: 'You must agree to the processing of your details for clinical inquiries.'
        }
    };

    // Remove validation states on input change
    Object.keys(fields).forEach(key => {
        const item = fields[key];
        const eventType = key === 'consent' ? 'change' : 'input';
        
        item.element.addEventListener(eventType, () => {
            if (item.element.classList.contains('invalid')) {
                item.element.classList.remove('invalid');
                item.error.classList.remove('visible');
                item.error.textContent = '';
            }
            // Hide the error alert banner if they start modifying fields
            errorAlert.style.display = 'none';
        });
    });

    const validateForm = () => {
        let isFormValid = true;

        Object.keys(fields).forEach(key => {
            const field = fields[key];
            const value = field.element.value;
            const isValid = field.validate(value, field.element);

            if (!isValid) {
                field.element.classList.add('invalid');
                field.error.textContent = field.errorMessage;
                field.error.classList.add('visible');
                isFormValid = false;
            } else {
                field.element.classList.remove('invalid');
                field.error.textContent = '';
                field.error.classList.remove('visible');
            }
        });

        return isFormValid;
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Hide any previous alert state
        successAlert.style.display = 'none';
        errorAlert.style.display = 'none';

        // Perform clinical validation
        const isValid = validateForm();

        if (!isValid) {
            errorAlert.style.display = 'flex';
            errorAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            return;
        }

        // Simulating form submission (e.g. mock AJAX request)
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Disable form controls during loading
        Object.values(fields).forEach(field => field.element.disabled = true);
        if (document.getElementById('phone')) {
            document.getElementById('phone').disabled = true;
        }

        // Simulate network latency (1.5 seconds)
        setTimeout(() => {
            // Re-enable form fields
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            Object.values(fields).forEach(field => field.element.disabled = false);
            if (document.getElementById('phone')) {
                document.getElementById('phone').disabled = false;
            }

            // Success response mock
            form.reset();
            successAlert.style.display = 'flex';
            successAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            // Auto hide success notice after 10 seconds
            setTimeout(() => {
                successAlert.style.display = 'none';
            }, 10000);

        }, 15000 / 10); // 1.5 seconds
    });
});
