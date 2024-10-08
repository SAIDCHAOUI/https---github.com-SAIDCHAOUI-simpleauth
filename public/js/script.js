// register
document.addEventListener('DOMContentLoaded', function () {
    // Get the register form element
    const registerForm = document.getElementById('registerForm');

    // Check if the register form exists
    if (registerForm) {
        // Add submit event listener to the register form
        registerForm.addEventListener('submit', function (event) {
            // Get the values of the email, password, and password confirmation fields
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const role = document.getElementById('role').value;
            const password = document.getElementById('password').value;
            const passwordConfirm = document.getElementById('passwordConfirm').value;

            // Regex patterns for validations
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Email validation pattern
            const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])[A-Za-z\d\W\S]{6,}$/; // Strong password validation pattern
            
            // Validation du nom d'utilisateur
            if (!username.trim()) {
                alert("Veuillez entrer un nom d'utilisateur valide.");
                event.preventDefault();
                return;
            }

            // Validate email format
            if (!emailPattern.test(email)) {
                alert("Veuillez entrer un email valide.");
                event.preventDefault(); // Prevent form submission
                return;
            }

            // Validate password strength
            if (!strongPasswordPattern.test(password)) {
                alert("Le mot de passe doit contenir au moins 6 caractères, une majuscule, un chiffre, et un caractère spécial.");
                event.preventDefault(); // Prevent form submission
                return;
            }

            // Validate password confirmation
            if (password !== passwordConfirm) {
                alert("Les mots de passe ne correspondent pas.");
                event.preventDefault(); // Prevent form submission
                return;
            }
        });

        // Toggle show password
        document.getElementById('showPassword').addEventListener('change', function () {
            // Get the password and password confirmation fields
            const password = document.getElementById('password');
            const passwordConfirm = document.getElementById('passwordConfirm');
            // Toggle the type attribute between 'text' and 'password'
            if (this.checked) {
                password.type = 'text';
                passwordConfirm.type = 'text';
            } else {
                password.type = 'password';
                passwordConfirm.type = 'password';
            }
        });
    }

    // login form validation
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            const email = document.getElementById('loginEmail').value;
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Email validation pattern

            if (!emailPattern.test(email)) {
                alert("Veuillez entrer un email valide.");
                event.preventDefault(); // Prevent form submission
                return;
            }
        });
    }
});
