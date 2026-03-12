/**
 * dashboard.js - Admin Dashboard for Consultation Leads
 * 
 * Reads consultation data from Firebase Realtime Database
 * Displays in a dynamic table with real-time updates
 */

import { ref, onValue, remove, update } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";
import { db } from "./firebase.js";

console.log('📊 Dashboard initializing...');

// ==================== ELEMENTS ====================
const loadingSpinner = document.getElementById('loadingSpinner');
const tableContainer = document.getElementById('tableContainer');
const emptyState = document.getElementById('emptyState');
const tableBody = document.getElementById('tableBody');
const errorMessage = document.getElementById('errorMessage');
const totalLeadsEl = document.getElementById('totalLeads');
const todayLeadsEl = document.getElementById('todayLeads');
const weekLeadsEl = document.getElementById('weekLeads');
const uniquePhonesEl = document.getElementById('uniquePhones');
const lastUpdatedEl = document.getElementById('lastUpdated');
const syncTimeEl = document.getElementById('syncTime');
const searchInput = document.getElementById('searchInput');
const clearSearch = document.getElementById('clearSearch');
const searchResults = document.getElementById('searchResults');

// ==================== STATE ====================
let allConsultations = [];
let currentPage = 1;
const recordsPerPage = 10;
let currentSearchQuery = '';

// ==================== HELPER FUNCTIONS ====================

/**
 * Format timestamp to readable date and time
 */
function formatTime(timestamp) {
  try {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const dateString = date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    const timeString = date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    return `${dateString} ${timeString}`;
  } catch (error) {
    console.error('Error formatting time:', error);
    return timestamp;
  }
}

/**
 * Get today's date in YYYY-MM-DD format
 */
function getTodayDate() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

/**
 * Check if a timestamp is from today
 */
function isToday(timestamp) {
  try {
    const date = new Date(timestamp);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  } catch (error) {
    return false;
  }
}

/**
 * Format phone number as clickable WhatsApp link
 */
function formatPhoneNumber(phone) {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  return cleaned;
}

/**
 * Create HTML for style badges
 */
function createStyleBadges(styles) {
  if (!styles) return '--';
  
  // Handle string format (comma-separated)
  let styleArray = Array.isArray(styles) ? styles : styles.split(', ').filter(s => s.trim());
  
  if (!styleArray || styleArray.length === 0) return '--';
  
  return styleArray
    .slice(0, 3) // Show max 3 styles
    .map(style => `<span class="style-badge">${escapeHtml(style.trim())}</span>`)
    .join('');
}

/**
 * Show error message
 */
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.add('show');
  console.error('❌ Error:', message);
}

/**
 * Hide error message
 */
function hideError() {
  errorMessage.classList.remove('show');
}

/**
 * Check if a timestamp is from this week (last 7 days)
 */
function isThisWeek(timestamp) {
  try {
    const date = new Date(timestamp);
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    return date >= sevenDaysAgo && date <= today;
  } catch (error) {
    return false;
  }
}

/**
 * Get unique phone numbers from consultations
 */
function getUniquePhoneNumbers(consultations = null) {
  const dataToProcess = consultations || allConsultations;
  if (!dataToProcess || dataToProcess.length === 0) {
    return 0;
  }
  
  const phoneSet = new Set();
  dataToProcess.forEach(consultation => {
    const phone = consultation.phone || consultation.phoneNumber;
    if (phone) {
      const cleanPhone = phone.toString().trim();
      if (cleanPhone) {
        phoneSet.add(cleanPhone);
      }
    }
  });
  
  return phoneSet.size;
}

/**
 * Update dashboard statistics
 */
