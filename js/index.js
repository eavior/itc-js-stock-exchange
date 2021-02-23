const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput');

searchButton.addEventListener('click', () => {
    startSearch();
});

document.querySelector('#searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') startSearch();
});

function startSearch() {
    document.getElementById("spinner").style.display = "block";
    item = document.querySelector('#result');
    while (item.firstChild) {
        item.removeChild(item.firstChild);
    }
    const inputValue = searchInput.value;
    getServerResults(inputValue);
}

let sortChoice = "Name Asc";

let newArray = [];

async function getServerResults(inputValue) {

    await fetch(`https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=${inputValue}&limit=10&exchange=NASDAQ`).then(response => {
        if (!response.ok) {
            response.text().then(text => {
                document.getElementById("spinner").style.display = "none";
                let serverError = document.createElement("div");
                serverError.innerHTML = text;
                serverError.setAttribute("id", "serverError");
                document.getElementById("result").appendChild(serverError);
            })
        } else {
            response.json().then(data => {
                let arrayFromHTMLCollection = Array.from(data);
                newArray = arrayFromHTMLCollection.slice(0);
                newArray.sort((a, b) => a.name - b.name); // Why doesn't this work? Sorting does not take place.

                let resultList = document.createElement("ul");
                resultList.id = "listHolder";
                document.getElementById("result").appendChild(resultList);

                for (let j = 0; j < newArray.length; j++) {
                    console.log(newArray[j].symbol);
                    fetch(`https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${newArray[j].symbol}`).then(response => {
                        if (!response.ok) {
                            response.text().then(text => {
                                alert(text);
                            })
                        } else {
                            response.json().then(data => {
                                let resultListItem = document.createElement("li");

                                let companyImage = document.createElement('img');
                                companyImage.setAttribute("src", data.profile.image);
                                // companyImage.setAttribute("width", "304");
                                companyImage.setAttribute("height", "50px");
                                companyImage.setAttribute("alt", data.profile.companyName);
                                resultListItem.appendChild(companyImage);

                                let a = document.createElement('a');
                                let linkText = document.createTextNode(`   ${data.profile.companyName}   `);
                                a.appendChild(linkText);
                                a.href = `html/company.html?symbol=${newArray[j].symbol}`;
                                a.target = "_blank";
                                resultListItem.appendChild(a);

                                let companySymbol = document.createElement('span');
                                // companySymbol.id = 'companySymbol';
                                companySymbol.innerHTML = `${newArray[j].symbol}   `;
                                resultListItem.appendChild(companySymbol);

                                let companyStockPercentages = document.createElement('span');
                                // companyStockPercentages.id = 'companyStockPercentages';
                                companyStockPercentages.innerHTML = data.profile.changesPercentage;
                                if (data.profile.changesPercentage.includes("-")) companyStockPercentages.style.color = 'red';
                                else companyStockPercentages.style.color = 'green';
                                resultListItem.appendChild(companyStockPercentages);

                                document.getElementById("listHolder").appendChild(resultListItem);
                            })
                        }
                    });
                }
                document.getElementById("spinner").style.display = "none";
            })
        }
    })
}

async function getCompanyData(symbol) {
    await fetch(`https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${symbol}`).then(response => {
        if (!response.ok) {
            response.text().then(text => {
                alert(text);
            })
        } else {
            response.json().then(data => {
                return data.profile;
            })
        }
    })
};