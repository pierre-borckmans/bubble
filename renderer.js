const app = require('electron').remote.app;
const window = require('electron').remote.getCurrentWindow();
let bubble = document.querySelector('.bubble');
let frame = document.querySelector('.frame');
let counter = document.querySelector('.counter');
let iter = 0;
let transparency = 0.2;
let counterText = 30;

updateCounter();
reset();

function toggleClass(el, cls) {
    if (el.classList.contains(cls)) {
        el.classList.remove(cls);
    } else {
        el.classList.add(cls);
    }
}

function reset() {
    iter = 0;
    if (bubble.classList.contains('bubble_animated')) {
        bubble.classList.remove('bubble_animated');
        bubble.offsetWidth;
    }
    bubble.classList.add('bubble_animated');
    if (!bubble.classList.contains('paused')) {
        bubble.classList.add('paused');
    }
    updateCounter();
}

function togglePause() {
    toggleClass(bubble, 'paused');
}

function updateCounter() {
    counterText = ""+(30-iter);
    update();
}

function increaseTransparency() {
    transparency = Math.max(0, transparency - 0.1);
    update();
}

function decreaseTransparency() {
    transparency = Math.min(1, transparency + 0.1);
    update();
}

function update() {
    counter.textContent = counterText;
    bubble.style.opacity = transparency;
    frame.style.opacity = transparency;
    counter.style.opacity = transparency;
}

bubble.addEventListener('animationiteration', () => {
    iter = iter+1;
    updateCounter();
    if (iter==30) { 
        reset();
    }
});

frame.addEventListener('click', () => {
});

frame.addEventListener('dblclick', () => {
    reset();
});

document.addEventListener('keydown', (event) => {
    const code = event.code;
    const key = event.key;
    if (key === '+') {
        decreaseTransparency();
    }
    if (key === '-') {
        increaseTransparency();
    }
    if (code === 'Space') {
        togglePause();
    }
    if (code === 'Enter') {
        reset();
    }
    if (code === 'Escape') {
        window.hide();
    }
});