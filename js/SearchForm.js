class SearchForm {
    constructor(DOMelement) {
        this.DOMelement = DOMelement;
        this.innerHTML = `
        <div class="col-lg-11 col-md-8 col-sm-4 col-xs-2">
            <input type="text" class="form-control" placeholder="Search this site" id="inputValue">
        </div>
        <div class="input-group-append col-sm-1 float-end">
            <div id="spinner" class="spinner-grow text-primary d-none" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <button class="btn btn-primary mb-2" type="button" id="searchButton">
                <i class="fas fa-search"></i>
            </button>
        </div>`;
        this.init();
    }

    init = function () {
        let form = document.createElement("form");
        form.innerHTML = this.innerHTML;
        form.classList = "row";
        document.getElementById("form").appendChild(form);
    }

    onSearch(callback) {
        const searchButton = document.getElementById('searchButton');
        const inputValue = document.getElementById('inputValue');
        searchButton.addEventListener('click', () => {
        if(callback) callback(inputValue.value);
        });
        document.querySelector('#inputValue').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                if(callback) callback(inputValue.value);
                e.preventDefault();
            }
        });       
      }
}