// Admin Panel Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (sessionStorage.getItem('adminLoggedIn') !== 'true') {
        window.location.href = 'login.html';
        return;
    }
    
    // Update user name in header
    const userNameElement = document.querySelector('.user-name');
    if (userNameElement) {
        const adminUsername = sessionStorage.getItem('adminUsername') || 'Admin User';
        userNameElement.textContent = adminUsername;
    }
    
    // DOM Elements
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    const contentSections = document.querySelectorAll('.content-section');
    const headerTitle = document.querySelector('.header-title h1');
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // Modals and Buttons
    const addNoticeBtn = document.getElementById('addNoticeBtn');
    const uploadImagesBtn = document.getElementById('uploadImagesBtn');
    const addUserBtn = document.getElementById('addUserBtn');
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    
    const addNoticeModal = document.getElementById('addNoticeModal');
    const uploadImagesModal = document.getElementById('uploadImagesModal');
    const addUserModal = document.getElementById('addUserModal');
    const deleteConfirmModal = document.getElementById('deleteConfirmModal');
    
    const closeModalButtons = document.querySelectorAll('.close-modal, .cancel-modal');
    const deleteButtons = document.querySelectorAll('.btn-icon.delete');
    const editButtons = document.querySelectorAll('.btn-icon.edit');
    const confirmDeleteBtn = document.getElementById('confirmDelete');
    
    // Current item being deleted
    let currentDeleteTarget = null;
    
    // Navigation - show content sections based on sidebar links
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active link
            sidebarLinks.forEach(l => l.parentElement.classList.remove('active'));
            this.parentElement.classList.add('active');
            
            // Show appropriate section
            const targetSection = this.getAttribute('data-section');
            contentSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetSection) {
                    section.classList.add('active');
                    // Update header title
                    headerTitle.textContent = this.textContent.trim();
                }
            });
            
            // On mobile, close the sidebar after selection
            if (window.innerWidth <= 992) {
                sidebar.classList.remove('active');
            }
        });
    });
    
    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
    
    // Modal functions
    function openModal(modal) {
        if (modal) modal.style.display = 'flex';
    }
    
    function closeModal(modal) {
        if (modal) modal.style.display = 'none';
    }
    
    function closeAllModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
    }
    
    // Close modal with X or Cancel buttons
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            closeAllModals();
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });
    
    // Open Add Notice modal
    if (addNoticeBtn) {
        addNoticeBtn.addEventListener('click', function() {
            // Set today's date as default
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('noticeDate').value = today;
            openModal(addNoticeModal);
        });
    }
    
    // Open Upload Images modal
    if (uploadImagesBtn) {
        uploadImagesBtn.addEventListener('click', function() {
            openModal(uploadImagesModal);
        });
    }
    
    // Open Add User modal
    if (addUserBtn) {
        addUserBtn.addEventListener('click', function() {
            openModal(addUserModal);
        });
    }
    
    // Handle image preview in upload form
    const imageFile = document.getElementById('imageFile');
    const imagePreview = document.getElementById('imagePreview');
    
    if (imageFile && imagePreview) {
        imageFile.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.src = e.target.result;
                    imagePreview.style.display = 'block';
                }
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Delete confirmation
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Store reference to the item being deleted (the table row or card)
            currentDeleteTarget = this.closest('tr') || this.closest('.image-card');
            openModal(deleteConfirmModal);
        });
    });
    
    // Handle delete confirmation
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', function() {
            if (currentDeleteTarget) {
                // Remove the item from the DOM
                currentDeleteTarget.remove();
                
                // Show success message
                alert('Item deleted successfully.');
                
                // Reset and close modal
                currentDeleteTarget = null;
                closeModal(deleteConfirmModal);
            }
        });
    }
    
    // Handle form submissions
    
    // Add Notice Form
    const addNoticeForm = document.getElementById('addNoticeForm');
    if (addNoticeForm) {
        addNoticeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const title = document.getElementById('noticeTitle').value;
            const date = document.getElementById('noticeDate').value;
            const status = document.getElementById('noticeStatus').value;
            
            // Create new table row
            const noticesTable = document.getElementById('noticesTable');
            if (noticesTable) {
                const tbody = noticesTable.querySelector('tbody');
                const newRow = document.createElement('tr');
                
                // Format date
                const formattedDate = new Date(date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                
                newRow.innerHTML = `
                    <td>${title}</td>
                    <td>${formattedDate}</td>
                    <td><span class="status-badge ${status}">${status.charAt(0).toUpperCase() + status.slice(1)}</span></td>
                    <td class="actions">
                        <button class="btn-icon edit" title="Edit"><i class="fas fa-edit"></i></button>
                        <button class="btn-icon delete" title="Delete"><i class="fas fa-trash-alt"></i></button>
                    </td>
                `;
                
                // Add event listeners to new buttons
                const newDeleteBtn = newRow.querySelector('.delete');
                if (newDeleteBtn) {
                    newDeleteBtn.addEventListener('click', function() {
                        currentDeleteTarget = this.closest('tr');
                        openModal(deleteConfirmModal);
                    });
                }
                
                // Add the row to the table
                tbody.insertBefore(newRow, tbody.firstChild);
                
                // Show success message and close modal
                alert('Notice added successfully!');
                closeModal(addNoticeModal);
                addNoticeForm.reset();
            }
        });
    }
    
    // Upload Images Form
    const uploadImagesForm = document.getElementById('uploadImagesForm');
    if (uploadImagesForm) {
        uploadImagesForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const title = document.getElementById('imageTitle').value;
            const category = document.getElementById('imageCategory').value;
            const imageFile = document.getElementById('imageFile').files[0];
            
            // In a real app, you would upload the file to the server here
            // For this demo, we'll just create a new image card
            
            if (imageFile) {
                const imageGallery = document.querySelector('.image-gallery');
                if (imageGallery) {
                    const newImageCard = document.createElement('div');
                    newImageCard.className = 'image-card';
                    
                    // Create image URL
                    const imageUrl = URL.createObjectURL(imageFile);
                    
                    newImageCard.innerHTML = `
                        <div class="image-preview">
                            <img src="${imageUrl}" alt="${title}">
                        </div>
                        <div class="image-details">
                            <h4>${title}</h4>
                            <p>Used in: ${category.charAt(0).toUpperCase() + category.slice(1)}</p>
                        </div>
                        <div class="image-actions">
                            <button class="btn-icon edit" title="Edit"><i class="fas fa-edit"></i></button>
                            <button class="btn-icon delete" title="Delete"><i class="fas fa-trash-alt"></i></button>
                        </div>
                    `;
                    
                    // Add event listener to new delete button
                    const newDeleteBtn = newImageCard.querySelector('.delete');
                    if (newDeleteBtn) {
                        newDeleteBtn.addEventListener('click', function() {
                            currentDeleteTarget = this.closest('.image-card');
                            openModal(deleteConfirmModal);
                        });
                    }
                    
                    // Add the card to the gallery
                    imageGallery.insertBefore(newImageCard, imageGallery.firstChild);
                    
                    // Show success message and close modal
                    alert('Image uploaded successfully!');
                    closeModal(uploadImagesModal);
                    uploadImagesForm.reset();
                    document.getElementById('imagePreview').style.display = 'none';
                }
            }
        });
    }
    
    // Add User Form
    const addUserForm = document.getElementById('addUserForm');
    if (addUserForm) {
        addUserForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const username = document.getElementById('userName').value;
            const fullName = document.getElementById('userFullName').value;
            const email = document.getElementById('userEmail').value;
            const role = document.getElementById('userRole').value;
            const status = document.getElementById('userStatus').value;
            
            // Create new table row
            const usersTable = document.getElementById('usersTable');
            if (usersTable) {
                const tbody = usersTable.querySelector('tbody');
                const newRow = document.createElement('tr');
                
                // Format role with capital first letter
                const formattedRole = role.charAt(0).toUpperCase() + role.slice(1);
                
                newRow.innerHTML = `
                    <td>${username}</td>
                    <td>${fullName}</td>
                    <td>${email}</td>
                    <td>${formattedRole}</td>
                    <td><span class="status-badge ${status}">${status.charAt(0).toUpperCase() + status.slice(1)}</span></td>
                    <td class="actions">
                        <button class="btn-icon edit" title="Edit"><i class="fas fa-edit"></i></button>
                        <button class="btn-icon delete" title="Delete"><i class="fas fa-trash-alt"></i></button>
                    </td>
                `;
                
                // Add event listener to new delete button
                const newDeleteBtn = newRow.querySelector('.delete');
                if (newDeleteBtn) {
                    newDeleteBtn.addEventListener('click', function() {
                        currentDeleteTarget = this.closest('tr');
                        openModal(deleteConfirmModal);
                    });
                }
                
                // Add the row to the table
                tbody.insertBefore(newRow, tbody.firstChild);
                
                // Show success message and close modal
                alert('User added successfully!');
                closeModal(addUserModal);
                addUserForm.reset();
            }
        });
    }
    
    // Save Settings
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', function() {
            // In a real app, you would send this data to the server
            alert('Settings saved successfully!');
        });
    }
    
    // Search functionality for notices
    const noticeSearch = document.getElementById('noticeSearch');
    if (noticeSearch) {
        noticeSearch.addEventListener('input', function() {
            filterTable('noticesTable', this.value);
        });
    }
    
    // Filter functionality for notices
    const noticeFilter = document.getElementById('noticeFilter');
    if (noticeFilter) {
        noticeFilter.addEventListener('change', function() {
            filterTableByStatus('noticesTable', this.value);
        });
    }
    
    // Search functionality for images
    const imageSearch = document.getElementById('imageSearch');
    if (imageSearch) {
        imageSearch.addEventListener('input', function() {
            filterGallery(this.value);
        });
    }
    
    // Filter functionality for images
    const imageFilter = document.getElementById('imageFilter');
    if (imageFilter) {
        imageFilter.addEventListener('change', function() {
            filterGalleryByCategory(this.value);
        });
    }
    
    // Filter table by search term
    function filterTable(tableId, searchTerm) {
        const table = document.getElementById(tableId);
        if (table) {
            const rows = table.querySelectorAll('tbody tr');
            searchTerm = searchTerm.toLowerCase();
            
            rows.forEach(row => {
                const title = row.cells[0].textContent.toLowerCase();
                if (title.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        }
    }
    
    // Filter table by status
    function filterTableByStatus(tableId, status) {
        const table = document.getElementById(tableId);
        if (table) {
            const rows = table.querySelectorAll('tbody tr');
            
            rows.forEach(row => {
                const statusCell = row.querySelector('.status-badge');
                if (statusCell) {
                    const rowStatus = statusCell.classList[1]; // Get the status class
                    
                    if (status === 'all' || rowStatus === status) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                }
            });
        }
    }
    
    // Filter gallery by search term
    function filterGallery(searchTerm) {
        const gallery = document.querySelector('.image-gallery');
        if (gallery) {
            const cards = gallery.querySelectorAll('.image-card');
            searchTerm = searchTerm.toLowerCase();
            
            cards.forEach(card => {
                const title = card.querySelector('h4').textContent.toLowerCase();
                if (title.includes(searchTerm)) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        }
    }
    
    // Filter gallery by category
    function filterGalleryByCategory(category) {
        const gallery = document.querySelector('.image-gallery');
        if (gallery) {
            const cards = gallery.querySelectorAll('.image-card');
            
            cards.forEach(card => {
                const usedIn = card.querySelector('p').textContent.toLowerCase();
                
                if (category === 'all' || usedIn.includes(category)) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        }
    }
    
    // Logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Clear session storage
            sessionStorage.removeItem('adminLoggedIn');
            sessionStorage.removeItem('adminUsername');
            
            // Redirect to login page
            window.location.href = 'login.html';
        });
    }
    
    // Handle edit functionality for notices
    editButtons.forEach(button => {
        if (button.closest('#noticesTable')) {
            button.addEventListener('click', function() {
                const row = this.closest('tr');
                const title = row.cells[0].textContent;
                const date = row.cells[1].textContent;
                const status = row.querySelector('.status-badge').classList[1];
                
                // Populate the add/edit notice modal with existing data
                document.getElementById('noticeTitle').value = title;
                
                // Convert the date format
                const dateObj = new Date(date);
                const formattedDate = dateObj.toISOString().split('T')[0];
                document.getElementById('noticeDate').value = formattedDate;
                
                document.getElementById('noticeStatus').value = status;
                
                // Open the modal
                openModal(addNoticeModal);
                
                // Change the title to "Edit Notice"
                const modalTitle = addNoticeModal.querySelector('h2');
                if (modalTitle) modalTitle.textContent = 'Edit Notice';
                
                // Change the submit button text
                const submitBtn = addNoticeModal.querySelector('.btn-primary');
                if (submitBtn) submitBtn.textContent = 'Update Notice';
                
                // Store reference to the row being edited
                currentDeleteTarget = row;
            });
        }
    });
});