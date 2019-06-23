const searchForm = document.querySelector('#search-form');
const outPage = document.querySelector('#movies');
const link = 'https://api.themoviedb.org/3/search/multi?api_key=efea5188a7f43aa1303c12cb1ad8a604&language=ru&query=';

//submit function, api search
function apiSearch(event) {
    let inputText = document.querySelector('#search-text');
    const inputValue = inputText.value;
    let server = link + inputValue;

    event.preventDefault();
    inputText.value = '';
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

    requestApi('GET', server)
        .then(function(result) {
            const output = JSON.parse(result);
            let inner = '';
            output.results.forEach((el) => {
                let nameItem = el.name || el.title;
                inner += `<div class="col-12 col-md-4">${nameItem}</div>`;
            });

            outPage.innerHTML = inner;
        })
        .catch(function(err) {
            outPage.innerHTML = 'Ooops...something wrong!!!';
            console.error('Error ' + err.status);
        });
}
searchForm.addEventListener('submit', apiSearch);


// server request function< promise
function requestApi(method, url) {
    return new Promise(function(resolve, reject) {
        const request = new XMLHttpRequest();
        request.open(method, url);

        request.addEventListener('load', () => {
            if(request.status !== 200) {
                reject({
                    status: request.status
                });
                return;
            }
            resolve(request.response);
        });

        request.addEventListener('error', () => {
            reject({
                status: request.status
            });
        });

        request.send();
    });
}
