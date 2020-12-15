$(window).on("load", function () {
    let requestURL = "data/researchers.json"; 
    let datarequestURL = "data/researchersdata.json"; 
    let request =  axios.get(requestURL);
    let datarequest =  axios.get(datarequestURL);
    let maincontentContainer = document.getElementsByClassName('main-content')[0];
    axios.all([request, datarequest]).then(axios.spread((...responses) => {
        let expertspage =  responses[0].data;
        let data = responses[1].data;
        let experts = data.filter(function(item){
            return item["Q31_1"] == "Yes, I'd like to have my research profile/expertise included.";
        });
        let webelements = expertspage.content;
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
        content += '<input id = "search-box" placeholder = "Search Experts...">'+
                    '<button id = "search-button" type = "submit"><i class="fa fa-search"></i></button>'+
                '<br><span id = "search-box-results"></span>';
        content +='<div id="experts-content">'+buildExpertContent(experts)+'</div>';
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
});

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
    let universityExperts = experts.filter(function(expert){
        return expert["Q16"] == "University";
    });
    let nonuniversityExperts = experts.filter(function(expert){
        return expert["Q16"] != "University";
    });
    let tabattribute = "Q17"
    let distincttabs = getDistinctUniversities(universityExperts);
    distincttabs.push("Other Organizations");
    content = createTabNavigation(distincttabs, tabattribute);
    let tabContent = [];
    for(let i = 0; i< distincttabs.length; i++){
        let tabexperts = universityExperts.filter(function(expert){
            return (expert.Q17 == distincttabs[i]) || (expert["Q17_4_TEXT"] == distincttabs[i]);
        });
        let tabId = "";
        if(distincttabs[i] != "Other Organizations")
        {
            tabId = tabattribute + i.toString();
            tabContent.push(buildUniversityExperts(tabId, tabexperts));
        }
        else
        {
            tabId = tabattribute + i.toString();
            tabContent.push(buildNonUniversityExperts(tabId, nonuniversityExperts));
        }
        
    }

    content += buildTabContent(distincttabs, tabattribute, tabContent);
    return content;
}

let getDistinctUniversities = function(experts){
    let mappedAttributes = experts.map(function(expert){
        return expert.Q17 != "Other" ? expert.Q17 : expert["Q17_4_TEXT"];
    });
    let distinctAttributes = mappedAttributes.filter(function(v, i, a){
        return a.indexOf(v) === i;
     });

    return distinctAttributes;
}
//Start with level1 accordion and build one by one the levels going down.
//this is nestted accordion that can go upto 4 levels
let buildUniversityExperts = function(tabId, tabexperts){
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
                level2Elem+= buildUniversityExpertElements(level3s);
            });
        }  
        contactElem+= generateAccordionElem(1, collapseId1, headerId1, tabId, childId1, level1, level2Elem);
    });
    contactElem += '</div>';
    //end level1 accordion
    return contactElem;
}

let buildUniversityExpertElements = function(experts){
    let content = '';
    for(var i=0; i< experts.length; i++){
        if(experts[i].Q12 == "") //skip of there is no first name
            continue;
        let expert = experts[i];
        content +='<div class = "search-container expert-info">'+
        '<img class = "expert-image" src = "assets/images/researchers/' + (expert["Q44_Name"] != ''? expert.ResponseId+'_'+expert["Q44_Name"]  : 'placeholder.jpg') +'"/>'+
        '<h2 class = "content-header-no-margin">'+ (expert["Q43_9"] == ""? expert.Q12 + ' '+ expert.Q11 : '<a class = "no-link-decoration" href = ' + expert["Q43_9"] + '>' + expert.Q12 + ' '+ expert.Q11 + '</a>') + '</h2>'+
        '<h5 class = "content-header-no-margin faculty-title">'+ (expert.Q15 != ''? expert.Q15 + ',<br>':'') + (expert.Q18 != ''? expert.Q18 + ', ':'') + expert.Q17 + '</h5>' +
        generateLogoContent(expert) +'<p class = "faculty-description"><strong>Email: </strong> <a class = "email-link" href = mailto:' + expert.Q13 + 
        '>'+ expert.Q13+ '</a><br>'+ (expert.Q14 != ""? '<strong>Phone: </strong>'+ expert.Q14 + '<br>': "")+'<strong>Research Interests: </strong>'+ 
        getResearchInterests(expert) + '</p><p>' + expert.Q42 +'</p>'+ generateProjectsContent([expert["Q51_1"],expert["Q51_14"],expert["Q51_15"],expert["Q51_16"],expert["Q51_17"]])+'</div>';
    }
    return content;
}

let buildNonUniversityExperts = function(tabId, tabexperts){
    let counter = 1; 
    let contactElem = '';
    contactElem += '<div id = "' + tabId + '">';
    let distinctLevel1s = getDistinctAttributes(tabexperts, 'Q110');
    distinctLevel1s.sort();
    distinctLevel1s.forEach(function(level1) {
        let collapseId1 = "collapse" + counter;
        let headerId1 = "heading" + counter;
        let childId1 = "child" + counter;
        counter++;
        let level2Elem = '';
        //filter level2s
        let level2s = tabexperts.filter(function(expert){
            return expert.Q110 == level1;
        }); 
        if(level2s.length > 0)
        {
            let distinctLevel2s = getDistinctAttributes(level2s, 'Q111');
            distinctLevel2s.sort();
            distinctLevel2s.forEach(function(level2){
                //filter level3 
                let level3s = level2s.filter(function(expert){
                    return expert.Q111 == level2;
                });
                level3s.sort((a,b) => b.firstName - a.firstName)
                //for level2s build simple list
                level2Elem+= buildNonUniversityExpertElements(level3s);
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

let buildNonUniversityExpertElements = function(experts){
    let content = '';
    for(var i=0; i< experts.length; i++){
        if(experts[i].Q12 == "") //skip of there is no first name
            continue;
        let expert = experts[i];
        content +='<div class = "search-container expert-info"><img class = "expert-image" src = "assets/images/researchers/' + (expert["Q44_Name"] != ''? expert.ResponseId+'_'+expert["Q44_Name"]  : 'placeholder.jpg') +'"/>'+
        '<h2 class = "content-header-no-margin">'+ (expert["Q43_9"] == ""? expert.Q12 + ' '+ expert.Q11 : '<a class = "no-link-decoration" href = ' + expert["Q43_9"] + '>' + expert.Q12 + ' '+ expert.Q11 + '</a>') + '</h2>'+
        '<h5 class = "content-header-no-margin faculty-title">'+ (expert.Q15 != ''? expert.Q15 + ',<br>':'') +
        (expert.Q111 == ''? '' : expert.Q111 + ', ') + expert.Q110 + '</h5>'+ generateLogoContent(expert) +
        '<p class = "faculty-description"><strong>Email: </strong> <a class = "email-link" href = mailto:' + expert.Q13 + '>'+ expert.Q13+ '</a><br>'+ 
        (expert.Q14 != ""? '<strong>Phone: </strong>'+ expert.Q14 + '<br>': "")+'<strong>Research Interests: </strong>'+ getResearchInterests(expert) + '</p>'+
        '<p>' + experts[i].Q42 +'</p>'+generateProjectsContent([expert["Q51_1"],expert["Q51_14"],expert["Q51_15"],expert["Q51_16"],expert["Q51_17"]])+'</div>';
    }
    return content;
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

$('.carousel').carousel({pause: false});