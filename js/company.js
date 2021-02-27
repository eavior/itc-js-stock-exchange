// Default URL
const defaultURL = "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3";

let urlParams = new URLSearchParams(window.location.search);
let inputValue = "";
for (let value of urlParams.values()) {
    inputValue = value;
}


getAllData(inputValue);

async function getAllData (inputValue) {
    spinner.classList.remove('d-none');
    await getCompanyData(inputValue);
    await getStockData(inputValue);
    spinner.classList.add('d-none');
}

async function getCompanyData(symbol) {
    await fetch(`${defaultURL}/company/profile/${symbol}`).then(response => {
        if (!response.ok) {
            response.text().then(text => {
                alert(text);
            })
        } else {
            response.json().then(data => {
                    let companyImage = document.createElement('img');
                    companyImage.setAttribute("src", data.profile.image);
                    companyImage.id = 'companyImage';
                    companyImage.setAttribute("alt", data.profile.companyName);
                    companyImage.setAttribute("height", "60px");
                    companyImage.setAttribute("vertical-align", "text-top");
                    document.getElementById("company-image").appendChild(companyImage);

                    let companyName = document.createElement('h1');
                    companyName.id = 'companyName';
                    companyName.innerHTML = data.profile.companyName;
                    document.getElementById("company").appendChild(companyName);

                    let companyDescription = document.createElement('div');
                    companyDescription.id = 'companyDescription';
                    companyDescription.innerHTML = data.profile.description;
                    document.getElementById("description").appendChild(companyDescription);

                    let companyLink = document.createElement('a');
                    companyLink.id = 'companyLink';
                    let companyLinkText = document.createTextNode(data.profile.website);
                    companyLink.appendChild(companyLinkText);
                    companyLink.href = data.profile.website;
                    companyLink.target = "_blank";
                    document.getElementById("company-link").appendChild(companyLink);

                    let companyStockPrice = document.createElement('div');
                    companyStockPrice.id = 'companyStockPrice';
                    companyStockPrice.innerHTML = `Stock price: ${data.profile.currency} ${data.profile.price}`;
                    document.getElementById("price").appendChild(companyStockPrice);

                    let companyStockPercentages = document.createElement('div');
                    companyStockPercentages.id = 'companyStockPercentages';
                    companyStockPercentages.innerHTML = data.profile.changesPercentage;
                    if (data.profile.changesPercentage.includes("-")) companyStockPercentages.style.color = 'red';
                    else companyStockPercentages.style.color = 'green';
                    document.getElementById("percentage").appendChild(companyStockPercentages);
                }   
            )
        }
    })
};

let historicalArray = [];
let datesArray = [];
let closeArray = [];

async function getStockData(symbol) {
    await fetch(`${defaultURL}/historical-price-full/${symbol}?serietype=line`).then(response => {
        if (!response.ok) {
            response.text().then(text => {
                alert(text);
            })
        } else {
            response.json().then(data => {
                    let arrayFromHTMLCollection = Array.from(data.historical);
                    let sortedArray = arrayFromHTMLCollection.slice(0);
                    let decrementBy = Math.round((Object.keys(sortedArray).length) / 20);
                    for (let i = data.historical.length - 1; i > 0; i -= decrementBy) {
                        closeArray.push(data.historical[i].close);
                        datesArray.push(data.historical[i].date);
                    }
                    createChart(datesArray, closeArray);
                }     
            )
        }
    })
};

function createChart(datesArray, closeArray) {
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: datesArray,
            datasets: [{
                label: 'Stock Price History',
                data: closeArray,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}