/* ===============================================
   INTERIOR DESIGN WEBSITE - COMPLETE JAVASCRIPT
   =============================================== */

document.addEventListener("DOMContentLoaded", function () {

  /* ============================================
     1. DROPDOWN MENU FUNCTIONALITY
     ============================================ */
  
  const dropdownParents = document.querySelectorAll(".dropdown-parent");
  
  dropdownParents.forEach(parent => {
    const link = parent.querySelector("a");
    const dropdown = parent.querySelector(".dropdown");
    
    if (link && dropdown) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
      });
    }
  });
  
  // Close dropdowns when clicking outside
  document.addEventListener("click", function (e) {
    dropdownParents.forEach(parent => {
      const dropdown = parent.querySelector(".dropdown");
      if (!parent.contains(e.target) && dropdown) {
        dropdown.style.display = "none";
      }
    });
  });

  /* ============================================
     2. INDEX PAGE - LANDING FORM VALIDATION
     ============================================ */
  
  const indexForm = document.getElementById("indexForm");
  
  if (indexForm) {
    indexForm.addEventListener("submit", function (e) {
      e.preventDefault();
      
      const nameInput = document.querySelector("#name");
      const phoneInput = document.querySelector("#phone");
      
      // Validation
      if (!nameInput || !phoneInput) return;
      
      const name = nameInput.value.trim();
      const phone = phoneInput.value.trim();
      
      // Validate name
      if (name.length < 2) {
        showNotification("Please enter a valid name (at least 2 characters)", "error");
        return;
      }
      
      // Validate phone
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(phone)) {
        showNotification("Please enter a valid 10-digit phone number", "error");
        return;
      }
      
      // Save to localStorage
      const leadData = {
        name: name,
        phone: phone,
        timestamp: new Date().toLocaleString(),
        whatsapp: document.querySelector("#whatsapp").checked
      };
      
      localStorage.setItem("leadData", JSON.stringify(leadData));
      
      // Show success message
      showNotification("Form submitted successfully! Redirecting...", "success");
      
      // Redirect to thank-you.html after 1.5 seconds
      setTimeout(() => {
        window.location.href = "thank-you.html";
      }, 1500);
    });
  }

  /* ============================================
     3. SAVE-LEAD PAGE - FORM HANDLING
     ============================================ */
  
  const leadForm = document.getElementById("leadForm");
  
  if (leadForm) {
    leadForm.addEventListener("submit", function (e) {
      e.preventDefault();
      
      const nameInput = document.getElementById("name");
      const phoneInput = document.getElementById("phone");
      
      const name = nameInput ? nameInput.value.trim() : "";
      const phone = phoneInput ? phoneInput.value.trim() : "";
      
      // Validate
      if (name.length < 2) {
        alert("Please enter a valid name");
        return;
      }
      
      if (!/^[0-9]{10}$/.test(phone)) {
        alert("Please enter a valid 10-digit phone number");
        return;
      }
      
      // Save to localStorage
      const leadData = {
        name: name,
        phone: phone,
        timestamp: new Date().toLocaleString()
      };
      
      localStorage.setItem("leadData", JSON.stringify(leadData));
      console.log("Lead saved:", leadData);
      
      // Redirect to thank-you page
      setTimeout(() => {
        window.location.href = "thank-you.html";
      }, 500);
    });
  }

  /* ============================================
     4. HOME PAGE - DESIGN CARDS FILTERING
     ============================================ */
  
  const filterButton = document.querySelector(".filter-action button");
  const designCards = document.querySelectorAll(".design-card");
  
  if (filterButton && designCards.length > 0) {
    filterButton.addEventListener("click", function (e) {
      e.preventDefault();
      
      // Get filter values
      const roomSelect = document.querySelector(".filter-item:nth-child(1) select");
      const styleSelect = document.querySelector(".filter-item:nth-child(2) select");
      const budgetSelect = document.querySelector(".filter-item:nth-child(3) select");
      
      if (!roomSelect || !styleSelect || !budgetSelect) return;
      
      const selectedRoom = roomSelect.value.toLowerCase();
      const selectedStyle = styleSelect.value.toLowerCase();
      const selectedBudget = budgetSelect.value.toLowerCase();
      
      let visibleCount = 0;
      
      designCards.forEach(card => {
        const cardRoom = card.dataset.room ? card.dataset.room.toLowerCase() : "";
        const cardStyle = card.dataset.style ? card.dataset.style.toLowerCase() : "";
        const cardBudget = card.dataset.budget ? card.dataset.budget.toLowerCase() : "";
        
        const roomMatch = selectedRoom === "all" || cardRoom === selectedRoom;
        const styleMatch = selectedStyle === "all" || cardStyle === selectedStyle;
        const budgetMatch = selectedBudget === "all" || cardBudget === selectedBudget;
        
        const isVisible = roomMatch && styleMatch && budgetMatch;
        card.style.display = isVisible ? "block" : "none";
        
        if (isVisible) visibleCount++;
      });
      
      // Show message if no cards match
      if (visibleCount === 0) {
        showNotification("No designs found matching your criteria", "info");
      } else {
        showNotification(`Found ${visibleCount} design(s)`, "success");
      }
    });
  }

  /* ============================================
     5. HOME PAGE - SEARCH FUNCTIONALITY
     ============================================ */
  
  const searchForm = document.querySelector(".hero form");
  const searchInput = document.querySelector(".hero input");
  
  if (searchForm && searchInput && designCards.length > 0) {
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      performSearch();
    });
    
    // Search as user types (debounced)
    function debounce(fn, wait) {
      let t;
      return function (...args) {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, args), wait);
      };
    }

    const debouncedSearch = debounce(performSearch, 200);
    searchInput.addEventListener("input", debouncedSearch);
  }
  
  function performSearch() {
    if (!searchInput) return;
    
    const searchValue = searchInput.value.toLowerCase().trim();
    let visibleCount = 0;
    
    if (searchValue === "") {
      // Reset all cards if search is empty
      designCards.forEach(card => {
        card.style.display = "block";
        visibleCount++;
      });
    } else {
      designCards.forEach(card => {
        const title = card.querySelector("h3") ? card.querySelector("h3").innerText.toLowerCase() : "";
        const description = card.querySelector("p") ? card.querySelector("p").innerText.toLowerCase() : "";
        
        const isMatch = title.includes(searchValue) || description.includes(searchValue);
        card.style.display = isMatch ? "block" : "none";
        
        if (isMatch) visibleCount++;
      });
    }
    
    if (visibleCount === 0 && searchValue !== "") {
      showNotification("No designs found matching your search", "info");
    }
  }

  /* ============================================
     6. CATEGORY CARD INTERACTIONS
     ============================================ */
  
  const categoryLinks = document.querySelectorAll(".category-link");
  
  categoryLinks.forEach(link => {
    link.addEventListener("click", function (e) {
      // You can add animation or tracking here
      console.log("Category clicked:", link.getAttribute("href"));
      
      // Subtle click feedback handled via CSS where possible
    });
    
    // Hover effects
    // Hover scaling handled by CSS (.category-card:hover)
  });

  /* ============================================
     7. SMOOTH SCROLLING FOR ANCHORS
     ============================================ */
  
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  /* ============================================
     8. NOTIFICATION SYSTEM
     ============================================ */
  
  function showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Auto-remove after 3s with fade-out class
    setTimeout(() => {
      notification.classList.add("hide");
      setTimeout(() => notification.remove(), 350);
    }, 3000);
  }

  /* ============================================
     9. LOAD PREVIOUSLY SAVED FORM DATA
     ============================================ */
  
  function loadSavedFormData() {
    // DISABLED BY DEFAULT - Uncomment to enable auto-fill
    // const savedData = localStorage.getItem("leadData");
    
    // if (savedData) {
    //   try {
    //     const data = JSON.parse(savedData);
    //     const nameInput = document.querySelector("#name");
    //     const phoneInput = document.querySelector("#phone");
        
    //     if (nameInput && data.name) nameInput.value = data.name;
    //     if (phoneInput && data.phone) phoneInput.value = data.phone;
    //   } catch (error) {
    //     console.error("Error loading saved data:", error);
    //   }
    // }
  }
  
  loadSavedFormData();

  /* ============================================
     9B. CLEAR FORM DATA
     ============================================ */
  
  const clearButton = document.querySelector(".clear-btn");
  
  if (clearButton) {
    clearButton.addEventListener("click", function (e) {
      e.preventDefault();
      localStorage.removeItem("leadData");
      document.getElementById("indexForm").reset();
      showNotification("Form cleared successfully!", "success");
    });
  }

  /* ============================================
     10. ACTIVE PAGE NAVIGATION HIGHLIGHT
     ============================================ */
  
  function highlightActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || "index.html";
    const navLinks = document.querySelectorAll(".main-nav a");
    
    navLinks.forEach(link => {
      const href = link.getAttribute("href");
      if (href === currentPage) {
        link.style.color = "#c89b3c";
        link.style.fontWeight = "600";
      }
    });
  }
  
  highlightActiveNav();

  /* ============================================
     11. MOBILE MENU TOGGLE (if needed)
     ============================================ */
  
  const mainNav = document.querySelector(".main-nav");
  
  if (mainNav) {
    // Add mobile menu functionality if hamburger is added
    const hamburger = document.querySelector(".hamburger");
    
    if (hamburger) {
      hamburger.addEventListener("click", function () {
        mainNav.classList.toggle("active");
        hamburger.classList.toggle("active");
      });
    }
  }

  /* ============================================
     12. LAZY LOADING FOR IMAGES
     ============================================ */
  
  if ("IntersectionObserver" in window) {
    const images = document.querySelectorAll("img[loading='lazy']");
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.add("loaded");
          observer.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  }

  /* ============================================
     13. PAGE SCROLL ANIMATION
     ============================================ */
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px"
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = "fadeInUp 0.6s ease";
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  document.querySelectorAll("section").forEach(section => {
    observer.observe(section);
  });

  /* ============================================
     14. FORM INPUT VALIDATION IN REAL-TIME
     ============================================ */
  
  const nameInputs = document.querySelectorAll("input[type='text'][placeholder*='name' i], input[id='name']");
  
  nameInputs.forEach(input => {
    input.addEventListener("input", function () {
      this.value = this.value.replace(/[^a-zA-Z\s]/g, "");
    });
  });
  
  const phoneInputs = document.querySelectorAll("input[type='tel'], input[type='text'][placeholder*='phone' i], input[id='phone']");
  
  phoneInputs.forEach(input => {
    input.addEventListener("input", function () {
      this.value = this.value.replace(/[^0-9]/g, "").slice(0, 10);
    });
  });

  /* ============================================
     15. THEME TOGGLE (Optional Feature)
     ============================================ */
  
  const themeToggle = document.querySelector(".theme-toggle");
  
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      document.body.classList.toggle("dark-mode");
      localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
    });
    
    // Load saved theme
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode");
    }
  }

  /* ============================================
     16. CTA BUTTON TRACKING
     ============================================ */
  
  const ctaButtons = document.querySelectorAll(".cta-primary, .cta-secondary, .next-btn");
  
  ctaButtons.forEach(button => {
    button.addEventListener("click", function () {
      console.log("CTA clicked:", this.textContent);
      // You can add analytics here
    });
  });

  /* ============================================
     17. CONTACT FORM HANDLING (if exists)
     ============================================ */
  
  const contactForm = document.querySelector(".contact-form");
  
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      
      const email = this.querySelector("input[type='email']");
      const message = this.querySelector("textarea");
      
      if (email && message && email.value && message.value) {
        showNotification("Message sent successfully! We'll reply soon.", "success");
        this.reset();
      } else {
        showNotification("Please fill all fields", "error");
      }
    });
  }

  /* ============================================
     18. CONSOLE LOG - INITIALIZATION COMPLETE
     ============================================ */
  
  console.log("✓ Interior Design Website - JavaScript Loaded Successfully");
  console.log("✓ All features initialized");
  
});

/* ============================================
   CSS ANIMATIONS - Add to style.css
   ============================================ */

// Animations/styles for notifications and scroll animations moved to style.css for better performance
