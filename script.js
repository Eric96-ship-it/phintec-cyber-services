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
    
    // Add loading state to CTA button
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            if (this.href === '#' || this.getAttribute('onclick')) {
                e.preventDefault();
                const originalText = this.innerHTML;
                this.innerHTML = '<span class="loading"></span> Processing...';
                setTimeout(() => {
                    this.innerHTML = originalText;
                }, 2000);
            }
        });
    }
    
    // Service Order Functionality
    const orderButtons = document.querySelectorAll('.order-btn');
    const orderFormSection = document.querySelector('.order-form-section');
    
    // Payment details toggle functionality
    function setupPaymentDetailsToggle() {
        const paymentRadios = document.querySelectorAll('input[name="payment"]');
        const paymentDetailsBoxes = document.querySelectorAll('.payment-details-box');
        
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
        
        // Trigger change event on page load if a payment method is selected
        const selectedRadio = document.querySelector('input[name="payment"]:checked');
        if (selectedRadio) {
            selectedRadio.dispatchEvent(new Event('change'));
        }
    }
    
    // Transaction code validation
    function isValidTransactionCode(code) {
        // M-Pesa transaction codes are typically 10 characters alphanumeric
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
                    const sendAmount = document.getElementById('send-amount');
                    const airtelAmount = document.getElementById('airtel-amount');
                    
                    if (orderServiceName) orderServiceName.textContent = service;
                    if (orderServicePrice) orderServicePrice.textContent = `Ksh ${price}`;
                    if (orderPaymentAmount) orderPaymentAmount.textContent = `Ksh ${price}`;
                    if (sendAmount) sendAmount.textContent = price;
                    if (airtelAmount) airtelAmount.textContent = price;
                    
                    // Show order form section
                    orderFormSection.classList.add('active');
                    
                    // Scroll to order form
                    orderFormSection.scrollIntoView({ behavior: 'smooth' });
                    
                    // Setup payment details toggle
                    setTimeout(setupPaymentDetailsToggle, 100);
                }
            });
        });
    }
    
    // Order Form Submission
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const service = document.getElementById('order-service-name')?.textContent || 'Service';
            const price = document.getElementById('order-service-price')?.textContent || '0';
            const whatsapp = document.getElementById('order-whatsapp')?.value || '';
            const email = document.getElementById('order-email')?.value || '';
            const details = document.getElementById('order-details')?.value || '';
            const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value || '';
            const transactionCode = document.getElementById('order-transaction-code')?.value || '';
            
            // Validate transaction code
            if (!transactionCode || !isValidTransactionCode(transactionCode)) {
                alert('Please enter a valid transaction code (8-12 characters, letters and numbers only)');
                return;
            }
            
            // Show success message
            alert(`Thank you for your order!\n\nService: ${service}\nPrice: ${price}\nTransaction Code: ${transactionCode}\n\nWe will contact you on WhatsApp: ${whatsapp}\nYour work will be delivered to: ${email}\n\nPayment Method: ${paymentMethod}\n\nYour order has been received and will be processed once payment is verified.`);
            
            // Reset form
            orderForm.reset();
            
            // Hide order form section
            if (orderFormSection) {
                orderFormSection.classList.remove('active');
            }
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // CV Form Functionality
    const cvForm = document.getElementById('cvForm');
    const totalCostElement = document.getElementById('total-cost');
    const wordCountElement = document.getElementById('word-count');
    const paymentAmountElement = document.getElementById('payment-amount');
    const addExperienceBtn = document.getElementById('addExperience');
    const addEducationBtn = document.getElementById('addEducation');
    const addRefereeBtn = document.getElementById('addReferee');
    
    // Calculate CV cost based on word count
    function calculateCVCost() {
        const basePrice = 50;
        const pricePerUnit = 50;
        const unitWords = 100;
        
        let totalWords = 0;
        
        // Count words from all text areas and inputs in the CV form
        if (cvForm) {
            const textAreas = cvForm.querySelectorAll('textarea');
            const textInputs = cvForm.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]');
            
            textAreas.forEach(element => {
                if (element.id !== 'order-details') {
                    totalWords += countWords(element.value);
                }
            });
            
            textInputs.forEach(element => {
                if (element.id !== 'order-whatsapp' && element.id !== 'order-email') {
                    totalWords += countWords(element.value);
                }
            });
        }
        
        const additionalCost = Math.floor(totalWords / unitWords) * pricePerUnit;
        const totalCost = basePrice + additionalCost;
        
        if (totalCostElement) {
            totalCostElement.textContent = `Ksh ${totalCost}`;
        }
        if (paymentAmountElement) {
            paymentAmountElement.textContent = `Ksh ${totalCost}`;
        }
        
        // Update CV payment instruction amounts
        const cvSendAmount = document.getElementById('send-amount-cv');
        const cvAirtelAmount = document.getElementById('airtel-amount-cv');
        
        if (cvSendAmount) cvSendAmount.textContent = `Ksh ${totalCost}`;
        if (cvAirtelAmount) cvAirtelAmount.textContent = `Ksh ${totalCost}`;
        
        if (wordCountElement) {
            wordCountElement.textContent = totalWords;
        }
        
        return totalCost;
    }
    
    function countWords(text) {
        if (!text || text.trim() === '') return 0;
        return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    }
    
    // Form validation function
    function validateForm() {
        let isValid = true;
        
        // Clear previous error messages
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.textContent = '');
        
        // Validate required fields
        const requiredFields = cvForm.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                const fieldName = field.id || field.name || field.className;
                const errorElement = document.getElementById(`${fieldName}-error`);
                if (errorElement) {
                    errorElement.textContent = 'This field is required';
                }
                isValid = false;
            }
        });
        
        // Validate email format
        const emailField = document.getElementById('email');
        if (emailField && emailField.value && !isValidEmail(emailField.value)) {
            const emailError = document.getElementById('email-error');
            if (emailError) emailError.textContent = 'Please enter a valid email address';
            isValid = false;
        }
        
        // Validate phone format
        const phoneField = document.getElementById('phone');
        if (phoneField && phoneField.value && !isValidPhone(phoneField.value)) {
            const phoneError = document.getElementById('phone-error');
            if (phoneError) phoneError.textContent = 'Please enter a valid phone number';
            isValid = false;
        }
        
        // Validate WhatsApp format
        const whatsappField = document.getElementById('whatsapp');
        if (whatsappField && whatsappField.value && !isValidPhone(whatsappField.value)) {
            const whatsappError = document.getElementById('whatsapp-error');
            if (whatsappError) whatsappError.textContent = 'Please enter a valid WhatsApp number';
            isValid = false;
        }
        
        // Validate payment method selection
        const paymentSelected = document.querySelector('input[name="payment"]:checked');
        if (!paymentSelected) {
            const paymentError = document.getElementById('payment-error');
            if (paymentError) paymentError.textContent = 'Please select a payment method';
            isValid = false;
        }
        
        // Validate transaction code
        const transactionCode = document.getElementById('transaction-code');
        if (transactionCode && (!transactionCode.value || !isValidTransactionCode(transactionCode.value))) {
            const transactionError = document.getElementById('transaction-code-error');
            if (transactionError) transactionError.textContent = 'Please enter a valid transaction code (8-12 characters, letters and numbers only)';
            isValid = false;
        }
        
        // Validate payment confirmation
        const paymentConfirmed = document.getElementById('paymentConfirmed');
        if (paymentConfirmed && !paymentConfirmed.checked) {
            const paymentConfirmedError = document.getElementById('paymentConfirmed-error');
            if (paymentConfirmedError) paymentConfirmedError.textContent = 'You must confirm payment before submitting';
            isValid = false;
        }
        
        return isValid;
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function isValidPhone(phone) {
        const phoneRegex = /^[0-9]{9,12}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }
    
    // Add event listeners to all form fields for real-time cost calculation
    if (cvForm) {
        // Add input event to the entire form for word counting
        cvForm.addEventListener('input', calculateCVCost);
        
        // Setup payment details toggle for CV form
        setupPaymentDetailsToggle();
        
        // Add experience section
        if (addExperienceBtn) {
            addExperienceBtn.addEventListener('click', function() {
                const experienceContainer = document.getElementById('workExperience');
                const newExperience = document.createElement('div');
                newExperience.className = 'experience-item';
                newExperience.innerHTML = `
                    <div class="form-group">
                        <label>Job Title <span class="required">*</span></label>
                        <input type="text" class="jobTitle" required placeholder="e.g. Sales Manager">
                    </div>
                    <div class="form-group">
                        <label>Company <span class="required">*</span></label>
                        <input type="text" class="company" required placeholder="Company Name">
                    </div>
                    <div class="form-group">
                        <label>Duration <span class="required">*</span></label>
                        <input type="text" class="duration" required placeholder="e.g. Jan 2020 - Present">
                    </div>
                    <div class="form-group">
                        <label>Responsibilities <span class="required">*</span></label>
                        <textarea class="responsibilities" rows="3" required placeholder="Key responsibilities and achievements..."></textarea>
                    </div>
                    <button type="button" class="btn btn-outline remove-btn">Remove</button>
                `;
                
                experienceContainer.appendChild(newExperience);
                
                // Add remove functionality
                const removeBtn = newExperience.querySelector('.remove-btn');
                removeBtn.addEventListener('click', function() {
                    experienceContainer.removeChild(newExperience);
                    calculateCVCost();
                });
            });
        }
        
        // Add education section
        if (addEducationBtn) {
            addEducationBtn.addEventListener('click', function() {
                const educationContainer = document.getElementById('education');
                const newEducation = document.createElement('div');
                newEducation.className = 'education-item';
                newEducation.innerHTML = `
                    <div class="form-group">
                        <label>Institution <span class="required">*</span></label>
                        <input type="text" class="institution" required placeholder="University/College/School">
                    </div>
                    <div class="form-group">
                        <label>Qualification <span class="required">*</span></label>
                        <input type="text" class="qualification" required placeholder="Degree/Diploma/Certificate">
                    </div>
                    <div class="form-group">
                        <label>Year <span class="required">*</span></label>
                        <input type="text" class="year" required placeholder="e.g. 2015-2019">
                    </div>
                    <button type="button" class="btn btn-outline remove-btn">Remove</button>
                `;
                
                educationContainer.appendChild(newEducation);
                
                // Add remove functionality
                const removeBtn = newEducation.querySelector('.remove-btn');
                removeBtn.addEventListener('click', function() {
                    educationContainer.removeChild(newEducation);
                    calculateCVCost();
                });
            });
        }
        
        // Add referee section
        if (addRefereeBtn) {
            addRefereeBtn.addEventListener('click', function() {
                const refereesContainer = document.getElementById('referees');
                const newReferee = document.createElement('div');
                newReferee.className = 'referee-item';
                newReferee.innerHTML = `
                    <div class="form-group">
                        <label>Name</label>
                        <input type="text" class="refName" placeholder="Referee Name">
                    </div>
                    <div class="form-group">
                        <label>Position</label>
                        <input type="text" class="refPosition" placeholder="Position/Title">
                    </div>
                    <div class="form-group">
                        <label>Company</label>
                        <input type="text" class="refCompany" placeholder="Company/Organization">
                    </div>
                    <div class="form-group">
                        <label>Contact</label>
                        <input type="text" class="refContact" placeholder="Phone or Email">
                    </div>
                    <button type="button" class="btn btn-outline remove-btn">Remove</button>
                `;
                
                refereesContainer.appendChild(newReferee);
                
                // Add remove functionality
                const removeBtn = newReferee.querySelector('.remove-btn');
                removeBtn.addEventListener('click', function() {
                    refereesContainer.removeChild(newReferee);
                    calculateCVCost();
                });
            });
        }
        
        // Add remove functionality to initial remove buttons
        const initialRemoveBtns = document.querySelectorAll('.remove-btn');
        initialRemoveBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const parentItem = this.closest('.experience-item, .education-item, .referee-item');
                if (parentItem) {
                    parentItem.remove();
                    calculateCVCost();
                }
            });
        });
        
        // Handle form submission
        cvForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (!validateForm()) {
                alert('Please fix the errors in the form before submitting.');
                return;
            }
            
            // Calculate final cost
            const totalCost = calculateCVCost();
            
            // Collect form data
            const formData = {
                personalDetails: {
                    fullName: document.getElementById('fullName').value,
                    phone: document.getElementById('phone').value,
                    email: document.getElementById('email').value,
                    address: document.getElementById('address').value
                },
                personalProfile: document.getElementById('personalProfile').value,
                careerSummary: document.getElementById('careerSummary').value,
                workExperience: [],
                education: [],
                professionalQualifications: document.getElementById('professionalQualifications').value,
                keySkills: document.getElementById('keySkills').value,
                referees: [],
                payment: {
                    method: document.querySelector('input[name="payment"]:checked').value,
                    amount: totalCost,
                    whatsapp: document.getElementById('whatsapp').value,
                    transactionCode: document.getElementById('transaction-code').value
                }
            };
            
            // Collect work experience
            const experienceItems = document.querySelectorAll('.experience-item');
            experienceItems.forEach(item => {
                const jobTitle = item.querySelector('.jobTitle');
                const company = item.querySelector('.company');
                const duration = item.querySelector('.duration');
                const responsibilities = item.querySelector('.responsibilities');
                
                if (jobTitle && company && duration && responsibilities) {
                    formData.workExperience.push({
                        jobTitle: jobTitle.value,
                        company: company.value,
                        duration: duration.value,
                        responsibilities: responsibilities.value
                    });
                }
            });
            
            // Collect education
            const educationItems = document.querySelectorAll('.education-item');
            educationItems.forEach(item => {
                const institution = item.querySelector('.institution');
                const qualification = item.querySelector('.qualification');
                const year = item.querySelector('.year');
                
                if (institution && qualification && year) {
                    formData.education.push({
                        institution: institution.value,
                        qualification: qualification.value,
                        year: year.value
                    });
                }
            });
            
            // Collect referees
            const refereeItems = document.querySelectorAll('.referee-item');
            refereeItems.forEach(item => {
                const refName = item.querySelector('.refName');
                const refPosition = item.querySelector('.refPosition');
                const refCompany = item.querySelector('.refCompany');
                const refContact = item.querySelector('.refContact');
                
                if (refName && refPosition && refCompany && refContact) {
                    formData.referees.push({
                        name: refName.value,
                        position: refPosition.value,
                        company: refCompany.value,
                        contact: refContact.value
                    });
                }
            });
            
            // Show payment confirmation
            const paymentMethod = formData.payment.method;
            const whatsapp = formData.payment.whatsapp;
            const transactionCode = formData.payment.transactionCode;
            
            alert(`CV Request Submitted Successfully!\n\nTotal Cost: Ksh ${totalCost}\nTransaction Code: ${transactionCode}\nPayment Method: ${paymentMethod}\n\nWe have received your payment verification and will begin processing your CV.\n\nWe will contact you on WhatsApp: ${whatsapp} for any clarifications and delivery.`);
            
            // Reset form
            cvForm.reset();
            calculateCVCost();
            
            // Hide all payment details boxes
            document.querySelectorAll('.payment-details-box').forEach(box => {
                box.classList.remove('active');
            });
            
            // Scroll to top
            window.scrollTo(0, 0);
        });
    }
    
    // Contact Form Functionality
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // In a real implementation, you would send this data to a server
            alert(`Thank you for your message, ${name}!\n\nWe have received your inquiry and will get back to you shortly.\n\nSubject: ${subject}\n\nWe will contact you on: ${phone}`);
            
            contactForm.reset();
        });
    }
    
    // Initialize cost calculation for CV page
    if (totalCostElement && wordCountElement) {
        calculateCVCost();
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
});