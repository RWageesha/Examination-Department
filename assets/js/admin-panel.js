// Admin Panel Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
        // We rely on PHP session for auth; a first probe to a protected endpoint will confirm.
    
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
    // Guidance
    const addGuidanceBtn = document.getElementById('addGuidanceBtn');
    const addGuidanceModal = document.getElementById('addGuidanceModal');
    const addGuidanceForm = document.getElementById('addGuidanceForm');
    const guidanceTable = document.getElementById('guidanceTable');
    // Downloads
    const addDownloadBtn = document.getElementById('addDownloadBtn');
    const addDownloadModal = document.getElementById('addDownloadModal');
    const addDownloadForm = document.getElementById('addDownloadForm');
    const downloadsTable = document.getElementById('downloadsTable');
    const downloadCategorySelect = document.getElementById('downloadCategory');

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
    let currentDeleteTargetType = null; // 'notice' | 'user' | 'image' | 'guidance' | 'download'
    let currentDeleteTargetId = null;

    // Editing state
    let editingNoticeId = null;
    let editingGuidanceId = null;

    // Category cache for downloads (slug -> name)
    const categoryMap = new Map();

    // Simple API helper
    async function apiFetch(url, options = {}) {
        const res = await fetch(url, { credentials: 'include', ...options });
        // Try to parse json; if fails, throw fallback
        let data = null;
        try { data = await res.json(); } catch (_) {}
        if (!res.ok) {
            const msg = (data && (data.error || data.message)) || `Request failed (${res.status})`;
            const err = new Error(msg);
            err.status = res.status;
            throw err;
        }
        return data;
    }

    async function ensureAuth() {
        try {
            const data = await apiFetch('../backend/api/auth/me.php');
            // Update header user
            if (userNameElement) {
                userNameElement.textContent = data.admin.username || data.admin.name || data.admin.email;
            }
            return data.admin;
        } catch (err) {
            if (err.status === 401) {
                window.location.href = 'login.html';
                return;
            }
            throw err;
        }
    }
    
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
    
    // Attach initial delete button handlers (static elements only)
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            currentDeleteTarget = this.closest('tr') || this.closest('.image-card');
            // Try detect type & id if present
            const tbody = this.closest('tbody');
            if (tbody && tbody.parentElement && tbody.parentElement.id === 'noticesTable') {
                currentDeleteTargetType = 'notice';
                currentDeleteTargetId = Number(this.closest('tr').dataset.id || 0);
            } else if (tbody && tbody.parentElement && tbody.parentElement.id === 'usersTable') {
                currentDeleteTargetType = 'user';
                currentDeleteTargetId = Number(this.closest('tr').dataset.id || 0);
            } else if (tbody && tbody.parentElement && tbody.parentElement.id === 'guidanceTable') {
                currentDeleteTargetType = 'guidance';
                currentDeleteTargetId = Number(this.closest('tr').dataset.id || 0);
            } else if (tbody && tbody.parentElement && tbody.parentElement.id === 'downloadsTable') {
                currentDeleteTargetType = 'download';
                currentDeleteTargetId = Number(this.closest('tr').dataset.id || 0);
            } else {
                currentDeleteTargetType = 'image';
                currentDeleteTargetId = null;
            }
            openModal(deleteConfirmModal);
        });
    });
    
    // Handle delete confirmation
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', async function() {
            if (!currentDeleteTarget) return;
            try {
                if (currentDeleteTargetType === 'notice' && currentDeleteTargetId) {
                    await apiFetch('../backend/api/notices.php', {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: new URLSearchParams({ id: String(currentDeleteTargetId) })
                    });
                    // Refresh list
                    await loadNotices();
                } else if (currentDeleteTargetType === 'user' && currentDeleteTargetId) {
                    await apiFetch('../backend/api/admins.php', {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: new URLSearchParams({ id: String(currentDeleteTargetId) })
                    });
                    await loadUsers();
                } else if (currentDeleteTargetType === 'guidance' && currentDeleteTargetId) {
                    await apiFetch('../backend/api/guidance.php', {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: new URLSearchParams({ id: String(currentDeleteTargetId) })
                    });
                    await loadGuidance();
                } else if (currentDeleteTargetType === 'download' && currentDeleteTargetId) {
                    await apiFetch('../backend/api/downloads.php', {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: new URLSearchParams({ id: String(currentDeleteTargetId) })
                    });
                    await loadDownloads();
                } else {
                    // Image demo: just remove
                    currentDeleteTarget.remove();
                }
                alert('Deleted successfully.');
            } catch (err) {
                alert(`Delete failed: ${err.message}`);
            } finally {
                currentDeleteTarget = null;
                currentDeleteTargetType = null;
                currentDeleteTargetId = null;
                closeModal(deleteConfirmModal);
            }
        });
    }
    
    // Handle form submissions
    
    // Notices CRUD wiring
    const noticesTable = document.getElementById('noticesTable');
    const addNoticeForm = document.getElementById('addNoticeForm');

    async function loadNotices() {
        if (!noticesTable) return;
        try {
            const data = await apiFetch('../backend/api/notices.php');
            const tbody = noticesTable.querySelector('tbody');
            if (!tbody) return;
            tbody.innerHTML = '';
            data.items.forEach(item => {
                const tr = document.createElement('tr');
                tr.dataset.id = item.id;
                const date = new Date(item.noticed_date + 'T00:00:00');
                const formattedDate = date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
                tr.innerHTML = `
                    <td>${escapeHtml(item.title)}</td>
                    <td>${formattedDate}</td>
                    <td>${item.link_url ? `<a href="${escapeAttr(item.link_url)}" target="_blank" rel="noopener">Link</a>` : '-'}</td>
                    <td class="actions">
                        <button class="btn-icon edit" title="Edit"><i class="fas fa-edit"></i></button>
                        <button class="btn-icon delete" title="Delete"><i class="fas fa-trash-alt"></i></button>
                    </td>`;
                tbody.appendChild(tr);
            });
        } catch (err) {
            console.error(err);
            alert('Failed to load notices: ' + err.message);
        }
    }

    function escapeHtml(str) {
        return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[s]));
    }
    function escapeAttr(str) { return String(str).replace(/"/g, '&quot;'); }

    if (addNoticeForm) {
        addNoticeForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const title = document.getElementById('noticeTitle').value.trim();
            const noticed_date = document.getElementById('noticeDate').value;
            const description = document.getElementById('noticeContent').value.trim();
            const link_url = document.getElementById('noticeLink').value.trim();
            if (!title || !noticed_date || !description) {
                alert('Please fill Title, Date and Content.');
                return;
            }
            try {
                if (editingNoticeId) {
                    // Update via PUT urlencoded
                    await apiFetch('../backend/api/notices.php', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: new URLSearchParams({ id: String(editingNoticeId), title, description, noticed_date, link_url })
                    });
                    alert('Notice updated successfully!');
                } else {
                    // Create via POST multipart/form-data
                    const fd = new FormData();
                    fd.append('title', title);
                    fd.append('description', description);
                    fd.append('noticed_date', noticed_date);
                    if (link_url) fd.append('link_url', link_url);
                    await apiFetch('../backend/api/notices.php', { method: 'POST', body: fd });
                    alert('Notice added successfully!');
                }
                editingNoticeId = null;
                const modalTitle = addNoticeModal && addNoticeModal.querySelector('h2');
                if (modalTitle) modalTitle.textContent = 'Add New Notice';
                const submitBtn = addNoticeModal && addNoticeModal.querySelector('.btn-primary');
                if (submitBtn) submitBtn.textContent = 'Save Notice';
                closeModal(addNoticeModal);
                addNoticeForm.reset();
                await loadNotices();
            } catch (err) {
                alert('Save failed: ' + err.message);
            }
        });
    }

    // Delegate edit/delete clicks for notices
    if (noticesTable) {
        const tbody = noticesTable.querySelector('tbody');
        if (tbody) {
            tbody.addEventListener('click', function(e) {
                const btn = e.target.closest('button');
                if (!btn) return;
                const tr = btn.closest('tr');
                const id = Number(tr && tr.dataset.id);
                if (!id) return;
                if (btn.classList.contains('edit')) {
                    // Populate modal
                    const title = tr.cells[0].textContent;
                    const dateText = tr.cells[1].textContent;
                    const date = new Date(dateText);
                    document.getElementById('noticeTitle').value = title;
                    document.getElementById('noticeDate').value = isNaN(date) ? '' : date.toISOString().slice(0,10);
                    document.getElementById('noticeContent').value = ''; // description not in table; optional: fetch single item
                    const linkEl = tr.cells[2].querySelector('a');
                    document.getElementById('noticeLink').value = linkEl ? linkEl.getAttribute('href') : '';
                    // UI labels
                    const modalTitle = addNoticeModal && addNoticeModal.querySelector('h2');
                    if (modalTitle) modalTitle.textContent = 'Edit Notice';
                    const submitBtn = addNoticeModal && addNoticeModal.querySelector('.btn-primary');
                    if (submitBtn) submitBtn.textContent = 'Update Notice';
                    editingNoticeId = id;
                    openModal(addNoticeModal);
                } else if (btn.classList.contains('delete')) {
                    currentDeleteTarget = tr;
                    currentDeleteTargetType = 'notice';
                    currentDeleteTargetId = id;
                    openModal(deleteConfirmModal);
                }
            });
        }
    }

    // Guidance CRUD wiring
    async function loadGuidance() {
        if (!guidanceTable) return;
        try {
            const data = await apiFetch('../backend/api/guidance.php');
            const tbody = guidanceTable.querySelector('tbody');
            if (!tbody) return;
            tbody.innerHTML = '';
            data.items.forEach(item => {
                const tr = document.createElement('tr');
                tr.dataset.id = item.id;
                tr.dataset.description = item.description || '';
                tr.innerHTML = `
                    <td>${escapeHtml(item.title)}</td>
                    <td>${item.attachment_path ? `<a href="../${escapeAttr(item.attachment_path)}" target="_blank" rel="noopener">Attachment</a>` : '-'}</td>
                    <td>${item.link_url ? `<a href="${escapeAttr(item.link_url)}" target="_blank" rel="noopener">Link</a>` : '-'}</td>
                    <td class="actions">
                        <button class="btn-icon edit" title="Edit"><i class="fas fa-edit"></i></button>
                        <button class="btn-icon delete" title="Delete"><i class="fas fa-trash-alt"></i></button>
                    </td>`;
                tbody.appendChild(tr);
            });
        } catch (err) {
            console.error(err);
            alert('Failed to load guidance: ' + err.message);
        }
    }

    if (addGuidanceBtn && addGuidanceForm) {
        addGuidanceBtn.addEventListener('click', function() {
            editingGuidanceId = null;
            addGuidanceForm.reset();
            const modalTitle = addGuidanceModal && addGuidanceModal.querySelector('h2');
            if (modalTitle) modalTitle.textContent = 'Add Guidance';
            const submitBtn = addGuidanceModal && addGuidanceModal.querySelector('.btn-primary');
            if (submitBtn) submitBtn.textContent = 'Save Guidance';
            openModal(addGuidanceModal);
        });

        addGuidanceForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const title = document.getElementById('guidanceTitle').value.trim();
            const description = document.getElementById('guidanceContent').value.trim();
            const link_url = document.getElementById('guidanceLink').value.trim();
            const file = document.getElementById('guidanceFile').files[0];
            if (!title || !description) { alert('Please fill Title and Description.'); return; }
            try {
                if (editingGuidanceId) {
                    // Update via PUT (file cannot be updated here)
                    await apiFetch('../backend/api/guidance.php', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: new URLSearchParams({ id: String(editingGuidanceId), title, description, link_url })
                    });
                    alert('Guidance updated successfully!');
                } else {
                    const fd = new FormData();
                    fd.append('title', title);
                    fd.append('description', description);
                    if (link_url) fd.append('link_url', link_url);
                    if (file) fd.append('attachment', file);
                    await apiFetch('../backend/api/guidance.php', { method: 'POST', body: fd });
                    alert('Guidance added successfully!');
                }
                editingGuidanceId = null;
                closeModal(addGuidanceModal);
                addGuidanceForm.reset();
                await loadGuidance();
            } catch (err) {
                alert('Save failed: ' + err.message);
            }
        });
    }

    if (guidanceTable) {
        const tbody = guidanceTable.querySelector('tbody');
        if (tbody) {
            tbody.addEventListener('click', function(e) {
                const btn = e.target.closest('button');
                if (!btn) return;
                const tr = btn.closest('tr');
                const id = Number(tr && tr.dataset.id);
                if (!id) return;
                if (btn.classList.contains('edit')) {
                    const title = tr.cells[0].textContent;
                    const description = tr.dataset.description || '';
                    const linkEl = tr.cells[2].querySelector('a');
                    const link = linkEl ? linkEl.getAttribute('href') : '';
                    document.getElementById('guidanceTitle').value = title;
                    document.getElementById('guidanceContent').value = description;
                    document.getElementById('guidanceLink').value = link;
                    // File cannot be edited; clear file input
                    const fileInput = document.getElementById('guidanceFile');
                    if (fileInput) fileInput.value = '';
                    const modalTitle = addGuidanceModal && addGuidanceModal.querySelector('h2');
                    if (modalTitle) modalTitle.textContent = 'Edit Guidance';
                    const submitBtn = addGuidanceModal && addGuidanceModal.querySelector('.btn-primary');
                    if (submitBtn) submitBtn.textContent = 'Update Guidance';
                    editingGuidanceId = id;
                    openModal(addGuidanceModal);
                } else if (btn.classList.contains('delete')) {
                    currentDeleteTarget = tr;
                    currentDeleteTargetType = 'guidance';
                    currentDeleteTargetId = id;
                    openModal(deleteConfirmModal);
                }
            });
        }
    }

    // Downloads wiring
    async function preloadCategories() {
        if (!downloadCategorySelect) return;
        try {
            const data = await apiFetch('../backend/api/categories.php');
            downloadCategorySelect.innerHTML = '';
            data.items.forEach(cat => {
                categoryMap.set(cat.slug, cat.name);
                const opt = document.createElement('option');
                opt.value = cat.slug; // use slug for backend
                opt.textContent = cat.name;
                downloadCategorySelect.appendChild(opt);
            });
        } catch (err) {
            console.error(err);
            // Fallback to known slugs if needed
            ['staff','students','exam_hall_schedules'].forEach(slug => {
                if (!categoryMap.has(slug)) categoryMap.set(slug, slug.replace(/_/g,' '));
            });
        }
    }

    async function loadDownloads() {
        if (!downloadsTable) return;
        try {
            const data = await apiFetch('../backend/api/downloads.php');
            const tbody = downloadsTable.querySelector('tbody');
            if (!tbody) return;
            tbody.innerHTML = '';
            data.items.forEach(item => {
                const tr = document.createElement('tr');
                tr.dataset.id = item.id;
                const resourceLink = item.file_path
                    ? `<a href="../${escapeAttr(item.file_path)}" target="_blank" rel="noopener">File</a>`
                    : (item.link_url ? `<a href="${escapeAttr(item.link_url)}" target="_blank" rel="noopener">Link</a>` : '-');
                const catName = categoryMap.get(item.category) || item.category;
                tr.innerHTML = `
                    <td>${escapeHtml(item.title)}</td>
                    <td>${escapeHtml(catName)}</td>
                    <td>${resourceLink}</td>
                    <td class="actions">
                        <button class="btn-icon delete" title="Delete"><i class="fas fa-trash-alt"></i></button>
                    </td>`;
                tbody.appendChild(tr);
            });
        } catch (err) {
            console.error(err);
            alert('Failed to load downloads: ' + err.message);
        }
    }

    if (addDownloadBtn && addDownloadForm) {
        addDownloadBtn.addEventListener('click', function() {
            addDownloadForm.reset();
            openModal(addDownloadModal);
        });
        addDownloadForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const category = downloadCategorySelect ? downloadCategorySelect.value : '';
            const title = document.getElementById('downloadTitle').value.trim();
            const description = document.getElementById('downloadDescription').value.trim();
            const link_url = document.getElementById('downloadLink').value.trim();
            const file = document.getElementById('downloadFile').files[0];
            if (!category || !title || !description) { alert('Please fill Category, Title and Description.'); return; }
            if (!file && !link_url) { alert('Provide a file or a link.'); return; }
            try {
                const fd = new FormData();
                fd.append('category', category);
                fd.append('title', title);
                fd.append('description', description);
                if (link_url) fd.append('link_url', link_url);
                if (file) fd.append('file', file);
                await apiFetch('../backend/api/downloads.php', { method: 'POST', body: fd });
                alert('Download added successfully!');
                closeModal(addDownloadModal);
                addDownloadForm.reset();
                await loadDownloads();
            } catch (err) {
                alert('Save failed: ' + err.message);
            }
        });
    }

    if (downloadsTable) {
        const tbody = downloadsTable.querySelector('tbody');
        if (tbody) {
            tbody.addEventListener('click', function(e) {
                const btn = e.target.closest('button');
                if (!btn) return;
                if (btn.classList.contains('delete')) {
                    const tr = btn.closest('tr');
                    const id = Number(tr && tr.dataset.id);
                    if (!id) return;
                    currentDeleteTarget = tr;
                    currentDeleteTargetType = 'download';
                    currentDeleteTargetId = id;
                    openModal(deleteConfirmModal);
                }
            });
        }
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
    
    // Users management wiring
    const usersTable = document.getElementById('usersTable');
    const addUserForm = document.getElementById('addUserForm');

    function mapUiRoleToBackend(role) {
        // Map UI roles to backend roles (super/admin); keep admin by default to avoid over-privilege
        return role === 'administrator' ? 'admin' : 'admin';
    }

    async function loadUsers() {
        if (!usersTable) return;
        try {
            const data = await apiFetch('../backend/api/admins.php');
            const tbody = usersTable.querySelector('tbody');
            if (!tbody) return;
            tbody.innerHTML = '';
            data.items.forEach(u => {
                const tr = document.createElement('tr');
                tr.dataset.id = u.id;
                tr.innerHTML = `
                    <td>${u.username ? escapeHtml(u.username) : '-'}</td>
                    <td>${escapeHtml(u.name)}</td>
                    <td>${escapeHtml(u.email)}</td>
                    <td>${escapeHtml(u.role)}</td>
                    <td><span class="status-badge ${u.is_active ? 'active' : 'inactive'}">${u.is_active ? 'Active' : 'Inactive'}</span></td>
                    <td class="actions">
                        <button class="btn-icon delete" title="Deactivate"><i class="fas fa-user-slash"></i></button>
                    </td>`;
                tbody.appendChild(tr);
            });
        } catch (err) {
            console.error(err);
            alert('Failed to load users: ' + err.message);
        }
    }

    if (addUserForm) {
        addUserForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const username = document.getElementById('userName').value.trim();
            const fullName = document.getElementById('userFullName').value.trim();
            const email = document.getElementById('userEmail').value.trim();
            const password = document.getElementById('userPassword').value;
            const roleUi = document.getElementById('userRole').value;
            const role = mapUiRoleToBackend(roleUi);
            if (!fullName || !email || !password) {
                alert('Full name, email and password are required');
                return;
            }
            try {
                await apiFetch('../backend/api/admins.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: fullName, email, username, password, role })
                });
                alert('User added successfully!');
                closeModal(addUserModal);
                addUserForm.reset();
                await loadUsers();
            } catch (err) {
                alert('Failed to add user: ' + err.message);
            }
        });
    }

    // Delegate delete (deactivate) for users
    if (usersTable) {
        const tbody = usersTable.querySelector('tbody');
        if (tbody) {
            tbody.addEventListener('click', function(e) {
                const btn = e.target.closest('button');
                if (!btn) return;
                if (btn.classList.contains('delete')) {
                    const tr = btn.closest('tr');
                    const id = Number(tr && tr.dataset.id);
                    if (!id) return;
                    currentDeleteTarget = tr;
                    currentDeleteTargetType = 'user';
                    currentDeleteTargetId = id;
                    openModal(deleteConfirmModal);
                }
            });
        }
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
            logoutBtn.addEventListener('click', async function(e) {
                e.preventDefault();
                try {
                    await fetch('../backend/api/auth/logout.php', { method: 'POST', credentials: 'include' });
                } catch (_) {}
                window.location.href = 'login.html';
            });
    }
    
    // When opening Add Notice modal for create
    if (addNoticeBtn) {
        addNoticeBtn.addEventListener('click', function() {
            editingNoticeId = null;
            const modalTitle = addNoticeModal && addNoticeModal.querySelector('h2');
            if (modalTitle) modalTitle.textContent = 'Add New Notice';
            const submitBtn = addNoticeModal && addNoticeModal.querySelector('.btn-primary');
            if (submitBtn) submitBtn.textContent = 'Save Notice';
            const today = new Date().toISOString().split('T')[0];
            const dateEl = document.getElementById('noticeDate');
            if (dateEl && !dateEl.value) dateEl.value = today;
        });
    }

    // Initial load sequence
    (async function init() {
        await ensureAuth();
        await preloadCategories();
        await Promise.all([
            loadNotices(),
            loadUsers(),
            loadGuidance(),
            loadDownloads()
        ]);
    })();
});