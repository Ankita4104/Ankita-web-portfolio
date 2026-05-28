/**
 * Ankita Das - Personal Portfolio Website Script
 * Clean, lightweight, beginner-friendly vanilla JS.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. Sticky Navbar & Shrink on Scroll
     ========================================================================== */
  const header = document.getElementById('navbar-header');
  const scrollThreshold = 50;

  function handleScrollHeader() {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScrollHeader);
  handleScrollHeader(); // Initial call


  /* ==========================================================================
     2. Mobile Hamburger Menu Toggle
     ========================================================================== */
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const navWrapper = document.getElementById('nav-list-wrapper');
  const navLinks = document.querySelectorAll('.nav-link');

  function toggleMobileMenu() {
    menuToggle.classList.toggle('active');
    navWrapper.classList.toggle('active');
    
    // Prevent background scrolling when menu is active
    if (navWrapper.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  function closeMobileMenu() {
    menuToggle.classList.remove('active');
    navWrapper.classList.remove('active');
    document.body.style.overflow = '';
  }

  menuToggle.addEventListener('click', toggleMobileMenu);

  // Close menu when clicking on any menu link
  navLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close menu when page is resized beyond mobile break
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      closeMobileMenu();
    }
  });


  /* ==========================================================================
     3. Active Menu Link Swapping on Scroll (Intersection Observer)
     ========================================================================== */
  const sections = document.querySelectorAll('section[id]');
  
  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px', // Triggers when section occupies central part of viewport
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        // Remove active class from all links first
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    sectionObserver.observe(section);
  });


  /* ==========================================================================
     4. Interactive Resume / CV Modal
     ========================================================================== */
  const downloadResumeBtn = document.getElementById('download-resume-btn');
  const resumeModal = document.getElementById('resume-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  function openModal() {
    resumeModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock background scroll
  }

  function closeModal() {
    resumeModal.classList.remove('active');
    document.body.style.overflow = ''; // Release scroll
  }

  if (downloadResumeBtn && resumeModal) {
    downloadResumeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });

    modalCloseBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside of the content container
    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) {
        closeModal();
      }
    });

    // Close modal on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && resumeModal.classList.contains('active')) {
        closeModal();
      }
    });
  }


  /* ==========================================================================
     5. Advanced Interactive Contact Form Submissions (EmailJS integration)
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  const successPanel = document.getElementById('submit-success-panel');
  const formSubmitBtn = contactForm ? contactForm.querySelector('.form-submit-btn') : null;

  // EMAILJS SETUP CONFIGURATION
  // To receive contact form emails directly, sign up at emailjs.com and:
  // 1. Enter your Public Key below in EMAILJS_PUBLIC_KEY
  // 2. Create an Email Service and Template in the EmailJS Dashboard
  // 3. Replace "YOUR_SERVICE_ID" and "YOUR_TEMPLATE_ID" inside emailjs.send
  const EMAILJS_PUBLIC_KEY = "J3pVgAPORU0w_3HSs"; // Replace this with your actual public key

  if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }

  if (contactForm && successPanel) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault(); // Stop page reload

      // Form inputs gathering
      const nameVal = document.getElementById('contact-name').value.trim();
      const emailVal = document.getElementById('contact-email').value.trim();
      const subjectVal = document.getElementById('contact-subject').value.trim();
      const messageVal = document.getElementById('contact-message').value.trim();

      // Elementary verification guard
      if (!nameVal || !emailVal || !messageVal) {
        alert('Please fill out all required fields.');
        return;
      }

      // Enter loading state for form submit button
      formSubmitBtn.classList.add('loading');
      formSubmitBtn.disabled = true;

      // Determine if EmailJS is actively configured
      if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
        const templateParams = {
          from_name: nameVal,
          from_email: emailVal,
          subject: subjectVal,
          message: messageVal,
          reply_to: emailVal,
          to_name: "Ankita Das"
        };

        // Send real email via client SDK
        emailjs.send("service_8rxff34", "template_8iwhdyx", templateParams)
          .then(() => {
            // Success handler
            formSubmitBtn.classList.remove('loading');
            successPanel.classList.add('active');

            const successTitle = successPanel.querySelector('.success-title');
            if (successTitle) {
              successTitle.textContent = `Thank you, ${nameVal}!`;
            }
            contactForm.reset();
          })
          .catch((error) => {
            console.error('EmailJS transmit error:', error);
            formSubmitBtn.classList.remove('loading');
            formSubmitBtn.disabled = false;
            alert('Failed to transmit email through EmailJS. Falling back to secure simulated dispatch.');
            
            // Fallback success panel slide-in
            successPanel.classList.add('active');
            const successTitle = successPanel.querySelector('.success-title');
            if (successTitle) {
              successTitle.textContent = `Thank you, ${nameVal}! (Offline mode)`;
            }
          });
      } else {
        // Offline / Sandbox Simulation Mode (if keys are not swapped in yet)
        console.log("EmailJS is currently unconfigured. Simulating message parameters:", {
          name: nameVal,
          email: emailVal,
          subject: subjectVal,
          message: messageVal
        });

        setTimeout(() => {
          // Clear loading state
          formSubmitBtn.classList.remove('loading');
          
          // Show success panel slide-in animation
          successPanel.classList.add('active');
          
          // Dynamically insert user references
          const successTitle = successPanel.querySelector('.success-title');
          if (successTitle) {
            successTitle.textContent = `Thank you, ${nameVal}!`;
          }

          // Reset the form values
          contactForm.reset();
        }, 1200);
      }
    });

    // Add close logic for success panel to let user write another message if needed
    const successResetBtn = document.getElementById('success-reset-btn');
    if (successResetBtn) {
      successResetBtn.addEventListener('click', () => {
        successPanel.classList.remove('active');
        formSubmitBtn.disabled = false;
      });
    }
  }


  /* ==========================================================================
     6. Back to Top Button
     ========================================================================== */
  const backToTopBtn = document.getElementById('back-to-top');

  function handleScrollBackToTop() {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  }

  window.addEventListener('scroll', handleScrollBackToTop);
  handleScrollBackToTop(); // Check immediately on startup

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }


  /* ==========================================================================
     7. Interactive IDE Visual Graphic Mockup Code Typewriter & Swapper
     ========================================================================== */
  const words = ['Designers', 'Mentors', 'Creators', 'Developers'];
  const activePill = document.querySelector('.preview-pill.active');
  
  if (activePill) {
    let wordIndex = 0;
    
    // Periodically fluctuate preview component colors or tags for visual activity
    setInterval(() => {
      wordIndex = (wordIndex + 1) % words.length;
      activePill.textContent = words[wordIndex];
      
      // Flash a skeleton bar briefly to simulate a "refresh"
      const skeletonTitle = document.querySelector('.preview-skeleton-title');
      if (skeletonTitle) {
        skeletonTitle.style.opacity = '0.4';
        setTimeout(() => {
          skeletonTitle.style.opacity = '1';
        }, 300);
      }
    }, 3000);
  }

});
