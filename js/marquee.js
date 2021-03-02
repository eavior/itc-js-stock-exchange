const defaultURL = "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3";

class Marquee {
    constructor(DOMelement) {
        this.DOMelement = DOMelement;
        this.init();
    }

    init() {
        // from: https://financialmodelingprep.com/developer/docs
        document.addEventListener('DOMContentLoaded', () => {
            this.getRequest(`${defaultURL}/stock/actives`, this.createMarquee);
        })
    }

    createMarquee(responseText) {
        const resp = Object.values(JSON.parse(responseText).mostActiveStock);
        const marqueeText = document.createElement("p");
        let marqueeString = "";
        for (let i = 0; i < resp.length; i++) {
            let financial = resp[i];
            let newMarqueeElement = new MarqueeElement(financial.ticker, financial.price);
            marqueeString += newMarqueeElement.toString();
        }
        marqueeText.innerHTML = marqueeString.repeat(10);
        document.getElementById("marquee").appendChild(marqueeText);
    }

    getRequest(url, success) {
        var req = false;
        try {
            req = new XMLHttpRequest();
        } catch (e) {
            try {
                req = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                try {
                    req = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (e) {
                    return false;
                }
            }
        }
        if (!req) return false;
        if (typeof success != 'function') success = function () {};
        req.onreadystatechange = function () {
            if (req.readyState == 4) {
                if (req.status === 200) {
                    success(req.responseText)
                }
            }
        }
        req.open("GET", url, true);
        req.send(null);
        return req;
    }

}

class MarqueeElement {
    constructor(ticker, price) {
        this.ticker = ticker;
        this.price = price;
    }
    toString() {
        return `${this.ticker} <strong style="color: #008000">$${this.price}</strong>&nbsp&nbsp&nbsp&nbsp&nbsp`;
    }
}