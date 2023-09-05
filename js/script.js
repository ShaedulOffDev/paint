const canvas = document.querySelector('canvas'),
toolBtns = document.querySelectorAll('.tool'),
fillColor = document.querySelector('#fill-color'),
sizer = document.querySelector('#size-slider'),
colorBtns = document.querySelectorAll('.colors .option'),
colorPicker = document.querySelector('#color-picker'),
clearCanvasBtn = document.querySelector('.clear-canvas'),
saveImageBtn = document.querySelector('.save-img');

let ctx = canvas.getContext('2d')

function canvasBg(){
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = penColor
}

window.addEventListener('load', () => {
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    canvasBg()
})

var isDraw = 0,
currentLocation = 0,
brushWidth = 5,
selectedTool = 'brush',
prevMouseX,
prevMouseY,
snapshot,
penColor = '#000';

const drawRectangle = e => {
    !fillColor.checked 
    ? ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY)
    : ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY)
}
const drawTriangle = e => {
    ctx.beginPath()
    ctx.moveTo(prevMouseX, prevMouseY)
    ctx.lineTo(e.offsetX, e.offsetY)
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY)
    ctx.closePath()
    fillColor.checked ? ctx.fill() : ctx.stroke()
}
const drawCircle = e => {
    ctx.beginPath()
    const radius = Math.sqrt(Math.pow(prevMouseX - e.offsetX, 2)) + Math.pow(prevMouseY - e.offsetY, 2)
    ctx.arc(prevMouseX, prevMouseY, radius / 10, 0, 2 * Math.PI)
    fillColor.checked ? ctx.fill() : ctx.stroke()
}

const drawing = e => {
    if(!isDraw) return
    ctx.fillColor = penColor
    ctx.putImageData(snapshot, 0, 0)
    switch(selectedTool){
        case 'brush':
            ctx.lineTo(e.offsetX, e.offsetY)
            ctx.stroke()
            break
        case 'rectangle':
            drawRectangle(e)
            break
        case 'triangle':
            drawTriangle(e)
            break
        case 'circle':
            drawCircle(e)
            break
        case 'eraser':
            ctx.strokeStyle = '#fff'
            ctx.lineTo(e.offsetX, e.offsetY)
            ctx.stroke()
            break
        default:
            break
    }
}

canvas.addEventListener('mousemove', drawing)
canvas.addEventListener('mouseleave', mouseLeave)
canvas.addEventListener('mousedown', mouseDown)
canvas.addEventListener('mouseup', mouseUp)

function mouseDown(e){
    isDraw = 1
    prevMouseX = e.offsetX
    prevMouseY = e.offsetY
    ctx.beginPath()
    ctx.strokeStyle = penColor
    ctx.fillStyle = penColor
    ctx.lineWidth = brushWidth
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height)
}
function mouseUp(){
    isDraw = 0
}
function mouseLeave(){
    isDraw = 0
}

toolBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector(".options .active").classList.remove('active')
        btn.classList.add('active')
        selectedTool = btn.id
    })
})

sizer.addEventListener('change', () => {
    brushWidth = sizer.value
})

colorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.colors .selected').classList.remove('selected');
        btn.classList.add('selected')
        const bgColor = window.getComputedStyle(btn).getPropertyValue('background-color')
        penColor = bgColor
    })
})
colorPicker.addEventListener('change', () => {
    colorPicker.parentElement.style.backgroundColor = colorPicker.value
    colorPicker.parentElement.click()
    penColor = colorPicker.value
})

clearCanvasBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
})
saveImageBtn.addEventListener('click', () => {
    const link = document.createElement('a')
    link.download = `Pain${Date.now()}.jpg`;
    link.href = canvas.toDataURL()
    link.click()
})