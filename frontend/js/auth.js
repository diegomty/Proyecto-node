// frontend/js/auth.js
const API_URL = 'http://localhost:3000/api'; 
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const loginMessage = document.getElementById('login-message');

    // Si estamos en la página de login y ya hay un token, redirigir al dashboard
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        if (localStorage.getItem('authToken')) {
            window.location.href = 'dashboard.html';
            return;
        }
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault(); 

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    // Guardar el token JWT (por ejemplo, en localStorage)
                    localStorage.setItem('authToken', data.token);
                    localStorage.setItem('username', data.username); 

                    loginMessage.textContent = 'Inicio de sesión exitoso. Redirigiendo...';
                    loginMessage.className = 'message success';

                    // Redirigir al dashboard después de un breve retraso
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1000);
                } else {
                    loginMessage.textContent = data.message || 'Error al iniciar sesión.';
                    loginMessage.className = 'message error';
                }
            } catch (error) {
                console.error('Error de red o al conectar con el API:', error);
                loginMessage.textContent = 'Error de conexión. Inténtalo más tarde.';
                loginMessage.className = 'message error';
            }
        });
    }
});

// Función global de logout que se puede llamar desde dashboard.html
function logout() { 
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    window.location.href = 'index.html';
} 