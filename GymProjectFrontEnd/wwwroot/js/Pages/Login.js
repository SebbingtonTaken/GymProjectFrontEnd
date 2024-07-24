import { SessionManager } from '../SessionManager.js';
import { ControlActions } from '../ControlActions.js';


$(document).ready(function () {
    function LoginViewController() {
        this.ViewName = "Login";
        this.ApiBaseEndPoint = "User";
        this.sessionManager = new SessionManager();
        this.controlAction = new ControlActions();
        this.emailForOtp = ""; 
        this.userIdForPasswordUpdate = null; 

        this.InitView = () => {
            console.log("User view init!!!");

            $("#send-button").on('click', (event) => {
                event.preventDefault();
                console.log("Send button clicked");
                this.handleFormSubmit();
            });

            $('#forget-password').on('click', (event) => {
                event.preventDefault();
                this.openForgetPasswordPopup();
            });

            $("#login").on('click', (event) => {
                event.preventDefault();
                this.openLoginPopup();
            });
        };

        this.openOtpWindow = async (email) => {
            this.emailForOtp = email;
            let user = await this.getUserByEmail(email); 
            if (user) {
                let id = user.id;
                console.log(this.emailForOtp);
                console.log(id);
                $('#popup-content').html(`
            <span class="close" id="close">&times;</span>
            <h2>Recuperar contraseña</h2>
            <form class="login-form">
                <div class="form-group-login">
                    <input class="login-input" type="text" id="otp-code" placeholder="Código OTP:">
                    <div class="error" id="otp-not-inserted"></div>
                </div>
                <div class="ButtonContainer">
                    <div class="Reservation login"> 
                        <button id="confirm-otp-recovery">Confirmar</button>
                    </div>
                    <div class="CheckSchedule forget-password"> 
                        <button id="cancel-recovery">Cancelar</button>
                    </div>
                </div>
            </form>
        `);
                $('#popup').css('display', 'block');

                $('#confirm-otp-recovery').on('click', async (event) => {
                    event.preventDefault();
                    await this.handleOtpSubmit(id);
                });

                $('#close').on('click', (event) => {
                    event.preventDefault();
                    this.closePopup();
                });

                $('#cancel-recovery').on('click', (event) => {
                    event.preventDefault();
                    this.closePopup();
                });

                $('.login-form').on('submit', async (event) => {
                    event.preventDefault();
                    await this.handleOtpSubmit(id);
                });
            } else {
                console.error("Failed to retrieve user, cannot open OTP window");
            }
        };


        this.openPasswordUpdatePopup = () => {
            $('#popup-content').html(`
                <span class="close" id="close">&times;</span>
                <h2>Actualizar contraseña</h2>
                <form class="login-form">
                    <div class="form-group-login">
                        <input class="login-input" type="password" id="new-password" placeholder="Nueva contraseña:">
                        <div class="error" id="new-password-error"></div>
                    </div>
                    <div class="ButtonContainer">
                        <div class="Reservation login"> 
                            <button id="update-password">Actualizar contraseña</button>
                        </div>
                        <div class="CheckSchedule forget-password"> 
                            <button id="cancel-update">Cancelar</button>
                        </div>
                    </div>
                </form>
            `);
            $('#popup').css('display', 'block');

            $('#update-password').on('click', async (event) => {
                event.preventDefault();
                await this.handlePasswordUpdate();
            });

            $('#close').on('click', (event) => {
                event.preventDefault();
                this.closePopup();
            });

            $('#cancel-update').on('click', (event) => {
                event.preventDefault();
                this.closePopup();
            });

            $('.login-form').on('submit', (event) => {
                event.preventDefault();
                this.handlePasswordUpdate();
            });
        };

        this.openLoginPopup = () => {
            $('#popup-content').html(`
                <span class="close" id="close">&times;</span>
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

            $('#final-login').on('click', (event) => {
                event.preventDefault();
                console.log("Final login button clicked inside popup");
                this.handleLoginSubmit();
            });

            $('#final-forget-password').on('click', (event) => {
                event.preventDefault();
                this.openForgetPasswordPopup();
            });

            $('#close').on('click', (event) => {
                event.preventDefault();
                this.closePopup();
            });

            $('.login-form').on('submit', (event) => {
                event.preventDefault();
                this.validateLoginForm();
            });
        };

        this.openForgetPasswordPopup = () => {
            $('#popup-content').html(`
                <span class="close" id="close">&times;</span>
                <h2>Recuperar contraseña</h2>
                <form class="login-form">
                    <div class="form-group-login">
                        <input class="login-input" type="email" id="forget-password-email" placeholder="Email:">
                        <div class="error" id="forget-password-email-error"></div>
                    </div>
                    <div class="ButtonContainer">
                        <div class="Reservation login"> 
                            <button id="confirm-recovery">Confirmar</button>
                        </div>
                        <div class="CheckSchedule forget-password"> 
                            <button id="cancel-recovery">Cancelar</button>
                        </div>
                    </div>
                </form>
            `);
            $('#popup').css('display', 'block');

            $('#confirm-recovery').on('click', async (event) => {
                event.preventDefault();
                await this.handleForgetPasswordSubmit();
            });

            $('#close').on('click', (event) => {
                event.preventDefault();
                this.closePopup();
            });

            $('#cancel-recovery').on('click', (event) => {
                event.preventDefault();
                this.closePopup();
            });

            $('.login-form').on('submit', async (event) => {
                event.preventDefault();
                await this.handleForgetPasswordSubmit();
            });
        };

        this.handleFormSubmit = async function () {
            if (this.validateForm()) {
                await this.Create();
            }
        };

        this.Create = async function () {
            var membershipId = $("#customer-membership").val();

            var userMembership = {
                id: parseInt(membershipId),
                creationDate: new Date().toISOString(),
                membershipName: "Example Membership Name",
                membershipPrice: 0,
                personalClassesInclude: 0,
                groupClassesInclude: 0,
                registrationFee: 0
            };

            var user = {
                id: 0,
                creationDate: new Date().toISOString(),
                dni: parseInt($("#dni").val()),
                name: $("#name").val(),
                email: $("#email").val(),
                password: $("#password").val(),
                lastName: $("#last-name").val(),
                address: $("#address").val(),
                birthDate: $("#birthdate").val(),
                phoneNumber: parseInt($("#phone-number").val()),
                gender: $("#gender").val(),
                userMembership: userMembership,
                isVerified: "N",
                confirmationMethod: $("#confirmation-method").val()
            };

            console.log("creadno",user);
            var endPointRoute = this.ApiBaseEndPoint + "/CreateCustomer";
            const controlAction = new ControlActions();
            controlAction.PostToAPI(endPointRoute, user, () => {
                this.openOtpWindow(user.email);
                console.log("User Created");
            });
        };

        this.validateForm = function () {
            let isValid = true;

            const fields = [
                { id: 'name', errorId: 'name-error', message: 'El nombre es necesario' },
                { id: 'last-name', errorId: 'last-name-error', message: 'El apellido es necesario' },
                { id: 'birthdate', errorId: 'birthdate-error', message: 'La fecha de nacimiento es necesaria' },
                { id: 'dni', errorId: 'dni-error', message: 'El DNI es necesario' },
                { id: 'email', errorId: 'email-error', message: 'El correo electrónico es necesario' },
                { id: 'gender', errorId: 'gender-error', message: 'El género es necesario' },
                { id: 'password', errorId: 'password-error', message: 'La contraseña es necesaria' },
                { id: 'phone-number', errorId: 'phone-number-error', message: 'El número de teléfono es necesario' },
                { id: 'address', errorId: 'address-error', message: 'La dirección es necesaria' }
            ];

            fields.forEach(field => {
                if (!$('#' + field.id).val()) {
                    $('#' + field.errorId).text(field.message).show();
                    isValid = false;
                } else {
                    $('#' + field.errorId).text('').hide();
                }
            });

            return isValid;
        };

        this.validateLoginForm = () => {
            let email = $('#login-email').val();
            let password = $('#login-password').val();
            let isValid = true;

            if (!email) {
                $('#login-email-error').text('El correo electrónico es necesario').show();
                isValid = false;
            } else {
                $('#login-email-error').text('').hide();
            }

            if (!password) {
                $('#login-password-error').text('La contraseña es necesaria').show();
                isValid = false;
            } else {
                $('#login-password-error').text('').hide();
            }

            if (isValid) {
                this.handleLoginSubmit();
            }
        };

        this.handleLoginSubmit = async () => {
            let loginData = {
                email: $('#login-email').val(),
                password: $('#login-password').val()
            };

            console.log("Logging in with", loginData);

            this.sessionManager.setSession(loginData.email);
            alert("Login successful");
            this.closePopup();
        };

        this.handleOtpSubmit = async (id) => {
            if (this.validateOtpForm()) {
                try {
                    let otpCode = $('#otp-code').val();
                    console.log("ID:", id);

                    if (otpCode) { 
                        var controlActions = new ControlActions();
                        this.ApiBaseEndPoint = "User";
                        var endPointRoute = `${this.ApiBaseEndPoint}/ConfirmAccount/${otpCode}/${id}`;

                        await controlActions.PostToAPI(endPointRoute, { otpCode: otpCode, id: id });

                        alert("OTP verificado");
                        this.closePopup();
                        this.openPasswordUpdatePopup();
                    } else {
                        alert("Por favor, ingrese un código OTP.");
                    }
                } catch (error) {
                    console.error("Error en la verificación OTP:", error);
                    alert("Error en la verificación OTP. Inténtelo de nuevo más tarde.");
                }
            }
        };

            this.handleOtpSubmit = async (id) => {
            if (this.validateOtpForm()) {
                try {
                    let otpCode = $('#otp-code').val();
                    console.log("ID:", id);

                    if (otpCode) { 
                        var controlActions = new ControlActions();
                        this.ApiBaseEndPoint = "User";
                        var endPointRoute = `${this.ApiBaseEndPoint}/ConfirmAccount/${otpCode}/${id}`;

                        await controlActions.PostToAPI(endPointRoute, { otpCode: otpCode, id: id });

                        alert("OTP verificado");
                        this.closePopup();
                        this.openPasswordUpdatePopup();
                    } else {
                        alert("Por favor, ingrese un código OTP.");
                    }
                } catch (error) {
                    console.error("Error en la verificación OTP:", error);
                    alert("Error en la verificación OTP. Inténtelo de nuevo más tarde.");
                }
            }
        };

        this.validateOtpForm = () => {
            let otpCode = $('#otp-code').val();
            let isValid = true;

            if (!otpCode) {
                $('#otp-not-inserted').text('El código OTP es necesario').show();
                isValid = false;
            } else {
                $('#otp-not-inserted').text('').hide();
            }

            return isValid;
        };

        this.handleForgetPasswordSubmit = async () => {
            let email = $('#forget-password-email').val();
            if (!email) {
                $('#forget-password-email-error').text('El correo electrónico es necesario').show();
                return;
            }

            $('#forget-password-email-error').hide();

            let user = await this.getUserByEmail(email);
            if (user) {
                this.openOtpWindow(email, user.id);
            } else {
                alert("Usuario no encontrado");
            }
        };

        this.getUserByEmail = async (email) => {
            const controlActions = new ControlActions();
            this.ApiBaseEndPoint = "User";
            const endPointRoute = this.ApiBaseEndPoint + `/RetrieveUserByEmail/${email}`;
            try {
                const user = await controlActions.GetToApi(endPointRoute);
                console.log("User retrieved:", user);
                return user;
            } catch (error) {
                console.error("Failed to retrieve user:", error);
                return null;
            }
        };


        this.handlePasswordUpdate = async () => {
            let newPassword = $('#new-password').val();
            let isValid = true;

            if (!newPassword) {
                $('#new-password-error').text('La nueva contraseña es necesaria').show();
                isValid = false;
            } else {
                $('#new-password-error').text('').hide();
            }

            if (isValid) {
                try {
                    var controlActions = new ControlActions();
  
                    var endPointRoute = this.ApiBaseEndPoint + "/UpdatePassword";
                    await controlActions.PostToAPI(endPointRoute, { userId: this.userIdForPasswordUpdate, newPassword: newPassword });
                    alert("Contraseña actualizada");
                    this.closePopup();
                } catch (error) {
                    console.error("Error en la actualización de contraseña:", error);
                    alert("Error en la actualización de contraseña. Inténtelo de nuevo más tarde.");
                }
            }
        };

        this.closePopup = () => {
            $('#popup').css('display', 'none');
        };
    }

    // Instantiate and initialize
    const loginController = new LoginViewController();
    loginController.InitView();
});
