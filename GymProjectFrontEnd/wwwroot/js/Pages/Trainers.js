document.addEventListener('DOMContentLoaded', function() {
 
    var divs = document.querySelectorAll('.reservation-button');


    divs.forEach(function(div) {

        var tdContainer = div.closest('.td-container');
        if (tdContainer) {
            var statusText = tdContainer.textContent.trim();
            

            if (statusText.includes('No disponible')) {
                div.classList.add('button-disabled');
                div.disabled = true; 
            }
        }
    });
});

document.addEventListener('click', function(event) {
    if (event.target.matches('.check-trainer-schedule')) {
        let trainerId = event.target.getAttribute('data-trainer-id');
        let popup = document.getElementById(`trainer-${trainerId}`);
        if (popup) {
            popup.style.display = 'block';
        }
    }
});

function closePopup(popupId) {
    document.getElementById(popupId).style.display = 'none';
}


