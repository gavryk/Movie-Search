const searchForm = document.querySelector('#search-form');
const outPage = document.querySelector('#movies');
const link = 'https://api.themoviedb.org/3/search/multi?api_key=efea5188a7f43aa1303c12cb1ad8a604&language=ru&query=';   // API server
const urlPoster = 'https://image.tmdb.org/t/p/w500';                                                                    // API pictures


function apiSearch(event) {                                                                                             //submit function, search
    event.preventDefault();                                                                                             // Reset configuration, no restart page
    let inputText = document.querySelector('#search-text');                                                     // search value, input
    const inputValue = inputText.value;

    if(inputValue.trim().length === 0) {                                                                                // Check empty value
        outPage.innerHTML = `<h2 class="col-12 text-center text-danger">
                                Поле пошуку має містити символи!!!
                            </h2>`;
        return;
    }
    let server = link + inputValue;                                                                                     //

    inputText.value = '';                                                                                               // Reset input after submit
                                                                                                                        // Spinner
    outPage.innerHTML = `                                                                                                  
                <div class="lds-roller">                                                                               
                    <div></div>                                                                                        
                    <div></div>                                                                                       
                    <div></div>                                                                                        
                    <div></div>                                                                                         
                    <div></div>                                                                                        
                    <div></div>                                                                                        
                    <div></div>                                                                                        
                    <div></div>                                                                                        
                </div>                                                                                                 
    `;

    fetch(server)                                                                                                       // Fetch
        .then(function(response) {
            if(response.status !== 200) {
                return Promise.reject(response);
            }
            return response.json();
        })
        .then(function(output) {                                                                                //
            let inner = '';
            if(output.results.length === 0) {
                inner = `<h2 class="col-12 text-center text-primary">
                             Sorry, По вашому запиту нічого не знайдено.
                         </h2>`;
            }
            output.results.forEach((el) => {
                let nameItem = el.name || el.title,
                    poster = el.poster_path ? urlPoster + el.poster_path : './img/no-poster.jpg';
                    releaseDate = el.release_date || el.first_air_date || "Неизвестно",
                    description = el.overview || "",
                    rate = el.vote_average || "Неизвестно",
                    dataInfo = '';
                if(el.media_type !== 'person') {
                    dataInfo = `data-id="${el.id}}" data-type="${el.media_type}"`;
                }
                inner += `
                        <div class="col-12 item" ${dataInfo}>
                            <img src='${poster}' alt='${nameItem}' class="img_poster">
                            <div style="text-align: right; width: 100%;">
                                <span class="badge badge-dark" style="font-size: large;">Rate: ${rate}</span>
                            </div>
                            <h2>${nameItem}</h2>
                            <strong>(${releaseDate})</strong>
                            <p style="margin-right: 10px;">${description}</p>
                        </div>
                    `;
            });
            if (inner !== '') {
                outPage.innerHTML = inner;
            } else {
                outPage.innerHTML = 'По вашому запиту нічого не знайдено';
            }
            addEventMedia();
        })
        .catch(function(err) {
            outPage.innerHTML = 'Упс, щось пішло не так...';
            console.error('Error ' + err.status);
        });
}
searchForm.addEventListener('submit', apiSearch);                                                                  // Listener

function addEventMedia() {
    const media = outPage.querySelectorAll('.item');
    media.forEach((elem) => {
        elem.style.cursor = "pointer";
        elem.addEventListener('click', showFullInfo);
    })
}

