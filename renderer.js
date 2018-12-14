function toggleClass(el, cls) {
    if (el.classList.contains(cls)) {
        el.classList.remove(cls);
    } else {
        el.classList.add(cls);
    }
}

document.querySelector('.frame').addEventListener('click', () => {
    let bubble = document.querySelector('.bubble');
    toggleClass(bubble, 'paused')
})

document.querySelector('.frame').addEventListener('dblclick', () => {
    let bubble = document.querySelector('.bubble');
    if (bubble.classList.contains('bubble_animated')) {
        bubble.classList.remove('bubble_animated');
        bubble.offsetWidth;
    }
    bubble.classList.add('bubble_animated');
})