window.onload = function () {
    let requestURL = "data/researchers.json"; 
    let datarequestURL = "data/researchersdata.json"; 
    let request =  axios.get(requestURL);
    let datarequest =  axios.get(datarequestURL);
    let maincontentContainer = document.getElementsByClassName('main-content')[0];
    axios.all([request, datarequest]).then(axios.spread((...responses) => {
        let researcherscontent =  responses[0].data;
        let researchers = responses[1].data;
        let webelements = researcherscontent;
        let content = '';
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
        content += '<input id = "search-box" placeholder = "Search Researchers...">'+
                    '<button id = "search-button" type = "submit"><i class="fa fa-search"></i></button>'+
                '<br><span id = "search-box-results"></span>';
        content +='<div id="experts-content">'+buildResearchersContent(researchers)+'</div>';
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

    })).catch(errors => {
        console.log(errors);
    })
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

let buildResearchersContent = function(experts){
    let content = '';
    let universityResearchers = experts.filter(function(expert){
        return (expert["Q16"] == "University") && (expert.Q17 != "Other (Please specify)");
    });
    let otherResearchers = experts.filter(function(expert){
        return (expert["Q16"] != "University") ||((expert["Q16"] == "University") && (expert.Q17 == "Other (Please specify)"));
    });
    let tabattribute = "Q17"
    let distincttabs = getDistinctAttributes(universityResearchers, 'Q17'); 
    distincttabs.push("Other Organizations");
    content = createTabNavigation(distincttabs, tabattribute);
    let tabContent = [];
    for(let i = 0; i< distincttabs.length; i++){
        let tabexperts = universityResearchers.filter(function(expert){
            return (expert.Q17 == distincttabs[i]) || (expert["Q17_4_TEXT"] == distincttabs[i]);
        });
        let tabId = "";
        if(distincttabs[i] != "Other Organizations")
        {
            tabId = tabattribute + i.toString();
            tabContent.push(buildUniversityResearchers(tabId, tabexperts));
        }
        else
        {
            tabId = tabattribute + i.toString();
            tabContent.push(buildOtherResearchers(tabId, otherResearchers));
        }
        
    }

    content += buildTabContent(distincttabs, tabattribute, tabContent);
    return content;
}

//Start with level1 accordion and build one by one the levels going down.
//this is nestted accordion that can go upto 4 levels
let buildUniversityResearchers = function(tabId, tabexperts){
    let counter = 1; 
    let contactElem = '';
    contactElem += '<div id = "' + tabId + '">';
    let distinctLevel1s = getDistinctAttributes(tabexperts, 'Q18');
    distinctLevel1s.sort();
    distinctLevel1s.forEach(function(level1) {
        let collapseId1 = "collapse" + counter;
        let headerId1 = "heading" + counter;
        let childId1 = "child" + counter;
        counter++;
        let level2Elem = '';
        //filter level2s
        let level2s = tabexperts.filter(function(expert){
            return expert.Q18 == level1;
        }); 

        if(level2s.length > 0)
        {
            let distinctLevel2s = getDistinctAttributes(level2s, 'Q19');
            distinctLevel2s.sort();
            distinctLevel2s.forEach(function(level2){
                //filter level3 
                let level3s = level2s.filter(function(expert){
                    return expert.Q19 == level2;
                });
                level3s.sort((a,b) => b.firstName - a.firstName)
                //for level2s build simple list
                level2Elem+= buildUniversityResearcherElements(level3s);
            });
        }  
        contactElem+= generateAccordionElem(1, collapseId1, headerId1, tabId, childId1, level1, level2Elem);
    });
    contactElem += '</div>';
    //end level1 accordion
    return contactElem;
}

let buildUniversityResearcherElements = function(researchers){
    let content = '';
    for(var i=0; i< researchers.length; i++){
        if(researchers[i].Q12 == "") //skip of there is no first name
            continue;
        let researcher = researchers[i];
        content +='<div class = "search-container expert-info">'+
        '<img class = "expert-image" src = "assets/images/researchers/' + (researcher["Q44_Name"] != ''? researcher.ResponseId+'_'+researcher["Q44_Name"]  : 'placeholder.jpg') +'"/>'+
        '<h2 class = "content-header-no-margin">'+ (researcher["Q43_9"] == ""? researcher.Q12 + ' '+ researcher.Q11 : '<a class = "no-link-decoration" href = ' + researcher["Q43_9"] + '>' + researcher.Q12 + ' '+ researcher.Q11 + '</a>') + '</h2>'+
        '<h5 class = "content-header-no-margin faculty-title" style = "font-size:20px;">'+ (researcher.Q15 != ''? researcher.Q15 + ',<br>':'') + (researcher.Q19 != ''? researcher.Q19 :'') + '</h5>' +
        generateLogoContent(researcher) +'<p class = "faculty-description"><strong>Email: </strong> <a class = "email-link" href = mailto:' + researcher.Q13 + 
        '>'+ researcher.Q13+ '</a><br>'+ (researcher.Q14 != ""? '<strong>Phone: </strong>'+ researcher.Q14 + '<br>': "")+'<strong>Research Interests: </strong>'+ 
        getResearchInterests(researcher) + '</p><p>' + researcher.Q42 +'</p>'+ generateProjectsContent([researcher["Q51_1"],researcher["Q51_14"],researcher["Q51_15"],researcher["Q51_16"],researcher["Q51_17"]])+
        generateRelevantCourses([researcher["Q52_1"],researcher["Q52_14"],researcher["Q52_15"],researcher["Q52_16"],researcher["Q52_17"]]) + '<div style="display:none">Counter:' + researcher.Q17 + '</div></div>';
    }
    return content;
}

let buildOtherResearchers = function(tabId, tabresearchers){
    let counter = 1; 
    let contactElem = '';
    contactElem += '<div id = "' + tabId + '">';
    let distinctLevel1s = getDistinctOrganizations(tabresearchers);
    distinctLevel1s.sort();
    distinctLevel1s.forEach(function(level1) {
        let collapseId1 = "collapse" + counter;
        let headerId1 = "heading" + counter;
        let childId1 = "child" + counter;
        counter++;
        let level2Elem = '';
        //filter level2s
        let level2s = tabresearchers.filter(function(researcher){
            return (researcher["Q16"] == "University") ? researcher["Q17_4_TEXT"] == level1 : (researcher["Q16"] == "Other (Please specify)")? researcher["Q16_6_TEXT"] == level1 : researcher.Q110 == level1;
        }); 
        if(level2s.length > 0)
        {
            let distinctLevel2s = getDistinctDivisions(level2s);
            distinctLevel2s.sort();
            distinctLevel2s.forEach(function(level2){
                //filter level3 
                let level3s = level2s.filter(function(researcher){
                    return (researcher["Q16"] == "University") ? researcher.Q19 == level2 : researcher.Q111 == level2;
                });
                level3s.sort((a,b) => b.firstName - a.firstName)
                //for level2s build simple list
                level2Elem+= buildOtherResearcherElements(level3s);
            });
        } 

        if(level1 == "")
        {
            level1 = "Other";
        }

        contactElem+= generateAccordionElem(1, collapseId1, headerId1, tabId, childId1, level1, level2Elem);
    });
    contactElem += '</div>';
    //end level1 accordion
    return contactElem;
}

let getDistinctOrganizations = function(researchers){
    let mappedAttributes = researchers.map(function(researcher){
        return  (researcher["Q16"] == "University") ? researcher["Q17_4_TEXT"] : (researcher["Q16"] == "Other (Please specify)")? researcher["Q16_6_TEXT"] : researcher.Q110;
    });
    let distinctOrganizations = mappedAttributes.filter(function(v, i, a){
        return a.indexOf(v) === i;
     });

    return distinctOrganizations;
}

let getDistinctDivisions = function(researchers){
    let mappedAttributes = researchers.map(function(researcher){
        return  (researcher["Q16"] == "University") ? researcher.Q19 : researcher.Q111;
    });
    let distinctDivisions = mappedAttributes.filter(function(v, i, a){
        return a.indexOf(v) === i;
     });

    return distinctDivisions;
}

let buildOtherResearcherElements = function(researchers){
    let content = '';
    for(var i=0; i< researchers.length; i++){
        if(researchers[i].Q12 == "") //skip of there is no first name
            continue;
        let researcher = researchers[i];
        content +='<div class = "search-container expert-info"><img class = "expert-image" src = "assets/images/researchers/' + (researcher["Q44_Name"] != ''? researcher.ResponseId+'_'+researcher["Q44_Name"]  : 'placeholder.jpg') +'"/>'+
        '<h2 class = "content-header-no-margin">'+ (researcher["Q43_9"] == ""? researcher.Q12 + ' '+ researcher.Q11 : '<a class = "no-link-decoration" href = ' + researcher["Q43_9"] + '>' + researcher.Q12 + ' '+ researcher.Q11 + '</a>') + '</h2>'+
        generateOtherResearcherTitle(researcher) + generateLogoContent(researcher) +
        '<p class = "faculty-description"><strong>Email: </strong> <a class = "email-link" href = mailto:' + researcher.Q13 + '>'+ researcher.Q13+ '</a><br>'+ 
        (researcher.Q14 != ""? '<strong>Phone: </strong>'+ researcher.Q14 + '<br>': "")+'<strong>Research Interests: </strong>'+ getResearchInterests(researcher) + '</p>'+
        '<p>' + researchers[i].Q42 +'</p>'+generateProjectsContent([researcher["Q51_1"],researcher["Q51_14"],researcher["Q51_15"],researcher["Q51_16"],researcher["Q51_17"]])+
        (researcher["Q16"] == "University" ? generateRelevantCourses([researcher["Q52_1"],researcher["Q52_14"],researcher["Q52_15"],researcher["Q52_16"],researcher["Q52_17"]]) : '') +
        '<div style="display:none">Counter:'+researcher.Q17+'</div></div>';
    }
    return content;
}

let generateOtherResearcherTitle = function(researcher){

    let title = '<h5 class = "content-header-no-margin faculty-title">'+ (researcher.Q15 != ''? researcher.Q15 + ',<br>':'');
    if(researcher["Q16"] == "University")
        title += (researcher.Q19 != ''? researcher.Q19 + ', ' :'') + (researcher.Q18 != ''? researcher.Q18 :'')  
    else
        title +=  (researcher.Q111 == ''? '' : researcher.Q111);
    title += '</h5>';
    return title;
}

let generateLogoContent = function(expert){
    let onlineCVContent = (expert["Q43_4"] == '')?'':
    '<a href = "'+ expert["Q43_4"] +'"><img src = "assets/images/cv.png"></a>'; 
    let researchGateContent = (expert["Q43_10"]== '')?'':
    '<a href = "'+ expert["Q43_10"] +'"><img src = "assets/images/research-gate-logo.png"></a>'; 
    let googleScholarContent = (expert["Q43_11"] == '')?'':
    '<a href = "'+ expert["Q43_11"] +'"><img src = "assets/images/google-scholar-logo.png"></a>'; 
    let otherContent = (expert["Q43_12"] == '')?'':
    '<a href = "'+ expert["Q43_12"] +'"><img src = "assets/images/link.png"></a>'; 
    let linkContainer = '<div class = "display-flex icon-container">'+
    onlineCVContent + researchGateContent + googleScholarContent + otherContent + '</div>';
    return linkContainer;
}

let getResearchInterests = function(expert){
    let interests = "";
    interests += (expert["Q41_1"] == ''?  "" : expert["Q41_1"] +"; " )+ (expert["Q41_8"] == ''?  "":expert["Q41_8"] +"; ") + (expert["Q41_9"] == ''?  "": expert["Q41_9"]+"; ") + (expert["Q41_10"]== ''?  "":expert["Q41_10"] +"; " )+
    (expert["Q41_11"] == ''?  "":expert["Q41_11"] +"; ") + (expert["Q41_12"]== ''?"":expert["Q41_12"]+"; ") + expert["Q41_13"] ; 
    return interests;
}

let generateProjectsContent = function(projects){
    let linkContent = '';
    let projectcount = 0;
    for(let i = 0; i < projects.length; i++)
    {
      if('' != projects[i])
      {
        linkContent = linkContent + '<li>'+ projects[i] + '</li>';
        projectcount++;
      }
    }
    linkContent = (projectcount > 0)?
    '<b class = "purple-font">Ongoing Research/Scholarship Related Projects</b><ul class = "sub-list">'
    + linkContent + '</ul>': '';
    return linkContent;
}

let generateRelevantCourses = function(courses){
    let courseContent = '';
    let count = 0;
    for(let i = 0; i < courses.length; i++)
    {
      if('' != courses[i])
      {
        courseContent = courseContent + '<li>'+ courses[i] + '</li>';
        count++;
      }
    }
    courseContent = (count > 0)?
    '<b class = "purple-font">RELEVANT COURSES</b><ul class = "sub-list">'
    + courseContent + '</ul>': '';
    return courseContent;
}

//Search Function

searchfunction = function () {
    //getting search-box Element
    let searchbox = document.getElementById('search-box');
    let searchbutton = document.getElementById('search-button');

    //getting sub-accordions within accordions to toggle display
    let accordionContainers = document.getElementsByClassName('accordion-container');
    //getting accordionElems to toggle display
    let cardElems = document.getElementsByClassName('card');
    //getting individual content withing sub-accordions to toggle display
    let accordionContent = document.getElementsByClassName('accordion-content');
    //Setting display to none for all accordion and sub-accordionElems
    if (cardElems.length > 0) {
        for (let i = 0; i < cardElems.length; i++) {
            cardElems[i].style.display = "none";
        }
    }

    if (accordionContent.length > 0) {
        for (let i = 0; i < accordionContainers.length; i++) {
            accordionContainers[i].style.display = "none";
        }
    }

    //extracting search-text and trimming text to ignore additional-spaces
    let searchtext = searchbox.value.trim();
    let modifiedsearchtext = searchtext.replace(/\s+/g, '').toLowerCase();
    let uAlbanyText = ('Counter:UAlbany').replace(/\s+/g, '').toLowerCase();
    let uAlbanyDText = ('Counter:SUNY Downstate').replace(/\s+/g, '').toLowerCase();
    let uAlbanyUText = ('Counter:SUNY Upstate').replace(/\s+/g, '').toLowerCase();
    let uAlbanyOtherText = ('Counter:Other (Please specify)').replace(/\s+/g, '').toLowerCase();

    let searchElems = document.getElementsByClassName('search-container');

    //If search keyword length is greater than zero ie. User has typed something
    if (searchbox.value.length > 0) {
        //Storing total number of matches
        let matchcount = 0;
        let ualbanyCount = 0;
        let sunyDCount = 0;
        let sunyUCount = 0;
        let otherCount = 0;

        //Iterating through each content and validating if keyword is substring or not
        for (let i = 0; i < searchElems.length; i++) {
            if (searchElems[i].textContent.replace(/\s+/g, '').toLowerCase().indexOf(modifiedsearchtext) >= 0) {
                //Add another 'if' if the indivdual tabs
                if (searchElems[i].textContent.replace(/\s+/g, '').toLowerCase().indexOf(uAlbanyText)>=0) {
                    ualbanyCount++;
                }
                else if (searchElems[i].textContent.replace(/\s+/g, '').toLowerCase().indexOf(uAlbanyDText)>=0) {
                    sunyDCount++;
                    console.log();
                }
                else if (searchElems[i].textContent.replace(/\s+/g, '').toLowerCase().indexOf(uAlbanyUText)>=0) {
                    sunyUCount++;
                }
                else if (searchElems[i].textContent.replace(/\s+/g, '').toLowerCase().indexOf(uAlbanyOtherText)>=0) {
                    otherCount++;
                }
                //toggling display to block to show content
                searchElems[i].style.display = "block";
                //logic for search-box when accordion/sub-accordions are present to group content
                //Toggles visibility if the content within accordion/subaccordion contains substring
                if (cardElems.length > 0 && accordionContent.length > 0) {
                    searchElems[i].parentElement.style.display = "block";
                    // Accessing accordion-container class containeing content of sub-accordion
                    subaccordionElem = searchElems[i].parentElement.parentElement;
                    subaccordionElem.style.display = "block";
                    //Adding class show if main-accordion is in collapsed mode
                    subaccordionElem.parentElement.parentElement.classList.add('show');
                    subaccordionElem.parentElement.parentElement.parentElement.style.display = "block";
                }
                else if (cardElems.length > 0) {
                    searchElems[i].parentElement.style.display = "block";
                    searchElems[i].parentElement.parentElement.classList.add('show');
                    searchElems[i].parentElement.parentElement.parentElement.style.display = "block";
                }
                matchcount = matchcount + 1;
                //Updating search results
            }
            else {
                //If text doesn't match searchElement's display is toggled to none
                searchElems[i].style.display = "none";
            }
        }
        if (matchcount != 0) {
            document.getElementById('search-box-results').innerText = "Showing total " + matchcount + " results for: " + searchtext + " in UAlbany: " + ualbanyCount + ", SUNY Downstate: " + sunyDCount + ", SUNY Upstate: " + sunyUCount + " & Other Organization: " + otherCount;
        }
        else {
            document.getElementById('search-box-results').innerText = "No Results Found";
        }
    }
    else {
        document.getElementById('search-box-results').innerText = '';
        //When user clears search, toggling state of each subAccordionElems
        if (cardElems.length > 0 && accordionContainers.length > 0) {
            for (let i = 0; i < accordionContainers.length; i++) {
                accordionContainers[i].style.display = "block";
                accordionContainers[i].parentElement.parentElement.classList.remove('show');
            }
            //When user clears search, toggling state of each AccordionElems
            for (let i = 0; i < cardElems.length; i++) {
                cardElems[i].style.display = "block";
            }
            //When user clears search, toggling state of each individual group content
            for (let i = 0; i < accordionContent.length; i++) {
                accordionContent[i].style.display = "none";
            }
        }
        else if (cardElems.length > 0) {
            for (let i = 0; i < cardElems.length; i++) {
                cardElems[i].style.display = "block";
            }
            for (let i = 0; i < searchElems.length; i++) {
                searchElems[i].parentElement.parentElement.classList.remove('show');
            }
        }
        //When user clears search, toggling state of each individual content
        for (let i = 0; i < searchElems.length; i++) {
            searchElems[i].style.display = "block";
        }
    }
}

$('.carousel').carousel({pause: false});