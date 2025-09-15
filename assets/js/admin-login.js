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
    
    // If already have a PHP session, backend will accept authenticated requests.
    // We optimistically navigate after successful login only.
    
    // Handle login form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
    const identifier = document.getElementById('username').value.trim(); // email or username
        const password = document.getElementById('password').value;

        loginMessage.className = 'login-message';
        loginMessage.textContent = '';
        try {
            const res = await fetch('../backend/api/auth/login.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ identifier, password })
            });
            const data = await res.json();
            if (!res.ok || !data.ok) {
                throw new Error(data.error || 'Login failed');
            }
            loginMessage.className = 'login-message success';
            loginMessage.textContent = 'Login successful! Redirecting...';
            setTimeout(() => { window.location.href = 'index.html'; }, 500);
        } catch (err) {
            loginMessage.className = 'login-message error';
            loginMessage.textContent = err.message;
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