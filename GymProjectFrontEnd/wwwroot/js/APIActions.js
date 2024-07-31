import { ControlActions } from './ControlActions.js';


export async function RetrieveUserMeasures(userId) {
    let controlAction = new ControlActions();
    const apiBaseEndPoint = "Measure";
    const endPointRoute = `${apiBaseEndPoint}/RetrieveById?Id=${userId}`;

    try {
        const userMeasures = await controlAction.GetToApi(endPointRoute);
        console.log("User retrieved:", userMeasures);
        return userMeasures;
    } catch (error) {
        console.error("Failed to retrieve user:", error);
        return null;
    }
}

export async function RetrieveEquipment() {
    let controlAction = new ControlActions();
    const apiBaseEndPoint = "Equipment";
    const endPointRoute = `${apiBaseEndPoint}/RetrieveAll`;

    try {
        const allEquipment = await controlAction.GetToApi(endPointRoute);
        return allEquipment;
    } catch (error) {
        console.error("Failed to retrieve user:", error);
        return null;
    }
}

    export async function RetrieveAllUsers() {
        let controlAction = new ControlActions();
        const apiBaseEndPoint = "User";
        const endPointRoute = `${apiBaseEndPoint}/RetrieveAllUsers`;

        try {
            const users = await controlAction.GetToApi(endPointRoute);
            return users;
        } catch (error) {
            console.error("Failed to retrieve all users:", error);
            return null;
        }
    }



export async function RetrieveTrainerSchedule() {
    let controlAction = new ControlActions();
    const apiBaseEndPoint = "Classes";
    const endPointRoute = `${apiBaseEndPoint}/RetrieveAll`;

    try {
        const trainerSchedule = await controlAction.GetToApi(endPointRoute);
        return trainerSchedule;
    } catch (error) {
        console.error("Failed to schedules:", error);
        return null;
    }
}

export async function RetrieveMeasurementAppointments() {
    let controlAction = new ControlActions();
    const apiBaseEndPoint = "MeasurementAppointments";
    const endPointRoute = `${apiBaseEndPoint}/RetrieveAll`;

    try {
        const measurementAppointments = await controlAction.GetToApi(endPointRoute);
        return measurementAppointments;
    } catch (error) {
        console.error("Failed to schedules:", error);
        return null;
    }
}

export async function UpdateMeasurementAppointment(measurementAppointment) {
    let controlAction = new ControlActions();
    const apiBaseEndPoint = "MeasurementAppointments";
    const endPointRoute = `${apiBaseEndPoint}/Update`;

    try {
        const response = await controlAction.PutToAPI(endPointRoute, measurementAppointment);
        return response;
    } catch (error) {
        console.error("Failed to update measurement appointment:", error);
        return null;
    }
}


export async function CreateMeasurementAppointment(measurementAppointment) {
    let controlAction = new ControlActions();
    const apiBaseEndPoint = "MeasurementAppointments";
    const endPointRoute = `${apiBaseEndPoint}/CreateMeasurementAppointment`;

    try {
        const response = await controlAction.PostToAPI(endPointRoute, measurementAppointment);
        return response;
    } catch (error) {
        console.error("Failed to create measurement appointment:", error);
        return null;
    }
}
