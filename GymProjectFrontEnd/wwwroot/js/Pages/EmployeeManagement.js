﻿import { ControlActions } from '../ControlActions.js';

$(document).ready(function () {

    this.ViewName = "Login";
    this.ApiBaseEndPoint = "User";
    this.controlAction = new ControlActions();
    let originalPermissions = {}; // Variable para almacenar los permisos originales
    let employees = [];

    this.handleFormSubmit = async () => {
        if (this.validateForm()) {
            await this.Create();
        }
    };

    this.Create = async () => {
        var employee = {
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
            salary: 0,
            hourlyRate: 0,
            employeeRole: $("#role").val(),
            userPermissions: [0],
            isVerified: "Y"
        };

        var endPointRoute = this.ApiBaseEndPoint + "/CreateEmployee";
        console.log(endPointRoute);
        const controlAction = new ControlActions();
        controlAction.PostToAPI(endPointRoute, employee, () => {
            loadEmployees(); // Actualizar la tabla después de crear un empleado
        });
    };

    this.validateForm = () => {
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
            { id: 'address', errorId: 'address-error', message: 'La dirección es necesaria' },
            { id: 'role', errorId: 'role-error', message: 'El rol es necesario' }
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

    const loadEmployees = () => {
        var endPointRoute = this.ApiBaseEndPoint + "/RetrieveAllEmployees";

        this.controlAction.GetToApi(endPointRoute)
            .then((data) => {
                employees = data;
                const tableBody = $('#employee-table tbody');
                originalPermissions = {}; // Inicializar los permisos originales

                tableBody.empty(); // Limpiar la tabla antes de llenarla de nuevo

                employees.forEach(employee => {
                    // Guardar permisos originales
                    originalPermissions[employee.id] = employee.userPermissions.slice();

                    const userPermissions = employee.userPermissions;
                    let rowHtml = `<tr>
                        <td>${employee.name} ${employee.lastName}</td>
                        <td>${employee.employeeRole}</td>
                        ${generatePermissionCells(employee.id, userPermissions)}
                    </tr>`;
                    tableBody.append(rowHtml);
                });

                populateEmployeeSelect(employees); // Llenar el select con los empleados
            })
            .catch(error => {
                console.error('Error al cargar empleados:', error);
            });
    };

    const generatePermissionCells = (employeeId, userPermissions) => {
        const permissions = [10, 9, 11, 12, 13, 14, 21, 22];
        let cellsHtml = '';
        permissions.forEach(permission => {
            const isChecked = userPermissions.includes(permission) ? 'checked' : '';
            cellsHtml += `<td><input type="checkbox" name="employee-${employeeId}-permission-${permission}" value="${permission}" ${isChecked}></td>`;
        });
        return cellsHtml;
    };

    $('#confirm-changes button').click(() => {
        const updatedPermissions = [];
        const permissionsForDelete = [];

        $('#employee-table tbody tr').each(function () {
            const employeeId = $(this).find('input[type="checkbox"]').first().attr('name').split('-')[1];
            const currentPermissions = [];
            const originalPermissions = employees.find(emp => emp.id == employeeId).userPermissions;

            $(this).find('input[type="checkbox"]').each(function () {
                if ($(this).is(':checked')) {
                    currentPermissions.push(parseInt($(this).val()));
                }
            });

            const addedPermissions = currentPermissions.filter(p => !originalPermissions.includes(p));
            const removedPermissions = originalPermissions.filter(p => !currentPermissions.includes(p));

            if (addedPermissions.length > 0 || removedPermissions.length > 0) {
                updatedPermissions.push({ employeeId, permissionIds: addedPermissions });
                permissionsForDelete.push({ employeeId, permissionsForDelete: removedPermissions });
            }
        });

        if (updatedPermissions.length > 0) {
            updateEmployeePermissions(updatedPermissions, permissionsForDelete);
        }
    });

    $('#cancel-changes button').click(() => {
        // Restaurar permisos originales
        $('#employee-table tbody tr').each(function () {
            const employeeId = $(this).find('input[type="checkbox"]').first().attr('name').split('-')[1];
            const permissions = originalPermissions[employeeId] || [];

            $(this).find('input[type="checkbox"]').each(function () {
                const permissionValue = parseInt($(this).val());
                if (permissions.includes(permissionValue)) {
                    $(this).prop('checked', true);
                } else {
                    $(this).prop('checked', false);
                }
            });
        });
    });

    const updateEmployeePermissions = (updatedPermissions, permissionsForDelete) => {
        const updateApiUrl = `${this.ApiBaseEndPoint}/UpdateEmployeePermissions`;
        const controlAction = new ControlActions();

        updatedPermissions.forEach(update => {
            const { employeeId, permissionIds } = update;
            const deletePermissions = permissionsForDelete.find(item => item.employeeId == employeeId)?.permissionsForDelete || [];
            const data = {
                id: employeeId,
                creationDate: new Date().toISOString(),
                permissionIds: permissionIds,
                permissionsForDelete: deletePermissions
            };

            controlAction.PostToAPI(updateApiUrl, data, () => {

            });
        });
    };

    const populateEmployeeSelect = (employees) => {
        const employeeSelect = $('#employee-select');
        employeeSelect.empty(); // Limpiar el select antes de llenarlo
        employeeSelect.append('<option value="">Selecciona un empleado</option>');
        employees.forEach(employee => {

            employeeSelect.append(`<option value="${employee.id}">${employee.name} ${employee.lastName}</option>`);
        });
    };

    const initializeTimeSelects = () => {
        const startTimeSelect = $('#start-time-select');
        const endTimeSelect = $('#end-time-select');

        const hoursOptions = Array.from({ length: 24 }, (_, i) => `
            <option value="${i.toString().padStart(2, '0')}:00:00">${i.toString().padStart(2, '0')}:00:00</option>
        `).join('');

        startTimeSelect.html(`<option value="">Selecciona la hora de inicio</option>${hoursOptions}`);
        endTimeSelect.html(`<option value="">Selecciona la hora de fin</option>${hoursOptions}`);
    };

    $('#create-schedule-btn').click(function () {
        createEmployeeSchedule();
    });

    // Añadir event listener para el botón de creación de horario
    $('#create-schedule-button').on('click', function () {
        createEmployeeSchedule();
    });

    loadEmployees();
    initializeTimeSelects();

    $('#send-button').on('click', (event) => {
        event.preventDefault();
        this.handleFormSubmit();
    });

    $('#reset-button').on('click', () => {
        $('#registration-form')[0].reset();
        $('.error').text('').hide();
    });
});

function createEmployeeSchedule() {
    const employeeId = $('#employee-select').val();
    const startTime = $('#start-time-select').val();
    const endTime = $('#end-time-select').val();
    const freeDays = $('#free-days-select').val()
    const year = $('#year-select').val()
    const month = $('#month-select').val()

    if (!employeeId || !startTime || !endTime) {
        alert('Todos los campos son obligatorios.');
        return;
    }

    if (startTime >= endTime) {
        alert('La hora de inicio debe ser anterior a la hora de fin.');
        return;
    }

    const scheduleData = {
        employeeId: parseInt(employeeId),
        startTime: startTime,
        freeDays: freeDays,
        endTime: endTime,
        isAvailable: 'Y',
        month: month,
        year: year
    };

    const controlAction = new ControlActions();
    var createScheduleEndpoint = "User/CreateScheduleForEmployees";
    console.log(scheduleData);
    controlAction.PostToAPI(createScheduleEndpoint, scheduleData, () => {
        alert('Horario creado exitosamente.');
    });
}
