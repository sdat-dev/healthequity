let requestURL = "data/facultyexperts.json"; 
let request = new XMLHttpRequest();
//getting content Element to append grants information
let maincontentContainer = document.getElementsByClassName('main-content')[0];
request.open('GET', requestURL);
request.responseType = 'json';
request.send();
request.onload = function(){
    let content = '';
    const expertspagejson = request.response;
    //condition for checking if browser is Internet Explorer
    let expertspage =  ((false || !!document.documentMode))? JSON.parse(expertspagejson): expertspagejson;
    let webelements = expertspage.content;
    let experts = expertspage.experts;
    let logostart = true;
    let pageheaders = [];
    for(let i = 0; i < webelements.length; i++)
    {
        let element = webelements[i]; 
        let type = element.type.toLowerCase(); 
        if(type == 'ph')
        {
            pageheaders.push(element);
        }
        else if(type == 'ch')
        {
            let header = document.getElementsByClassName("content-header")[0];
            header.innerHTML = element.content.toUpperCase();
        }
        else if(type == 'p')
        {
            content += '<p>' + element.content + '</p>';
        }
        else if(type == 'img')
        {
            content += '<img src="assets/images/'+ element.content + '" alt="" style="width: 100%;">';
        }
        else if(type == 'iframe')
        {
            content += '<iframe '+ element.content +'></iframe>';
        }
        else if(type == 'ul')
        { 
            content += '<ul class="sub-list ' + element.content +'">';
        }
        else if(type == 'li')
        {
            content += '<li>'+ element.content +'</li>';
        }
        else if(type == '/ul')
        {
            content += '</ul>';
        }
        else if(type == 'a' && !element.hasOwnProperty("logo"))
        {
            content +='<a href = "'+ element.source +'">'+ element.content + '</a>';
        }
        else if(type == 'a' && element.logo != '')
        {
            if(logostart == true)
            {
                content +='<div class = "display-flex">';
                logostart = false;
            }
            content +='<div class = "col-xl-4 col-lg-6 col-md-12">'+
                        '<a target = "_blank" href = "'+ element.source +'">'+
                            '<div class = "home-logo-container">' +
                                '<img class = "home-logo" src = "assets/images/' + element.logo+ '">'+
                                '<p>'+ element.content+'</p>' +
                            '</div>'+
                        '</a>'+
                    '</div>';
            if(i+1 ==  webelements.length){
                content += '</div>';
            }
        }
    }
    content += '<input id = "search-box" placeholder = "Search Experts...">'+
                    '<button id = "search-button" type = "submit"><i class="fa fa-search"></i></button>'+
                '<br><span id = "search-box-results"></span>';
    content +=buildExpertContent(experts);
    addheader(pageheaders);
    let contentElement = document.createElement('div');
    contentElement.classList.add('content');
    contentElement.innerHTML = content.trim();
    maincontentContainer.appendChild(contentElement);
    addfooter();
    let searchbox = document.getElementById('search-box');
    let searchbutton = document.getElementById('search-button');
    searchbox.onkeyup = searchfunction;
    searchbutton.onclick = searchfunction;
}

let addheader =  function (headers){
    let header = document.getElementById("page-header");
    let content ="";
    let image = "";
    let header1 = "";
    let header2 = "";

    content += '<div class="carousel slide carousel-fade pointer-event" data-ride="carousel">'+
                    '<div class="carousel-inner">';
    for(var i =0 ; i < headers.length; i++)
    {
        image = typeof headers[i].logo != 'undefined' && headers[i].logo != ''? headers[i].logo : image;
        header1 =  typeof headers[i].content != 'undefined' && headers[i].content != ''? headers[i].content : header1;
        header2 =  typeof headers[i].subcontent != 'undefined' && headers[i].subcontent != ''? headers[i].subcontent : header2;
        let source = 'assets/images/' + (typeof headers[i].source != 'undefined' && headers[i].source != ''? headers[i].source+'/' : '');
        if(i == 0)
        {
            content += '<div class="carousel-item active">';
        }
        else
        {
            content += '<div class="carousel-item">';
        }
        content +=  '<img src="'+ source + image +'" class="d-block w-100" alt="...">'+
                    '<div id = "landing-page-text-wrapper">'+
                        '<h1>'+ header1 +'</h1>' + 
                        '<p>' + header2 + '</p>' +      
                    '</div>'+
                '</div>';
    }
    content +=  '</div></div>';
    header.innerHTML = content;
}

let buildExpertContent = function(experts){
    let content = '';
    let tabattribute = "organization"
    let distincttabs = getDistinctAttributes(experts, tabattribute);
    content = createTabNavigation(distincttabs, tabattribute);
    let tabContent = [];
    for(let i = 0; i< distincttabs.length; i++){
        let tabexperts = experts.filter(function(expert){
            return expert[tabattribute] == distincttabs[i];
        });
        let tabId = tabattribute + i.toString();
        tabContent.push(buildExperts(tabId, tabexperts));
    }
    content += buildTabContent(distincttabs, tabattribute, tabContent);
    return content;
}

