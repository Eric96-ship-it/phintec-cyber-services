// Enhanced navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    const header = document.querySelector('header');
    
    // Mobile menu toggle
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // Header scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (nav && nav.classList.contains('active') && 
            !event.target.closest('nav') && 
            !event.target.closest('.mobile-menu-btn')) {
            nav.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        }
    });
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (nav) {
                nav.classList.remove('active');
                if (mobileMenuBtn) {
                    mobileMenuBtn.classList.remove('active');
                }
            }
        });
    });
    
    // Service Order Functionality
    const orderButtons = document.querySelectorAll('.order-btn');
    const orderFormSection = document.querySelector('.order-form-section');
    
    // Payment details toggle functionality - FIXED VERSION
    function setupPaymentDetailsToggle() {
        const paymentRadios = document.querySelectorAll('input[name="payment_method"]');
        const paymentDetailsBoxes = document.querySelectorAll('.payment-details-box');
        
        // Hide all payment details first
        paymentDetailsBoxes.forEach(box => {
            box.classList.remove('active');
        });
        
        // Show the currently selected payment method
        const selectedMethod = document.querySelector('input[name="payment_method"]:checked').value;
        const activeDetailsBox = document.getElementById(`${selectedMethod}-details`);
        if (activeDetailsBox) {
            activeDetailsBox.classList.add('active');
        }
        
        // Add change event listeners
        paymentRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                // Hide all payment details boxes
                paymentDetailsBoxes.forEach(box => {
                    box.classList.remove('active');
                });
                
                // Show the selected payment details
                const selectedMethod = this.value;
                const detailsBox = document.getElementById(`${selectedMethod}-details`);
                if (detailsBox) {
                    detailsBox.classList.add('active');
                }
            });
        });
    }
    
    // Transaction code validation
    function isValidTransactionCode(code) {
        const transactionCodeRegex = /^[A-Z0-9]{8,12}$/;
        return transactionCodeRegex.test(code);
    }
    
    // Service order functionality
    if (orderButtons.length > 0) {
        orderButtons.forEach(button => {
            button.addEventListener('click', function() {
                const service = this.getAttribute('data-service');
                const price = this.getAttribute('data-price');
                
                // Scroll to order form section
                if (orderFormSection) {
                    // Update order form with service details
                    const orderServiceName = document.getElementById('order-service-name');
                    const orderServicePrice = document.getElementById('order-service-price');
                    const orderPaymentAmount = document.getElementById('order-payment-amount');
                    const mpesaAmount = document.getElementById('mpesa-amount');
                    const airtelAmount = document.getElementById('airtel-amount');
                    
                    if (orderServiceName) orderServiceName.textContent = service;
                    if (orderServicePrice) orderServicePrice.textContent = `Ksh ${price}`;
                    if (orderPaymentAmount) orderPaymentAmount.textContent = `Ksh ${price}`;
                    if (mpesaAmount) mpesaAmount.textContent = price;
                    if (airtelAmount) airtelAmount.textContent = price;
                    
                    // Show order form section
                    orderFormSection.classList.add('active');
                    
                    // Scroll to order form
                    orderFormSection.scrollIntoView({ behavior: 'smooth' });
                    
                    // Setup payment details toggle
                    setupPaymentDetailsToggle();
                }
            });
        });
    }
    
    // Order Form Submission - UPDATED FOR FORMSPREE
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            const transactionCode = document.getElementById('order-transaction-code')?.value || '';
            
            // Only validate, don't prevent submission unless validation fails
            if (!transactionCode || !isValidTransactionCode(transactionCode)) {
                e.preventDefault();
                alert('Please enter a valid transaction code (8-12 characters, letters and numbers only)');
                return;
            }
            
            // Show loading state but allow form to submit to Formspree
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Submitting to Formspree...';
            submitBtn.disabled = true;
            
            // Form will submit to Formspree automatically
        });
    }
    
    // Contact Form Functionality - UPDATED FOR FORMSPREE
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // Only validate required fields, don't prevent submission
            const name = document.getElementById('name')?.value || '';
            const email = document.getElementById('email')?.value || '';
            
            if (!name.trim() || !email.trim()) {
                e.preventDefault();
                alert('Please fill in all required fields');
                return;
            }
            
            // Show loading state but allow form to submit to Formspree
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Sending...';
            submitBtn.disabled = true;
            
            // Form will submit to Formspree automatically
        });
    }
    
    // Scroll to top functionality
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.innerHTML = '↑';
    scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollToTopBtn);
    
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });

    // Check for Formspree success in URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
        alert('Thank you! Your form has been submitted successfully. We will contact you shortly.');
        
        // Clear URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});