function updateStats() {
  if (!allConsultations || allConsultations.length === 0) {
    totalLeadsEl.textContent = '0';
    todayLeadsEl.textContent = '0';
    weekLeadsEl.textContent = '0';
    uniquePhonesEl.textContent = '0';
    lastUpdatedEl.textContent = 'N/A';
    return;
  }

  // Filter out invalid entries (more lenient validation)
  const validConsultations = allConsultations.filter(consultation => {
    const name = consultation.name || consultation.fullName || '';
    const phone = consultation.phone || consultation.phoneNumber || '';
    
    const hasName = typeof name === 'string' && name.trim() !== '';
    const hasPhone = typeof phone === 'string' && phone.toString().trim() !== '';
    return hasName || hasPhone;
  });

  // Total leads (valid entries only)
  totalLeadsEl.textContent = validConsultations.length;

  // Today's leads
  const todayCount = validConsultations.filter(consultation => {
    const timestamp = consultation.timestamp || consultation.submissionDate;
    return isToday(timestamp);
  }).length;
  todayLeadsEl.textContent = todayCount;

  // This week's leads (last 7 days)
  const weekCount = validConsultations.filter(consultation => {
    const timestamp = consultation.timestamp || consultation.submissionDate;
    return isThisWeek(timestamp);
  }).length;
  weekLeadsEl.textContent = weekCount;

  // Unique phone numbers
  const uniquePhoneCount = getUniquePhoneNumbers(validConsultations);
  uniquePhonesEl.textContent = uniquePhoneCount;

  // Last updated time
  const now = new Date();
  const timeString = now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  lastUpdatedEl.textContent = timeString;
  syncTimeEl.textContent = timeString;
}

/**
 * Filter consultations based on search query
 */
function filterConsultations(query) {
  // First filter to only valid consultations
  const validConsultations = allConsultations.filter(consultation => {
    const name = consultation.name || consultation.fullName || '';
    const phone = consultation.phone || consultation.phoneNumber || '';
    
    const hasName = typeof name === 'string' && name.trim() !== '';
    const hasPhone = typeof phone === 'string' && phone.toString().trim() !== '';
    return hasName || hasPhone;
  });

  if (!query.trim()) {
    return validConsultations;
  }

  const searchTerm = query.toLowerCase().trim();
  
  return validConsultations.filter(consultation => {
    const name = (consultation.name || consultation.fullName || '').toLowerCase();
    const phone = (consultation.phone || consultation.phoneNumber || '').toString().toLowerCase();
    
    return name.includes(searchTerm) || phone.includes(searchTerm);
  });
}

/**
 * Handle search input change
 */
function handleSearchInput(event) {
  currentSearchQuery = event.target.value;
  
  // Show/hide clear button
  if (currentSearchQuery.trim()) {
    clearSearch.style.display = 'block';
  } else {
    clearSearch.style.display = 'none';
  }

  // Reset to first page when searching
  currentPage = 1;
  
  // Render filtered results
  renderFilteredTable();
}

/**
 * Clear search input
 */
function handleClearSearch() {
  currentSearchQuery = '';
  searchInput.value = '';
  clearSearch.style.display = 'none';
  currentPage = 1;
  renderTable();
}

/**
 * Render table with filtered results
 */
