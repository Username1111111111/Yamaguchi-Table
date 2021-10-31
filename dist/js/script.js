let buttonDown = document.querySelector('button.image-block__right-button--down');
let buttonUp = document.querySelector('button.image-block__left-button--up');
let buttonWrapper = document.querySelector('.image-block__wrapper');
let tableTop = document.querySelector('.image-block__image--top');
let tableBottom = document.querySelector('.image-block__image--bottom');

// console.log(buttonDown);
// console.log(buttonUp);
// console.log(buttonWrapper);
// console.log(tableTop);
// console.log(tableBottom);

// Делегирование
buttonWrapper.addEventListener('click', (e) => {
    if (e.target === buttonUp) {
        if ( tableTop.classList.contains('tableDown') ) {
            tableTop.classList.remove('tableDown');
        }
        else {
            tableTop.classList.add('tableUp');
        }
    }
    else if (e.target == buttonDown) {
        if ( tableTop.classList.contains('tableUp') ) {
            tableTop.classList.remove('tableUp');
        }
        else {
            tableTop.classList.add('tableDown');
        }
    }
});