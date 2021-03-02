class SearchForm {
    constructor(DOMelement) {
        this.DOMelement = DOMelement;
        this.init(); // Creation of the html form structure
        this.button = document.getElementById('searchButton');
        this.inputForm = document.querySelector('#inputValue');
        this.inputValue = document.getElementById('inputValue');
    }

    init = function () {
        // form creation
        const form = document.createElement("form");
        form.classList = "row";
        // form inputHolder
        const formInputHolder = document.createElement("div");
        formInputHolder.classList.add("col-lg-11", "col-md-8", "col-sm-4", "col-xs-2");
        form.append(formInputHolder);
        // search form
        const searchForm = document.createElement("input");
        searchForm.classList.add("form-control");
        searchForm.id = "inputValue";
        searchForm.type = "text";
        searchForm.placeholder = "Search this site";
        formInputHolder.append(searchForm);
        // button & spinner holder
        const buttonHolder = document.createElement("div");
        buttonHolder.classList.add("input-group-append", "col-sm-1", "float-end");
        form.append(buttonHolder);
        // spinner
        const spinner = document.createElement("div");
        spinner.classList.add("spinner-grow", "text-primary", "d-none");
        spinner.id = "spinner";
        spinner.role = "status";
        // spinner span
        const spinnerSpan = document.createElement("span");
        spinnerSpan.classList.add("visually-hidden");
        spinnerSpan.append(spinner);
        buttonHolder.append(spinner);
        // button
        const button = document.createElement("div");
        button.classList.add("btn", "btn-primary", "mb-2");
        button.id = "searchButton";
        buttonHolder.append(button);
        // button icon
        const buttonI = document.createElement("i");
        buttonI.classList.add("fas", "fa-search");
        button.append(buttonI);
        this.DOMelement.appendChild(form);
    }

    onSearch(callback) {
        this.button.addEventListener('click', () => {
            if (callback) callback(this.inputValue.value);
        });
        this.inputValue.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                if (callback) callback(this.inputValue.value);
                e.preventDefault();
            }
        });
    }
}