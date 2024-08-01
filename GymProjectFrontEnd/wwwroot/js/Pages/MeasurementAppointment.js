import { RetrieveTrainerSchedule, RetrieveMeasurementAppointments, UpdateMeasurementAppointment, CreateMeasurementAppointment, RetrieveAllUsers } from '../APIActions.js';

// Asegúrate de exponer las funciones globalmente
window.cancelAppointment = cancelAppointment;
window.openUserSelectionPopup = openUserSelectionPopup;

document.addEventListener('DOMContentLoaded', async () => {
    const scheduleData = await RetrieveTrainerSchedule();
    const measurementAppointments = await RetrieveMeasurementAppointments();
    const users = await RetrieveAllUsers();

    if (scheduleData && measurementAppointments && users) {
        trainers = processData(scheduleData, measurementAppointments, users);
        updateTrainerDropdown(trainers);
        selectDefaultTrainer(trainers);
    }
});

let trainers;
let usersList;

function processData(scheduleData, measurementAppointments, users) {
    const trainers = new Map();
    const customers = new Map();
    usersList = users;  // Save the users list for later use

    measurementAppointments.forEach(entry => {
        customers.set(entry.trainerScheduleId, entry);
    });

    scheduleData.forEach(entry => {
        const trainerName = entry.name;
        const startDate = new Date(entry.startDate);
        const weekNumber = getWeekNumber(startDate);

        if (!trainers.has(trainerName)) {
            trainers.set(trainerName, new Map());
        }

        const trainerSchedule = trainers.get(trainerName);

        if (!trainerSchedule.has(weekNumber)) {
            trainerSchedule.set(weekNumber, []);
        }

        entry.customer = customers.get(entry.id);
        trainerSchedule.get(weekNumber).push(entry);
    });

    return trainers;
}

function getWeekNumber(date) {
    const start = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date - start) / (24 * 60 * 60 * 1000)) + 1;
    return Math.ceil(days / 7);
}

function updateTrainerDropdown(trainers) {
    const slcTrainer = document.getElementById('slcTrainer');
    trainers.forEach((_, trainerName) => {
        const option = document.createElement('option');
        option.value = trainerName;
        option.textContent = trainerName;
        slcTrainer.appendChild(option);
    });
}

function selectDefaultTrainer(trainers) {
    const slcTrainer = document.getElementById('slcTrainer');
    const firstTrainer = trainers.keys().next().value;
    slcTrainer.value = firstTrainer;
    updateWeekDropdown(trainers, firstTrainer);
    selectMostRecentWeek(trainers, firstTrainer);
}

document.getElementById('slcTrainer').addEventListener('change', function () {
    const selectedTrainer = this.value;
    updateWeekDropdown(trainers, selectedTrainer);
    selectMostRecentWeek(trainers, selectedTrainer);
    document.getElementById('searchBox').value = '';
    generateScheduleHTML([]);
});

document.getElementById('searchBox').addEventListener('input', function () {
    const selectedTrainer = document.getElementById('slcTrainer').value;
    const selectedWeek = this.value;
    const schedule = filterByWeek(trainers, selectedTrainer, selectedWeek);
    generateScheduleHTML(schedule);
});

function updateWeekDropdown(trainers, selectedTrainer) {
    const trainerSchedule = trainers.get(selectedTrainer);
    const dropdownContent = document.getElementById('dropdown-content');
    dropdownContent.innerHTML = ''; // Clear existing content

    if (trainerSchedule) {
        const sortedWeeks = Array.from(trainerSchedule.keys()).sort((a, b) => a - b);
        sortedWeeks.forEach(weekNumber => {
            const div = document.createElement('div');
            div.style.backgroundColor = 'var(--black)';
            const span = document.createElement('span');
            span.textContent = `Semana ${weekNumber}`;
            div.appendChild(span);
            div.addEventListener('click', function () {
                document.getElementById('searchBox').value = weekNumber;
                const schedule = filterByWeek(trainers, selectedTrainer, weekNumber);
                generateScheduleHTML(schedule);
            });
            dropdownContent.appendChild(div);
        });
    }
}

function selectMostRecentWeek(trainers, selectedTrainer) {
    const trainerSchedule = trainers.get(selectedTrainer);
    if (trainerSchedule) {
        const sortedWeeks = Array.from(trainerSchedule.keys()).sort((a, b) => b - a);
        const mostRecentWeek = sortedWeeks[0];
        document.getElementById('searchBox').value = mostRecentWeek;
        const schedule = filterByWeek(trainers, selectedTrainer, mostRecentWeek);
        generateScheduleHTML(schedule);
    }
}

