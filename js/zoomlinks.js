let requestURL = "https://sdat-dev.github.io/resources/healthequity/data/Sessionlinks.json";
let request = new XMLHttpRequest();
//getting content Element to append grants information
let maincontentContainer = document.getElementsByClassName('main-content')[0];
request.open('GET', requestURL);
request.responseType = 'json';
request.send();
request.onload = function(){
    const webelementsjson = request.response;
    //condition for checking if browser is Internet Explorer
    let webelements =  ((false || !!document.documentMode))? JSON.parse(webelementsjson): webelementsjson;
    let content = getContent(webelements);
    let contentElement = document.createElement('div');
    contentElement.classList.add('content');
    contentElement.innerHTML = content.trim();
    maincontentContainer.appendChild(contentElement);
    addfooter();
}

$('.carousel').carousel({pause: "false",
 interval: 2000

});