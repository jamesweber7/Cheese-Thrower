[...document.getElementsByClassName('load-cheese-button')].forEach(btn => {
    btn.addEventListener('click', () => {
        tellTabToLoadCheeses(Number.parseInt(btn.getAttribute('count')));
    })
})