function filterByWeek(trainers, selectedTrainer, selectedWeek) {
    const trainerSchedule = trainers.get(selectedTrainer);
    if (trainerSchedule) {
        return trainerSchedule.get(selectedWeek) || [];
    }
    return [];
}

function generateScheduleHTML(schedule) {
    const tbody = document.querySelector('table tbody');
    tbody.innerHTML = '';

    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const hours = getUniqueHours(schedule);

    hours.forEach(hour => {
        const tr = document.createElement('tr');
        const firstTd = document.createElement('td');
        firstTd.className = 'first-td';
        firstTd.textContent = hour;
        tr.appendChild(firstTd);

        days.forEach(day => {
            const td = document.createElement('td');
            const div = document.createElement('div');
            div.className = 'td-container';

            const appointment = schedule.find(entry => {
                const entryDate = new Date(entry.startDate);
                return formatHour(entryDate) === hour && entryDate.getDay() === days.indexOf(day) + 1;
            });

            if (appointment) {
                if (appointment.isAvailable === 'Y') {
                    div.innerHTML = `Instructor: ${appointment.name}<br><div class="button-container"><div class="reservation-button add-class-button"><button onclick="openUserSelectionPopup(${appointment.id}, '${appointment.name}', '${appointment.startDate}')">Agendar cita</button></div></div>`;
                } else {
                    div.innerHTML = `Instructor: ${appointment.name}<br>Cliente: ${appointment.customer.customerName}<br><div class="button-container"><div class="login cancel-edit-button"><button value="${appointment.customer.id}" data-customername="${appointment.customer.customerName}" data-trainername="${appointment.name}" data-trainerscheduleid="${appointment.trainerScheduleId}" onclick="cancelAppointment(${appointment.customer.id}, '${appointment.customer.customerName}', '${appointment.name}', ${appointment.trainerScheduleId}, ${appointment.id})">Cancelar</button></div></div>`;
                }
            }

            td.appendChild(div);
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });
}

function getUniqueHours(schedule) {
    const hoursSet = new Set();

    schedule.forEach(entry => {
        const entryDate = new Date(entry.startDate);
        hoursSet.add(formatHour(entryDate));
    });

    return Array.from(hoursSet).sort();
}

function formatHour(date) {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
}

async function openUserSelectionPopup(scheduleId, trainerName, appointmentDate) {
    const popup = document.getElementById('userSelectionPopup');
    const userSelect = document.getElementById('userSelect');
    userSelect.innerHTML = '';

    usersList.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = user.name;
        userSelect.appendChild(option);
    });

    document.getElementById('createAppointment').onclick = async () => {
        const selectedUserId = userSelect.value;
        const selectedUser = usersList.find(user => user.id == selectedUserId);
        const requestBody = {
            id: 0,
            creationDate: new Date().toISOString(),
            userId: selectedUser.id,
            customerName: selectedUser.name,
            trainerName: trainerName,
            trainerScheduleId: scheduleId,
            appointmentDate: appointmentDate,
            appointmentStatus: 'Pendiente'
        };
        const response = await CreateMeasurementAppointment(requestBody);
        if (response) {
            alert('Cita agendada con éxito');
            popup.style.display = 'none';
            window.location.reload();
        } else {
            alert('Error al agendar cita');
        }
    };

    document.getElementById('closePopup').onclick = () => {
        popup.style.display = 'none';
    };

    popup.style.display = 'block';
}

async function cancelAppointment(userId, customerName, trainerName, trainerScheduleId, appointmentId) {

    const measurementAppointments = await RetrieveMeasurementAppointments();


    const user = usersList.find(user => user.name === customerName);
    const actualUserId = user.id;

    const appointmentToCancel = measurementAppointments.find(appointment =>
        appointment.trainerScheduleId === appointmentId 
    );

    if (!appointmentToCancel) {
        alert('No se encontró la cita para cancelar');
        return;
    }



    const requestBody = {
        id: appointmentToCancel.id,  
        creationDate: new Date().toISOString(),
        userId: actualUserId,
        trainerName: trainerName,
        customerName: customerName,
        appointmentStatus: "Cancelado",
        trainerScheduleId: appointmentId
    };

    console.log(requestBody); 

    try {
        const response = await UpdateMeasurementAppointment(requestBody);
        console.log("this", response)
        if (response) {
            alert('Cita cancelada con éxito');
            window.location.reload();
        } else {
            alert('Error al cancelar cita');
        }
    } catch (error) {
        console.error('Error al cancelar la cita:', error);
        alert('Error al cancelar cita');
    }
}

