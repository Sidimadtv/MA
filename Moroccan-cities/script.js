let counter =  0;
console.log('Created By Youssef Ghafir !')
window.addEventListener('load',()=> {
    slide = document.querySelector('.slide');
    load = document.querySelector('.loader_container');
    load.classList.add('hidden');
    slide.children[1].classList.remove('ac');
    slide.children[2].classList.remove('ac');
    // 
    let info = [
    ['Dem','nate','images/demnate.jpg'],
    ['Imin','ifri','images/iminifri.jpeg'],
    ['Chefch','aouen','images/chefchaouen.jpg'],
    ['Casab','lanca','images/casa.jpg'],
    ['Marra','kech','images/Marrakech.jpg'],
    ['Des','ert','images/desert.jpg'],
    ['Rab','at','images/rabat.jpg'],
    ['Essao','uira','images/essaouira.jpg'],
    ['Sa','fi','images/safi.jpg'],
    ['Tan','ger','images/tanger.jpg'],
    ['Benim','ellal','images/Beni.jpg'],
    ['Teto','uan','images/tetouan.jpg'],
    ['Ouarz','azate','images/ouarzazate.jpg'],
    ['Zag','ora','images/Zagora.jpg']
];
// ============================
// =============================
let time = 6500;
    function Auto_Play_Next() {
        if (counter == info.length - 1) {
            clearInterval(b);
            c = setInterval(() => {
                Auto_Play_Previous();
            }, time);
        }
        counter++;
        CheckClass(0);   
        next();
    }
    function Auto_Play_Previous() {
        counter--
        CheckClass(1);
        previous();
        if (counter == 0) {
            clearInterval(c);
            b = setInterval(() => {
                Auto_Play_Next();
            },time);
        }
    }
    let   c = setInterval(() => {
        Auto_Play_Previous();
    }, time);
    let b = setInterval(() => {
        Auto_Play_Next();
    },time);

// =============================
    let arrow_btn = document.querySelector('.arrow_btn');
    arrow_btn.children[1].addEventListener('click',()=> {
        counter++;
        clearInterval(b)
        clearInterval(c)
        CheckClass(0);   
        next();
    })
    arrow_btn.children[0].addEventListener('click',()=> { 
        counter--
        clearInterval(b)
        clearInterval(c)
        CheckClass(1);
        previous();
    })
    function CheckClass(i) {
        if( arrow_btn.children[i].classList.contains('active')) {
            arrow_btn.children[i].classList.remove('active');
        }
    }
    function ChnageImage() {
        slide.children[0].src = info[counter][2];
        slide.children[1].children[0].textContent = info[counter][0]
        slide.children[2].children[0].textContent = info[counter][1]
        slide.children[1].classList.add('ac');
        slide.children[2].classList.add('ac');
    }
    function loadShow() {
        load.classList.remove('hidden');
       setTimeout(() => {
        load.classList.add('hidden');
        slide.children[1].classList.remove('ac');
        slide.children[2].classList.remove('ac');
       },2000);
    }
    function next() {
        if (counter === info.length - 1) {
            arrow_btn.children[1].classList.add('active');
        }
        if(counter < info.length ) {   
            ChnageImage();  
            loadShow()           
        }else {
            counter = info.length - 1;
        }
    }
    function previous() {
        if (counter === 0) {
            arrow_btn.children[0].classList.add('active');
        }
        if(counter >= 0) {
            loadShow()
            ChnageImage();
        }else {
            counter = 0
        }
    }
})
