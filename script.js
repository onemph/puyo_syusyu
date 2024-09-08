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

    if (!(quantity && startDate && endDate && daysDiff > 0)) {
        alert("値を正しく入力してください。");
        return;
    }

    const dailyAverage = Math.ceil(quantity / (daysDiff + 1));
    let copyText = '';
    let output = '';
    let runningTotal = 0;

    // JSTで現在の日付を取得
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 9); // JSTに変換
    const currentDateJST = currentDate.toISOString().split('T')[0];

    for (let i = 0; i <= daysDiff; i++) {
        const loopDate = new Date(startDate);
        loopDate.setDate(startDate.getDate() + i);
        const formattedDate = loopDate.toISOString().split('T')[0];

        runningTotal += dailyAverage;
        if (runningTotal > quantity) {
            runningTotal = quantity;
        }

        let displayText = `${formattedDate} ${runningTotal.toLocaleString()}`;

        if (formattedDate === currentDateJST) {
            displayText = `<span style="color:red;">${displayText}</span>`;
        }

        output += `${displayText}<br>`;

        if (formattedDate === currentDateJST) {
            if (i === 0) {
                copyText = `今回の完走は${quantity.toLocaleString()}個、日数は${daysDiff + 1}日なので、1日の平均個数は\n${dailyAverage.toLocaleString()}個\nです。`;
            } else {
                copyText = `おはようございます。今日の目安は\n${runningTotal.toLocaleString()}個\nです。`;
            }
        }
    }

    // フラッシュ効果の適用
    const outputElement = document.getElementById("output");
    outputElement.classList.add('flash');
    setTimeout(() => {
        outputElement.classList.remove('flash');
    }, 300);

    // ボタンを押した日のコピーされるテキストを設定
    navigator.clipboard.writeText(copyText);

    // 合算値を表示
    outputElement.innerHTML = output;

    // 値をローカルストレージに保存する
    localStorage.setItem('quantity', quantity);
    localStorage.setItem('startDate', document.getElementById("start-date").value);
    localStorage.setItem('endDate', document.getElementById("end-date").value);
}
