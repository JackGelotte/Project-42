'use strict';
import { transition } from './transitions.js';

window.onload = function () {
    transition();
    // style nav button as "active" page
    const activeButton = document.getElementById('active-btn');
    activeButton.style.backgroundColor = 'rgba(39, 90, 83, 0.9)';
    activeButton.style.boxShadow = 'inset 1px 1px 5px 1px rgba(25, 56, 52, 0.6), 0 1px 1px rgba(0, 0, 0, 0.16), 0 3px 10px 0 rgba(0, 0, 0, 0.15)';

    const searchBtn = document.getElementById('searchBtn');
    const key = '4294483c1fa9e154b8920e88d4e076a4';
    searchBtn.onclick = function () {
        // gömmer lyrics-container när en ny sökning görs
        document.querySelector('#lyrics-container').style.display = 'none';

        // kalla på funktion som gör sökning med user input
        const input = document.getElementById('searchBar').value;
        const searchWords = input.split(' ').join('%20');
        getSongs(searchWords, key);

    }
}

function getSongs(searchWords, key) {
    // se till att error-meddelande inte visas på default
    document.getElementById('error-msg').style.visibility = 'hidden';

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

            // printar ut sökresultat som länkar
            printSongResults(songArr, key, length);
        })
        .catch(function (error) {
            console.log(error.message);
            document.getElementById('error-msg').style.visibility = 'visible';
            document.getElementById('error-msg').innerHTML = 'Could not find any song that matches your search, try again!';
        });
}

function printSongResults(songArr, key, length) {
    const titleLinks = document.getElementById('title-links');
    document.getElementById('search-title').innerText = '';

    for (let i = 0; i < length; i++) {
        if (document.getElementById('song-link' + i)) {
            document.getElementById('song-link' + i).remove();
        }
    }

    for (let i = 0; i < length; i++) {
        let band = songArr[i].band;
        let song = songArr[i].title;
        // hämtar ut song id
        let songId = songArr[i].id;
        // skapar en länk
        let songLink = document.createElement('a');
        // sätter id på länken för att kunna komma åt den
        songLink.id = 'song-link' + i;
        // sätter länkens text till låt-titel
        songLink.innerText = band + ' - ' + song;
        // placerar länken i länk-klassen
        titleLinks.appendChild(songLink);
        // lägger till click-event för specifik låt (som printar lyrics)
        songLink.addEventListener('click', function () {
            document.querySelector('#lyrics-container').style.display = 'flex';
            getLyrics(songId, key);
            embedVideo(band, song);
        })
    }
}

function embedVideo(band, song) {
    const youtubeKey = 'AIzaSyAMElWV5YhXPfB9z_DVSlgYTN_GM-CzXrk';
    const video = document.getElementById('video');
    // en replace box som visas om video inte hittas
    const videoReplace = document.getElementById('video-replace');

    fetch('https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=' + band + song + '&type=video&videoEmbeddable=true&key=' + youtubeKey)
        .then(function (response) {
            if (response.ok) {
                console.log(response);
                return response.json();
            }
        })
        .then(function (data) {
            console.log(data);
            let videoId = data.items[0].id.videoId;
            video.style.display = 'block';
            videoReplace.style.display = 'none';
            video.data = 'https://www.youtube.com/embed/' + videoId;
        })
        .catch(function (error) {
            // göm video och visa felmeddelande-box
            video.style.display = 'none';
            videoReplace.style.display = 'block';
            console.error(error.message);
        });
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
            document.getElementById('lyrics').innerText = data.mus[0].text;
            document.getElementById('search-title').innerText = data.mus[0].name;
        })
        .catch(function (error) {
            console.error(error.message);
        });
}

