// 구글 차트 라이브러리 로딩
google.charts.load('current', {'packages':['corechart', 'bar']});

// 엑셀 파일 업로드 및 읽기
document.querySelector('#excelInput').addEventListener('change', handleFile, false);
function handleFile(event) {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.xlsx')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const data = e.target.result;
            // 엑셀 데이터 파싱
            const workbook = XLSX.read(data, {type: 'binary'});
            // 첫 번째 시트를 선택
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            // 시트 데이터를 JSON 형식으로 변환
            const jsonData = XLSX.utils.sheet_to_json(worksheet, {header: 1});
            // 구글 차트로 데이터 표시
            drawChart(jsonData);
        };
        reader.readAsBinaryString(file);
    } 
    else {
        alert('엑셀 파일만 업로드 가능합니다!');
    }
}

// 구글 차트 그리기 함수
function drawChart(data) {
    // 구글 차트 데이터 형식으로 변환
    const dataTable = new google.visualization.arrayToDataTable(data);

    // 첫 번째 차트 그리기
    const chart1 = new google.visualization.BarChart(document.querySelectorAll('.chartContainer')[0]);
    chart1.draw(dataTable, {title: '막대그래프'});
    // 두 번째 차트 그리기
    const chart2 = new google.visualization.PieChart(document.querySelectorAll('.chartContainer')[1]);
    chart2.draw(dataTable, {title: '원그래프'});
    // 세 번째 차트 그리기
    const chart3 = new google.visualization.LineChart(document.querySelectorAll('.chartContainer')[2]);
    chart3.draw(dataTable, {title: '꺽은선 그래프'});
}