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
            let songId = data.response.docs[0].id;
            getLyrics(songId, key);
        })
        .catch(function (error) {
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
            console.log(data.mus[0].text);
            document.getElementById('lyrics').innerText = data.mus[0].text;
        })
        .catch(function (error) {
            console.error(error.message);
        });
}

