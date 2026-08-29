const AUTH_BASE_URL = import.meta.env.VITE_AUTH_URL;
const REGISTER_URL = `${AUTH_BASE_URL}/register`;
const LOGIN_URL = `${AUTH_BASE_URL}/login`;
const CHECK_SESSION_URL = `${AUTH_BASE_URL}/check-session`;
const LOGOUT_URL = `${AUTH_BASE_URL}/logout`;

async function register(userData) {
    try {
        const response = await fetch(REGISTER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include', // Important for session cookies
            body: JSON.stringify(userData)
        });

        // Handle error responses from backend
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Registration failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Register error:', error);
        throw error;
    }
}

// Add login function to authenticate user
async function login(userData) {
    try {
        const response = await fetch(LOGIN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include', // Important for session cookies
            body: JSON.stringify(userData)
        });

        // Handle error responses from backend
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Login failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

// Check if user has active session
async function checkSession() {
    try {
        const response = await fetch(CHECK_SESSION_URL, {
            method: 'GET',
            credentials: 'include' // Important for session cookies
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Session check failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Check session error:', error);
        throw error;
    }
}

// Logout user and destroy session
async function logout() {
    try {
        const response = await fetch(LOGOUT_URL, {
            method: 'POST',
            credentials: 'include' // Important for session cookies
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Logout failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Logout error:', error);
        throw error;
    }
}

export { REGISTER_URL, LOGIN_URL, CHECK_SESSION_URL, LOGOUT_URL, register, login, checkSession, logout };

