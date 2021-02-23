'use strict';

window.onload = function () {
    const searchBtn = document.getElementById('searchBtn');
    const key = '4294483c1fa9e154b8920e88d4e076a4';

    searchBtn.onclick = function () {
        document.getElementById('lyrics').innerText = "";
        const input = document.getElementById('searchBar').value;
        const searchWords = input.split(' ').join('%20');
        getSong(searchWords, key);
    }
}

function getSong(searchWords, key) {
    fetch('https://api.vagalume.com.br/search.excerpt?q=' + searchWords + '&limit=5&apikey=' + key)
        .then(function (response) {
            if (response.ok) {
                console.log(response);
                return response.json();
            }
        })
        .then(function (data) {
            console.log(data);
            console.log(data.response.docs[0].id);

            // gör en array där alla låtar i sökningen läggs till
            const songArr = [];
            const length = data.response.docs.length;

            for (let i = 0; i < length; i++) {
                songArr.push(data.response.docs[i]);
            }

            // kallar på funktion som printar ut sökresultat
            printSongResults(songArr, key, length);
        })
        .catch(function (error) {
            console.error(error.message);
        });
}

function printSongResults(songArr, key, length) {
    const titleLinks = document.getElementById('title-links');

    for (let i = 0; i < length; i++) {
        if (document.getElementById('song-link' + i)) {
            document.getElementById('song-link' + i).remove();
        }
    }

    for (let i = 0; i < length; i++) {
        // hämtar ut song id
        let songId = songArr[i].id;
        // skapar en länk
        let songLink = document.createElement('a');
        // sätter id på länken för att kunna komma åt den
        songLink.id = 'song-link' + i;
        // sätter länkens text till låt-titel
        songLink.innerText = songArr[i].band + ' - ' + songArr[i].title;
        // placerar länken i länk-klassen
        titleLinks.appendChild(songLink);
        // lägger till click-event för specifik låt (som printar lyrics)
        songLink.addEventListener('click', function () {
            getLyrics(songId, key);
        })
    }
}

function getLyrics(songId, key) {
    fetch('https://api.vagalume.com.br/search.php?musid=' + songId + '&apikey=' + key)
        .then(function (response) {
            if (response.ok) {
                console.log(response);
                return response.json();
            }
        })
        .then(function (data) {
            console.log(data);
            console.log(data.mus[0].text);
            document.getElementById('title-links').style.display = 'hidden';
            document.getElementById('lyrics').innerText = data.mus[0].text;
            document.getElementById('search-title').innerText = data.mus[0].name;
        })
        .catch(function (error) {
            console.error(error.message);
        });
}

