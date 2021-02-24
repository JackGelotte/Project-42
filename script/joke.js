'use strict';




window.onload = function () {


}

window.addEventListener('DOMContentLoaded', () => {
    let cont = document.querySelector('#jokeApi');
    cont.addEventListener('click', btnEvent, false);
    function btnEvent(e) {
        if (e.target !== e.currentTarget) {
            if (e.target.id === 'chuck') {
                chuckNorris();
            } else {
                jokeApi(e.target.id);
            }
        }
        e.stopPropagation();
    }
})

// https://v2.jokeapi.dev/
async function jokeApi(category) {
    let baseURL = "https://v2.jokeapi.dev";
    let categories = [category];
    let params = ["idRange=0-100"];
    let response = await fetch(`${baseURL}/joke/${categories.join(",")}?${params.join("&")}`)
    let textB = document.querySelector('#textBox');
    if (response.ok) {
        let json = await response.json();

        if (json.type == "single") {
            textB.innerText = (json.joke);
        }
        else {
            textB.innerText = (json.setup);
            textB.innerText += (json.delivery);
        }
    }
}



// https://api.chucknorris.io/
async function chuckNorris() {
    let response = await fetch(`https://api.chucknorris.io/jokes/random`)
    let textB = document.querySelector('#textBox');
    let img = document.querySelector('#wat');
    if (response.ok) {
        let json = await response.json();
        img.src = json.icon_url
        textB.innerText = json.value;

        img.addEventListener('click', chuckList, { once: true });
    }
}
async function chuckList() {
    let response = await fetch(`https://api.chucknorris.io/jokes/categories`);

    if (response.ok) {
        let json = await response.json();
        let chuckBox = document.querySelector('#chuckBox');
        console.log(json);

        let select = document.createElement('select');
        chuckBox.append(select);
        let options = json;

        for (let i = 0; i < options.length; i++) {
            let opt = options[i];
            let el = document.createElement('option');
            el.textContent = opt;
            el.value = opt;
            select.add(el);
        }
    }
}







// om vi behöver
/* async function getLyric() {
    const key = '4294483c1fa9e154b8920e88d4e076a4';
    let response = await fetch(`https://api.vagalume.com.br/search.excerpt?q=&limit=15&apikey=${key}`);
    if (response.ok) {
        let json = await response.json();
        let para = document.querySelector('#para');
        console.log(json);

        let musid = json.response.docs[3].id;
        let getLyrics = await fetch(`https://api.vagalume.com.br/search.php?musid=${musid}&apikey=${key}`);
        if (getLyrics.ok) {
            let json2 = await getLyrics.json();
            console.log(json2.mus[0].text);
        }
    }
}*/