function renderFilteredTable() {
  const filtered = filterConsultations(currentSearchQuery);
  
  tableBody.innerHTML = '';

  if (filtered.length === 0) {
    // Show no results message
    loadingSpinner.style.display = 'none';
    tableContainer.style.display = 'none';
    emptyState.style.display = 'block';
    searchResults.innerHTML = '';
    
    emptyState.innerHTML = `
      <div class="no-results">
        <div class="no-results-icon">🔍</div>
        <h3>No Results Found</h3>
        <p>No consultations match "${currentSearchQuery}"</p>
      </div>
    `;
    return;
  }

  // Show table with results
  loadingSpinner.style.display = 'none';
  tableContainer.style.display = 'block';
  emptyState.style.display = 'none';
  
  // Show search results count
  const totalMatches = filtered.length;
  searchResults.innerHTML = `<strong>${totalMatches}</strong> result${totalMatches !== 1 ? 's' : ''} found`;

  // Sort by timestamp (newest first)
  const sorted = [...filtered].sort((a, b) => {
    const dateA = new Date(a.timestamp || 0);
    const dateB = new Date(b.timestamp || 0);
    return dateB - dateA;
  });

  // Create table rows
  sorted.forEach((consultation) => {
    const row = document.createElement('tr');
    const whatsappLink = generateWhatsAppLink(consultation);
    const currentStatus = consultation.status || 'New';
    const statusClass = `status-${currentStatus.toLowerCase().replace(/\s+/g, '-')}`;

    row.innerHTML = `
      <td class="name">${escapeHtml(consultation.name || 'N/A')}</td>
      <td class="phone">${escapeHtml(consultation.phone || 'N/A')}</td>
      <td><span class="budget">${escapeHtml(consultation.budget || 'N/A')}</span></td>
      <td class="styles">${createStyleBadges(consultation.styles)}</td>
      <td>
        <select class="status-select ${statusClass}" onchange="updateConsultationStatus('${consultation.id}', this.value, this)">
          <option value="New" ${currentStatus === 'New' ? 'selected' : ''}>New</option>
          <option value="Contacted" ${currentStatus === 'Contacted' ? 'selected' : ''}>Contacted</option>
          <option value="In Progress" ${currentStatus === 'In Progress' ? 'selected' : ''}>In Progress</option>
          <option value="Closed" ${currentStatus === 'Closed' ? 'selected' : ''}>Closed</option>
        </select>
      </td>
      <td class="time">${formatTime(consultation.timestamp || '')}</td>
      <td class="action-cell">
        <a href="${whatsappLink}" target="_blank" class="whatsapp-btn">
          💬 WhatsApp
        </a>
        <button class="delete-btn" onclick="deleteConsultation('${consultation.id}', '${escapeHtml(consultation.name || 'Unknown')}')">
          🗑️ Delete
        </button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}



/**
 * Delete a consultation from Firebase
 */
window.deleteConsultation = async function(id, name) {
  if (!confirm(`Are you sure you want to delete the consultation from ${name}? This action cannot be undone.`)) {
    return;
  }

  try {
    // Find the consultation to get its Firebase path
    const consultation = allConsultations.find(c => c.id === id);
    const firebasePath = consultation?.firebasePath || 'consultations';
    
    // 🚀 INSTANTLY UPDATE THE UI (don't wait for Firebase listener)
    console.log('🗑️ Removing from UI instantly:', id);
    allConsultations = allConsultations.filter(c => c.id !== id);
    renderTable();
    updateStats();
    
    // Show success notification
    const notification = document.createElement('div');
    notification.className = 'notification notification-success';
    notification.textContent = `✅ Deleted consultation from ${name}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('hide');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
    
    hideError();
    
    // Delete from Firebase in the background
    const consultationRef = ref(db, `${firebasePath}/${id}`);
    await remove(consultationRef);
    console.log('✅ Consultation deleted from Firebase');
    
  } catch (error) {
    console.error('❌ Error deleting consultation:', error);
    showError(`Failed to delete consultation: ${error.message}`);
    
    // Reload page on error to restore UI state
    setTimeout(() => {
      location.reload();
    }, 2000);
  }
};

/**
 * Update consultation status in Firebase
 */
window.updateConsultationStatus = async function(id, newStatus, selectElement) {
  try {
    // Add visual feedback
    selectElement.classList.add('status-updating');
    selectElement.disabled = true;

    // Update Firebase
    const consultationRef = ref(db, `consultations/${id}`);
    await update(consultationRef, { status: newStatus });

    // Update status class
    const statusClass = `status-${newStatus.toLowerCase().replace(/\s+/g, '-')}`;
    selectElement.className = `status-select ${statusClass}`;

    console.log(`✅ Status updated to "${newStatus}" for consultation ${id}`);
    hideError();

    // Remove visual feedback
    selectElement.classList.remove('status-updating');
    selectElement.disabled = false;
  } catch (error) {
    console.error('❌ Error updating status:', error);
    showError(`Failed to update status: ${error.message}`);
    
    // Revert select to previous value on error
    selectElement.classList.remove('status-updating');
    selectElement.disabled = false;
    
    // Reload to get fresh data
    setTimeout(() => {
      location.reload();
    }, 2000);
  }
};

/**
 * Export all consultation leads to Excel file
 */
window.exportLeadsToExcel = async function() {
  try {
    const exportBtn = document.getElementById('exportBtn');
    
    // Check if there are leads to export
    if (!allConsultations || allConsultations.length === 0) {
      showError('No consultation leads to export');
      return;
    }

    // Show loading state
    exportBtn.classList.add('loading');
    exportBtn.disabled = true;
    exportBtn.textContent = '📊 Exporting...';

    // Prepare data for Excel
    const excelData = allConsultations.map(consultation => ({
      'Name': consultation.name || 'N/A',
      'Phone': consultation.phone || 'N/A',
      'Budget': consultation.budget || 'N/A',
      'Preferred Styles': Array.isArray(consultation.styles) 
        ? consultation.styles.join(', ') 
        : 'N/A',
      'Date': formatTime(consultation.timestamp || ''),
      'Status': consultation.status || 'New'
    }));

    // Create a new workbook
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Consultations');

    // Set column widths for better readability
    const colWidths = [
      { wch: 20 }, // Name
      { wch: 15 }, // Phone
      { wch: 15 }, // Budget
      { wch: 30 }, // Preferred Styles
      { wch: 20 }, // Date
      { wch: 15 }  // Status
    ];
    worksheet['!cols'] = colWidths;

    // Style the header row (optional but nice)
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_col(C) + '1';
      if (!worksheet[address]) continue;
      worksheet[address].s = {
        font: { bold: true, color: { rgb: 'FFFFFF' } },
        fill: { fgColor: { rgb: '667eea' } },
        alignment: { horizontal: 'center', vertical: 'center' }
      };
    }

    // Generate filename with current date
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    const filename = `consultation-leads-${dateStr}.xlsx`;

    // Write the file
    XLSX.writeFile(workbook, filename);

    console.log(`✅ Successfully exported ${allConsultations.length} leads to Excel`);
    hideError();

    // Reset button
    exportBtn.classList.remove('loading');
    exportBtn.disabled = false;
    exportBtn.textContent = '📊 Export Leads';

    // Show success message
    const notification = document.createElement('div');
    notification.className = 'notification notification-success';
    notification.textContent = `✅ Successfully exported ${allConsultations.length} leads!`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('hide');
      setTimeout(() => notification.remove(), 300);
    }, 3000);

  } catch (error) {
    console.error('❌ Error exporting to Excel:', error);
    showError(`Export failed: ${error.message}`);
    
    const exportBtn = document.getElementById('exportBtn');
    exportBtn.classList.remove('loading');
    exportBtn.disabled = false;
    exportBtn.textContent = '📊 Export Leads';
  }
};

