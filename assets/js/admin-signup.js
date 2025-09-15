document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signupForm');
  const msg = document.getElementById('signupMessage');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msg.className = 'login-message';
    msg.textContent = '';
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const confirm = document.getElementById('confirm').value;
    try {
      const res = await fetch('../backend/api/auth/signup.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, username, password, confirm })
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Signup failed');
      msg.className = 'login-message success';
      msg.textContent = 'Account created! Redirecting to Admin Panel...';
      setTimeout(() => { window.location.href = 'index.html'; }, 800);
    } catch (err) {
      msg.className = 'login-message error';
      msg.textContent = err.message;
    }
  });
});
