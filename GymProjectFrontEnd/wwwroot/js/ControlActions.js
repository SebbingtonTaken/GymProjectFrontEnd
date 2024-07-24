export function ControlActions() {
    // Ruta base del API
    this.URL_API = "https://localhost:7236/api/";

    // Get URL for API service
    this.GetUrlApiService = function (service) {
        return this.URL_API + service;
    };

    // POST request
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
                        'Good job!',
                        'Transaction completed!',
                        'success'
                    );
                    callBackFunction(data);
                }
            },
            error: function (jqXHR) {
                var responseJson = jqXHR.responseJSON;
                var message = jqXHR.responseText;

                if (responseJson) {
                    var errors = responseJson.errors;
                    var errorMessages = Object.values(errors).flat();
                    message = errorMessages.join("<br/> ");
                }
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    html: message,
                    footer: 'UCenfotec'
                });
            }
        });
    };

    // PUT request
    this.PutToAPI = function (service, data, callBackFunction) {
        $.put(this.GetUrlApiService(service), data, function (response) {
            Swal.fire(
                'Good job!',
                'Transaction completed!',
                'success'
            );

            if (callBackFunction) {
                callBackFunction(response);
            }
        }).fail(function (response) {
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

    // DELETE request
    this.DeleteToAPI = function (service, data, callBackFunction) {
        $.delete(this.GetUrlApiService(service), data, function (response) {
            Swal.fire(
                'Good job!',
                'Transaction completed!',
                'success'
            );

            if (callBackFunction) {
                callBackFunction(response);
            }
        }).fail(function (xhr) {
            try {
                var data = xhr.responseJSON;
                if (data && data.errors) {
                    var errorMessages = Object.values(data.errors).flat();
                    var message = errorMessages.join("<br/> ");
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        html: message,
                        footer: 'UCenfotec'
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Unexpected error occurred',
                        footer: 'UCenfotec'
                    });
                }
            } catch (error) {
                console.error("Error handling API response:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Unexpected error occurred',
                    footer: 'UCenfotec'
                });
            }
        });
    };

    // GET request
    this.GetToApi = function (service) {
        return new Promise((resolve, reject) => {
            $.get(this.GetUrlApiService(service))
                .done((response) => {
                    console.log("Response " + response);
                    resolve(response);
                })
                .fail((jqXHR, textStatus, errorThrown) => {
                    console.error("Error fetching data:", textStatus, errorThrown);
                    reject(new Error(`Error fetching data: ${textStatus}`));
                });
        });
    };
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
};

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
};
