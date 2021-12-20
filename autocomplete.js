const createAutoComplete = (config) => {
	const { root, renderOption, onOptionSelect, inputValue, fetchData } = config;
	root.innerHTML = `
  <label><b>Search For a Movie</b></label>
  <input class="input" />
  <div class="dropdown">
    <div class="dropdown-menu">
      <div class="dropdown-content results"></div>
    </div>
  </div>
`;

	const input = root.querySelector('input');
	const dropdown = root.querySelector('.dropdown');
	const resultsWrapper = root.querySelector('.results');

	const onInput = async (event) => {
		const items = await fetchData(event.target.value);
		if (!items.length) {
			dropdown.classList.remove('is-active');
			return;
		}
		resultsWrapper.innerHTML = '';
		dropdown.classList.add('is-active');
		for (let item of items) {
			const option = document.createElement('a');

			option.classList.add('dropdown-item');

			option.innerHTML = renderOption(item);

			option.addEventListener('click', async () => {
				dropdown.classList.remove('is-active');
				input.value = inputValue(item);
				onOptionSelect(item);
			});

			resultsWrapper.appendChild(option);
		}
	};
	input.addEventListener('input', debounce(onInput, 500));

	//hide search result
	document.addEventListener('click', (event) => {
		if (event.target.contains(root)) {
			dropdown.classList.remove('is-active');
		}
	});
};
