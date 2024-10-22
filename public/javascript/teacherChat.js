let chart = document.addEventListener('DOMContentLoaded', function(){
    fetch('/chart/chart_data/studentData.student_id').then(response => response.json()).then(data => {
        let labels= data.map(row => row.skills_name)
        let values = data.map(row => row.score);
        console.log(labels)
        console.log(values)
        const ctx = document.getElementById('myBarChart').getContext('2d');
        const myBarChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{label: 'Student Data',
                    data: values,
                    backgroundColor: ['rgba(54, 162, 235, 0.3)'],
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            Option: {
                scales: {
                    yAxes: {
                        
                            beginAtZero: true,
                            max: 5 
                        }
                    }
                }
        });
        })
        .catch(error => {
            console.error('Error: ', error);
        });
    });