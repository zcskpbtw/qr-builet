function submitForm() {
    const transportType = document.getElementById("transportType").value;
    const routeNumber = document.getElementById("routeNumber").value;
    const vehicleNumber = document.getElementById("vehicleNumber").value;
    const ticketPrice = document.getElementById("ticketPrice").value;
    const entryTime = new Date().toISOString();
    
    localStorage.setItem("ticket", JSON.stringify({ transportType, routeNumber, vehicleNumber, ticketPrice, entryTime }));
    window.location.href = "ticket.html";
}

function loadTicket() {
    const ticket = JSON.parse(localStorage.getItem("ticket"));
    if (!ticket) return;

    document.getElementById("transportType").textContent = ticket.transportType === "bus" ? "Автобус" : "Троллейбус";
    document.getElementById("routeNumber").textContent = ticket.routeNumber;
    document.getElementById("vehicleNumber").textContent = ticket.vehicleNumber;
    document.getElementById("ticketPrice").textContent = ticket.ticketPrice;
    document.getElementById("entryDate").textContent = new Date(ticket.entryTime).toLocaleDateString();
    document.getElementById("entryTime").textContent = new Date(ticket.entryTime).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    document.getElementById("ticketSeries").textContent = `QR${Math.floor(Math.random() * 1000000000000)}`;

    const now = new Date();
    const ticketNumber = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}${now.getMilliseconds()}`;
    document.getElementById("ticketNumber").textContent = ticketNumber;

    setInterval(() => {
        const elapsed = Math.floor((new Date() - new Date(ticket.entryTime)) / 1000);
        const minutes = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
        const seconds = String(elapsed % 60).padStart(2, '0');
        document.getElementById("elapsedTime").textContent = `${minutes}:${seconds}`;
    }, 1000);

    generateQRCode(ticket);
}

function generateQRCode(ticket) {
    const qrData = `Транспорт: ${ticket.transportType}, Маршрут: ${ticket.routeNumber}, ТС: ${ticket.vehicleNumber}, Время входа: ${new Date(ticket.entryTime).toLocaleString()}, Стоимость: ${ticket.ticketPrice}₽`;
    const qrCodeURL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;
    document.getElementById("qrCode").src = qrCodeURL;
}

function downloadTicket() {
    const panel = document.getElementById("downloadPanel");
    const overlay = document.getElementById("overlay");
    panel.classList.add("visible");
    overlay.classList.add("visible");
}

function confirmDownload() {
    const ticket = JSON.parse(localStorage.getItem("ticket"));
    if (!ticket) return;

    // Корректное форматирование даты и времени с учётом локального времени
    const entryTimeFull = new Date(ticket.entryTime).toLocaleString('ru-RU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }).replace(/\./g, '-').replace(/, /g, 'А'); // Преобразуем в 2025-06-21А12:46:00

    const ticketSeries = document.getElementById("ticketSeries").textContent;
    const ticketNumber = document.getElementById("ticketNumber").textContent;
    const qrCodeURL = document.getElementById("qrCode").src;

    const content = `
        <html>
        <head>
            <style>
                .semi-transparent {
                    opacity: 0.6; /* Полупрозрачность 50% */
                }
                h6 {
                    margin: 0px;
                }
                p {
                    margin-top: 5px;
                    margin-bottom: 24px; /* Уменьшаем отступ между параграфами */
                }
            </style>
        </head>
        <body style="font-family: Arial, sans-serif; margin: 45px;">
            <p>${entryTimeFull}</p>
            <h6 class="semi-transparent">Вид билета</h6>
            <p> Разовый билет QRPay</p>
            <h6 class="semi-transparent">Серия билета</h6>
            <p> ${ticketSeries}</p>
            <h6 class="semi-transparent">Номер билета</h6>
            <p> ${ticketNumber}</p>
            <h6 class="semi-transparent">ИНН перевозчика</h6>
            <p> 5507022628</p>
            <h6 class="semi-transparent">Наименование перевозчика</h6>
            <p> АО "Пассажирское предприятие № 8"</p>
            <h6 class="semi-transparent">Вид транспорта</h6>
            <p>${ticket.transportType === "bus" ? "Автобус" : "Троллейбус"}</p>
            <h6 class="semi-transparent">Маршрут/Станция</h6>
            <p> ${ticket.routeNumber}</p>
            <h6 class="semi-transparent">Номер ТС</h6>
            <p> ${ticket.vehicleNumber}</p>
            <h6 class="semi-transparent">Дата и время поездки</h6>
            <p> ${entryTimeFull}</p>
            <h6 class="semi-transparent">Стоимость</h6>
            <p> ${ticket.ticketPrice}.0 ₽</p>
            <img src="${qrCodeURL}" alt="QR-код" style="width: 400px; height: 400px; margin-top: 20px; margin-left: 12px;">
        </body>
        </html>
    `;

    const blob = new Blob([content], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ticket.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    const panel = document.getElementById("downloadPanel");
    const overlay = document.getElementById("overlay");
    panel.classList.remove("visible");
    overlay.classList.remove("visible");
}