/**
 * Render table rows from consultations data with pagination
 */
function renderTable() {
  // Clear existing rows
  tableBody.innerHTML = '';

  if (!allConsultations || allConsultations.length === 0) {
    // Show empty state
    loadingSpinner.style.display = 'none';
    tableContainer.style.display = 'none';
    emptyState.style.display = 'block';
    return;
  }

  // Filter out invalid entries (entries with no name/phone AND no ID pattern)
  const validConsultations = allConsultations.filter(consultation => {
    const name = consultation.name || consultation.fullName || '';
    const phone = consultation.phone || consultation.phoneNumber || '';
    
    const hasName = typeof name === 'string' && name.trim() !== '';
    const hasPhone = typeof phone === 'string' && phone.toString().trim() !== '';
    const hasIdentifier = hasName || hasPhone;
    
    if (!hasIdentifier) {
      console.warn('⚠️ Filtering out invalid consultation entry:', consultation);
      return false;
    }
    return true;
  });

  // Show empty state if all entries are invalid
  if (validConsultations.length === 0) {
    loadingSpinner.style.display = 'none';
    tableContainer.style.display = 'none';
    emptyState.style.display = 'block';
    return;
  }

  // Show table, hide loading and empty state
  loadingSpinner.style.display = 'none';
  tableContainer.style.display = 'block';
  emptyState.style.display = 'none';

  // Sort consultations by timestamp (newest first)
  const sorted = [...validConsultations].sort((a, b) => {
    // Get timestamp from various possible fields
    const timestampA = a.timestamp || a.submissionDate || a.created_at || '';
    const timestampB = b.timestamp || b.submissionDate || b.created_at || '';
    
    // Convert to date objects for comparison
    const dateA = timestampA ? new Date(timestampA) : new Date(0);
    const dateB = timestampB ? new Date(timestampB) : new Date(0);
    
    // Handle invalid dates
    const timeA = isNaN(dateA.getTime()) ? 0 : dateA.getTime();
    const timeB = isNaN(dateB.getTime()) ? 0 : dateB.getTime();
    
    // Sort newest first (descending order)
    return timeB - timeA;
  });

  console.log('📊 Sorted consultations (first 3):', sorted.slice(0, 3).map(c => ({
    name: c.name || c.fullName,
    timestamp: c.timestamp || c.submissionDate,
    sortKey: new Date(c.timestamp || c.submissionDate).getTime()
  })));

  // Calculate pagination
  const totalPages = Math.ceil(sorted.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const paginatedData = sorted.slice(startIndex, endIndex);

  // Create table rows
  paginatedData.forEach((consultation, index) => {
    const row = document.createElement('tr');

    // Map field names properly
    const fullName = consultation.fullName || consultation.name || 'N/A';
    const phoneNumber = consultation.phoneNumber || consultation.phone || 'N/A';
    const categoryName = consultation.category || consultation.bedroomType || consultation.kitchenType || consultation.livingRoomType || 'N/A';
    const budgetValue = consultation.budget || 'N/A';
    const stylesArray = consultation.preferredStyles 
      ? (Array.isArray(consultation.preferredStyles) 
          ? consultation.preferredStyles 
          : consultation.preferredStyles.split(', '))
      : (consultation.styles || []);
    
    // Format timestamp properly
    let formattedTime = 'N/A';
    try {
      const timestamp = consultation.submissionDate || consultation.timestamp;
      if (timestamp) {
        formattedTime = new Date(timestamp).toLocaleString('en-IN', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        });
      }
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      formattedTime = 'Invalid Date';
    }

    // Generate WhatsApp link with encoded message
    const whatsappLink = generateWhatsAppLink({
      name: fullName,
      phone: phoneNumber,
      category: categoryName,
      budget: budgetValue,
      styles: stylesArray
    });
    
    const currentStatus = consultation.status || 'pending';
    const statusClass = `status-${currentStatus.toLowerCase().replace(/\s+/g, '-')}`;

    row.innerHTML = `
      <td class="name">${escapeHtml(fullName)}</td>
      <td class="phone">${escapeHtml(phoneNumber)}</td>
      <td class="category"><span class="category-badge">${escapeHtml(categoryName)}</span></td>
      <td><span class="budget">${escapeHtml(budgetValue)}</span></td>
      <td class="styles">${createStyleBadges(stylesArray)}</td>
      <td>
        <select class="status-select ${statusClass}" onchange="updateConsultationStatus('${consultation.id}', this.value, this)">
          <option value="New" ${currentStatus === 'New' || currentStatus === 'pending' ? 'selected' : ''}>New</option>
          <option value="Contacted" ${currentStatus === 'Contacted' ? 'selected' : ''}>Contacted</option>
          <option value="In Progress" ${currentStatus === 'In Progress' ? 'selected' : ''}>In Progress</option>
          <option value="Closed" ${currentStatus === 'Closed' ? 'selected' : ''}>Closed</option>
        </select>
      </td>
      <td class="time">${formattedTime}</td>
      <td class="action-cell">
        <a href="${whatsappLink}" target="_blank" class="whatsapp-btn">
          💬 WhatsApp
        </a>
        <button class="delete-btn" onclick="deleteConsultation('${consultation.id}', '${escapeHtml(fullName)}')">
          🗑️ Delete
        </button>
      </td>
    `;

    tableBody.appendChild(row);
  });

  // Add pagination controls
  renderPagination(totalPages, sorted.length);

  console.log(`✅ Rendered ${paginatedData.length}/${sorted.length} consultation(s) (Page ${currentPage}/${totalPages})`);
  updateStats();
}

