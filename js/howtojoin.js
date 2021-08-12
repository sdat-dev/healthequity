let requestURL = "https://sdat-dev.github.io/resources/healthequity/data/howtojoin.json";
let request = new XMLHttpRequest();
//getting content Element to append grants information
let maincontentContainer = document.getElementsByClassName('main-content')[0];
request.open('GET', requestURL);
request.responseType = 'json';
request.send();
request.onload = function () {
    const webelementsjson = request.response;
    //condition for checking if browser is Internet Explorer
    let webelements = ((false || !!document.documentMode)) ? JSON.parse(webelementsjson) : webelementsjson;
    let contentElement = document.createElement('div');
    contentElement.classList.add('content');
    contentElement.innerHTML = getContent(webelements);
    maincontentContainer.appendChild(contentElement);
    addfooter();
}

let addheader = function (headers) {
    let header = document.getElementById("page-header");
    let content = "";
    let image = "";
    let header1 = "";
    let header2 = "";

    content += '<div class="carousel slide carousel-fade pointer-event" data-ride="carousel">' +
        '<div class="carousel-inner">';
    for (var i = 0; i < headers.length; i++) {
        image = typeof headers[i].logo != 'undefined' && headers[i].logo != '' ? headers[i].logo : image;
        header1 = typeof headers[i].content != 'undefined' && headers[i].content != '' ? headers[i].content : header1;
        header2 = typeof headers[i].subcontent != 'undefined' && headers[i].subcontent != '' ? headers[i].subcontent : header2;
        let source = 'assets/images/' + (typeof headers[i].source != 'undefined' && headers[i].source != '' ? headers[i].source + '/' : '');
        if (i == 0) {
            content += '<div class="carousel-item active">';
        }
        else {
            content += '<div class="carousel-item">';
        }
        if (header1 == '') {
            content += '<img src="' + source + image + '" class="d-block w-100" alt="...">' +
                '</div>';
        }
        else if (header1.includes('link')) {
            console.log("else if");
            content += '<a target = "_blank" href="https://albany.az1.qualtrics.com/jfe/form/SV_7Vw1AmKqr14FT25"> <img src="' + source + image + '" class="d-block w-100" alt="..."></a>' +
                '</div>';
        }
        else {
            content += '<img src="' + source + image + '" class="d-block w-100" alt="...">' +
                '<div id = "landing-page-text-wrapper">' +
                '<h1>' + header1 + '</h1>' +
                '<p>' + header2 + '</p>' +
                '</div>' +
                '</div>';
        }
    }
    content += '</div></div>';
    header.innerHTML = content;
}

$('.carousel').carousel({
    pause: "false",
    interval: 2000

});