import { SessionManager } from '../SessionManager.js';
import { ControlActions } from '../ControlActions.js';

function validateForm() {
    let isValid = true;

    const fields = [
        { id: 'name', errorId: 'name-error', message: 'El nombre es necesario' },
        { id: 'last-name', errorId: 'last-name-error', message: 'El apellido es necesario' },
        { id: 'birthdate', errorId: 'birthdate-error', message: 'La fecha de nacimiento es necesaria' },
        { id: 'dni', errorId: 'dni-error', message: 'El DNI es necesario' },
        { id: 'email', errorId: 'email-error', message: 'El correo electrónico es necesario' },
        { id: 'gender', errorId: 'gender-error', message: 'El género es necesario' },
        { id: 'phone-number', errorId: 'phone-number-error', message: 'El número de teléfono es necesario' },
        { id: 'address', errorId: 'address-error', message: 'La dirección es necesaria' },
        { id: 'customer-membership', errorId: 'customer-membership-error', message: 'La membresía es necesaria' }
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
}

// Guardar cambios
async function saveChanges() {
    if (!validateForm()) {
        return;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        alert("Usuario no encontrado");
        return;
    }

    user.name = $('#name').val();
    user.lastName = $('#last-name').val();
    user.birthDate = $('#birthdate').val();
    user.dni = $('#dni').val();
    user.email = $('#email').val();
    user.gender = $('#gender').val();
    user.phoneNumber = $('#phone-number').val();
    user.address = $('#address').val();
    user.userMembership.id = $('#customer-membership').val();
    user.confirmationMethod = "null";
    user.userMembership.membershipName = "null";

    let controlActions = new ControlActions();
    const apiBaseEndPoint = "User";
    const endPointRoute = user.employeeRole ? `${apiBaseEndPoint}/UpdateEmployee` : `${apiBaseEndPoint}/UpdateCustomer`;

    try {
        const response = await new Promise((resolve, reject) => {
            controlActions.PutToAPI(endPointRoute, user, (response) => {
                if (response) {
                    resolve(response);
                } else {
                    reject('Error al actualizar la información');
                }
            });
        });

        console.log(response);
        if (response.name) {
            alert("Datos actualizados correctamente");
            localStorage.setItem('user', JSON.stringify(user));
            toggleEdit(false);
            updateForm();
        } else {
            const errorText = response.responseText || 'Error al actualizar la información';
            throw new Error(`Error al actualizar la información: ${errorText}`);
        }
    } catch (error) {
        console.error(error.message);
        alert('Error al actualizar la información');
    }
}


function toggleEdit(editMode) {
    const $formElements = $('#account-form input, #account-form select');
    const $editButton = $('#edit-button');
    const $saveButton = $('#save-button');
    const $cancelButton = $('#cancel-button');

    $formElements.each(function () {
        if (this.id !== 'dni') {
            $(this).prop('readonly', !editMode);
            $(this).prop('disabled', !editMode);
            $(this).css('display', editMode ? 'inline-block' : 'none');
            const labelSpanId = '#' + this.id + '-label';
            $(labelSpanId).css('display', editMode ? 'none' : 'inline');
        }
    });

    $('#customer-membership').prop('disabled', !editMode).css('display', editMode ? 'inline-block' : 'none');

    $editButton.css('display', editMode ? 'none' : 'inline-block');
    $saveButton.css('display', editMode ? 'inline-block' : 'none');
    $cancelButton.css('display', editMode ? 'inline-block' : 'none');
}

// Función para actualizar el formulario con los datos del usuario
function updateForm() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        $('#name').val(user.name);
        $('#last-name').val(user.lastName);
        $('#birthdate').val(user.birthDate);
        $('#dni').val(user.dni);
        $('#email').val(user.email);
        $('#gender').val(user.gender);
        $('#phone-number').val(user.phoneNumber);
        $('#address').val(user.address);

        const membershipValue = user.userMembership.id;
        $('#customer-membership').val(membershipValue);
        $('#basic-membership').prop('selected', membershipValue === '4');
        $('#regular-membership').prop('selected', membershipValue === '5');
        $('#premium-membership').prop('selected', membershipValue === '6');

        $('#name-label').text(user.name);
        $('#last-name-label').text(user.lastName);
        $('#birthdate-label').text(user.birthDate);
        $('#dni-label').text(user.dni);
        $('#email-label').text(user.email);
        $('#gender-label').text(user.gender);
        $('#phone-number-label').text(user.phoneNumber);
        $('#address-label').text(user.address);

        const membershipText = membershipValue === '4' ? 'Básica' :
            membershipValue === '5' ? 'Regular' :
                'Premium';
        $('#membership-label').text(membershipText);
    }
}

$(document).ready(function () {
    $('#edit-button').click(function () {
        toggleEdit(true);
    });

    $('#save-button').click(function () {
        saveChanges();
    });

    $('#cancel-button').click(function () {
        toggleEdit(false);
    });

    // Inicializar los datos del formulario
    updateForm();
});
