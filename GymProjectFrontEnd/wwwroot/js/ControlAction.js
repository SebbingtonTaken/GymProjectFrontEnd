 export function ControlAction() {
	//Ruta base del API
	this.URL_API = "https://localhost:7236/api/";

	this.GetUrlApiService = function (service) {
		return this.URL_API + service;
	}

	this.GetTableColumsDataName = function (tableId) {
		var val = $('#' + tableId).attr("ColumnsDataName");
		return val;
	}

	this.FillTable = function (service, tableId, refresh) {
		if (!refresh) {
			columns = this.GetTableColumsDataName(tableId).split(',');
			var arrayColumnsData = [];

			$.each(columns, function (index, value) {
				var obj = {};
				obj.data = value;
				arrayColumnsData.push(obj);
			});
			$('#' + tableId).DataTable({
				"processing": true,
				"ajax": {
					"url": this.GetUrlApiService(service),
					dataSrc: ''
				},
				"columns": arrayColumnsData
			});
		} else {
			$('#' + tableId).DataTable().ajax.reload();
		}
	}

	this.GetSelectedRow = function (tableId) {
		var data = sessionStorage.getItem(tableId + '_selected');
		return data;
	};

	this.BindFields = function (formId, data) {
		console.log(data);
		$('#' + formId + ' *').filter(':input').each(function (input) {
			var columnDataName = $(this).attr("ColumnDataName");
			this.value = data[columnDataName];
		});
	}

	this.GetDataForm = function (formId) {
		var data = {};
		$('#' + formId + ' *').filter(':input').each(function (input) {
			var columnDataName = $(this).attr("ColumnDataName");
			data[columnDataName] = this.value;
		});
		console.log(data);
		return data;
	}

	// Custom jQuery actions
	$.put = function (url, data, callback) {
		if ($.isFunction(data)) {
			callback = data;
			data = {};
		}
		return $.ajax({
			url: url,
			type: 'PUT',
			success: callback,
			data: JSON.stringify(data),
			contentType: 'application/json'
		});
	}

	$.delete = function (url, data, callback) {
		if ($.isFunction(data)) {
			callback = data;
			data = {};
		}
		return $.ajax({
			url: url,
			type: 'DELETE',
			success: callback,
			data: JSON.stringify(data),
			contentType: 'application/json'
		});
	}

	this.SweetAlert = function (title,text,type) {
		return Swal.fire(
			title,
			text,
			type
		)
	};
	/* ACCIONES VIA AJAX, O ACCIONES ASINCRONAS*/
	this.PostToAPI = function (service, data, callBackFunction) {
		$.ajax({
			type: "POST",
			url: this.GetUrlApiService(service),
			data: JSON.stringify(data),
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function (data) {
				if (callBackFunction) {
					Swal.fire(
						'¡Bien hecho!',
						'Transacción completada!',
						'success'
					)
					callBackFunction(data);
				}
			},
			error: function (jqXHR, textStatus, errorThrown) {
				var responseJson = jqXHR.responseJSON;
				var message = jqXHR.responseText;
				if (responseJson) {
					var errors = responseJson.errors;
					var errorMessages = Object.values(errors).flat();
					message = errorMessages.join("<br/> ");
				}
				Swal.fire({
					icon: 'error',
					title: 'Ups...',
					html: message,
				})
			}
		});
	};

	this.PutToAPI = function (service, data, callBackFunction) {
		$.put(this.GetUrlApiService(service), data)
			.done(function (response) {

				if (callBackFunction) {
					Swal.fire(
						'¡Bien hecho!',
						'Transacción completada!',
						'success'
					)
					callBackFunction(response);
				}
			})
			.fail(function (response) {
				var data = response.responseJSON;
				var errors = data.errors;
				var errorMessages = Object.values(errors).flat();
				var message = errorMessages.join("<br/> ");
				Swal.fire({
					icon: 'error',
					title: 'Ups...',
					html: message,
				});
			});
	};

	this.DeleteToAPI = function (service, data, callBackFunction) {
		$.delete(this.GetUrlApiService(service), data)
			.done(function (response) {
				Swal.fire(
					'Good job!',
					'Transaction completed!',
					'success'
				);
				if (callBackFunction) {
					callBackFunction(response);
				}
			})
			.fail(function (response) {
				var data = response.responseJSON;
				var errors = data.errors;
				var errorMessages = Object.values(errors).flat();
				var message = errorMessages.join("<br/> ");
				Swal.fire({
					icon: 'error',
					title: 'Oops...',
					html: message,
					footer: 'UCenfotec'
				});
			});
	};

	this.GetToApi = function (service, callBackFunction) {
		$.get(this.GetUrlApiService(service), function (response) {
			console.log("Response " + response);
			if (callBackFunction) {
				callBackFunction(response);
			}
		});
	}

}