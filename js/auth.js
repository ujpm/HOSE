import config from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    // Toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            const input = e.target.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            e.target.classList.toggle('fa-eye');
            e.target.classList.toggle('fa-eye-slash');
        });
    });

    // Password strength meter
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', (e) => {
            const password = e.target.value;
            const strengthMeter = document.querySelector('.strength-meter');
            const strengthText = document.querySelector('.strength-text span');
            
            if (!strengthMeter || !strengthText) return;

            let strength = 0;
            if (password.length >= 8) strength++;
            if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
            if (password.match(/\d/)) strength++;
            if (password.match(/[^a-zA-Z\d]/)) strength++;

            strengthMeter.className = 'strength-meter';
            switch (strength) {
                case 0:
                case 1:
                    strengthMeter.classList.add('weak');
                    strengthText.textContent = 'Weak';
                    break;
                case 2:
                case 3:
                    strengthMeter.classList.add('medium');
                    strengthText.textContent = 'Medium';
                    break;
                case 4:
                    strengthMeter.classList.add('strong');
                    strengthText.textContent = 'Strong';
                    break;
            }
        });
    }

    // Form submission
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(loginForm);
            const data = Object.fromEntries(formData);
            
            try {
                const response = await fetch(`${config.API_URL}/auth/login`, {
                    method: 'POST',
                    headers: config.DEFAULT_HEADERS,
                    body: JSON.stringify(data)
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || 'Login failed');
                }

                const { token, user } = await response.json();
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                window.location.href = '../dashboard/index.html';
            } catch (error) {
                alert(error.message || 'Login failed. Please try again.');
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(registerForm);
            const data = Object.fromEntries(formData);
            
            if (data.password !== data.confirmPassword) {
                alert('Passwords do not match');
                return;
            }

            try {
                const response = await fetch(`${config.API_URL}/auth/register`, {
                    method: 'POST',
                    headers: config.DEFAULT_HEADERS,
                    body: JSON.stringify(data)
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || 'Registration failed');
                }

                const { token, user } = await response.json();
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                window.location.href = '../dashboard/index.html';
            } catch (error) {
                alert(error.message || 'Registration failed. Please try again.');
            }
        });
    }

    // Social authentication
    document.querySelectorAll('.btn-social').forEach(button => {
        button.addEventListener('click', () => {
            alert('Social authentication coming soon!');
        });
    });
});
