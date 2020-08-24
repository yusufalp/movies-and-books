let myArray, randomItem;

function fetchMovieResults(userSearchTitle) {
    //Searching IMDb API
    fetch(`https://movie-database-imdb-alternative.p.rapidapi.com/?page=1&r=json&s=${userSearchTitle}`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "movie-database-imdb-alternative.p.rapidapi.com",
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
    //Appending the movie results to the page
    let counter = 0;
    let movieTitle = '',
        movieYear = '',
        movieImageUrl = '';
    for (let i = 0; i < response.Search.length; i++) {
        if (response.Search[i].Type == 'movie') {
            movieTitle = response.Search[i].Title;
            if (response.Search[i].Year == undefined) {
                movieYear = '';
            } else {
                movieYear = response.Search[i].Year;
            }
            if (response.Search[i].Poster.startsWith("http")) {
                movieImageUrl = response.Search[i].Poster;
            } else {
                movieImageUrl = 'https://i.ya-webdesign.com/images/no-image-available-png-2.png'
            }

            $('#display-movies').append(`
                <li>
                    <img src='${movieImageUrl}' alt='poster'>
                    <p>${movieYear}</p>
                    <p class="results-title">${movieTitle}</p>
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
    //Appending the Book results to the page
    let counter = 0;
    let bookTitle = '',
        bookYear = '',
        bookImageUrl = '';
    for (let i = 0; i < response.items.length; i++) {
        bookTitle = response.items[i].volumeInfo.title;
        if (response.items[i].volumeInfo.publishedDate == undefined) {
            bookYear = '';
        } else {
            bookYear = response.items[i].volumeInfo.publishedDate;
        }
        if (response.items[i].volumeInfo.imageLinks == undefined) {
            bookImageUrl = 'https://i.ya-webdesign.com/images/no-image-available-png-2.png';
        } else {
            bookImageUrl = response.items[i].volumeInfo.imageLinks.smallThumbnail;
        }
        $('#display-books').append(`
                <li>
                    <img src='${bookImageUrl}' alt='poster'>
                    <p>${bookYear.substring(0, 4)}</p>
                    <p class="results-title">${bookTitle}</p>
                </li>
            `);
        counter++;
    }
    displayBookResults(counter);
}

function displayMovieResults(counter) {
    //At the top of the book search, show how many successful search are being shown
    $('.searching-movies').html(`Total Movies Showing: ${counter}`);
}

function displayBookResults(counter) {
    //At the top of the movie search, show how many successful search are being shown
    $('.searching-books').html(`Total Books Showing: ${counter}`);
}

function giveFeedbackOnSubmitBoth() {
    //Displays both movie and book results
    clearResultsAll();
    fetchBookResults(getUserSearchTitle());
    fetchMovieResults(getUserSearchTitle());
    $('.hidden').removeClass('hidden');
}

function giveFeedbackOnSubmitMovie() {
    //Displays movie results
    clearResultsAll();
    fetchMovieResults(getUserSearchTitle());
    $('#display-books').append(`<li class="random-book-message">${randomBookMessage}</li>`)
    $('.hidden').removeClass('hidden');
}

function giveFeedbackOnSubmitBook() {
    //Displays book results
    clearResultsAll();
    fetchBookResults(getUserSearchTitle());
    $('#display-movies').append(`<li class="random-movie-message">${randomMovieMessage}</li>`)
    $('.hidden').removeClass('hidden');
}

function clearSearchMessageResults() {
    //Clears the number of successful search section before making a new search
    $('.searching-movies').empty();
    $('.searching-books').empty();
}

function clearResultsAll() {
    //Clears the results section before making a new search
    $('#display-movies').html('');
    $('#display-books').html('');
}

function getUserSearchTitle() {
    //Gets the input from user
    let userEntry = $('#user-search-title').val();
    let userSearchTitle = userEntry.toLowerCase();
    return userSearchTitle;
}

function getRandomMessage() {
    //Create random message from the store.js to show if there is a no search in
    //one of the categories
    bookArray = STORE.randomBookMessagesList;
    movieArray = STORE.randomMovieMessagesList;
    randomBookMessage = bookArray[Math.floor(Math.random() * bookArray.length)];
    randomMovieMessage = movieArray[Math.floor(Math.random() * movieArray.length)];
}

function waitForSubmit() {
    $('form').submit(e => {
        e.preventDefault();
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

function eventListener() {
    //On smaller screens, shows a collapsable button to hide the results at first
    $('.collapse-button-movie').on('click', e => {
        $('#display-movies').toggleClass('mobile-collapse')
    });
    $('.collapse-button-books').on('click', e => {
        $('#display-books').toggleClass('mobile-collapse')
    });
}

function render() {
    waitForSubmit();
    eventListener();
}

$(render);