const ctx = document.getElementById('medidasChart').getContext('2d');
const originalLabels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'];
const originalData = {
    'Peso': [70, 72, 68, 75, 73, 74],
    'Grasa Corporal': [20, 18, 22, 19, 21, 20],
    'Músculo': [30, 32, 28, 33, 31, 30],
    'Masa Ósea': [15, 16, 14, 17, 16, 15]
};

const medidasChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [...originalLabels],
        datasets: [
            {
                label: 'Peso',
                data: [...originalData['Peso']],
                backgroundColor: '#876b21',
                borderColor: '#876b21',
                borderWidth: 1
            },
            {
                label: 'Grasa Corporal',
                data: [...originalData['Grasa Corporal']],
                backgroundColor: '#dbbc6b',
                borderColor: '#dbbc6b',
                borderWidth: 1
            },
            {
                label: 'Músculo',
                data: [...originalData['Músculo']],
                backgroundColor: '#b9932dff',
                borderColor: '#b9932dff',
                borderWidth: 1
            },
            {
                label: 'Masa Ósea',
                data: [...originalData['Masa Ósea']],
                backgroundColor: '#d2ac47ff',
                borderColor: '#d2ac47ff',
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

document.querySelectorAll('.filters input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', updateChart);
});

function updateChart() {
    const selectedMonths = Array.from(document.querySelectorAll('.filters input[type="checkbox"]:checked')).map(cb => cb.value);
    medidasChart.data.labels = selectedMonths;

    medidasChart.data.datasets.forEach(dataset => {
        dataset.data = originalData[dataset.label].filter((_, index) => selectedMonths.includes(originalLabels[index]));
    });

    medidasChart.update();
}