/**
 * Render pagination controls
 */
function renderPagination(totalPages, totalRecords) {
  const existingPagination = document.querySelector('.pagination');
  if (existingPagination) {
    existingPagination.remove();
  }

  if (totalPages <= 1) return; // No pagination needed

  const paginationDiv = document.createElement('div');
  paginationDiv.className = 'pagination';
  paginationDiv.style.cssText = `
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 20px;
    padding: 15px;
    background: #f9f9f9;
    border-radius: 8px;
  `;

  // Previous button
  const prevBtn = document.createElement('button');
  prevBtn.textContent = '← Previous';
  prevBtn.disabled = currentPage === 1;
  prevBtn.style.cssText = `
    padding: 8px 12px;
    border: 1px solid #ddd;
    background: ${currentPage === 1 ? '#f0f0f0' : 'white'};
    cursor: ${currentPage === 1 ? 'not-allowed' : 'pointer'};
    border-radius: 4px;
    font-weight: 500;
  `;
  prevBtn.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      renderTable();
    }
  };
  paginationDiv.appendChild(prevBtn);

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement('button');
    pageBtn.textContent = i;
    pageBtn.style.cssText = `
      padding: 8px 12px;
      border: 1px solid ${i === currentPage ? '#667eea' : '#ddd'};
      background: ${i === currentPage ? '#667eea' : 'white'};
      color: ${i === currentPage ? 'white' : '#333'};
      cursor: pointer;
      border-radius: 4px;
      font-weight: ${i === currentPage ? 'bold' : 'normal'};
    `;
    pageBtn.onclick = () => {
      currentPage = i;
      renderTable();
    };
    paginationDiv.appendChild(pageBtn);
  }

  // Next button
  const nextBtn = document.createElement('button');
  nextBtn.textContent = 'Next →';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.style.cssText = `
    padding: 8px 12px;
    border: 1px solid #ddd;
    background: ${currentPage === totalPages ? '#f0f0f0' : 'white'};
    cursor: ${currentPage === totalPages ? 'not-allowed' : 'pointer'};
    border-radius: 4px;
    font-weight: 500;
  `;
  nextBtn.onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderTable();
    }
  };
  paginationDiv.appendChild(nextBtn);

  // Info text
  const infoSpan = document.createElement('span');
  infoSpan.style.cssText = `
    display: flex;
    align-items: center;
    margin-left: 20px;
    color: #666;
    font-size: 14px;
  `;
  infoSpan.textContent = `Page ${currentPage} of ${totalPages} (${totalRecords} total)`;
  paginationDiv.appendChild(infoSpan);

  tableContainer.parentNode.insertBefore(paginationDiv, tableContainer.nextSibling);
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Design Images Mapping - Links to design images for each design style
 */
