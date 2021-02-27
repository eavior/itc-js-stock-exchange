// Default URL
const defaultURL = "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3";

// Declaration of global variables + retrieve and define DOM elements

const searchButton = document.getElementById('searchButton');
const inputValue = document.getElementById('inputValue');
const resultsList = document.querySelector('#resultsList');
let newArray = [];

// Event listeners
searchButton.addEventListener('click', () => {
    startSearch(inputValue.value);
});
document.querySelector('#inputValue').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        startSearch(inputValue.value);
        e.preventDefault();
    }
});

// Start the search
async function startSearch(inputValue) {
    document.getElementById("results").innerHTML = "";
    document.getElementById("serverError").innerHTML = "";
    searchButton.classList.add('d-none');
    spinner.classList.remove('d-none');
    try {
        const data = await getServerResults(inputValue);
        searchButton.classList.remove('d-none');
        spinner.classList.add('d-none');

    } catch (error) {
        serverError.textContent = error.message;
        searchButton.classList.remove('d-none');
        spinner.classList.add('d-none');
        serverError.classList.remove('d-none');
    }
}

async function getServerResults(inputValue) {
    const response = await fetch(`${defaultURL}/search?query=${inputValue}&limit=10&exchange=NASDAQ`);
    if (response.ok) {
        const data = await response.json();
        let arrayFromHTMLCollection = Array.from(data);
        newArray = arrayFromHTMLCollection.slice(0);
        newArray.sort((a, b) => a.name - b.name); // Why doesn't this work? Sorting does not take place.
        for (let j = 0; j < newArray.length; j++) {
            fetch(`${defaultURL}/company/profile/${newArray[j].symbol}`).then(response => {
                if (!response.ok) {
                    response.text().then(text => {
                        alert(text);
                    })
                } else {
                    response.json().then(data => {
                        newArray[j].image = data.profile.image;
                        newArray[j].companyName = data.profile.companyName;
                        newArray[j].changesPercentage = data.profile.changesPercentage;
                        appendToList(newArray, j);
                    })
                }
            });
        }
        return newArray;
    } else {
        const text = await response.text();
        throw new Error(text);
    }
}

function appendToList(newArray, j) {
    // UL
    let resultList = document.createElement("ul");
    resultList.id = "listHolder";
    resultList.classList.add("list-group", "list-group-flush", "mt-4", "row", "col-lg-10", "col-md-8", "col-sm-4", "col-xs-2");
    document.getElementById("results").appendChild(resultList);
    // LI
    let resultListItem = document.createElement("li");
    resultListItem.classList.add("list-group-item");
    // IMG
    let companyImage = document.createElement('img');
    companyImage.setAttribute("src", newArray[j].image);
    companyImage.setAttribute("height", "30px");
    companyImage.setAttribute("alt", newArray[j].companyName);
    resultListItem.appendChild(companyImage);
    // Empty spaces
    let emptySpaces = document.createElement('span');
    emptySpaces.innerHTML = `&nbsp&nbsp&nbsp`;
    resultListItem.appendChild(emptySpaces);
    // A with company name
    let a = document.createElement('a');
    let linkText = document.createTextNode(`${newArray[j].companyName}`);
    a.appendChild(linkText);
    a.href = `html/company.html?symbol=${newArray[j].symbol}`;
    a.target = "_blank";
    resultListItem.appendChild(a);
    // Symbol
    let companySymbol = document.createElement('span');
    companySymbol.innerHTML = `&nbsp&nbsp&nbsp<sup>${newArray[j].symbol}</sup>`;
    resultListItem.appendChild(companySymbol);
    // Stock percentage
    let companyStockPercentages = document.createElement('span');
    companyStockPercentages.innerHTML = `<sup>&nbsp${newArray[j].changesPercentage}</sup>`;
    if (newArray[j].changesPercentage.includes("-")) companyStockPercentages.style.color = 'red';
    else companyStockPercentages.style.color = 'green';
    resultListItem.appendChild(companyStockPercentages);
    document.getElementById("listHolder").appendChild(resultListItem);
}