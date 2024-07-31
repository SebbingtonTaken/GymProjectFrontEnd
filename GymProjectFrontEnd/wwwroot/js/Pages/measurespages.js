import { ControlAction } from '../ControlAction.js';
import { RetrieveAllUsers } from '../APIActions.js';

document.addEventListener('DOMContentLoaded', async () => {
    const userList = await RetrieveAllUsers();
    console.log(userList);
    if (userList) {

        populateUserDropdown(userList);
    } else {
        console.error("No user data available.");
    }

    const vc = new MeasureViewController();
    vc.InitView();
});

function populateUserDropdown(userList) {
    const userDropdown = document.getElementById('slcUsuario');
    userDropdown.innerHTML = ''; // Clear existing options

    userList.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = user.name;
        userDropdown.appendChild(option);
    });
}

function MeasureViewController() {
    this.ApiBaseEndPoint = 'Measure'; 

    this.Create = async function () {
        const measure = this.getFormData();
        var ca = new ControlAction();
        var endPointRoute = this.ApiBaseEndPoint + "/Create";

        ca.PostToAPI(endPointRoute, measure, function () {
            console.log("Measure created");
            resetForm();
        });
    };

    this.Update = async function () {
        const measure = this.getFormData();
        var ca = new ControlAction();
        var endPointRoute = this.ApiBaseEndPoint + "/Update"; 

        ca.PostToAPI(endPointRoute, measure, function () {
            console.log("Measure updated");
            resetForm();
        });
    };

    this.getFormData = function () {

        const creationDate = new Date().toISOString();
        const userId = document.getElementById('slcUsuario').value;
        const weight = document.getElementById('txtPeso').value;
        const height = document.getElementById('txtAltura').value;
        const fatPercentage = document.getElementById('txtGrasa').value;
        const today = new Date();
        const measureDate = today.toISOString().split('T')[0] + 'T00:00:00.000Z';


        return {
            id: 0,
            creationDate: creationDate,
            userId: parseInt(userId),
            weight: weight,
            height: height,
            fatPercentage: fatPercentage,
            measureDate: measureDate
        };
    };

    this.resetForm = function () {
        document.getElementById('registration-form').reset();
        document.getElementById('txtId').value = '';
    };

    this.InitView = function () {
        console.log("Measure Init");

        $("#btnGuardar").click(() => {
            this.Create();
        });
        $("#btnModificar").click(() => {
            this.Update();
        });
        $("#reset-button").click(() => {
            this.resetForm();
        });
    };
}