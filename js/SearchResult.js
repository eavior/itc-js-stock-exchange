class SearchResult {
    constructor(DOMelement) {
        this.DOMelement = DOMelement;
        this.newArray = [];
        this.retrieveResults = async function () {
            while (this.DOMelement.firstChild) {
                this.DOMelement.removeChild(this.DOMelement.firstChild);
            }
            searchButton.classList.add('d-none');
            spinner.classList.remove('d-none');
            this.createListHolder();
            try {
                const data = await this.getServerResults(this.companies);
                searchButton.classList.remove('d-none');
                spinner.classList.add('d-none');
            } catch (error) {
                this.createServerErrorHolder();
                serverError.textContent = error.message;
                searchButton.classList.remove('d-none');
                spinner.classList.add('d-none');
                serverError.classList.remove('d-none');
            }
        }

        this.getServerResults = async function () {
            const response = await fetch(`${defaultURL}/search?query=${inputValue.value}&limit=10&exchange=NASDAQ`);
            if (response.ok) {
                const data = await response.json();
                const arrayFromHTMLCollection = Array.from(data);
                this.newArray = arrayFromHTMLCollection.slice(0);
                this.newArray.sort(this.compareForSorting);
                for (let j = 0; j < this.newArray.length; j++) {
                    fetch(`${defaultURL}/company/profile/${this.newArray[j].symbol}`).then(response => {
                        if (!response.ok) {
                            response.text().then(text => {
                                alert(text);
                            })
                        } else {
                            response.json().then(data => {
                                const itemID = j;
                                this.createListItem(data.profile.image, data.profile.companyName, this.newArray[j].symbol, data.profile.changesPercentage, itemID);
                            })
                        }
                    });
                }
            } else {
                const text = await response.text();
                throw new Error(text);
            }
        }
    }

    renderResults() {
        this.retrieveResults(this.companies);
    }

    compareForSorting(a, b) {
        // Use toUpperCase() to ignore character casing
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
        let comparison = 0;
        if (nameA > nameB) {
            comparison = 1;
        } else if (nameA < nameB) {
            comparison = -1;
        }
        return comparison;
    }

    createServerErrorHolder() {
        const serverErrorWarning = document.createElement("div");
        serverErrorWarning.id = "serverError";
        serverErrorWarning.classList.add("text-danger", "d-none");
        this.DOMelement.appendChild(serverErrorWarning);
    }

    createListHolder() {
        this.DOMelement.classList = "container mt-2";
        const resultList = document.createElement("ul");
        resultList.id = "listHolder";
        resultList.classList.add("list-group", "list-group-flush", "mt-4", "row", "col-lg-11", "col-md-8", "col-sm-4", "col-xs-2");
        this.DOMelement.appendChild(resultList);
    }

    createListItem(image, companyName, symbol, percentage, itemID) {
        const resultListItem = document.createElement("li"); //<li>
        resultListItem.classList.add("list-group-item");
        resultListItem.id = itemID;
        const companyImage = document.createElement('img'); //<img>
        companyImage.setAttribute("src", image);
        companyImage.setAttribute("height", "30px");
        companyImage.setAttribute("alt", companyName);
        resultListItem.appendChild(companyImage);
        const emptySpaces = document.createElement('span'); //Empty spaces
        emptySpaces.innerHTML = `&nbsp&nbsp&nbsp`;
        resultListItem.appendChild(emptySpaces);
        const a = document.createElement('a'); //<a> companyName
        const linkText = document.createTextNode(`${companyName}`);
        a.appendChild(linkText);
        a.href = `html/company.html?symbol=${symbol}`;
        a.target = "_blank";
        resultListItem.appendChild(a);
        const companySymbol = document.createElement('span'); // <span> Symbol
        companySymbol.innerHTML = `&nbsp&nbsp&nbsp<sup>${symbol}</sup>`;
        resultListItem.appendChild(companySymbol);
        const companyStockPercentages = document.createElement('span'); // <span> Stock percentage
        companyStockPercentages.innerHTML = `<sup>&nbsp${percentage}</sup>`;
        if (percentage.includes("-")) companyStockPercentages.style.color = 'red';
        else companyStockPercentages.style.color = 'green';
        resultListItem.appendChild(companyStockPercentages);
        document.getElementById("listHolder").appendChild(resultListItem);
        this.highlight(itemID);
    }

    highlight(itemID) {
        // This function will only highlight the search value in the first element defined in the next line, and cannot apply highlighting on children. Hence every result item is given an ID.
        var ob = new Mark(document.getElementById(itemID));
        inputValue.value;
        // First unmark the highlighted word or letter 
        ob.unmark();
        // Highlight letter or word 
        ob.mark(
            document.getElementById("inputValue").value, {
                className: 'highlight'
            }
        );
    }
}