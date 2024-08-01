export function ControlActions() {
    // Ruta base del API
    this.URL_API = "https://localhost:7236/api/";

    // Get URL for API service
    this.GetUrlApiService = function (service) {
        return this.URL_API + service;
    };

    // POST request
    this.PostToAPI = function (service, data) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "POST",
                url: this.GetUrlApiService(service),
                data: JSON.stringify(data),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response, textStatus, jqXHR) {
                    if (jqXHR.status === 200) {
                        const otpMessage = "OTP fue generado y enviado a su correo y celular";
                        if (response === otpMessage) {
                            Swal.fire({
                                icon: 'info',
                                title: 'OTP Enviado',
                                text: response,
                                footer: 'UCenfotec'
                            });
                        } else {
                            // Handle general success
                            Swal.fire(
                                'Good job!',
                                'Transaction completed!',
                                'success'
                            );
                        }
                        resolve(response);
                    } else {
                        // Handle non-200 status
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            html: response,
                            footer: 'UCenfotec'
                        });
                        reject(new Error(response));
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
                    reject(new Error(message));
                }
            });
        });
    };

    // PUT request
    this.PutToAPI = function (service, data) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "PUT",
                url: this.GetUrlApiService(service),
                data: JSON.stringify(data),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response, textStatus, jqXHR) {
                    if (jqXHR.status === 200) {
                        Swal.fire(
                            'Good job!',
                            'Transaction completed!',
                            'success'
                        );
                        resolve(response);
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            html: response,
                            footer: 'UCenfotec'
                        });
                        reject(new Error(response));
                    }
                },
                error: function (jqXHR) {
                    var responseJson = jqXHR.responseJSON;
                    var message = jqXHR.responseText;

                    if (responseJson && responseJson.errors) {
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
                    reject(new Error(message));
                }
            });
        });
    };

    // DELETE request
    this.DeleteToAPI = function (service, data, callBackFunction) {
        $.delete(this.GetUrlApiService(service), data, function (response, textStatus, jqXHR) {
            if (jqXHR.status === 200) {
                Swal.fire(
                    'Good job!',
                    'Transaction completed!',
                    'success'
                );

                if (callBackFunction) {
                    callBackFunction(response);
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    html: response,
                    footer: 'UCenfotec'
                });
            }
        }).fail(function (jqXHR) {
            try {
                var responseJson = jqXHR.responseJSON;
                if (responseJson && responseJson.errors) {
                    var errorMessages = Object.values(responseJson.errors).flat();
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
                .done((response, textStatus, jqXHR) => {
                    if (jqXHR.status === 200) {
                        resolve(response);
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            html: response,
                            footer: 'UCenfotec'
                        });
                        reject(new Error(response));
                    }
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
        contentType: 'application/json; charset=utf-8',
        dataType: 'json'
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
