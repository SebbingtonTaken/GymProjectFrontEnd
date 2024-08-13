import { ControlAction } from '../ControlAction.js';
import { ControlActions } from '../ControlActions.js';

function ExercisesViewController() {
    this.ViewName = "Exercises";
    this.ApiBaseEndPoint = "Exercise";

    //Metodo Constructor de la vista
    this.InitView = function () {
        console.log("Exercise view init!!!");
        //bind del click del buton con el metodo create

        $("#btnCreate").click(function () {
            var vc = new ExercisesViewController();
            vc.Create();
        });

        $("#btnUpdate").click(function () {
            var vc = new ExercisesViewController();
            vc.Update();
        });

        $("#btnDelete").click(function () {
            var vc = new ExercisesViewController();
            vc.Delete();
        });

        //carga de la tabla

        this.LoadTable();
        this.loadDropdownEquipment();
    }

    //Metodo de creacion de usuarios

    this.Create = async function () {


        //Crear el DTO de user

        var exercise = {};

        exercise.assignedEquipment = {};
        exercise.exerciseName = $("#txtName").val();
        //se debe ajustar para no enviar defaults
        exercise.id = 0;
        exercise.exerciseType = $("#slcTipo").val();
        exercise.assignedEquipment.Id = $("#slcEquipment").val();
        exercise.assignedEquipment.equipmentName = "";

        if (!(await this.ValidateExerciseCreate(exercise))) {
            return; // Stop execution if validation fails
        }
        var ca = new ControlAction();

        var endPointRoute = this.ApiBaseEndPoint + "/Create";


        ca.PostToAPI(endPointRoute, exercise, function () {
            console.log("exercise/s created");
            ca.SweetAlert('Accion completada', 'Ejercicio Creado', 'success').then(() => {
                // Refresh the page
                location.reload();
            });
        });



    };

    this.ValidateExerciseCreate =function(exercise){
        var ca = new ControlAction();

        // Create a promise to handle the asynchronous nature of SweetAlert
        return new Promise((resolve) => {
            if (exercise.exerciseName == "" || exercise.exerciseName == null || exercise.exerciseName === undefined) {
                ca.SweetAlert('Error', 'Debe incluir el nombre del ejercicio', 'error').then(() => {
                    resolve(false); // Resolve promise with false indicating validation failure
                });
                return; // Exit function to prevent further code execution
            }
            if (exercise.exerciseType == "" || exercise.exerciseType == null || exercise.exerciseType === undefined) {
                ca.SweetAlert('Error', 'Debe seleccionar algun tipo', 'error').then(() => {
                    resolve(false); // Resolve promise with false indicating validation failure
                });
                return; // Exit function to prevent further code execution
            }
            if (exercise.assignedEquipment.Id == 0 || exercise.assignedEquipment.Id == null || exercise.assignedEquipment.Id === undefined) {
                ca.SweetAlert('Error', 'Debe seleccionar algun equipo', 'error').then(() => {
                    resolve(false); // Resolve promise with false indicating validation failure
                });
                return; // Exit function to prevent further code execution
            }

            // If all validations pass, resolve the promise with true
            resolve(true);
        });
    };
    this.ValidateExercise = function (exercise) {
        var ca = new ControlAction();

        // Create a promise to handle the asynchronous nature of SweetAlert
        return new Promise((resolve) => {
            if (exercise.exerciseName == "" || exercise.exerciseName == null || exercise.exerciseName === undefined) {
                ca.SweetAlert('Error', 'Debe incluir el nombre del ejercicio', 'error').then(() => {
                    resolve(false); // Resolve promise with false indicating validation failure
                });
                return; // Exit function to prevent further code execution
            }
            if (exercise.id == 0 || exercise.id == null || exercise.id === undefined) {
                ca.SweetAlert('Error', 'Debe seleccionar algun ejercicio de la tabla', 'error').then(() => {
                    resolve(false); // Resolve promise with false indicating validation failure
                });
                return; // Exit function to prevent further code execution
            }
            if (exercise.exerciseType == "" || exercise.exerciseType == null || exercise.exerciseType === undefined) {
                ca.SweetAlert('Error', 'Debe seleccionar algun tipo', 'error').then(() => {
                    resolve(false); // Resolve promise with false indicating validation failure
                });
                return; // Exit function to prevent further code execution
            }
            if (exercise.assignedEquipment.Id == 0 || exercise.assignedEquipment.Id == null || exercise.assignedEquipment.Id === undefined) {
                ca.SweetAlert('Error', 'Debe seleccionar algun equipo', 'error').then(() => {
                    resolve(false); // Resolve promise with false indicating validation failure
                });
                return; // Exit function to prevent further code execution
            }

            // If all validations pass, resolve the promise with true
            resolve(true);
        });
    };
    this.Update = async function () {


        var exercise = {};

        exercise.assignedEquipment = {};
        exercise.exerciseName = $("#txtName").val();
        //se debe ajustar para no enviar defaults
        exercise.id = $("#txtId").val();
        exercise.exerciseType = $("#slcTipo").val();
        exercise.assignedEquipment.Id = $("#slcEquipment").val();
        exercise.assignedEquipment.equipmentName = "";

        if (!(await this.ValidateExercise(exercise))) {
            return; // Stop execution if validation fails
        }
;
        var ca = new ControlAction();

        var endPointRoute = this.ApiBaseEndPoint + "/Update";

        ca.PutToAPI(endPointRoute, exercise, function () {
            console.log("exercise/s created");
            ca.SweetAlert('Accion completada', 'Ejercicio Actualizado', 'success').then(() => {
                // Refresh the page
                location.reload();
            });
        });

    }

    this.Delete = function () {
        //var product = {};
        //product.id = $("#txtId").val();
        //product.name = $("#txtName").val();
        //product.description = $("#txtDescription").val();
        //product.category = $("#txtCategory").val();
        //product.price = $("#txtPrice").val();


        //var ca = new ControlActions();

        //var endPointRoute = this.ApiBaseEndPoint + "/Delete";
        //ca.DeleteToAPI(endPointRoute, product, function () {
        //    console.log("Product Deleted");
        //});
    }
    this.loadDropdownEquipment = function () {

        var ca = new ControlActions();
        var urlService = "Equipment/RetrieveAll";





        // Loop through each object in the JSON array
        ca.GetToApi(urlService)
            .then(response => {
                populateSelect(response);
            })
            .catch(error => {
                console.error("Failed to load equipment data:", error);
            });

    }

    function populateSelect(data) {
        const select = document.getElementById('slcEquipment');
        data.forEach(function (item) {
            const option = document.createElement('option');
            option.text = item.equipmentName;
            option.value = item.id;
            select.add(option);
        });
    }
    this.LoadTable = function () {
        var ca = new ControlAction();

        //Construimos la ruta del API para consumir el servicio de Retrieve

        var urlService = ca.GetUrlApiService(this.ApiBaseEndPoint + "/RetrieveAll");

        //Definir las columnas a extraer del json que devuelve el API

        //<th>Id</th>
        //                 <th>Name</th>
        //                 <th>Description</th>
        //                 <th>Category</th>
        //                 <th>Price</th>

        var columns = [];
        columns[0] = { 'data': 'id' };
        columns[1] = { 'data': 'exerciseName' };
        columns[2] = { 'data': 'exerciseType' };
        columns[3] = { 'data': 'assignedEquipment.equipmentName' };


        $('#tblExercises').dataTable({
            "ajax": {
                "url": urlService,
                "dataSrc": ""
            },
            "columns": columns,
            "language": {
                "url": "//cdn.datatables.net/plug-ins/2.1.3/i18n/es-MX.json"
            }
        });

        $('#tblExercises tbody').on('click', 'tr', function () {

            console.log('Testing click event');



            //Seleccionar la fila a la que dio click
            var row = $(this).closest('tr');

            //Extraemos la data de la tabla
            var DTO = $('#tblExercises').DataTable().row(row).data();

            //Mapeo de valores del DTO al formulario.
            $('#txtId').val(DTO.id);
            $('#txtName').val(DTO.exerciseName);
            $('#slcTipo').val(DTO.exerciseType).change();
            $('#slcEquipment').val(DTO.assignedEquipment.id).change();
        });
    }
}

//instanciamos la clase

$(document).ready(function () {
    var vc = new ExercisesViewController();
    vc.InitView();
});