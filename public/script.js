const canvas = document.getElementById('whiteboard');
const context = canvas.getContext('2d');
const socket = io();

canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 20;

let drawing = false;
let currentPath = [];

canvas.addEventListener('mousedown', () => {
    drawing = true;
    currentPath = [];
});

canvas.addEventListener('mousemove', () => {
    if (currentPath.length > 0) {
        socket.emit('draw', currentPath);
        currentPath = [];
    }
    drawing = false;
    context.beginPath();
});

canvas.addEventListener('mousemove', (e) => {
    if (!drawing) return;

    const x = e.clientX - canvas.getBoundingClientRect().left;
    const y = e.clientY - canvas.getBoundingClientRect().top;

    context.lineWidth = 2;
    context.lineCap = 'round';
    context.strokeStyle = 'black';

    context.lineTo(x, y);
    context.stroke();
    context.beginPath();
    context.moveTo(x, y);

    currentPath.push({ x, y });
});

socket.on('draw', (data) => {
    if (Array.isArray(data) && data.length > 0) {
        context.lineWidth = 2;
        context.lineCap = 'round';
        context.strokeStyle = 'black';

        context.beginPath();
        context.moveTo(data[0].x, data[0].y);

        for (let i = 1; i < data.length; i++) {
            context.lineTo(data[i].x, data[i].y);
            context.stroke();
        }

        context.beginPath();
    }
});
