document.addEventListener('DOMContentLoaded', () => {
    // from: https://financialmodelingprep.com/developer/docs
    getRequest(`${defaultURL}/stock/actives`,
        createMarquee
    );

    function createMarquee(responseText) {
        let resp = Object.values(JSON.parse(responseText).mostActiveStock);
        let marqueeText = document.createElement("p");
        marqueeText.innerHTML = "";
        for (let i = 0; i < resp.length; i++) {
            let financial = resp[i];
            marqueeText.innerHTML += `${financial.ticker} <strong style="color: #008000">$${financial.price}</strong>&nbsp&nbsp&nbsp&nbsp&nbsp`;
        }
        marqueeText.innerHTML = marqueeText.innerHTML + marqueeText.innerHTML + marqueeText.innerHTML;
        document.getElementById("marquee").appendChild(marqueeText);
    }

    function getRequest(url, success) {
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
})