// Design Consultation Modal Handler
import { db, ref, push } from './firebase.js';

(function() {
  console.log('🔥 Design Consultation Modal: Loaded with Firebase imports');
  
  let firebaseReady = true;
  
  // Create modal HTML
  const modalHTML = `
    <div id="designConsultationModal" class="consultation-modal">
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <button class="modal-close" onclick="closeDesignConsultation()">×</button>
        
        <div class="modal-header">
          <h2>Tell Us About Your Design Vision</h2>
          <p>Help us understand what you're looking for</p>
          <div class="form-progress">
            <div class="progress-bar"><div class="progress-fill"></div></div>
            <span class="progress-text">0% Complete</span>
          </div>
        </div>

        <form id="designConsultationForm" onsubmit="submitDesignConsultation(event)">
          
          <!-- Name Field -->
          <div class="form-section">
            <label for="consultantName" class="section-label">Full Name</label>
            <div class="input-wrapper">
              <input 
                type="text" 
                id="consultantName" 
                name="name" 
                placeholder="Enter your full name"
                required
                maxlength="50"
              >
              <span class="input-indicator">✓</span>
            </div>
            <span class="field-error"></span>
          </div>

          <!-- Phone Field -->
          <div class="form-section">
            <label for="consultantPhone" class="section-label">Phone Number</label>
            <div class="input-wrapper">
              <input 
                type="tel" 
                id="consultantPhone" 
                name="phone" 
                placeholder="10-digit mobile number"
                required
                pattern="[0-9\-\+\(\) ]{10,}"
                maxlength="15"
              >
              <span class="input-indicator">✓</span>
            </div>
            <span class="field-error"></span>
          </div>

          <!-- Category -->
          <div class="form-section">
            <label for="categoryDropdown" class="section-label">Room Category</label>
            <div class="dropdown-wrapper">
              <select 
                id="categoryDropdown" 
                name="category" 
                required
                class="category-dropdown"
              >
                <option value="">-- Select a Category --</option>
                <option value="Kitchen">🍳 Kitchen</option>
                <option value="Bedroom">🛏️ Bedroom</option>
                <option value="Bathroom">🚿 Bathroom</option>
                <option value="Living Room">🛋️ Living Room</option>
                <option value="Dining Area">🍽️ Dining Area</option>
                <option value="Balcony">🌿 Balcony</option>
                <option value="Full Home">🏠 Full Home</option>
              </select>
              <span class="dropdown-arrow">▼</span>
            </div>
            <span class="field-error"></span>
          </div>

          <!-- Budget -->
          <div class="form-section">
            <label class="section-label">What's Your Budget?</label>
            <div class="option-group">
              <label class="option">
                <input type="radio" name="budget" value="₹1-5 Lakh" required>
                <span>₹1-5 Lakh</span>
              </label>
              <label class="option">
                <input type="radio" name="budget" value="₹5-10 Lakh">
                <span>₹5-10 Lakh</span>
              </label>
              <label class="option">
                <input type="radio" name="budget" value="₹10-20 Lakh">
                <span>₹10-20 Lakh</span>
              </label>
              <label class="option">
                <input type="radio" name="budget" value="₹20-50 Lakh">
                <span>₹20-50 Lakh</span>
              </label>
              <label class="option">
                <input type="radio" name="budget" value="₹50+ Lakh">
                <span>₹50+ Lakh</span>
              </label>
            </div>
          </div>

          <!-- Design Style -->
          <div class="form-section">
            <label class="section-label">Preferred Design Style</label>
            <div class="option-group checkbox">
              <label class="option">
                <input type="checkbox" name="style" value="Modern">
                <span>Modern</span>
              </label>
              <label class="option">
                <input type="checkbox" name="style" value="Traditional">
                <span>Traditional</span>
              </label>
              <label class="option">
                <input type="checkbox" name="style" value="Minimalist">
                <span>Minimalist</span>
              </label>
              <label class="option">
                <input type="checkbox" name="style" value="Contemporary">
                <span>Contemporary</span>
              </label>
              <label class="option">
                <input type="checkbox" name="style" value="Luxe">
                <span>Luxe/Premium</span>
              </label>
              <label class="option">
                <input type="checkbox" name="style" value="Industrial">
                <span>Industrial</span>
              </label>
            </div>
          </div>

          <div class="form-buttons">
            <button type="submit" class="btn-submit" id="submitBtn">
              <span class="btn-text">Get Design Proposal</span>
              <span class="btn-loader" style="display: none;">⏳</span>
            </button>
            <button type="button" class="btn-cancel" onclick="closeDesignConsultation()">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  `;

  // Create modal styles
  const modalStyles = `
    <style>
      .consultation-modal {
        display: none !important;
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        z-index: 99999 !important;
      }

      .consultation-modal.active {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      }

      .modal-overlay {
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        background: rgba(0, 0, 0, 0.6) !important;
        backdrop-filter: blur(8px) !important;
      }

      .modal-content {
        position: relative !important;
        background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%) !important;
        border-radius: 25px !important;
        box-shadow: 0 25px 80px rgba(0, 0, 0, 0.25), 0 0 40px rgba(201, 162, 77, 0.1) !important;
        max-width: 650px !important;
        width: 90% !important;
        max-height: 85vh !important;
        overflow-y: auto !important;
        padding: 45px !important;
        animation: slideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
        border: 1px solid rgba(201, 162, 77, 0.2) !important;
      }

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(60px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      .modal-close {
        position: absolute !important;
        top: 20px !important;
        right: 20px !important;
        background: linear-gradient(135deg, #f5f5f5, #e8e8e8) !important;
        border: 1px solid #ddd !important;
        font-size: 28px !important;
        color: #666 !important;
        cursor: pointer !important;
        width: 45px !important;
        height: 45px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
        border-radius: 12px !important;
      }

      .modal-close:hover {
        color: #c9a24d !important;
        transform: rotate(90deg) scale(1.1) !important;
        background: linear-gradient(135deg, #fff5e6, #ffe8cc) !important;
        border-color: #c9a24d !important;
      }

      .modal-header {
        margin-bottom: 35px !important;
        text-align: center !important;
        padding-bottom: 25px !important;
        border-bottom: 2px solid rgba(201, 162, 77, 0.15) !important;
      }

      .form-progress {
        margin-top: 20px !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 10px !important;
      }

      .progress-bar {
        width: 100% !important;
        height: 6px !important;
        background: #e8e8e8 !important;
        border-radius: 10px !important;
        overflow: hidden !important;
      }

      .progress-fill {
        height: 100% !important;
        background: linear-gradient(90deg, #c9a24d, #d4b060) !important;
        width: 0% !important;
        transition: width 0.3s ease !important;
        border-radius: 10px !important;
      }

      .progress-text {
        font-size: 12px !important;
        color: #999 !important;
        text-align: center !important;
        font-weight: 600 !important;
      }

      .modal-header h2 {
        font-size: 32px !important;
        font-weight: 800 !important;
        background: linear-gradient(135deg, #1a1a1a, #666) !important;
        -webkit-background-clip: text !important;
        -webkit-text-fill-color: transparent !important;
        background-clip: text !important;
        margin-bottom: 12px !important;
        font-family: 'Playfair Display', serif !important;
        letter-spacing: -0.5px !important;
      }

      .modal-header p {
        color: #999 !important;
        font-size: 15px !important;
        font-weight: 500 !important;
        letter-spacing: 0.3px !important;
      }

      #designConsultationForm {
        display: flex !important;
        flex-direction: column !important;
        gap: 28px !important;
      }

      .form-section {
        display: flex !important;
        flex-direction: column !important;
        gap: 14px !important;
        animation: fadeIn 0.5s ease forwards !important;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .section-label {
        font-weight: 700 !important;
        color: #1a1a1a !important;
        font-size: 14px !important;
        text-transform: uppercase !important;
        letter-spacing: 1px !important;
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
      }

      .section-label::before {
        content: '' !important;
        width: 4px !important;
        height: 4px !important;
        background: #c9a24d !important;
        border-radius: 50% !important;
      }

      .option-group {
        display: grid !important;
        grid-template-columns: 1fr 1fr !important;
        gap: 12px !important;
      }

      .option-group.checkbox {
        display: flex !important;
        flex-direction: column !important;
        gap: 10px !important;
      }

      .option {
        display: flex !important;
        align-items: center !important;
        gap: 12px !important;
        padding: 14px 16px !important;
        background: linear-gradient(135deg, #f9f9fb, #f3f4f8) !important;
        border: 2px solid #e8e8f0 !important;
        border-radius: 12px !important;
        cursor: pointer !important;
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
        font-weight: 500 !important;
        color: #333 !important;
        position: relative !important;
      }

      .option:hover {
        background: linear-gradient(135deg, #fff9f0, #fff5e6) !important;
        border-color: #c9a24d !important;
        transform: translateX(4px) !important;
        box-shadow: 0 6px 20px rgba(201, 162, 77, 0.15) !important;
      }

      .option input {
        cursor: pointer !important;
        accent-color: #c9a24d !important;
        width: 20px !important;
        height: 20px !important;
        flex-shrink: 0 !important;
      }

      .option input:checked {
        accent-color: #c9a24d !important;
      }

      .option input:checked + span {
        color: #c9a24d !important;
        font-weight: 700 !important;
      }

      .option:has(input:checked) {
        background: linear-gradient(135deg, rgba(201, 162, 77, 0.12), rgba(201, 162, 77, 0.08)) !important;
        border-color: #c9a24d !important;
        box-shadow: 0 4px 15px rgba(201, 162, 77, 0.2) !important;
      }

      textarea {
        padding: 14px 16px !important;
        border: 2px solid #e5e5e5 !important;
        border-radius: 12px !important;
        font-size: 15px !important;
        font-family: 'Inter', sans-serif !important;
        resize: vertical !important;
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
        color: #333 !important;
        background: linear-gradient(135deg, #fafbfc, #f5f6fb) !important;
      }

      textarea:focus {
        outline: none !important;
        border-color: #c9a24d !important;
        box-shadow: 0 0 0 5px rgba(201, 162, 77, 0.15) !important;
        background: #ffffff !important;
      }

      input[type="text"],
      input[type="tel"] {
        width: 100% !important;
        padding: 14px 16px !important;
        border: 2px solid #e5e5e5 !important;
        border-radius: 12px !important;
        font-size: 15px !important;
        font-family: 'Inter', sans-serif !important;
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
        color: #333 !important;
        background: linear-gradient(135deg, #fafbfc, #f5f6fb) !important;
      }

      .input-wrapper {
        position: relative !important;
        display: flex !important;
        align-items: center !important;
      }

      .input-wrapper input {
        flex: 1 !important;
        padding-right: 45px !important;
      }

      .input-indicator {
        position: absolute !important;
        right: 14px !important;
        color: #c9a24d !important;
        font-size: 18px !important;
        opacity: 0 !important;
        transition: all 0.3s ease !important;
        pointer-events: none !important;
      }

      .input-wrapper input:valid ~ .input-indicator {
        opacity: 1 !important;
      }

      .field-error {
        color: #d32f2f !important;
        font-size: 12px !important;
        margin-top: 6px !important;
        display: none !important;
        font-weight: 500 !important;
      }

      .field-error.show {
        display: block !important;
      }

      input[type="text"]:focus,
      input[type="tel"]:focus {
        outline: none !important;
        border-color: #c9a24d !important;
        box-shadow: 0 0 0 5px rgba(201, 162, 77, 0.15) !important;
        background: #ffffff !important;
        transform: translateY(-2px) !important;
      }

      input[type="text"]::placeholder,
      input[type="tel"]::placeholder {
        color: #aaa !important;
      }

      /* Dropdown Styles */
      .dropdown-wrapper {
        position: relative !important;
        display: flex !important;
        align-items: center !important;
      }

      .category-dropdown {
        width: 100% !important;
        padding: 14px 40px 14px 16px !important;
        border: 2px solid #e5e5e5 !important;
        border-radius: 12px !important;
        font-size: 15px !important;
        font-family: 'Inter', sans-serif !important;
        color: #333 !important;
        background: linear-gradient(135deg, #fafbfc, #f5f6fb) !important;
        cursor: pointer !important;
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
        appearance: none !important;
        -webkit-appearance: none !important;
        -moz-appearance: none !important;
      }

      .category-dropdown:hover {
        border-color: #c9a24d !important;
        background: linear-gradient(135deg, #fff9f0, #fff5e6) !important;
      }

      .category-dropdown:focus {
        outline: none !important;
        border-color: #c9a24d !important;
        box-shadow: 0 0 0 5px rgba(201, 162, 77, 0.15) !important;
        background: #ffffff !important;
        transform: translateY(-2px) !important;
      }

      .category-dropdown option {
        padding: 12px 16px !important;
        background: white !important;
        color: #333 !important;
        border: none !important;
      }

      .category-dropdown option:hover {
        background: #f0f0f0 !important;
      }

      .dropdown-arrow {
        position: absolute !important;
        right: 14px !important;
        color: #c9a24d !important;
        font-size: 12px !important;
        pointer-events: none !important;
        transition: all 0.3s ease !important;
      }

      .category-dropdown:focus ~ .dropdown-arrow {
        transform: rotate(180deg) !important;
      }

      .form-buttons {
        display: grid !important;
        grid-template-columns: 1fr 1fr !important;
        gap: 14px !important;
        margin-top: 30px !important;
        padding-top: 25px !important;
        border-top: 2px solid rgba(201, 162, 77, 0.1) !important;
      }

      .btn-submit,
      .btn-cancel {
        padding: 16px 24px !important;
        border: none !important;
        border-radius: 12px !important;
        font-size: 15px !important;
        font-weight: 700 !important;
        cursor: pointer !important;
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
        font-family: 'Inter', sans-serif !important;
        text-transform: uppercase !important;
        letter-spacing: 0.8px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 8px !important;
        position: relative !important;
        overflow: hidden !important;
      }

      .btn-submit::before {
        content: '' !important;
        position: absolute !important;
        top: 0 !important;
        left: -100% !important;
        width: 100% !important;
        height: 100% !important;
        background: rgba(255, 255, 255, 0.2) !important;
        transition: left 0.3s ease !important;
      }

      .btn-submit {
        background: linear-gradient(135deg, #c9a24d, #d4b060) !important;
        color: white !important;
        box-shadow: 0 8px 25px rgba(201, 162, 77, 0.3) !important;
        position: relative !important;
      }

      .btn-submit:hover:not(:disabled) {
        transform: translateY(-4px) !important;
        box-shadow: 0 15px 40px rgba(201, 162, 77, 0.4) !important;
      }

      .btn-submit:hover:not(:disabled)::before {
        left: 100% !important;
      }

      .btn-submit:active {
        transform: translateY(-2px) !important;
      }

      .btn-submit:disabled {
        opacity: 0.8 !important;
        cursor: not-allowed !important;
      }

      .btn-loader {
        display: inline-block !important;
        animation: spin 1s linear infinite !important;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      .btn-cancel {
        background: linear-gradient(135deg, #f5f5f5, #e8e8e8) !important;
        color: #333 !important;
        border: 1px solid #ddd !important;
      }

      .btn-cancel:hover {
        background: linear-gradient(135deg, #e8e8e8, #ddd) !important;
        transform: translateY(-2px) !important;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1) !important;
      }

      .btn-cancel:active {
        transform: translateY(-1px) !important;
      }

      @media (max-width: 600px) {
        .modal-content {
          padding: 30px 20px !important;
          border-radius: 20px !important;
        }

        .modal-header {
          margin-bottom: 25px !important;
          padding-bottom: 20px !important;
        }

        .modal-header h2 {
          font-size: 26px !important;
        }

        .modal-header p {
          font-size: 14px !important;
        }

        .option-group {
          grid-template-columns: 1fr !important;
        }

        .form-buttons {
          grid-template-columns: 1fr !important;
          gap: 10px !important;
        }

        .btn-submit,
        .btn-cancel {
          padding: 14px 20px !important;
          font-size: 14px !important;
        }

        #designConsultationForm {
          gap: 22px !important;
        }

        .section-label {
          font-size: 13px !important;
        }
      }

      @media (max-width: 480px) {
        .modal-content {
          padding: 25px 16px !important;
          border-radius: 18px !important;
          max-width: 95vw !important;
        }

        .modal-header h2 {
          font-size: 22px !important;
        }

        .modal-header p {
          font-size: 13px !important;
        }

        .option {
          padding: 12px 14px !important;
          font-size: 14px !important;
        }

        .btn-submit,
        .btn-cancel {
          padding: 12px 16px !important;
          font-size: 13px !important;
          letter-spacing: 0.5px !important;
        }

        input[type="text"],
        input[type="tel"],
        textarea {
          padding: 12px 14px !important;
          font-size: 14px !important;
        }
      }
    </style>
  `;

  // Initialize modal when DOM is ready
  function initializeModal() {
    // Add styles
    document.head.insertAdjacentHTML('beforeend', modalStyles);
    
    // Add modal HTML
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Add form validation listeners AFTER DOM elements are ready
    setTimeout(() => {
      setupFormValidation();
    }, 0);

    // Update all "Book Free Consultation" buttons
    const allLinks = document.querySelectorAll('a');
    allLinks.forEach(link => {
      // Only attach to "Book Consultation" or "Request Consultation" buttons, not all Design links
      const text = link.textContent.trim();
      if ((text.includes('Book') && text.includes('Consultation')) || 
          text === 'Request Consultation') {
        link.href = 'javascript:void(0)';
        link.style.cursor = 'pointer';
        link.addEventListener('click', (e) => {
          e.preventDefault();
          openDesignConsultation();
        });
      }
    });
  }

  function setupFormValidation() {
    const form = document.getElementById('designConsultationForm');
    if (!form) return;

    const nameInput = document.getElementById('consultantName');
    const phoneInput = document.getElementById('consultantPhone');
    const categoryDropdown = document.getElementById('categoryDropdown');
    const budgetInputs = form.querySelectorAll('input[name="budget"]');
    const styleInputs = form.querySelectorAll('input[name="style"]');

    // Real-time validation and progress tracking
    const updateProgress = () => {
      let completed = 0;
      let total = 5; // name, phone, category, budget, style

      if (nameInput.value.trim().length > 0) completed++;
      if (phoneInput.value.trim().length > 0) completed++;
      if (categoryDropdown.value.trim().length > 0) completed++;
      if (Array.from(budgetInputs).some(i => i.checked)) completed++;
      if (Array.from(styleInputs).some(i => i.checked)) completed++;

      const percentage = Math.round((completed / total) * 100);
      const progressBar = document.querySelector('.progress-fill');
      const progressText = document.querySelector('.progress-text');

      if (progressBar) {
        progressBar.style.width = percentage + '%';
      }
      if (progressText) {
        progressText.textContent = percentage + '% Complete';
      }
    };

    // Name validation
    nameInput.addEventListener('input', (e) => {
      const isValid = e.target.value.trim().length >= 2;
      updateInputState(e.target, isValid);
      updateProgress();
    });

    // Phone validation
    phoneInput.addEventListener('input', (e) => {
      const phone = e.target.value.replace(/\D/g, '');
      const isValid = phone.length >= 10;
      updateInputState(e.target, isValid);
      updateProgress();
    });

    // Category change
    categoryDropdown.addEventListener('change', updateProgress);

    // Budget change
    budgetInputs.forEach(input => {
      input.addEventListener('change', updateProgress);
    });

    // Style change
    styleInputs.forEach(input => {
      input.addEventListener('change', updateProgress);
    });
  }

  function updateInputState(input, isValid) {
    const wrapper = input.closest('.input-wrapper');
    const errorSpan = input.closest('.form-section').querySelector('.field-error');
    
    if (isValid || input.value.trim() === '') {
      if (errorSpan) errorSpan.classList.remove('show');
    } else {
      if (errorSpan) {
        errorSpan.classList.add('show');
        if (input.name === 'name') {
          errorSpan.textContent = 'Please enter at least 2 characters';
        } else if (input.name === 'phone') {
          errorSpan.textContent = 'Please enter a valid phone number (10+ digits)';
        }
      }
    }
  }

  // Global functions
  window.openDesignConsultation = function() {
    const modal = document.getElementById('designConsultationModal');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeDesignConsultation = function() {
    const modal = document.getElementById('designConsultationModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  };

  window.submitDesignConsultation = async function(e) {
    e.preventDefault();

    // Get form data
    const form = document.getElementById('designConsultationForm');
    const formData = new FormData(form);
    const submitBtn = document.getElementById('submitBtn');
    
    // Extract values from form
    const name = document.getElementById('consultantName').value.trim();
    const phone = document.getElementById('consultantPhone').value.trim();
    const category = document.getElementById('categoryDropdown').value.trim();
    const budget = formData.get('budget');
    const styles = Array.from(formData.getAll('style'));

    console.log('📝 Form Data Captured:', { name, phone, category, budget, styles });

    // Validate required fields
    if (!name || !phone || !category || !budget || styles.length === 0) {
      alert('⚠️ Please fill in all required fields (Name, Phone, Category, Budget, and at least one Design Style)');
      return;
    }

    // Show loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      const btnText = submitBtn.querySelector('.btn-text');
      const btnLoader = submitBtn.querySelector('.btn-loader');
      if (btnText) btnText.style.display = 'none';
      if (btnLoader) btnLoader.style.display = 'inline-block';
    }

    // Prepare data object for Firebase
    const designData = {
      name: name,
      phone: phone,
      category: category,
      budget: budget,
      styles: styles,
      timestamp: new Date().toISOString(),
      localTime: new Date().toLocaleString()
    };

    console.log('🔥 Design Data to Save:', designData);

    // Save to Firebase
    await saveDesignDetailsToFirebase(designData, form, submitBtn);
  };

  async function saveDesignDetailsToFirebase(designData, form, submitBtn) {
    console.log('💾 Saving to Firebase...');
    console.log('Design Data:', designData);
    
    try {
      const consultationsRef = ref(db, 'consultations');
      console.log('📍 Reference created for consultations');
      
      // Simple approach: just push the data directly
      // Firebase listener will handle UI updates and deduplication
      console.log('🚀 Pushing data to Firebase...');
      const result = await push(consultationsRef, designData);
      
      console.log('✅ SUCCESS! Firebase ID:', result.key);
      console.log('✅ Data saved successfully');
      
      // Show success message
      showSuccessMessage(designData);

      // Reset form
      form.reset();
      
    } catch (error) {
      console.error('❌ FIREBASE ERROR:', error);
      console.error('Error Code:', error.code);
      console.error('Error Message:', error.message);
      console.error('Full Error:', error);
      
      // More helpful error messages
      let errorMsg = 'There was an error saving your request. Please check your internet connection and try again.';
      
      if (error.code === 'PERMISSION_DENIED') {
        errorMsg = 'Permission Denied. Please contact admin to fix Firebase rules.';
      } else if (error.code === 'NETWORK_ERROR') {
        errorMsg = 'Network error. Please check your internet connection.';
      } else if (error.message.includes('index')) {
        errorMsg = 'Database index error. Your request may still be saved. Please refresh.';
      }
      
      showErrorMessage(
        'Error Saving Request',
        errorMsg
      );
    } finally {
      // Reset button state
      if (submitBtn) {
        submitBtn.disabled = false;
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');
        if (btnText) btnText.style.display = 'inline';
        if (btnLoader) btnLoader.style.display = 'none';
      }
    }
  }

  /**
   * Generate WhatsApp link with pre-filled message for design consultation
   */
  function generateDesignWhatsAppLink(designData) {
    const cleanPhone = (designData.phone || '').replace(/\D/g, '');
    
    if (!cleanPhone) {
      return '#';
    }

    // Prepare styles string
    const stylesText = Array.isArray(designData.styles) && designData.styles.length > 0
      ? designData.styles.join(', ')
      : 'Modern & Contemporary';

    // Create message with consultation details - More attractive
    const message = `🎨 *Room Design Consultation* 🎨

Hello ${designData.name || 'there'}! 👋

We're thrilled to design your perfect space! ✨

📋 *Your Design Preferences:*
💰 Budget Range: ${designData.budget || 'Flexible'}
🎭 Design Style: ${stylesText}
📱 Contact: ${designData.phone}

🌟 *Our Design Process:*
✨ Understand your vision & needs
🎨 Create custom design proposals
🏗️ Handle project management
🎯 Deliver your dream space!

⏱️ *Next Steps:*
✅ Our design experts will contact you within 24 hours
✅ We'll create a personalized proposal for your space
✅ Let's bring your vision to life! 🚀

💡 Have specific ideas in mind? Share them with us!

Best regards,
*Interior Design Studio* 🏆`;

    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);

    // Generate the complete WhatsApp URL
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  }

  function showErrorMessage(title, message) {
    const modalContent = document.querySelector('.modal-content');
    const originalContent = modalContent.innerHTML;

    modalContent.innerHTML = `
      <div style="text-align: center; padding: 40px 20px;">
        <div style="font-size: 56px; margin-bottom: 20px; color: #d32f2f;">⚠️</div>
        <h2 style="font-family: 'Playfair Display', serif; font-size: 28px; color: #d32f2f; margin-bottom: 15px;">
          ${title}
        </h2>
        <p style="color: #666; font-size: 15px; margin-bottom: 20px; white-space: pre-wrap;">
          ${message}
        </p>
        <button onclick="location.reload()" style="
          background: linear-gradient(135deg, #d32f2f, #ff6f00);
          color: white;
          border: none;
          padding: 14px 32px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-right: 10px;
        ">Reload Page</button>
        <button onclick="closeDesignConsultation()" style="
          background: #f0f0f0;
          color: #333;
          border: none;
          padding: 14px 32px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        ">Close</button>
      </div>
    `;

    // Restore form after 10 seconds
    setTimeout(() => {
      if (modalContent.innerHTML.includes(title)) {
        modalContent.innerHTML = originalContent;
      }
    }, 10000);
  }

  function showSuccessMessage(userData) {
    const modalContent = document.querySelector('.modal-content');
    const originalContent = modalContent.innerHTML;

    modalContent.innerHTML = `
      <div style="text-align: center; padding: 50px 30px; display: flex; flex-direction: column; align-items: center; gap: 20px;">
        <div class="success-checkmark" style="
          font-size: 80px;
          margin-bottom: 10px;
          animation: scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        ">✓</div>
        
        <h2 style="font-family: 'Playfair Display', serif; font-size: 28px; color: #1a1a1a; margin: 0;">Design Request Received!</h2>
        
        <p style="color: #666; font-size: 15px; margin: 0; max-width: 400px;">
          Thank you for sharing your design preferences, <strong style="color: #c9a24d;">${userData.name}</strong>.<br>
          Our design team will contact you at <strong>${userData.phone}</strong> within 24 hours.
        </p>
        
        <div style="background: linear-gradient(135deg, rgba(201, 162, 77, 0.08), rgba(201, 162, 77, 0.05)); padding: 20px; border-radius: 12px; border: 1px solid rgba(201, 162, 77, 0.2); width: 100%; max-width: 380px; text-align: left;">
          <p style="color: #333; margin: 10px 0; font-size: 14px; display: flex; align-items: center; gap: 10px;"><span style="color: #c9a24d; font-size: 18px;">💰</span> <strong>Budget:</strong> ${userData.budget}</p>
          <p style="color: #333; margin: 10px 0; font-size: 14px; display: flex; align-items: center; gap: 10px;"><span style="color: #c9a24d; font-size: 18px;">🎨</span> <strong>Styles:</strong> ${userData.styles.join(', ')}</p>
          ${userData.roomTypes && userData.roomTypes.length > 0 ? `<p style="color: #333; margin: 10px 0; font-size: 14px; display: flex; align-items: center; gap: 10px;"><span style="color: #c9a24d; font-size: 18px;">🏠</span> <strong>Rooms:</strong> ${userData.roomTypes.join(', ')}</p>` : ''}
          <p style="color: #999; margin: 10px 0; font-size: 12px; display: flex; align-items: center; gap: 10px;"><span style="color: #c9a24d;">✓</span> Data saved to Firebase</p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; width: 100%; max-width: 360px; margin-top: 10px;">
          <button onclick="location.reload()" style="
            background: linear-gradient(135deg, #c9a24d, #d4b060);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 10px;
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          ">
            Close
          </button>
          <button onclick="window.open('https://wa.me/', '_blank')" style="
            background: #25D366;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 10px;
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          ">
            WhatsApp
          </button>
        </div>
      </div>

      <style>
        @keyframes scaleIn {
          0% {
            transform: scale(0) rotateZ(-45deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.2) rotateZ(10deg);
          }
          100% {
            transform: scale(1) rotateZ(0deg);
            opacity: 1;
          }
        }
      </style>
    `;

    // Restore form after 6 seconds
    setTimeout(() => {
      if (modalContent.innerHTML.includes('Design Request Received')) {
        modalContent.innerHTML = originalContent;
        // Reset progress bar
        const progressBar = document.querySelector('.progress-fill');
        if (progressBar) progressBar.style.width = '0%';
        const progressText = document.querySelector('.progress-text');
        if (progressText) progressText.textContent = '0% Complete';
        // Re-setup validation
        setupFormValidation();
        window.closeDesignConsultation();
      }
    }, 6000);
  }

  // Close modal when clicking overlay
  document.addEventListener('DOMContentLoaded', function() {
    initializeModal();
    
    document.addEventListener('click', function(e) {
      const modal = document.getElementById('designConsultationModal');
      if (e.target === modal) {
        window.closeDesignConsultation();
      }
    });
  });
})();
