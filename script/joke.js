


let baseURL = "https://v2.jokeapi.dev";
let categories = ["Programming"];
let params = ["idRange=0-100"];

async function getJoke() {
    let textB = document.querySelector('#lyrics');
    let response = await fetch(`${baseURL}/joke/${categories.join(",")}?${params.join("&")}`)

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

async function getLyric() {
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
}