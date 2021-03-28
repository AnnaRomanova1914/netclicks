// добавить ютуб превью ролики
// добавить расширенную пагинацию + пагинацию на формы с меню
// пагинацию поднять наверх
// при наведении на меню курсор менять на пальчик
// подключить RestFullAPI, чтобы сделать 
// добавить в остальные запросы строку поиска, чтобы вывести пагинацию
// говорит, что это примерно на 1 час + оптимизация на 1 час



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
    searchFormInput = document.querySelector('.search__form-input'),
    preloader = document.querySelector('.preloader'),
    dropdown = document.querySelectorAll('.dropdown'),
    tvShowsHead = document.querySelector('.tv-shows__head'),
    posterWrapper = document.querySelector('.poster__wrapper'),
    modalContent = document.querySelector('.modal__content'),
    pagination = document.querySelector('.pagination'),
    trailer = document.getElementById('trailer'),
    headTrailer = document.getElementById('headTrailer');

const loading = document.createElement('div');
loading.className = 'loading';


const DBService = class {

    constructor() {
        this.API_KEY = '1e3a472af4792bf13cd4eb68da49d5a4';
        this.SERVER = 'https://api.themoviedb.org/3';
    }

    getData = async(url) => {
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

    getSearchResult = query => {
        this.temp = `${this.SERVER}/search/tv?api_key=${this.API_KEY}&language=ru-RU&query=${query}`;
        return this.getData(this.temp);
    }

    getNextPage = page => {
        return this.getData(this.temp + '&page=' + page);
    }

    getTvShow = id => this.getData(this.SERVER + '/tv/' + id + '?api_key=' +
        this.API_KEY + '&language=ru-RU');

    getTopRated = () => this.getData(this.SERVER + `/tv/top_rated?api_key=${this.API_KEY}&language=ru-RU`);

    getPopular = () => this.getData(this.SERVER + `/tv/popular?api_key=${this.API_KEY}&language=ru-RU`);

    getToday = () => this.getData(this.SERVER + `/tv/airing_today?api_key=${this.API_KEY}&language=ru-RU`);

    getWeek = () => this.getData(this.SERVER + `/tv/on_the_air?api_key=${this.API_KEY}&language=ru-RU`);

    getVideo = id => {
        return this.getData(this.SERVER + '/tv/' + id + '/videos?api_key=' +
            this.API_KEY + '&language=ru-RU');
    }
}

const dbService = new DBService();

const renderCard = (response, target) => {

    //debugger;

    tvShowList.textContent = '';

    if (!response.total_results) {
        loading.remove();
        tvShowsHead.textContent = 'К сожалению, по Вашему запросу ничего не найдено.';
        tvShowsHead.style.color = 'green';
        return;
    }

    tvShowsHead.textContent = target ? target.textContent : 'Результат поиска:';
    tvShowsHead.style.color = 'blue';


    response.results.forEach(item => {

            // деструктуризация
            const {
                backdrop_path: backdrop,
                name: title,
                poster_path: poster,
                vote_average: vote,
                id
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
            <a href="#" id="${id}" class="tv-card">
                ${voteElem}
                <img class="tv-card__img" 
                src="${posterIMG}"
                data-backdrop="${backdropIMG}" 
                alt="${title}">
                <h4 class="tv-card__head">${title}</h4>
            </a>
         `;
            // ??? tvShowList.prepend(card);
            tvShowList.append(card);
        })
        // вынесла из forEach потому что он вызывался каждый раз в forEach
    loading.remove();
    // pagination
    pagination.textContent = '';
    if (!target && response.total_pages > 1) {
        for (let i = 1; i <= response.total_pages; i++) {
            pagination.innerHTML += `<li><a href="#" class="pages">${i}</a></li>`;
        }
    }
}

searchForm.addEventListener('submit', event => {
    event.preventDefault();
    value = searchFormInput.value.trim();
    if (value) {
        tvShows.append(loading);
        dbService.getSearchResult(value).then(renderCard);
        searchFormInput.value = '';
    }
});

// открыть/закрыть меню

const closeDropdown = () => {
    dropdown.forEach(item => {
        item.classList.remove('active');
    })
}

hamburger.addEventListener('click', () => {
    leftMenu.classList.toggle('openMenu');
    hamburger.classList.toggle('open');
    closeDropdown();
});

document.addEventListener('click', event => {
    const target = event.target;
    if (!target.closest('.left-menu')) {
        leftMenu.classList.remove('openMenu');
        hamburger.classList.remove('open');
    }
});

leftMenu.addEventListener('click', event => {
    event.preventDefault();
    const target = event.target;
    const dropdown = target.closest('.dropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
        leftMenu.classList.add('openMenu');
        hamburger.classList.add('open');
    }

    if (target.closest('#top-rated')) {
        tvShows.append(loading);
        // здесь можно сделать на bind
        dbService.getTopRated().then((response) => renderCard(response, target));
    }
    if (target.closest('#popular')) {
        tvShows.append(loading);
        dbService.getPopular().then((response) => renderCard(response, target));
    }
    if (target.closest('#today')) {
        tvShows.append(loading);
        dbService.getToday().then((response) => renderCard(response, target));
    }
    if (target.closest('#week')) {
        tvShows.append(loading);
        dbService.getWeek().then((response) => renderCard(response, target));
    }

    if (target.closest('#search')) {
        tvShowList.textContent = '';
        tvShowsHead.textContent = '';
    }
});


// открытие модального окна
tvShowList.addEventListener('click', event => {
    event.preventDefault();

    const target = event.target;
    const card = target.closest('.tv-card');
    if (card) {
        // открыть preload
        preloader.style.display = 'block';
        dbService.getTvShow(card.id)
            .then(({
                poster_path: posterPath,
                name: title,
                genres,
                vote_average: voteAverage,
                overview,
                homepage,
                id
            }) => {
                if (posterPath) {
                    tvCardImg.src = IMG_URL + posterPath;
                    tvCardImg.alt = title;
                    posterWrapper.style.display = '';
                    modalContent.style = '';
                } else {
                    //document.querySelector('.image__content').classList.toggle('hide');
                    posterWrapper.style.display = 'none';

                    // ОШИБКА вернуть отступ при открытии следущей картинки
                    modalContent.style.paddingLeft = '25px';
                }
                modalTitle.textContent = title;
                // genresList.innerHTML(data.genres.reduce((acc, item) => `${acc}<li>${ucFirst(item.name)}</li>`, ''));
                genresList.textContent = '';
                // genresList.forEach(item => {
                //     genresList.innerHTML += `<li>${item.name}</li>`;
                // });
                // for быстрее, чем forEach
                for (const item of genres) {
                    genresList.innerHTML += `<li>${item.name}</li>`;
                }
                rating.textContent = voteAverage;
                description.textContent = overview;
                modalLink.href = homepage;
                return id;
            })
            .then(dbService.getVideo)
            .then(response => {
                headTrailer.classList.add('hide');
                trailer.textContent = '';
                if (response.results.length > 0) {
                    headTrailer.classList.remove('hide');
                    response.results.forEach(item => {
                        const trailerItem = document.createElement('li');
                        trailerItem.innerHTML = `
                        <iframe 
                            width="400" 
                            height="300" 
                            src="https://www.youtube.com/embed/${item.key}" 
                            frameborder="0" 
                            allowfullscreen>
                        </iframe>
                        <h4>${item.name}</h4>`;
                        trailer.append(trailerItem);
                    })
                }
            })
            .then(() => {
                document.body.style.overflow = 'hidden';
                modal.classList.remove('hide');
            })
            .finally(() => {
                // закрыть прелоудер
                preloader.style.display = '';
            });


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
        // устаревший способ
        // const changeImg = img.dataset.backdrop;
        // if (changeImg) {
        //     console.log(img.src);
        //     img.dataset.backdrop = img.src;
        //     img.src = img.dataset.backdrop;
        // }
        // деструктуризация ???
        if (img.dataset.backdrop) {
            [img.dataset.backdrop, img.src] = [img.src, img.dataset.backdrop];
        }
    }
};
tvShowList.addEventListener('mouseover', changeImage);
tvShowList.addEventListener('mouseout', changeImage);

pagination.addEventListener('click', event => {
    event.preventDefault();
    const target = event.target;
    if (target.classList.contains('pages')) {
        tvShows.append(loading);
        dbService.getNextPage(target.textContent).then(renderCard);
    }
});