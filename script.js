// 平均値を計算して表示する
function calculateAverage() {
    const quantity = parseInt(document.getElementById("quantity").value);
    const startDate = new Date(document.getElementById("start-date").value + "T00:00:00Z");
    const endDate = new Date(document.getElementById("end-date").value + "T00:00:00Z");
    const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

    if (!(quantity && startDate && endDate && daysDiff > 0)) {
        alert("値を正しく入力してください。");
        return;
    }

    const dailyAverage = Math.ceil(quantity / (daysDiff + 1)); // dailyAverage をループ外で計算
    let copyText = ''; // copyText を宣言

    let output = '';
    let runningTotal = 0;

    for (let i = 0; i <= daysDiff; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        const formattedDate = currentDate.toISOString().split('T')[0];

        runningTotal += dailyAverage;
        // runningTotalがquantityを超えた場合、quantityの値にする
        if (runningTotal > quantity) {
            runningTotal = quantity;
        }

        output += `${formattedDate} ${runningTotal.toLocaleString()}<br>`;

        if (currentDate.toISOString().split('T')[0] === new Date().toISOString().split('T')[0]) {
            if (i === 0) {
                copyText = `今回の完走は${quantity.toLocaleString()}個、日数は${daysDiff+1}日なので、1日の平均個数は\n${dailyAverage.toLocaleString()}個\nです。`;
            } else {
                copyText = `おはようございます。今日の目安は\n${runningTotal.toLocaleString()}個\nです。`;
            }
        }
    }

    // ボタンを押した日のコピーされるテキストを設定
    navigator.clipboard.writeText(copyText);

    document.getElementById("output").innerHTML = output;

    // 値をローカルストレージに保存する
    localStorage.setItem('quantity', quantity);
    localStorage.setItem('startDate', document.getElementById("start-date").value);
    localStorage.setItem('endDate', document.getElementById("end-date").value);
}
