class SearchResult {
    constructor(DOMelement) {
        this.DOMelement = DOMelement;
        this.innerHTML = `
        <div class="col-lg-11 col-md-8 col-sm-4 col-xs-2">
        </div>`;
        const resultsList = document.querySelector('#resultsList');
        this.newArray = [];
        this.retrieveResults = async function () {
            document.getElementById("results").innerHTML = "";
            document.getElementById("serverError").innerHTML = "";
            searchButton.classList.add('d-none');
            spinner.classList.remove('d-none');
            try {
                const data = await this.getServerResults(this.companies);
                searchButton.classList.remove('d-none');
                spinner.classList.add('d-none');

            } catch (error) {
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
                let arrayFromHTMLCollection = Array.from(data);
                this.newArray = arrayFromHTMLCollection.slice(0);
                this.newArray.sort((a, b) => a.name - b.name); // Why doesn't this work? Sorting does not take place.
                for (let j = 0; j < this.newArray.length; j++) {
                    fetch(`${defaultURL}/company/profile/${this.newArray[j].symbol}`).then(response => {
                        if (!response.ok) {
                            response.text().then(text => {
                                alert(text);
                            })
                        } else {
                            response.json().then(data => {
                                this.newArray[j].image = data.profile.image;
                                this.newArray[j].companyName = data.profile.companyName;
                                this.newArray[j].changesPercentage = data.profile.changesPercentage;
                                // this.appendToList(this.newArray, j);
                                let resultList = document.createElement("ul");
                                resultList.id = "listHolder";
                                resultList.classList.add("list-group", "list-group-flush", "mt-4", "row", "col-lg-10", "col-md-8", "col-sm-4", "col-xs-2");
                                document.getElementById("results").appendChild(resultList);
                                // LI
                                let resultListItem = document.createElement("li");
                                resultListItem.classList.add("list-group-item");
                                // IMG
                                let companyImage = document.createElement('img');
                                companyImage.setAttribute("src", this.newArray[j].image);
                                companyImage.setAttribute("height", "30px");
                                companyImage.setAttribute("alt", this.newArray[j].companyName);
                                resultListItem.appendChild(companyImage);
                                // Empty spaces
                                let emptySpaces = document.createElement('span');
                                emptySpaces.innerHTML = `&nbsp&nbsp&nbsp`;
                                resultListItem.appendChild(emptySpaces);
                                // A with company name
                                let a = document.createElement('a');
                                let linkText = document.createTextNode(`${this.newArray[j].companyName}`);
                                a.appendChild(linkText);
                                a.href = `html/company.html?symbol=${this.newArray[j].symbol}`;
                                a.target = "_blank";
                                resultListItem.appendChild(a);
                                // Symbol
                                let companySymbol = document.createElement('span');
                                companySymbol.innerHTML = `&nbsp&nbsp&nbsp<sup>${this.newArray[j].symbol}</sup>`;
                                resultListItem.appendChild(companySymbol);
                                // Stock percentage
                                let companyStockPercentages = document.createElement('span');
                                companyStockPercentages.innerHTML = `<sup>&nbsp${this.newArray[j].changesPercentage}</sup>`;
                                if (this.newArray[j].changesPercentage.includes("-")) companyStockPercentages.style.color = 'red';
                                else companyStockPercentages.style.color = 'green';
                                resultListItem.appendChild(companyStockPercentages);
                                document.getElementById("listHolder").appendChild(resultListItem);


                            })
                        }
                    });
                }
                return this.newArray;
            } else {
                const text = await response.text();
                throw new Error(text);
            }
        }
    }

    renderResults() {
        this.retrieveResults(this.companies);
    }

    
}



