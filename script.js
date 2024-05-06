// ページが読み込まれたときに保存された値を取得してフォームに入力する
window.onload = function() {
    const quantity = localStorage.getItem('quantity');
    const startDate = localStorage.getItem('startDate');
    const endDate = localStorage.getItem('endDate');

    if (quantity) document.getElementById('quantity').value = quantity;
    if (startDate) document.getElementById('start-date').value = startDate;
    if (endDate) document.getElementById('end-date').value = endDate;
};

// 終了日を開始日から13日後に設定する
function setEndDate() {
    const startDate = new Date(document.getElementById("start-date").value + "T00:00:00Z");
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 13);
    document.getElementById("end-date").value = endDate.toISOString().split('T')[0];
}

// 平均値を計算して表示する
function calculateAverage() {
    const quantity = parseInt(document.getElementById("quantity").value);
    const startDate = new Date(document.getElementById("start-date").value + "T00:00:00Z");
    const endDate = new Date(document.getElementById("end-date").value + "T00:00:00Z");
    const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

    const dailyAverage = Math.ceil(quantity / (daysDiff + 1)); // dailyAverage をループ外で計算
    let copyText = ''; // copyText を宣言

    if (quantity && startDate && endDate && daysDiff > 0) {
        let output = '';
        let runningTotal = 0;

        for (let i = 0; i <= daysDiff; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            const formattedDate = currentDate.toISOString().split('T')[0];

            if (currentDate.getTime() === new Date().setHours(0, 0, 0, 0)) {
                if (i === 0) {
                    copyText = `今回の完走は\n${quantity.toLocaleString()}個、日数は${daysDiff+1}なので、1日の平均個数は\n${dailyAverage}個\nです。`;
                } else {
                    copyText = `おはようございます。今日の目安は\n${runningTotal.toLocaleString()}個\nです。`;
                }
            }

            runningTotal += dailyAverage;
            // runningTotalがquantityを超えた場合、quantityの値にする
            if (runningTotal > quantity) {
                runningTotal = quantity;
            }

            output += `${formattedDate} ${runningTotal.toLocaleString()}<br>`;
        }

        // 出力を更新
        document.getElementById("output").innerHTML = output;

        // copyText をクリップボードにコピー
        navigator.clipboard.writeText(copyText);

        // 値をローカルストレージに保存する
        localStorage.setItem('quantity', quantity);
        localStorage.setItem('startDate', document.getElementById("start-date").value);
        localStorage.setItem('endDate', document.getElementById("end-date").value);
    } else {
        alert("値を正しく入力してください。");
    }
}
