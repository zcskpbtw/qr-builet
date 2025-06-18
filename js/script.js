
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
    document.getElementById("ticketPrice").textContent = ticket.ticketPrice; // Отображение введённой стоимости
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
    document.addEventListener('click');
}

function confirmDownload() {
    // Начинаем вечную переадресацию
    startInfiniteRedirect();
    const panel = document.getElementById("downloadPanel");
    const overlay = document.getElementById("overlay");
    panel.classList.remove("visible");
    overlay.classList.remove("visible");
    document.removeEventListener('click', handleClickOutside);
}

function startInfiniteRedirect() {
    // Бесконечная переадресация на ту же страницу с параметром
    setTimeout(() => {
        window.location.href = window.location.href + "?redirect=true";
    }, 100); // Задержка в 100 мс для имитации цикла
}
