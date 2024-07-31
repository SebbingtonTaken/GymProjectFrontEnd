import { RetrieveUserMeasures } from '../APIActions.js';

const ctx = document.getElementById('medidasChart').getContext('2d');
const medidasChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [
            {
                label: 'Peso (kg)',
                data: [],
                backgroundColor: '#876b21',
                borderColor: '#876b21',
                borderWidth: 1
            },
            {
                label: 'Grasa Corporal (%)',
                data: [],
                backgroundColor: '#dbbc6b',
                borderColor: '#dbbc6b',
                borderWidth: 1
            },
            {
                label: 'Altura (cm)',
                data: [],
                backgroundColor: '#b9932dff',
                borderColor: '#b9932dff',
                borderWidth: 1
            }
        ]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        },
        plugins: {
            legend: {
                onClick: (e, legendItem, legend) => {
                    const index = legendItem.datasetIndex;
                    const chart = legend.chart;
                    chart.data.datasets.forEach((dataset, i) => {
                        dataset.hidden = i !== index;
                    });
                    chart.update();
                },
                labels: {
                    color: '#d2ac47ff'
                }
            }
        }
    }
});

// Verificar permisos del usuario y ocultar la sección si es necesario
function checkUserPermissions() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.userPermissions) {
        const section = document.querySelector('.section.measures');
        if (section) {
            section.style.display = 'none';
        }
    }
}

async function loadDataAndRenderChart() {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) {
        console.error("No user found in localStorage");
        return;
    }
    const userId = storedUser.id;

    try {
        const measures = await RetrieveUserMeasures(userId);

        // Agrupar datos por año y mes
        const dataByMonthAndYear = {};
        measures.forEach(measure => {
            const measureDate = new Date(measure.measureDate);
            const year = measureDate.getFullYear();
            const monthName = measureDate.toLocaleString('es-ES', { month: 'long' });

            const yearMonth = `${year}-${monthName}`;

            if (!dataByMonthAndYear[yearMonth]) {
                dataByMonthAndYear[yearMonth] = {
                    weight: [],
                    fatPercentage: [],
                    height: []
                };
            }
            dataByMonthAndYear[yearMonth].weight.push(parseFloat(measure.weight));
            dataByMonthAndYear[yearMonth].fatPercentage.push(parseFloat(measure.fatPercentage.replace('%', '')));
            dataByMonthAndYear[yearMonth].height.push(parseFloat(measure.height) * 100); // Convertir a centímetros
        });

        const years = [...new Set(Object.keys(dataByMonthAndYear).map(key => key.split('-')[0]))].sort((a, b) => b - a);
        const defaultYear = years[0]; // Año más reciente

        function getMonthLabels(year) {
            return Object.keys(dataByMonthAndYear)
                .filter(key => key.startsWith(year))
                .map(key => key.split('-')[1]);
        }

        function updateChartForYear(year) {
            const monthLabels = getMonthLabels(year);
            const weightData = monthLabels.map(month => dataByMonthAndYear[`${year}-${month}`].weight.reduce((a, b) => a + b, 0) / dataByMonthAndYear[`${year}-${month}`].weight.length);
            const fatPercentageData = monthLabels.map(month => dataByMonthAndYear[`${year}-${month}`].fatPercentage.reduce((a, b) => a + b, 0) / dataByMonthAndYear[`${year}-${month}`].fatPercentage.length);
            const heightData = monthLabels.map(month => dataByMonthAndYear[`${year}-${month}`].height.reduce((a, b) => a + b, 0) / dataByMonthAndYear[`${year}-${month}`].height.length);

            medidasChart.data.labels = monthLabels;
            medidasChart.data.datasets[0].data = weightData;
            medidasChart.data.datasets[1].data = fatPercentageData;
            medidasChart.data.datasets[2].data = heightData;

            medidasChart.update();
        }

        // Llenar las opciones del filtro select con los años únicos de las medidas
        const measureFilter = document.getElementById('measureFilter');
        measureFilter.innerHTML = '<option value="" selected disabled>Seleccionar año</option>';
        years.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.text = year;
            measureFilter.appendChild(option);
        });

        // Establecer el año más reciente como valor predeterminado
        measureFilter.value = defaultYear;
        updateChartForYear(defaultYear);

        measureFilter.addEventListener('change', (event) => {
            updateChartForYear(event.target.value);
        });

    } catch (error) {
        console.error("Failed to retrieve user measures:", error);
    }
}

checkUserPermissions();
loadDataAndRenderChart();
