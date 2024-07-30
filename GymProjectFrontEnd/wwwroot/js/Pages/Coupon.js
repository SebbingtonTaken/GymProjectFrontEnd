//JS que maneja comportamiento de la vista Users.cshtml

//Definimos la clase

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

        //carga de la tabla

        this.LoadTable();
    }

    //Metodo de creacion de usuarios

    this.Create = function () {


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
        var ca = new ControlAction();

        var endPointRoute = this.ApiBaseEndPoint + "/Create";
        for (i = 0; i < quantity; i++) {
            ca.PostToAPI(endPointRoute, coupon, function () {
                console.log("Coupon/s created");
            });

        }


    }
    this.Update = function () {

        var coupon = {};
        coupon.discountPercentage = $("#txtPercent").val();

        coupon.userCategory = $("#slcDestinataries").val();
        //se debe ajustar para no enviar defaults
        coupon.id = 0;
        coupon.expiryDate = $("#txtFin").val();
        coupon.couponCode = $("#txtCode").val();
        coupon.state = $("#slcState").val();

        var ca = new ControlAction();

        var endPointRoute = this.ApiBaseEndPoint + "/Update";

        ca.PutToAPI(endPointRoute, coupon, function () {
            console.log("Coupon Updated");
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

        $('#tblCoupons').dataTable({
            "ajax": {
                "url": urlService,
                "dataSrc": ""
            },
            columns: columns
        });

        $('#tblCoupons tbody').on('click', 'tr', function () {

            console.log('Testing click event');



            //Seleccionar la fila a la que dio click
            var row = $(this).closest('tr');

            //Extraemos la data de la tabla
            var DTO = $('#tblCoupons').DataTable().row(row).data();

            //Mapeo de valores del DTO al formulario.
            $('#txtCode').val(DTO.couponCode);
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