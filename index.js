let myArray, randomItem;

function fetchMovieResults(userSearchTitle) {
    fetch(`https://imdb8.p.rapidapi.com/title/auto-complete?q=${userSearchTitle}`, {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "imdb8.p.rapidapi.com",
                "x-rapidapi-key": "a99206a677msh1633721d3249f95p1cd95ejsn47728a24b280"
            }
        })
        .then(res => res.json())
        .then(response => {
            movieResults(response);
        })
        .catch(err => {
            console.log(err);
        });
}

function movieResults(response) {
    let counter = 0;
    let movieTitle = '',
        movieYear = '',
        movieImageUrl = '';
    for (let i = 0; i < response.d.length; i++) {
        if (response.d[i].q == 'feature') {
            movieTitle = response.d[i].l;
            if (response.d[i].y == undefined) {
                movieYear = '';
            } else {
                movieYear = response.d[i].y;
            }
            if (response.d[i].i == undefined) {
                movieImageUrl = 'https://i.ya-webdesign.com/images/no-image-available-png-2.png'
            } else {
                movieImageUrl = response.d[i].i.imageUrl;
            }

            $('#display-movies').append(`
                <li>
                    <img src='${movieImageUrl}' alt='poster'>
                    <p>${movieTitle}</p>
                    <p>${movieYear}</p>
                </li>
            `);
            counter++;
        }
    }
    displayMovieResults(counter);
}

//------

function fetchBookResults(userSearchTitle) {
    // Searching Google Book API
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${userSearchTitle}&api_key=AIzaSyDyNOOjF-2YUwE5IeyZTbVT6_XpS737mII`)
        .then(res => res.json())
        .then(response => {
            bookResults(response)
        })
        .catch(err => {
            console.log(err)
        });
}

function bookResults(response) {
    let counter = 0;
    let bookTitle = '',
        bookYear = '',
        bookImageUrl = '';
    for (let i = 0; i < response.items.length; i++) {
        bookTitle = response.items[i].volumeInfo.title;
        bookYear = response.items[i].volumeInfo.publishedDate;
        if (response.items[i].volumeInfo.imageLinks == undefined) {
            bookImageUrl = 'https://i.ya-webdesign.com/images/no-image-available-png-2.png';
        } else {
            bookImageUrl = response.items[i].volumeInfo.imageLinks.smallThumbnail;
        }
        $('#display-books').append(`
                <li>
                    <img src='${bookImageUrl}' alt='poster'>
                    <p>${bookTitle}</p>
                    <p>${bookYear}</p>
                </li>
            `);
        counter++;
    }
    displayBookResults(counter);
}

function displayMovieResults(counter) {
    $('.searching-movies').html(`Total Movies Showing: ${counter}`);
}

function displayBookResults(counter) {
    $('.searching-books').html(`Total Books Showing: ${counter}`);
}

function clearSearchMessageBeforeNew() {
    $('.searching').empty();
}

function clearSearchMessageResults() {
    $('.searching-movies').empty();
    $('.searching-books').empty();
}

function clearResultsAll() {
    $('#display-movies').html('');
    $('#display-books').html('');
}

function giveFeedbackOnSubmitBoth() {
    // $('.searching').html(`Searching movies and books for "${getUserSearchTitle()}"`);
    clearResultsAll();
    fetchBookResults(getUserSearchTitle());
    fetchMovieResults(getUserSearchTitle());
    $('.searching').empty();
    $('.hidden').removeClass('hidden');
    // console.log(randomBookMessage);
}

function giveFeedbackOnSubmitMovie() {
    // $('.searching').html(`Searching movies for "${getUserSearchTitle()}"`);
    clearResultsAll();
    fetchMovieResults(getUserSearchTitle());
    $('.searching').empty();
    $('#display-books').append(`<li>${randomBookMessage}</li>`)
    $('.hidden').removeClass('hidden');
}

function giveFeedbackOnSubmitBook() {
    // $('.searching').html(`Searching books for "${getUserSearchTitle()}"`);
    clearResultsAll();
    fetchBookResults(getUserSearchTitle());
    $('.searching').empty();
    $('#display-movies').append(`<li>${randomMovieMessage}</li>`)
    $('.hidden').removeClass('hidden');
}

function getUserSearchTitle() {
    let userEntry = $('#user-search-title').val();
    let userSearchTitle = userEntry.toLowerCase();
    return userSearchTitle;
}

function waitForSubmit() {
    $('form').submit(e => {
        e.preventDefault();
        clearSearchMessageBeforeNew();
        clearSearchMessageResults();
        getRandomMessage();
        if ($('#radio-movie').is(':checked')) {
            giveFeedbackOnSubmitMovie();
        } else if ($('#radio-books').is(':checked')) {
            giveFeedbackOnSubmitBook();
        } else {
            giveFeedbackOnSubmitBoth();
        }
    })
}

function getRandomMessage() {
    bookArray = STORE.randomBookMessagesList;
    movieArray = STORE.randomMovieMessagesList;
    randomBookMessage = bookArray[Math.floor(Math.random() * bookArray.length)];
    randomMovieMessage = movieArray[Math.floor(Math.random() * movieArray.length)];
}

function render() {
    waitForSubmit();
}

$(render);