
import { RetrieveEquipment } from '../APIActions.js';
$(document).ready(async function () {
    const equipmentList = await RetrieveEquipment();
    if (equipmentList) {
        populateTable(equipmentList);
    } else {
        console.error("No equipment data available.");
    }
});

function populateTable(equipmentList) {
    let tableBody = $("#equipment-table-body");
    tableBody.empty();

    equipmentList.forEach(equipment => {
        let row = `<tr data-id="${equipment.id}" data-name="${equipment.equipmentName}" data-location="${equipment.locationNumber}">
            <td>${equipment.id}</td>
            <td>${equipment.equipmentName}</td>
            <td>${equipment.locationNumber}</td>
        </tr>`;
        tableBody.append(row);
    });


    $("#equipment-table-body tr").click(function () {
        const id = $(this).data('id');
        const name = $(this).data('name');
        const location = $(this).data('location');


        $('#txtId').val(id);
        $('#txtName').val(name);
        $('#slcArea').val(location);
    });
}