import { ControlActions } from './ControlActions.js';


export async function RetrieveUserMeasures (userId) {
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