document.addEventListener('DOMContentLoaded', (event) => {
    const dropdownContent = document.getElementById('dropdown-content');
    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    months.forEach((month, index) => {
        const monthDiv = document.createElement('div');
        monthDiv.style.backgroundColor = 'var(--black)';
        const span = document.createElement('span');
        span.textContent = month;
        monthDiv.appendChild(span);
        monthDiv.onclick = () => selectMonth(month);
        dropdownContent.appendChild(monthDiv);
    });
});

function toggleDropdown() {
    document.getElementById("dropdown-content").classList.toggle("show");
}

function selectMonth(month) {
    document.getElementById("searchBox").value = month;
    filterMonths();
}

function filterMonths() {
    let input = document.getElementById('searchBox').value.trim().toUpperCase();
    let div = document.getElementById("dropdown-content");
    let divs = div.getElementsByTagName('div');

    for (let i = 0; i < divs.length; i++) {
        if (divs[i].textContent.toUpperCase().includes(input)) {
            divs[i].style.display = "";
        } else {
            divs[i].style.display = "none";
        }
    }
}
