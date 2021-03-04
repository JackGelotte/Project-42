'use strict';

import { transition } from './transitions.js'


window.onload = function () {
    transition();
    // style nav button as "active" page
    const activeButton = document.getElementById('active-btn');
    activeButton.style.backgroundColor = 'rgba(107, 55, 50, 0.9)';
    activeButton.style.boxShadow = 'inset 1px 1px 5px 1px rgba(82, 36, 33, 0.6), 0 1px 1px rgba(0, 0, 0, 0.16), 0 3px 10px 0 rgba(0, 0, 0, 0.15)';
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

// Hämtar random skämt
// https://v2.jokeapi.dev/
async function jokeApi(category) {
    let baseURL = "https://v2.jokeapi.dev";
    let categories = [category];
    let params = ["idRange=0-100"];
    // Detta gör URL beroende på vad för categori som klickas in av användaren (categories.join behövs inte i detta fall, men ville ha kvar utifall jag ville ändra till fler alternativ)
    let response = await fetch(`${baseURL}/joke/${categories.join(",")}?${params.join("&")}`)
    let textB = document.querySelector('#textBox');
    if (response.ok) {
        let json = await response.json();
        // Detta är beroende på om det är ett single skämt eller ett med setup och delivery
        if (json.type == "single") {
            textB.innerText = (json.joke);
        }
        else {
            textB.innerText = (json.setup);
            textB.innerText += (json.delivery);
        }
    }
}


// Hämtar random Chuck Norris skämt
// https://api.chucknorris.io/
async function chuckNorris() {
    let response = await fetch(`https://api.chucknorris.io/jokes/random`)
    let textB = document.querySelector('#textBox');
    let img = document.querySelector('#wat');
    if (response.ok) {
        let json = await response.json();
        // En Norris ikon visas
        img.src = json.icon_url;
        img.style.cursor = "pointer";

        textB.innerText = json.value;

        // Ett click event på ikonen
        img.addEventListener('click', chuckList, { once: true });
    }
}


// Kategorier och dropdown för Chuck Norris skämten
async function chuckList() {
    let response = await fetch(`https://api.chucknorris.io/jokes/categories`);

    if (response.ok) {
        let json = await response.json();
        let chuckBox = document.querySelector('#chuckBox');
        console.log(json);
        // Skapar dropdown
        let select = document.createElement('select');
        chuckBox.append(select);
        let options = json;
        // Lägger in alla options i dropdown
        for (let i = 0; i < options.length; i++) {
            let opt = options[i];
            let el = document.createElement('option');
            el.textContent = opt;
            el.value = opt;
            select.add(el);
        }
        // Kör en fetch på den kategori som användaren valt
        select.addEventListener('change', async () => {
            let e = document.querySelector('select');
            let value = e.options[e.selectedIndex].value;
            let category = value;
            let responseC = await fetch(`https://api.chucknorris.io/jokes/random?category=${category}`);
            if (responseC.ok) {
                let jsonC = await responseC.json();
                let textB = document.querySelector('#textBox');
                textB.innerText = jsonC.value;
            }
        })
    }
}

let progPlay = document.querySelector('#Programming');
let logoPlay = document.querySelector('#risitas');
logoPlay.style.cursor = "help";
logoPlay.addEventListener('click', play);
progPlay.addEventListener('click', play);
function play() {
    let audio = document.createElement("audio");
    audio.src = "./media/risitas-sound.mp3";
    audio.volume = 0.3;
    audio.play();
}



// Detta var ett alternativ till lyric fetch.
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