import { ControlAction } from '../ControlAction.js';

function EquipmentViewController() {
    this.ViewName = "Equipments";
    this.ApiBaseEndPoint = "Equipment";

    this.InitView = function () {
        console.log("Equipment Init");

        $("#send-button").click((event) => {
            event.preventDefault(); 
            this.Create(); 
        });

        $("#modify-button").click((event) => {
            event.preventDefault(); 
            this.Update();
        });

        $("#reset-button").click((event) => {
            event.preventDefault(); 
            this.ResetForm(); 
        });
    }

    this.Create = async function () {
        var equipment = {
            equipmentName: $("#txtName").val(),
            locationNumber: $("#slcArea").val(),
            id: 0,
            creationDate: new Date().toISOString()
        };

        var ca = new ControlAction();
        var endPointRoute = this.ApiBaseEndPoint + "/Create";

        try {
            await ca.PostToAPI(endPointRoute, equipment);
            alert("Equipment created successfully");
            this.ResetForm(); 
        } catch (error) {
            console.error("Error creating equipment:", error);
            alert("Error creating equipment");
        }
    }

    this.Update = async function () {
        var equipment = {
            equipmentName: $("#txtName").val(),
            locationNumber: $("#slcArea").val(),
            id: $("#txtId").val(),
            creationDate: new Date().toISOString()
        };

        var ca = new ControlAction();
        var endPointRoute = this.ApiBaseEndPoint + "/Update";

        try {
            await ca.PutToAPI(endPointRoute, equipment);
            alert("Equipment updated successfully");
            this.ResetForm();
        } catch (error) {
            console.error("Error updating equipment:", error);
            alert("Error updating equipment");
        }
    }

    this.ResetForm = function () {
        $("#txtId").val('');
        $("#txtName").val('');
        $("#slcArea").val('');
        $("#name-error").text('');
        $("#area-error").text('');
    }
}

$(document).ready(function () {
    var vc = new EquipmentViewController();
    vc.InitView();
});


