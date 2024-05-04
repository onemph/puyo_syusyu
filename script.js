// ページが読み込まれたときに保存された値を取得してフォームに入力する
window.onload = function() {
    const quantity = localStorage.getItem('quantity');
    const startDate = localStorage.getItem('startDate');
    const endDate = localStorage.getItem('endDate');

    if (quantity) document.getElementById('quantity').value = quantity;
    if (startDate) document.getElementById('start-date').value = startDate;
    if (endDate) document.getElementById('end-date').value = endDate;
};

function setEndDate() {
    const startDate = new Date(document.getElementById("start-date").value);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 13);
    document.getElementById("end-date").value = endDate.toISOString().split('T')[0];
}

function calculateAverage() {
    const quantity = parseInt(document.getElementById("quantity").value);
    const startDate = new Date(document.getElementById("start-date").value);
    const endDate = new Date(document.getElementById("end-date").value);
    const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

    if (quantity && startDate && endDate && daysDiff > 0) {
        let output = '';
        let runningTotal = 0;

        for (let i = 0; i <= daysDiff; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            const formattedDate = currentDate.toISOString().split('T')[0];
            const dailyAverage = Math.ceil(quantity / (daysDiff + 1));

            runningTotal += dailyAverage;
            // runningTotalがquantityを超えた場合、quantityの値にする
            if (runningTotal > quantity) {
                runningTotal = quantity;
            }

            output += `${formattedDate} ${runningTotal.toLocaleString()}<br>`;
        }

        document.getElementById("output").innerHTML = output;

        // ボタンを押した日の合算値を取得
        const currentDayIndex = Math.min(Math.max(0, Math.ceil((new Date() - startDate) / (1000 * 60 * 60 * 24))), daysDiff);
        const copiedTotal = runningTotal - Math.ceil(quantity / (daysDiff + 1)) * (daysDiff - currentDayIndex) - Math.ceil(quantity / (daysDiff + 1));

        const copyText = `おはようございます。今日の目安は\n${copiedTotal.toLocaleString()} 個\nです。`;
        navigator.clipboard.writeText(copyText);
        
        // 値をローカルストレージに保存する
        localStorage.setItem('quantity', quantity);
        localStorage.setItem('startDate', document.getElementById("start-date").value);
        localStorage.setItem('endDate', document.getElementById("end-date").value);
    } else {
        alert("値を正しく入力してください。");
    }
}
