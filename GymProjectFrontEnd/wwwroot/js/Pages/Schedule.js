document.addEventListener('DOMContentLoaded', (event) => {
    const dropdownContent = document.getElementById('dropdown-content');
    for (let i = 1; i <= 52; i++) {
        const weekDiv = document.createElement('div');
        weekDiv.style.backgroundColor = 'var(--black)';
        const span = document.createElement('span'); 
        span.textContent = `Semana ${i}`; 
        weekDiv.appendChild(span); 
        weekDiv.onclick = () => selectWeek(i);
        dropdownContent.appendChild(weekDiv);
    }
});

function toggleDropdown() {
    document.getElementById("dropdown-content").classList.toggle("show");
}

function selectWeek(week) {
    document.getElementById("searchBox").value = "Semana " + week;
    filterWeeks();
}

function filterWeeks() {
    let input = document.getElementById('searchBox').value.trim().toUpperCase();
    let div = document.getElementById("dropdownContent");
    let divs = div.getElementsByTagName('div');

    if (input.startsWith("SEMANA ")) {
        let targetWeek = parseInt(input.substring(7));
        for (let i = 1; i <= 52; i++) {
            if (i.toString().includes(targetWeek.toString())) {
                divs[i - 5].style.display = "";
            } else {
                divs[i - 5].style.display = "none";
            }
        }
    } else {
        for (let i = 0; i < divs.length; i++) {
            divs[i].style.display = "";
        }
    }
}

