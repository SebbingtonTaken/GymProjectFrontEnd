//JS que maneja comportamiento de la vista Users.cshtml

//Definimos la clase
import { ControlAction } from '../ControlAction.js';
function CouponsViewController() {
    this.ViewName = "Coupons";
    this.ApiBaseEndPoint = "Coupon";

    //Metodo Constructor de la vista
    this.InitView = function () {
        console.log("Coupon view init!!!");
        //bind del click del buton con el metodo create

        $("#btnCreate").click(function () {
            var vc = new CouponsViewController();
            vc.Create();
        });

        $("#btnUpdate").click(function () {
            var vc = new CouponsViewController();
            vc.Update();
        });

        $("#btnDelete").click(function () {
            var vc = new CouponsViewController();
            vc.Delete();
        });
        $("#reset-button").click((event) => {
            event.preventDefault();
            this.ResetForm();
        });

        //carga de la tabla

        this.LoadTable();
    }

    //Metodo de creacion de usuarios

    this.Create = async function () {


        //Crear el DTO de user

        var coupon = {};

        coupon.discountPercentage = $("#txtPercent").val();

        coupon.userCategory = $("#slcDestinataries").val();
        //se debe ajustar para no enviar defaults
        coupon.id = 0;
        coupon.expiryDate = $("#txtFin").val();
        coupon.couponCode = "";
        coupon.state = $("#slcState").val();
        let quantity = $("#txtQuantity").val();

        if (!(await this.ValidateCouponCreate(coupon))) {
            return; // Stop execution if validation fails
        }
        var ca = new ControlAction();

        var endPointRoute = this.ApiBaseEndPoint + "/Create";
        for (let i = 0; i < quantity; i++) {
            ca.PostToAPI(endPointRoute, coupon, function () {
                ca.SweetAlert('Accion completada', 'Cupon Creado', 'success').then(() => {
                    // Refresh the page
                    location.reload();
                });
                console.log("Coupon/s created");
            });

        }


    }
    this.ValidateCouponCreate = function (coupon) {
        var ca = new ControlAction();

        // Create a promise to handle the asynchronous nature of SweetAlert
        return new Promise((resolve) => {
            if (coupon.discountPercentage == 0 || coupon.discountPercentage == null || coupon.discountPercentage === undefined) {
                ca.SweetAlert('Error', 'Debe incluir el porcentaje del descuento', 'error').then(() => {
                    resolve(false); // Resolve promise with false indicating validation failure
                });
                return; // Exit function to prevent further code execution
            }
            if (coupon.expiryDate == "" || coupon.expiryDate == null || coupon.expiryDate === undefined) {
                ca.SweetAlert('Error', 'Debe seleccionar  fecha de expiración', 'error').then(() => {
                    resolve(false); // Resolve promise with false indicating validation failure
                });
                return; // Exit function to prevent further code execution
            }
            if (coupon.state == "" || coupon.state == null || coupon.state === undefined) {
                ca.SweetAlert('Error', 'Debe seleccionar algun estado de la tabla ', 'error').then(() => {
                    resolve(false); // Resolve promise with false indicating validation failure
                });
                return; // Exit function to prevent further code execution
            }
            if (coupon.userCategory == "" || coupon.userCategory == null || coupon.userCategory === undefined) {
                ca.SweetAlert('Error', 'Debe seleccionar alguna categoria de usuario de la tabla ', 'error').then(() => {
                    resolve(false); // Resolve promise with false indicating validation failure
                });
                return; // Exit function to prevent further code execution
            }

            // If all validations pass, resolve the promise with true
            resolve(true);
        });
    };
    this.ValidateCouponUpdate = function (coupon) {
        var ca = new ControlAction();

        // Create a promise to handle the asynchronous nature of SweetAlert
        return new Promise((resolve) => {
            if (coupon.discountPercentage == 0 || coupon.discountPercentage == null || coupon.discountPercentage === undefined) {
                ca.SweetAlert('Error', 'Debe incluir el porcentaje del descuento', 'error').then(() => {
                    resolve(false); // Resolve promise with false indicating validation failure
                });
                return; // Exit function to prevent further code execution
            }
            if (coupon.couponCode == "" || coupon.couponCode == null || coupon.couponCode === undefined) {
                ca.SweetAlert('Error', 'Debe seleccionar algun cupón de la tabla', 'error').then(() => {
                    resolve(false); // Resolve promise with false indicating validation failure
                });
                return; // Exit function to prevent further code execution
            }
            if (coupon.expiryDate == "" || coupon.expiryDate == null || coupon.expiryDate === undefined) {
                ca.SweetAlert('Error', 'Debe seleccionar  fecha de expiración', 'error').then(() => {
                    resolve(false); // Resolve promise with false indicating validation failure
                });
                return; // Exit function to prevent further code execution
            }
            if (coupon.state == "" || coupon.state == null || coupon.state === undefined) {
                ca.SweetAlert('Error', 'Debe seleccionar algun estado de la tabla ', 'error').then(() => {
                    resolve(false); // Resolve promise with false indicating validation failure
                });
                return; // Exit function to prevent further code execution
            }
            if (coupon.userCategory == "" || coupon.userCategory == null || coupon.userCategory === undefined) {
                ca.SweetAlert('Error', 'Debe seleccionar alguna categoria de usuario de la tabla ', 'error').then(() => {
                    resolve(false); // Resolve promise with false indicating validation failure
                });
                return; // Exit function to prevent further code execution
            }

            // If all validations pass, resolve the promise with true
            resolve(true);
        });
    };
    this.Update = async function () {

        var coupon = {};
        coupon.discountPercentage = $("#txtPercent").val();

        coupon.userCategory = $("#slcDestinataries").val();
        //se debe ajustar para no enviar defaults
        coupon.id = 0;
        coupon.expiryDate = $("#txtFin").val();
        coupon.couponCode = $("#txtCode").val();
        coupon.state = $("#slcState").val();


        if (!(await this.ValidateCouponUpdate(coupon))) {
            return; // Stop execution if validation fails
        }

        var ca = new ControlAction();

        var endPointRoute = this.ApiBaseEndPoint + "/Update";

        ca.PutToAPI(endPointRoute, coupon, function () {

            ca.SweetAlert('Accion completada', 'Cupon Actualizado', 'success').then(() => {
                // Refresh the page
                location.reload();
            });
        });
    }

    this.Delete = function () {
        var product = {};
        product.id = $("#txtId").val();
        product.name = $("#txtName").val();
        product.description = $("#txtDescription").val();
        product.category = $("#txtCategory").val();
        product.price = $("#txtPrice").val();


        var ca = new ControlAction();

        var endPointRoute = this.ApiBaseEndPoint + "/Delete";
        ca.DeleteToAPI(endPointRoute, product, function () {
            console.log("Product Deleted");
        });
    }
    this.ResetForm = function () {
        $("#txtCode").val('');
        $("#txtFin").val('');
        $("#slcDestinataries").val('');
        $("#slcState").val('');
        $("#txtQuantity").val('');

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
        columns[0] = { 'data': 'couponCode' };
        columns[1] = { 'data': 'discountPercentage' };
        columns[2] = { 'data': 'userCategory' };
        columns[3] = { 'data': 'expiryDate' };
        columns[4] = { 'data': 'state' };
        columns[5] = { 'data': 'creationDate' }

        $('#tblCoupons').dataTable({
            "ajax": {
                "url": urlService,
                "dataSrc": ""
            },
            "columns": columns,
            "language": {
                "url": "//cdn.datatables.net/plug-ins/2.1.3/i18n/es-MX.json"
            }
        });

        $('#tblCoupons tbody').on('click', 'tr', function () {

            console.log('Testing click event');



            //Seleccionar la fila a la que dio click
            var row = $(this).closest('tr');

            //Extraemos la data de la tabla
            var DTO = $('#tblCoupons').DataTable().row(row).data();

            //Mapeo de valores del DTO al formulario.
            $('#txtCode').val(DTO.couponCode);
            $('#slcDestinataries').val(DTO.userCategory).change();
            $('#txtPercent').val(DTO.discountPercentage);

            var onlyDate = DTO.expiryDate.split("T");
            $('#txtFin').val(onlyDate[0]);
            $('#slcState').val(DTO.state).change();
        });
    }

}



//instanciamos la clase

$(document).ready(function () {
    var vc = new CouponsViewController();
    vc.InitView();
});