const designImageMap = {
  'Minimalist Elegance': 'https://images.unsplash.com/photo-1600210491369-e753d80a41f3?w=800&h=600&fit=crop',
  'Luxury Contemporary': 'https://images.unsplash.com/photo-1617104678098-de229db51175?w=800&h=600&fit=crop',
  'Industrial Modern': 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
  'Scandinavian Style': 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=800&h=600&fit=crop',
  'Monochrome Theme': 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop',
  'Warm Neutrals': 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&h=600&fit=crop',
  'L-Shape Kitchen': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
  'U-Shape Kitchen': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop'
};

/**
 * Generate WhatsApp link with encoded message
 */
function generateWhatsAppLink(consultation) {
  // Handle field name variations
  const cleanPhone = formatPhoneNumber(consultation.phone || consultation.phoneNumber || '');
  const name = consultation.name || consultation.fullName || 'there';
  const category = consultation.category || consultation.bedroomType || consultation.kitchenType || consultation.livingRoomType || 'Not specified';
  const budget = consultation.budget || 'Flexible';
  const email = consultation.email || '';
  const selectedDesign = consultation.selectedBedroomDesign || consultation.selectedKitchenDesign || '';
  
  if (!cleanPhone) {
    return '#';
  }

  // Get design image if available
  const designImage = designImageMap[selectedDesign] || null;

  // Prepare styles string
  let stylesText = 'Modern & Contemporary';
  if (consultation.styles) {
    stylesText = Array.isArray(consultation.styles) 
      ? consultation.styles.join(', ')
      : consultation.styles;
  } else if (consultation.preferredStyles) {
    stylesText = Array.isArray(consultation.preferredStyles)
      ? consultation.preferredStyles.join(', ')
      : consultation.preferredStyles;
  }

  // Build detailed message with all user information
  let message = `✨ *Interior Design Consultation Confirmed* ✨

Dear *${name}*,

Thank you for entrusting us with your interior design project. We're delighted to transform your space into something extraordinary!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 *YOUR PROJECT DETAILS*

👤 *Client:* ${name}
📱 *Contact:* ${cleanPhone}
${email ? `📧 *Email:* ${email}\n` : ''}🏠 *Room Type:* ${category}
${selectedDesign ? `🎯 *Design Style:* ${selectedDesign}\n` : ''}💰 *Budget:* ${budget}
🎨 *Preferences:* ${stylesText}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⭐ *WHY PARTNER WITH US*

✓ Experienced design team with 10+ years in premium interiors
✓ Bespoke designs tailored perfectly to your space & vision
✓ Professional execution with meticulous attention to detail
✓ End-to-end project management & support
✓ Guaranteed quality & lasting elegance

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 *OUR PROCESS*

1️⃣ *Review* → We analyze your requirements & preferences (2 hrs)
2️⃣ *Consult* → Personal consultation to discuss vision (24-48 hrs)
3️⃣ *Design* → Custom proposals with detailed recommendations
4️⃣ *Finalize* → Agree on timeline & investment
5️⃣ *Transform* → Bring your dream space to life 🚀

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⏱️ *EXPECTED TIMELINE*

🔵 *Initial Response:* 2 hours
🔵 *Design Proposal:* 48 hours
🔵 *Project Commencement:* 1 week

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎁 *EXCLUSIVE OFFER*

New clients receive *10% discount* on design consultation services! Limited-time opportunity.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

We're committed to delivering exceptional design that reflects your personality and enhances your lifestyle. Looking forward to creating something beautiful together!

Questions? We're here to help. 😊

With warmth,
*Interior Design Studio*
_Premium Design • Timeless Elegance_`;

  // Encode the message for URL
  const encodedMessage = encodeURIComponent(message);

  // Generate the complete WhatsApp URL
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

/**
 * Load consultations from Firebase with real-time updates
 */
function loadConsultations() {
  console.log('🔥 Connecting to Firebase consultations...');
  hideError();

  try {
    // Define all consultation paths to listen to
    const consultationPaths = [
      'consultations',
      'lshape_kitchen_consultations',
      'modern_bedroom_consultations'
    ];

    // Create promises for each path that resolve once on first data load
    const dataPromises = consultationPaths.map((path) => {
      return new Promise((resolve, reject) => {
        const consultationsRef = ref(db, path);
        let isFirstCall = true;

        const unsubscribe = onValue(
          consultationsRef,
          (snapshot) => {
            try {
              let pathData = [];
              
              if (snapshot.exists()) {
                const data = snapshot.val();
                console.log(`📥 Firebase data received from ${path}:`, data);

                // Convert Firebase object to array and add category and path
                pathData = Object.entries(data).map(([key, value]) => ({
                  id: key,
                  category: path.replace(/_consultations/g, '').replace(/_/g, ' ').toUpperCase(),
                  firebasePath: path,
                  ...value
                }));
              } else {
                console.log(`📭 No consultations found at ${path}`);
              }

              // Only resolve on first load, then continue listening for updates
              if (isFirstCall) {
                isFirstCall = false;
                resolve(pathData);
              } else {
                // For subsequent updates, merge by ID to prevent duplicates
                console.log(`📥 Update from ${path}, pathData length: ${pathData.length}`);
                
                // Only merge if we have valid data
                if (pathData.length > 0) {
                  const updatedIds = new Set(pathData.map(item => item.id));
                  // Remove old entries for this path that match the updated IDs
                  const filteredConsultations = allConsultations.filter(item => 
                    !(item.firebasePath === path && updatedIds.has(item.id))
                  );
                  // Add the new/updated data
                  allConsultations = [...filteredConsultations, ...pathData];
                  console.log(`✅ Merged ${pathData.length} updated items from ${path}. Total: ${allConsultations.length}`);
                } else {
                  // Path is empty - remove all entries from this path
                  console.log(`🗑️ Path ${path} is now empty, removing all entries from this path`);
                  allConsultations = allConsultations.filter(item => item.firebasePath !== path);
                }
                
                renderTable();
                updateStats();
              }
            } catch (error) {
              console.error(`❌ Error processing Firebase data from ${path}:`, error);
              if (isFirstCall) {
                reject(error);
              } else {
                showError('Error processing consultation data');
              }
            }
          },
          (error) => {
            console.error(`❌ Firebase read error from ${path}:`, error);
            
            const errorText = error.code === 'PERMISSION_DENIED'
              ? 'Permission denied. Check Firebase Database Rules.'
              : `Error loading data: ${error.message}`;
            
            if (isFirstCall) {
              reject(error);
            } else {
              showError(errorText);
            }
          }
        );
      });
    });

    // Wait for all initial data to load, then render once
    Promise.all(dataPromises)
      .then((results) => {
        // Combine all data from all paths
        allConsultations = results.flat();
        console.log(`✅ Loaded ${allConsultations.length} consultation(s) total`);
        
        // Log timestamps for debugging sort order
        if (allConsultations.length > 0) {
          const sortedForLog = [...allConsultations].sort((a, b) => {
            const timeA = new Date(a.timestamp || a.submissionDate || 0).getTime();
            const timeB = new Date(b.timestamp || b.submissionDate || 0).getTime();
            return timeB - timeA;
          });
          console.log('📅 First 3 entries by timestamp:', sortedForLog.slice(0, 3).map(c => ({
            name: c.name || c.fullName,
            timestamp: c.timestamp || c.submissionDate
          })));
        }
        
        // Render all data immediately on first load (renderTable will sort)
        renderTable();
        updateStats();
        hideError();
      })
      .catch((error) => {
        console.error('❌ Error loading consultations:', error);
        loadingSpinner.style.display = 'none';
        showError(`Failed to connect to Firebase: ${error.message}`);
      });
  } catch (error) {
    console.error('❌ Error setting up Firebase listener:', error);
    loadingSpinner.style.display = 'none';
    showError('Failed to connect to Firebase');
  }
}

/**
 * Initialize dashboard
 */
function initializeDashboard() {
  console.log('%c📊 DASHBOARD INITIALIZED', 'color: green; font-weight: bold; font-size: 14px;');
  console.log('✅ Firebase module imported');
  console.log('✅ DOM elements loaded');
  console.log('✅ Starting real-time listener...');
  
  // Add search event listeners
  if (searchInput) {
    searchInput.addEventListener('input', handleSearchInput);
  }
  if (clearSearch) {
    clearSearch.addEventListener('click', handleClearSearch);
  }
  
  loadConsultations();
}

// ==================== INITIALIZATION ====================

// Start dashboard when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeDashboard);
} else {
  initializeDashboard();
}

// Add periodic sync time update (every minute)
setInterval(() => {
  const now = new Date();
  const timeString = now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  syncTimeEl.textContent = timeString;
}, 60000);


