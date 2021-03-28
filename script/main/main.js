// Ключ API (v3 auth)
// 1e3a472af4792bf13cd4eb68da49d5a4

// Пример API-запроса
// https://api.themoviedb.org/3/movie/550?api_key=1e3a472af4792bf13cd4eb68da49d5a4

// Ключ доступа к API (v4 auth)
// eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZTNhNDcyYWY0NzkyYmYxM2NkNGViNjhkYTQ5ZDVhNCIsInN1YiI6IjVlY2Q2Yzk0NzczOTQxMDAxZDA5NmJkMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.6UcZR1k5KM_WHHlVhU-uEscOvy0CGAZ6RxlusFVcLTo


const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2/';

const leftMenu = document.querySelector('.left-menu'),
    hamburger = document.querySelector('.hamburger'),
    tvShowList = document.querySelector('.tv-shows__list'),
    modal = document.querySelector('.modal'),
    tvShows = document.querySelector('.tv-shows'),
    tvCardImg = document.querySelector('.tv-card__img'),
    modalTitle = document.querySelector('.modal__title'),
    genresList = document.querySelector('.genres'),
    rating = document.querySelector('.rating'),
    description = document.querySelector('.description'),
    modalLink = document.querySelector('.modal__link'),
    searchForm = document.querySelector('.search__form'),
    searchFormInput = document.querySelector('.search__form-input');

//console.log(tvCardImg);
const loading = document.createElement('div');
loading.className = 'loading';
// console.log(loading);


const DBService = class {

    constructor() {
        this.API_KEY = '1e3a472af4792bf13cd4eb68da49d5a4';
        this.SERVER = '​https://api.themoviedb.org/3';
    }

    getData = async(url) => {
        console.log(url);
        const res = await fetch(url);
        if (res.ok) {
            return res.json();
        } else {
            throw new Error(`Не удалось получить данные по адресу ${url}`)
        }
    }

    getTestData = () => {
        return this.getData('test.json');
    }

    getTestCard = () => {
        return this.getData('card.json');
    }

    getSearchResult = query => this
        .getData(`${this.SERVER}/search/tv?api_key=${this.API_KEY}&language=ru-RU&query=${query}`);

    // getSearchResult = query => {
    //     // let url = this.SERVER + '/search/tv?api_key=' + this.API_KEY +
    //     //     '&language=ru-RU&query=' + query;
    //     // url = this.SERVER + '/search/tv?api_key=' + this.API_KEY +
    //     //     '&query=' + query + '&language=ua-UA&include_adult=false';
    //     return this.getData(this.SERVER + '/search/tv?api_key=' + this.API_KEY +
    //         '&query=' + query + '&language=ua-UA&include_adult=false');
    // }
}
console.log(new DBService().getSearchResult('няня'));
// getTvShow = id => {
//     return this.getData(this.SERVER + '​/tv/' + id +
//         'api_key=' + API_KEY + '&language=ru-RU');
// }

const renderCard = response => {
    //console.log(response.results);
    tvShowList.textContent = '';

    response.results.forEach(item => {
        //console.log(item);

        const {
            backdrop_path: backdrop,
            name: title,
            poster_path: poster,
            vote_average: vote
        } = item;

        const posterIMG = poster ? IMG_URL + poster : 'img/no-poster.jpg';
        // если нет backdrop то не добавляем ничего
        const backdropIMG = backdrop ? IMG_URL + backdrop : '';
        // если нет voteElem то не добавляем span
        // console.log(typeof vote) = number
        const voteElem = vote ? `<span class="tv-card__vote" > ${vote} </span>` : '';

        const card = document.createElement('li');
        card.classList.add('tv-shows__item');
        //card.className = 'tv-shows__item';
        card.innerHTML = `
            <a href="#" class="tv-card">
                ${voteElem}
                <img class="tv-card__img" 
                src="${posterIMG}"
                data-backdrop="${backdropIMG}" 
                alt="${title}">
                <h4 class="tv-card__head">${title}</h4>
            </a>
         `;
        // ??? tvShowList.prepend(card);
        loading.remove();
        tvShowList.append(card);
        //console.log(card);
    })
}

searchForm.addEventListener('submit', event => {
    event.preventDefault();
    console.log();
}); {
    tvShows.append(loading);
    new DBService().getTestData().then(renderCard);
}
// открыть/закрыть меню
hamburger.addEventListener('click', () => {
    leftMenu.classList.toggle('openMenu');
    hamburger.classList.toggle('open');
});

document.addEventListener('click', event => {
    const target = event.target;
    if (!target.closest('.left-menu')) {
        leftMenu.classList.remove('openMenu');
        hamburger.classList.remove('open');
    }
});

leftMenu.addEventListener('click', event => {
    const target = event.target;
    const dropdown = target.closest('.dropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
        leftMenu.classList.add('openMenu');
        hamburger.classList.add('open');
    }
});

// открытие модального окна
tvShowList.addEventListener('click', event => {
    event.preventDefault();

    const target = event.target;
    const card = target.closest('.tv-card');
    //console.log(modal);
    if (card) {

        // открыть preload
        new DBService().getTestCard()
            .then(data => {
                console.log(data);
                if (data.poster_path) {
                    tvCardImg.src = IMG_URL + data.poster_path;
                    tvCardImg.alt = data.name;
                } else {
                    document.querySelector('.image__content').classList.toggle('hide');
                }
                modalTitle.textContent = data.name;
                // genresList.innerHTML(data.genres.reduce((acc, item) => `${acc}<li>${ucFirst(item.name)}</li>`, ''));
                genresList.textContent = '';
                // genresList.forEach(item => {
                //     genresList.innerHTML += `<li>${item.name}</li>`;
                // });
                // for быстрее, чем forEach
                for (const item of data.genres) {
                    genresList.innerHTML += `<li>${item.name}</li>`;
                }
                rating.innerHTML = data.vote_average;
                description.innerHTML = data.overview;
                modalLink.href = data.homepage;
            })
            .then(() => {
                document.body.style.overflow = 'hidden';
                modal.classList.remove('hide');
            });

        // скрыть прелоудер
    }
});

modal.addEventListener('click', event => {
    if (event.target.closest('.cross') ||
        event.target.classList.contains('modal')) {
        document.body.style.overflow = '';
        modal.classList.add('hide');
    }
});

// смена карточки
const changeImage = event => {
    const card = event.target.closest('.tv-shows__item');
    if (card) {
        const img = card.querySelector('.tv-card__img');
        // const changeImg = img.dataset.backdrop;
        // if (changeImg) {
        //     console.log(img.src);
        //     img.dataset.backdrop = img.src;
        //     img.src = img.dataset.backdrop;
        // }

        if (img.dataset.backdrop) {
            [img.dataset.backdrop, img.src] = [img.src, img.dataset.backdrop];
        }
    }
};
tvShowList.addEventListener('mouseover', changeImage);
tvShowList.addEventListener('mouseout', changeImage);