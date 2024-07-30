function EquipmentViewController() {
    this.ViewName = "Equipments";
    this.ApiBaseEndPoint = "Equipment";

    this.InitView = function () {
        console.log(" Equipment Init");

        $("#send-button").click(function () {
            var vc = new EquipmentViewController();
            vc.Create();
        })
        $("#modify-button").click(function () {
            var vc = new EquipmentViewController();
            vc.Update();
        })
        $("#reset-button").click(function () {
            var vc = new EquipmentViewController();
            vc.Delete();
        })

    }

    this.Create = function () {
 

        var equipment = {};
        equipment.equipment_Name = $("#txtName").val();
        equipment.location = $("#slcArea").val();

        equipment.id = 0;
        equipment.creationDate = "2024-07-29T08:31:41.191Z";

        var ca = new ControlAction();
        var endPointRoute = this.ApiBaseEndPoint + "/Create";

        ca.PostToAPI(endPointRoute, equipment, function () {
            console.log("equipment created")
        })
    }

    this.Update = function () {
        var equipment = {};
        equipment.equipment_Name = $("#txtName").val();
        equipment.location = $("#slcArea").val();

        equipment.id = $("#txtId");;
        equipment.creationDate = "2024-07-29T08:31:41.191Z";

        var ca = new ControlAction();
        var endPointRoute = this.ApiBaseEndPoint + "/Update";

        ca.PutToAPI(endPointRoute, equipment, function () {
            console.log("equipment created")
        })
    }



}


$(document).ready(function () {
    var vc = new EquipmentViewController();
    vc.InitView();
});