function showFullInfo() {
    let url = '';
    if (this.dataset.type === 'movie') {
        url = `http://api.themoviedb.org/3/movie/${this.dataset.id}?api_key=efea5188a7f43aa1303c12cb1ad8a604&language=ru`
    } else if (this.dataset.type === 'tv') {
        url = `http://api.themoviedb.org/3/tv/${this.dataset.id}?api_key=efea5188a7f43aa1303c12cb1ad8a604&language=ru`
    } else {
        outPage.innerHTML = '<h2 class="col-12 text-center text-danger">' +
            'Виникла помилка, спробуйте пізніше.</h2>';
    }

    fetch(url)
        .then(function(response) {
            if(response.status !== 200) {
                return Promise.reject(response);
            }
            return response.json();
        })
        .then((output) => {
            console.log(output);
            let genres = '';
            output.genres.map((item) => genres += item.name + ', ');
            outPage.innerHTML = `
			                    <h4 class="col-12 text-center text-info mb-4">${output.name || output.title}</h4>
			                    <h5 class="col-12 text-center">Жанры: ${genres.trim().substring(0,genres.trim().length-1)}</h5>
			                    <div class="col-5">
				                    <img class="img-fluid img-thumbnail mb-4" src="${(output.poster_path)? `https://image.tmdb.org/t/p/w500${output.poster_path}`: './assets/no-poster.jpg' }" alt="${output.name || output.title}"/>
                                ${ (output.homepage) ? `<p class="text-center text-info mb-2"><a class="btn btn-primary" href="${output.homepage}" target="_blank">Официальная страница</a></p>` : ""}
				                ${ (output.imdb_id) ? `<p class="text-center text-info mb-2"><a  class="btn btn-primary" href="http://imdb.com/title/${output.imdb_id}" target="_blank">Страница на IMDB.com</a></p>` : ""}
			                    </div>
			                    <div class="col-7">
				                    <span class="badge badge-dark mb-2" style="font-size: medium;">Рейтинг: ${output.vote_average}</span>
				                    <p>${output.overview || "отсутствует"}</p>
				                    ${(output.last_episode_to_air)? `<p>${output.number_of_seasons} сезон ${output.last_episode_to_air.episode_number} серия(ий) вышла(и)</p>` : "" }
				                    <p>Статус: ${output.status}</p> 
			                    </div>
			        `
        })
        .catch((reason) => {
            outPage.innerHTML = 'Упс, щось пішло не так...';
            console.error(reason);
        })
}

document.addEventListener('DOMContentLoaded',() => {
    fetch('http://api.themoviedb.org/3/trending/all/week?api_key=efea5188a7f43aa1303c12cb1ad8a604&language=ru')
        .then((value) => {
            if (value.status !== 200) {
                return Promise.reject(value.status);
            }
            return value.json();
        })
        .then((output) => {
            let inner = '<h3 class="col-12 text-center text-info">Популярне за тиждень</h3>';
            if (output.results.length === 0) {
                inner = `<h3 class="col-12 text-center text-info">По вашому запиту нічого не знайдено</h3>`;
            }
            output.results.forEach(function (el) {
                let nameItem = el.name || el.title,
                    releaseDate = el.release_date || el.first_air_date || "Неизвестно",
                    poster = el.poster_path ? ("https://image.tmdb.org/t/p/w185" + el.poster_path) : './img/no-poster.jpg',
                    description = el.overview || "",
                    rate = el.vote_average || "Неизвестно",
                    mediaType = el.title ? "movie" : "tv",
                    dataInfo = `data-id="${el.id}}" data-type="${mediaType}"`;

                inner += `
						<div class="movie-item" ${dataInfo}>
							<img class="poster-film float-left" 
									 src="${poster}"
									 alt="${nameItem}"
							/>
							<div style="text-align: right; width: 100%;">
								<span class="badge badge-dark" style="font-size: large;">Rate: ${rate}</span>
							</div>
							<h4 class="text-left">${nameItem}</h4>
							<strong>(${releaseDate})</strong>
							<p style="margin-right: 10px;">${description}</p>
						</div>`;
            });
            if (inner !== '') {
                outPage.innerHTML = inner;
            } else {
                outPage.innerHTML = 'По вашему запросу ничего не найдено';
            }
            addEventMedia();
        })
        .catch((reason) => {
            outPage.innerHTML = 'Упс, щось пішло не так...';
            console.error(reason);
        })
});
