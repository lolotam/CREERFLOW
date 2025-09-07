// Contact Form Enhancements and Interactions

document.addEventListener('DOMContentLoaded', function() {
    // Form validation helpers
    const ValidationHelpers = {
        email: function(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        },
        
        phone: function(phone) {
            // Allow for various international phone formats
            const re = /^[\+]?[1-9][\d]{0,15}$/;
            return phone === '' || re.test(phone.replace(/[-\s\(\)]/g, ''));
        },
        
        required: function(value) {
            return value && value.trim().length > 0;
        }
    };

    // Auto-resize textarea
    function autoResizeTextarea(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    }

    // Find textarea and add auto-resize
    const messageTextarea = document.querySelector('textarea[name="message"]');
    if (messageTextarea) {
        messageTextarea.addEventListener('input', function() {
            autoResizeTextarea(this);
        });
    }

    // Form field focus effects
    const formInputs = document.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentNode.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentNode.classList.remove('focused');
            if (this.value === '') {
                this.parentNode.classList.remove('filled');
            } else {
                this.parentNode.classList.add('filled');
            }
        });
        
        // Check if field is pre-filled
        if (input.value !== '') {
            input.parentNode.classList.add('filled');
        }
    });

    // Smooth scroll to form on error
    function scrollToForm() {
        const form = document.querySelector('form');
        if (form) {
            form.scrollIntoView({ 
                behavior: 'smooth',
                block: 'center'
            });
        }
    }

    // Phone number formatting (optional enhancement)
    const phoneInput = document.querySelector('input[type="tel"]');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 10) {
                // Format as international number if it doesn't start with +
                if (!e.target.value.startsWith('+') && value.length === 10) {
                    e.target.value = '+965' + value;
                }
            }
        });
    }

    // Character counter for message field
    if (messageTextarea) {
        const maxLength = 1000;
        const counter = document.createElement('div');
        counter.className = 'character-counter text-sm text-gray-400 text-right mt-2';
        counter.textContent = `0/${maxLength}`;
        
        messageTextarea.parentNode.appendChild(counter);
        
        messageTextarea.addEventListener('input', function() {
            const currentLength = this.value.length;
            counter.textContent = `${currentLength}/${maxLength}`;
            
            if (currentLength > maxLength * 0.9) {
                counter.classList.add('text-yellow-400');
                counter.classList.remove('text-gray-400');
            } else {
                counter.classList.remove('text-yellow-400');
                counter.classList.add('text-gray-400');
            }
            
            if (currentLength > maxLength) {
                counter.classList.add('text-red-400');
                counter.classList.remove('text-yellow-400');
            }
        });
    }

    // Google Maps enhancement - Add click handler for better mobile experience
    const mapIframe = document.querySelector('iframe');
    if (mapIframe) {
        // Add a overlay for better mobile interaction
        const overlay = document.createElement('div');
        overlay.className = 'map-overlay absolute inset-0 bg-transparent cursor-pointer';
        overlay.style.zIndex = '10';
        
        overlay.addEventListener('click', function() {
            // Open Google Maps in new tab
            window.open('https://maps.app.goo.gl/dmTzTDmvKMrgB1U89', '_blank');
        });
        
        const mapContainer = mapIframe.parentNode;
        mapContainer.style.position = 'relative';
        mapContainer.appendChild(overlay);
    }

    // Add copy to clipboard functionality for contact info
    const contactInfo = document.querySelectorAll('[data-copy]');
    contactInfo.forEach(item => {
        const copyBtn = document.createElement('button');
        copyBtn.className = 'ml-2 text-blue-400 hover:text-blue-300 transition-colors';
        copyBtn.innerHTML = '📋';
        copyBtn.title = 'Copy to clipboard';
        
        copyBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            const textToCopy = item.dataset.copy;
            
            try {
                await navigator.clipboard.writeText(textToCopy);
                copyBtn.innerHTML = '✅';
                setTimeout(() => {
                    copyBtn.innerHTML = '📋';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy text: ', err);
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = textToCopy;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                
                copyBtn.innerHTML = '✅';
                setTimeout(() => {
                    copyBtn.innerHTML = '📋';
                }, 2000);
            }
        });
        
        item.appendChild(copyBtn);
    });

    // Form submission analytics (if needed)
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function() {
            // Track form submission for analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    'form_name': 'contact_form',
                    'page_location': window.location.href
                });
            }
        });
    }

    // Add keyboard navigation for better accessibility
    document.addEventListener('keydown', function(e) {
        // ESC to close any modals or overlays
        if (e.key === 'Escape') {
            const overlay = document.querySelector('.map-overlay');
            if (overlay && overlay.classList.contains('active')) {
                overlay.classList.remove('active');
            }
        }
    });

    // Intersection Observer for animation triggers
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.glass-card, .contact-item').forEach(el => {
        observer.observe(el);
    });
});

// Export for potential use in React components
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ValidationHelpers,
        autoResizeTextarea
    };
}