//Start with level1 accordion and build one by one the levels going down.
//this is nestted accordion that can go upto 4 levels
let buildExperts = function(tabId, tabexperts){
    let counter = 1; 
    let contactElem = '';
    contactElem += '<div id = "' + tabId + '">';
    let distinctLevel1s = getDistinctAttributes(tabexperts, 'level1');
        distinctLevel1s.sort();
        for(var i =0; i < distinctLevel1s.length; i++){
            if(distinctLevel1s[i] === "Other"){
                distinctLevel1s.splice(i, 1);
                distinctLevel1s.push("Other");
                break;
            }
        }
        distinctLevel1s.forEach(function(level1) {
            let collapseId1 = "collapse" + counter;
            let headerId1 = "heading" + counter;
            let childId1 = "child" + counter;
            counter++;
            let level2Elem = '';
            //filter level2s
            let level2s = tabexperts.filter(function(expert){
                return expert.level1 == level1;
            }); 
            if(level2s.length > 0)
            {
                let distinctLevel2s = getDistinctAttributes(level2s, 'level2');
                distinctLevel2s.sort();
                distinctLevel2s.forEach(function(level2){
                    counter++;
                    //filter level3 
                    let level3s = level2s.filter(function(expert){
                        return expert.level2 == level2;
                    });
                    level3s.sort((a,b) => b.firstName - a.firstName)
                    //for level2s build simple list
                    level2Elem+= buildExpertElements(level3s);
                });
            }  
            contactElem+= generateAccordionElem(1, collapseId1, headerId1, tabId, childId1, level1, level2Elem);
        });
    contactElem += '</div>';
    //end level1 accordion
    return contactElem;
}

let buildExpertElements = function(experts){
    let content = '';
    for(var i=0; i< experts.length; i++){
        let expert = experts[i];
        let institution = expert.level2 != "Other" ? expert.level2 + ', ' + expert.level1 : expert.level1 != "Other"? expert.level1 : "";
        content += '<div class = "search-container expert-info"><img class = "expert-image" src = "assets/images/' + (expert.photo != ''? 'experts/'+ expert.photo : 'placeholder.jpg') +'"/> <h2 class = "content-header-no-margin">' +
                    '<a class = "no-link-decoration" href = ' + expert.institutePage + '>' + expert.firstName + ' '+ expert.lastName + '</a></h2><h5 class = "content-header-no-margin faculty-title">'+ (expert.title != ''? expert.title + ',<br>':'') +
                    institution + '</h5>'+ generateLogoContent(expert) +'<p class = "faculty-description"><strong>Email: </strong> <a class = "email-link" href = mailto:' + expert.email + 
                    '>'+ expert.email+ '</a><br>'+ (expert.phone != ""? '<strong>Phone: </strong>'+ expert.phone + '<br>': "")+'<strong>Research Interests: </strong>'+ (expert.researchInterests == 'N/A'? "to be updated" : expert.researchInterests) + '</p><p>' + 
                    expert.researchDescription +'</p>'+ generateProjectsContent(expert.projects) +'</div>';
    }
    return content;
}

let generateProjectsContent = function(projects){
    let linkContent = '';
    for(let i = 0; i < projects.length; i++)
    {
      if('' != projects[i])
      {
        linkContent = linkContent + '<li>'+ projects[i] + '</li>';
      }
    }
    linkContent = (projects.length > 0)?
    '<b class = "purple-font">Ongoing Research/Scholarship Related Projects</b><ul class = "sub-list">'
    + linkContent + '</ul>': '';
    return linkContent;
}

let generateLogoContent = function(expert){
    let onlineCVContent = (expert.onlineCV == '')?'':
    '<a href = "'+ expert.onlineCV +'"><img src = "assets/images/cv.png"></a>'; 
    let researchGateContent = (expert.researchGate == '')?'':
    '<a href = "'+ expert.researchGate +'"><img src = "assets/images/research-gate-logo.png"></a>'; 
    let googleScholarContent = (expert.googleScholar == '')?'':
    '<a href = "'+ expert.googleScholar +'"><img src = "assets/images/google-scholar-logo.png"></a>'; 
    let otherContent = (expert.otherlink == '')?'':
    '<a href = "'+ expert.otherlink +'"><img src = "assets/images/link.png"></a>'; 
    let linkContainer = '<div class = "display-flex icon-container">'+
    onlineCVContent + researchGateContent + googleScholarContent + otherContent + '</div>';
    return linkContainer;
}

$('.carousel').carousel({pause: false});