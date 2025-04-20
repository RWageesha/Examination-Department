// Admin Login Functionality
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const forgotPasswordLink = document.getElementById('forgotPassword');
    const forgotPasswordModal = document.getElementById('forgotPasswordModal');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const closeModal = document.querySelector('.close-modal');
    const loginMessage = document.getElementById('loginMessage');
    const passwordToggle = document.querySelector('.password-toggle');
    const passwordField = document.getElementById('password');
    
    // Check if user is already logged in
    if (sessionStorage.getItem('adminLoggedIn') === 'true') {
        window.location.href = 'index.html';
    }
    
    // Sample admin credentials (in a real system, this would be server-side)
    const adminCredentials = {
        'admin': 'admin123',
        'sarah': 'sarah123',
        'mike': 'mike123'
    };
    
    // Handle login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Simple client-side validation (in a real app, this would be server-side)
        if (adminCredentials[username] && adminCredentials[username] === password) {
            // Show success message
            loginMessage.className = 'login-message success';
            loginMessage.textContent = 'Login successful! Redirecting...';
            
            // Simulate storing session (in a real app, this would be a secure cookie/session)
            sessionStorage.setItem('adminLoggedIn', 'true');
            sessionStorage.setItem('adminUsername', username);
            
            // Redirect to admin panel
            setTimeout(function() {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            // Show error message
            loginMessage.className = 'login-message error';
            loginMessage.textContent = 'Invalid username or password';
        }
    });
    
    // Toggle password visibility
    passwordToggle.addEventListener('click', function() {
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);
        
        // Change the eye icon
        const icon = this.querySelector('i');
        icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
    });
    
    // Open forgot password modal
    forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        forgotPasswordModal.style.display = 'flex';
    });
    
    // Close modal on X click
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            forgotPasswordModal.style.display = 'none';
        });
    }
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(e) {
        if (e.target === forgotPasswordModal) {
            forgotPasswordModal.style.display = 'none';
        }
    });
    
    // Handle forgot password form
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('recoveryEmail').value;
            
            // Show a message that would normally trigger an email
            alert(`Password reset link has been sent to ${email}. Please check your inbox.`);
            
            // Close the modal
            forgotPasswordModal.style.display = 'none';
        });
    }
});