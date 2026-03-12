// ============================================
// FIREBASE AUTHENTICATION SYSTEM
// ============================================

// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyApRFxmTfn_0BWNiP1kikyyX8RAr4TN3Uw",
    authDomain: "interior-design-3c5de.firebaseapp.com",
    databaseURL: "https://interior-design-3c5de-default-rtdb.firebaseio.com",
    projectId: "interior-design-3c5de",
    storageBucket: "interior-design-3c5de.firebasestorage.app",
    messagingSenderId: "575024906321",
    appId: "1:575024906321:web:ba480436da61a4dc657870"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

class AuthSystem {
    constructor() {
        this.auth = auth;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthStatus();
    }

    setupEventListeners() {
        // Form switching
        document.querySelectorAll('.switch-form').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchForm(e));
        });

        // Form submissions
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('signupForm').addEventListener('submit', (e) => this.handleSignup(e));

        // Password visibility toggle
        document.querySelectorAll('.toggle-password').forEach(btn => {
            btn.addEventListener('click', (e) => this.togglePassword(e));
        });

        // Password strength checker
        document.getElementById('signupPassword').addEventListener('input', (e) => {
            this.checkPasswordStrength(e.target.value);
        });

        // Clear error messages on input
        document.querySelectorAll('.form-group input').forEach(input => {
            input.addEventListener('input', () => {
                this.clearError(input.id);
            });
        });
    }

    switchForm(e) {
        e.preventDefault();
        const targetForm = e.target.dataset.form;

        // Toggle form visibility
        document.getElementById('loginContainer').classList.toggle('hidden', targetForm === 'signup');
        document.getElementById('signupContainer').classList.toggle('hidden', targetForm === 'login');

        // Clear forms and messages
        this.clearAllMessages();
        document.getElementById('loginForm').reset();
        document.getElementById('signupForm').reset();
    }

    togglePassword(e) {
        e.preventDefault();
        const targetId = e.currentTarget.dataset.target;
        const input = document.getElementById(targetId);
        const icon = e.currentTarget.querySelector('i');

        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }

    async handleLogin(e) {
        e.preventDefault();

        // Get form data
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.querySelector('input[name="remember"]').checked;

        // Validate inputs
        if (!this.validateLoginForm(email, password)) {
            return;
        }

        // Show loading state
        this.setLoadingState('loginForm', true);

        try {
            console.log('🔐 Attempting Firebase login for:', email);
            const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
            const user = userCredential.user;

            console.log('✅ Login successful:', user.uid);

            // Store user info
            localStorage.setItem('authToken', await user.getIdToken());
            localStorage.setItem('user', JSON.stringify({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName
            }));

            if (rememberMe) {
                localStorage.setItem('rememberMe', 'true');
            }

            this.showMessage('loginMessage', '✅ Login successful! Redirecting...', 'success');

            // Redirect after 1.5 seconds
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 1500);

        } catch (error) {
            console.error('❌ Login error:', error.code, error.message);
            console.error('Full error object:', error);
            
            let errorMessage = 'Login failed';
            if (error.code === 'auth/user-not-found') {
                errorMessage = 'Email not registered. Please sign up first.';
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = 'Incorrect password. Try again.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address.';
            } else if (error.code === 'auth/user-disabled') {
                errorMessage = 'This account has been disabled.';
            } else if (error.code === 'auth/internal-error') {
                errorMessage = 'Firebase connection error. Check your internet connection.';
            } else {
                errorMessage = `${error.message} (Code: ${error.code})`;
            }
            
            this.showMessage('loginMessage', `❌ ${errorMessage}`, 'error');
        } finally {
            this.setLoadingState('loginForm', false);
        }
    }

    async handleSignup(e) {
        e.preventDefault();

        // Get form data
        const name = document.getElementById('signupName').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;
        const termsAccepted = document.querySelector('input[name="terms"]').checked;

        // Validate inputs
        if (!this.validateSignupForm(name, email, password, confirmPassword, termsAccepted)) {
            return;
        }

        // Show loading state
        this.setLoadingState('signupForm', true);

        try {
            console.log('🔐 Attempting Firebase signup for:', email);
            const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
            const user = userCredential.user;

            console.log('✅ Signup successful:', user.uid);

            // Store user info
            localStorage.setItem('authToken', await user.getIdToken());
            localStorage.setItem('user', JSON.stringify({
                uid: user.uid,
                email: user.email,
                displayName: name
            }));

            this.showMessage('signupMessage', '✅ Account created successfully! Redirecting...', 'success');

            // Redirect after 1.5 seconds
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 1500);

        } catch (error) {
            console.error('❌ Signup error:', error.code, error.message);
            console.error('Full error object:', error);
            
            let errorMessage = 'Signup failed';
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'Email already registered. Try logging in.';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Password is too weak. Use at least 6 characters.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address.';
            } else if (error.code === 'auth/operation-not-allowed') {
                errorMessage = 'Account creation is disabled.';
            } else if (error.code === 'auth/internal-error') {
                errorMessage = 'Firebase connection error. Check your internet connection.';
            } else {
                errorMessage = `${error.message} (Code: ${error.code})`;
            }
            
            this.showMessage('signupMessage', `❌ ${errorMessage}`, 'error');
        } finally {
            this.setLoadingState('signupForm', false);
        }
    }

    validateLoginForm(email, password) {
        let isValid = true;

        // Email validation
        if (!email) {
            this.showError('loginEmail', 'Email is required');
            isValid = false;
        } else if (!this.isValidEmail(email)) {
            this.showError('loginEmail', 'Please enter a valid email');
            isValid = false;
        }

        // Password validation
        if (!password) {
            this.showError('loginPassword', 'Password is required');
            isValid = false;
        }

        return isValid;
    }

    validateSignupForm(name, email, password, confirmPassword, termsAccepted) {
        let isValid = true;

        // Name validation
        if (!name) {
            this.showError('signupName', 'Name is required');
            isValid = false;
        } else if (name.length < 2) {
            this.showError('signupName', 'Name must be at least 2 characters');
            isValid = false;
        }

        // Email validation
        if (!email) {
            this.showError('signupEmail', 'Email is required');
            isValid = false;
        } else if (!this.isValidEmail(email)) {
            this.showError('signupEmail', 'Please enter a valid email');
            isValid = false;
        }

        // Password validation
        if (!password) {
            this.showError('signupPassword', 'Password is required');
            isValid = false;
        } else if (password.length < 6) {
            this.showError('signupPassword', 'Password must be at least 6 characters');
            isValid = false;
        }

        // Confirm password validation
        if (!confirmPassword) {
            this.showError('signupConfirmPassword', 'Please confirm your password');
            isValid = false;
        } else if (password !== confirmPassword) {
            this.showError('signupConfirmPassword', 'Passwords do not match');
            isValid = false;
        }

        // Terms validation
        if (!termsAccepted) {
            this.showError('signupTerms', 'You must accept the terms and privacy policy');
            isValid = false;
        }

        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    checkPasswordStrength(password) {
        const strengthBar = document.querySelector('.strength-bar::after');
        const strengthText = document.getElementById('strengthLevel');
        let strength = 0;
        let level = 'Weak';
        let color = '#ef4444';

        if (password.length >= 6) strength++;
        if (password.length >= 10) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[!@#$%^&*]/.test(password)) strength++;

        if (strength <= 2) {
            level = 'Weak';
            color = '#ef4444';
        } else if (strength <= 3) {
            level = 'Fair';
            color = '#f59e0b';
        } else if (strength <= 4) {
            level = 'Good';
            color = '#3b82f6';
        } else {
            level = 'Strong';
            color = '#10b981';
        }

        const percentage = (strength / 5) * 100;
        document.querySelector('.strength-bar').style.setProperty('--width', percentage + '%');
        
        const barAfter = document.createElement('style');
        barAfter.textContent = `.strength-bar::after { width: ${percentage}% !important; background-color: ${color} !important; }`;
        document.head.appendChild(barAfter);

        strengthText.textContent = level;
        strengthText.style.color = color;
    }

    showError(inputId, message) {
        const input = document.getElementById(inputId);
        const errorElement = document.getElementById(inputId + 'Error');

        if (errorElement) {
            errorElement.textContent = message;
            input.classList.add('error');
            input.classList.remove('success');
        }
    }

    clearError(inputId) {
        const input = document.getElementById(inputId);
        const errorElement = document.getElementById(inputId + 'Error');

        if (errorElement) {
            errorElement.textContent = '';
            input.classList.remove('error');
        }
    }

    showMessage(elementId, message, type) {
        const messageElement = document.getElementById(elementId);
        messageElement.textContent = message;
        messageElement.className = `form-message ${type}`;
    }

    clearAllMessages() {
        document.getElementById('loginMessage').textContent = '';
        document.getElementById('signupMessage').textContent = '';
        document.getElementById('loginMessage').className = 'form-message';
        document.getElementById('signupMessage').className = 'form-message';
    }

    setLoadingState(formId, isLoading) {
        const form = document.getElementById(formId);
        const submitBtn = form.querySelector('.btn-submit');
        const loader = submitBtn.querySelector('.loader');
        const text = submitBtn.querySelector('span:first-child');

        if (isLoading) {
            submitBtn.disabled = true;
            text.style.display = 'none';
            loader.style.display = 'inline-block';
        } else {
            submitBtn.disabled = false;
            text.style.display = 'inline';
            loader.style.display = 'none';
        }
    }

    checkAuthStatus() {
        // Don't auto-redirect on login page
        // Let Firebase handle auth state on dashboard-protected.html instead
        // This page should always show login/signup forms
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new AuthSystem();
});
