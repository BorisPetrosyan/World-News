// Custom Http Module
function customHttp() {
    return {
        get(url, cb) {
            try {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', url);
                xhr.addEventListener('load', () => {
                    if (Math.floor(xhr.status / 100) !== 2) {
                        cb(`Error. Status code: ${xhr.status}`, xhr);
                        return;
                    }
                    const response = JSON.parse(xhr.responseText);
                    cb(null, response);
                });

                xhr.addEventListener('error', () => {
                    cb(`Error. Status code: ${xhr.status}`, xhr);
                });

                xhr.send();
            } catch (error) {
                cb(error);
            }
        },
        post(url, body, headers, cb) {
            try {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', url);
                xhr.addEventListener('load', () => {
                    if (Math.floor(xhr.status / 100) !== 2) {
                        cb(`Error. Status code: ${xhr.status}`, xhr);
                        return;
                    }
                    const response = JSON.parse(xhr.responseText);
                    cb(null, response);
                });

                xhr.addEventListener('error', () => {
                    cb(`Error. Status code: ${xhr.status}`, xhr);
                });

                if (headers) {
                    Object.entries(headers).forEach(([key, value]) => {
                        xhr.setRequestHeader(key, value);
                    });
                }

                xhr.send(JSON.stringify(body));
            } catch (error) {
                cb(error);
            }
        },
    };
}
// Init http module
const http = customHttp();

const newsService = (function() {
    const apiKey = '9195d644e7e14da3a162fcfe0339887a';
    const apiUrl = 'https://news-api-v2.herokuapp.com';

    return {
        topHeadlines(country = 'ua', cb) {
            http.get(`${apiUrl}/top-headlines?country=${country}&apiKey=${apiKey}`, cb);
        },
        everyThing(query, cb) {
            http.get(`${apiUrl}/everything?q=${query}&apiKey=${apiKey}`, cb);
        }

    }
})();

// elements

const form = document.forms['newsControls'];
const countrySelect = form.elements['country'];
const searchInput = form.elements['search'];

form.addEventListener('submit', e => {
    e.preventDefault();
    loadNews();

})

//  init selects
document.addEventListener('DOMContentLoaded', function() {
    M.AutoInit();
    loadNews();
});


//load news




// Load news function 
function loadNews() {
    showLoader();
    const country = countrySelect.value;
    const searchText = searchInput.value;
    if (!searchText) {
        newsService.topHeadlines(country, onGetResponse);
    } else {
        newsService.everyThing(searchText, onGetResponse);
    }

}

// function on get response from server
function onGetResponse(err, res) {
    const newsContainer = document.querySelector('.news-container .row');
    removeReloader()
    if (err) {
        showAlert(err, 'error-msg');
        return;
    }
    if (!res.articles.length) {

        clearContainer(newsContainer)
        showAlert('no News', 'error-msg');

        return;
    }
    //show emty message                  Homework


    renderNews(res.articles)
}

// function render News

function renderNews(news) {
    const newsContainer = document.querySelector('.news-container .row');
    if (newsContainer.children.length) {
        clearContainer(newsContainer)
    }
    let fragment = ''
    news.forEach(newsItem => {
        const el = newsTemplate(newsItem)
        fragment += el;
    });

    newsContainer.insertAdjacentHTML('afterbegin', fragment);
}

// function  Clear Container

function clearContainer(container) {
    // container.innerHTML = '';
    let child = container.lastElementChild;
    while (child) {
        container.removeChild(child)
        child = container.lastElementChild;
    }
}

//news iteom template function

function newsTemplate({ urlToImage, title, url, descrition }) {

    return `
    <div class="col s12">
      <div class=card>
        <div class="card-image">
          <img src="${urlToImage}">
          <span class="card-title"> ${title || ''}</span>
        </div>
        <div class = "card-content">
          <p>${descrition || ''}</p>
        </div>
          <a href="${url}">Read more</a>
     </div>
  </div> 
    `
}

function showAlert(msg, type = 'success') {
    M.toast({ html: msg, classes: type })
}

// show loader function

function showLoader() {
    document.body.insertAdjacentHTML(
        'afterbegin',
        `
        <div class="progress">
          <div class="indeterminate"></div>
        </div>
      `,
    );
}

// remove loader function 
function removeReloader() {
    const loader = document.querySelector('.progress')
    if (loader) {
        loader.remove();
    }
}