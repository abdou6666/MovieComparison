const autoCompleteConfig = {
	renderOption(movie) {
		const imgSrc = movie.Poster == 'N/A' ? '' : movie.Poster;
		return `
        <img src="${imgSrc}" />
        ${movie.Title}
        (${movie.Year})
      `;
	},
	inputValue(movie) {
		return movie.Title;
	},
	async fetchData(searchTerm) {
		const response = await axios.get('http://www.omdbapi.com/', {
			params: {
				apikey: '30e5b974',
				s: searchTerm
			}
		});

		if (response.data.Error) {
			return [];
		}

		return response.data.Search;
	}
};

createAutoComplete({
	...autoCompleteConfig,
	root: document.querySelector('#left-autocomplete'),
	onOptionSelect(movie) {
		document.querySelector('.tutorial').classList.add('is-hidden');
		onMovieSelect(movie.imdbID, document.querySelector('#left-summary'), 'left');
	}
});

createAutoComplete({
	...autoCompleteConfig,
	root: document.querySelector('#right-autocomplete'),
	onOptionSelect(movie) {
		document.querySelector('.tutorial').classList.add('is-hidden');
		onMovieSelect(movie.imdbID, document.querySelector('#right-summary'), 'right');
	}
});

const movieTemplate = (movieDetail) => {
	const dollars = movieDetail.BoxOffice.replace('$', '').replaceAll(',', '');
	const metaScore = parseInt(movieDetail.Metascore);
	const imdbRating = parseFloat(movieDetail.imdbRating);
	const imdbVotes = parseInt(movieDetail.imdbVotes.replaceAll(',', ''));
	const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
		const value = parseInt(word);

		if (isNaN(value)) {
			return prev;
		} else {
			return prev + value;
		}
	}, 0);

	return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetail.Poster}" />
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieDetail.Title}</h1>
          <h4>${movieDetail.Genre}</h4>
          <p>${movieDetail.Plot}</p>
        </div>
      </div>
    </article>
    <article class="notification is-primary" data-value=${awards}>
      <p class="title">${movieDetail.Awards} </p>
      <p class="subtitle">Awards</p>
    </article>

    <article class="notification is-primary" data-value=${dollars}>
      <p class="title">${movieDetail.BoxOffice} </p>
      <p class="subtitle">Box Office</p>
    </article>

    <article class="notification is-primary" data-value=${metaScore}>
      <p class="title">${movieDetail.Metascore} </p>
      <p class="subtitle">Metascore</p>
    </article>

    <article class="notification is-primary" data-value=${imdbRating}>
      <p class="title">${movieDetail.imdbRating} </p>
      <p class="subtitle">IMDB Rating</p>
    </article>

        <article class="notification is-primary" data-value=${imdbVotes}>
      <p class="title">${movieDetail.imdbVotes} </p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  `;
};
let leftSide;
let rightSide;
const onMovieSelect = async (movieId, summaryElement, side) => {
	const response = await axios.get('http://www.omdbapi.com/', {
		params: {
			apikey: '30e5b974',
			i: movieId
		}
	});
	summaryElement.innerHTML = movieTemplate(response.data);
	if (side == 'left') {
		leftSide = side;
	} else {
		rightSide = side;
	}
	if (leftSide && rightSide) {
		runComparison();
	}
	summaryElement.innerHTML = movieTemplate(response.data);
};

const runComparison = () => {
	const leftSideStats = document.querySelectorAll('#left-summary .notification');
	const rightSideStats = document.querySelectorAll('#right-summary .notification');

	leftSideStats.forEach((leftStat, index) => {
		const rightStat = rightSideStats[index];

		const leftSideValue = leftStat.dataset.value;
		const rightSideValue = rightStat.dataset.value;

		if (rightSideValue > leftSideValue) {
			leftStat.classList.remove('is-primary');
			leftStat.classList.add('is-warning');
		} else {
			rightStat.classList.remove('is-primary');
			rightStat.classList.add('is-warning');
		}
	});
};
