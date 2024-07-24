$(document).ready(function () {
    function LoginViewController() {
        this.ViewName = "Login";
        this.ApiBaseEndPoint = "User";

        this.InitView = function () {
            console.log("User view init!!!");

            $("#send-button").on('click', (event) => {
                event.preventDefault();
                console.log("Send button clicked");
                this.handleFormSubmit();
            });

            $("#final-login").on('click', (event) => {
                console.log("Final login button clicked");
                this.handleLoginSubmit();
            });

            $("#final-forget-password").on('click', (event) => {
                event.preventDefault();
                this.openForgetPasswordPopup();
            });

            // Attach the event listener for the login popup
            $("#login").on('click', (event) => {
                this.openLoginPopup();
            });
        };

        this.openLoginPopup = function () {
            $('#popup-content').html(`
                <span class="close" onclick="closePopup()">&times;</span>
                <h2>Iniciar sesión</h2>
                <form class="login-form">
                    <div class="form-group-login">
                        <input class="login-input" type="email" id="login-email" placeholder="Email:">
                        <div class="error" id="login-email-error"></div>
                        <input class="login-input" type="password" id="login-password" placeholder="Contraseña:">
                        <div class="error" id="login-password-error"></div>
                    </div>
                    <div class="ButtonContainer">
                        <div class="Reservation login" id="final-login-div"> 
                            <button id="final-login">Iniciar <br> sesión</button>  
                        </div>
                        <div class="CheckSchedule forget-password"> 
                            <button id="final-forget-password">Recuperar contraseña</button>
                        </div>
                    </div>
                </form>
            `);
            $('#popup').css('display', 'block');

            // Re-bind event listeners for dynamically created elements
            $('#final-login').on('click', (event) => {
                event.preventDefault();
                console.log("Final login button clicked inside popup");
                this.handleLoginSubmit();
            });

            $('#final-forget-password').on('click', (event) => {
                event.preventDefault();
                this.openForgetPasswordPopup();
            });

            $('.login-form').on('submit', (event) => {
                event.preventDefault();
                this.validateLoginForm();
            });
        };

        this.openForgetPasswordPopup = function () {
            $('#popup-content').html(`
                <span class="close" onclick="closePopup()">&times;</span>
                <h2>Recuperar contraseña</h2>
                <form class="login-form">
                    <div class="form-group-login">
                        <input class="login-input" type="email" id="forget-password-email" placeholder="Email:">
                        <div class="error" id="forget-password-email-error"></div>
                    </div>
                    <div class="ButtonContainer">
                        <div class="Reservation login"> 
                            <button id="confirm-recovery">Confirmar </button>
                        </div>
                        <div class="CheckSchedule forget-password"> 
                            <button id="cancel-recovery">Cancelar</button>
                        </div>
                    </div>
                </form>
            `);
            $('#popup').css('display', 'block');

            // Re-bind event listeners for dynamically created elements
            $('#confirm-recovery').on('click', (event) => {
                event.preventDefault();
                this.validateForgetPasswordForm();
            });

            $('#cancel-recovery').on('click', (event) => {
                event.preventDefault();
                this.closePopup();
            });

            $('.login-form').on('submit', (event) => {
                event.preventDefault();
                this.validateForgetPasswordForm();
            });
        };

        this.closePopup = function () {
            $('#popup').css('display', 'none');
        };

        this.validateLoginForm = function () {
            let email = $('#login-email').val();
            let password = $('#login-password').val();
            let isValid = true;

            if (!email) {
                $('#login-email-error').text('El correo electrónico es requerido').show();
                isValid = false;
            } else {
                $('#login-email-error').text('').hide();
            }

            if (!password) {
                $('#login-password-error').text('La contraseña es requerida').show();
                isValid = false;
            } else {
                $('#login-password-error').text('').hide();
            }

            return isValid;
        };

        this.handleLoginSubmit = function () {
            if (this.validateLoginForm()) {
                console.log("Login form is valid. Proceeding with login.");
                this.login();
            }
        };

        this.login = function () {
            var loginData = {
                email: $('#login-email').val(),
                password: $('#login-password').val()
            };

            console.log("Login data:", loginData);

            var controlAction = new ControlActions();
            var endPointRoute = "Login"; 

            console.log("Endpoint route:", endPointRoute);

            controlAction.PostToAPI(endPointRoute, loginData, function (response) {
                alert("Login Successful");
                localStorage.setItem('user', JSON.stringify(response)); 
                window.location.href = "/AccountInformation";
            }, function (error) {
                alert("Login Failed: " + error);
                $('#login-error').text('Error en el inicio de sesión. Por favor, verifique sus credenciales e intente de nuevo.').show();
            });
        };

        this.validateForgetPasswordForm = function () {
            let email = $('#forget-password-email').val();
            let isValid = true;

            if (!email) {
                $('#forget-password-email-error').text('El correo electrónico es requerido').show();
                isValid = false;
            } else {
                $('#forget-password-email-error').text('').hide();
            }

            return isValid;
        };

        this.InitView();
    }

    // Define closePopup globally
    window.closePopup = function () {
        $('#popup').css('display', 'none');
    };

    new LoginViewController();
});
