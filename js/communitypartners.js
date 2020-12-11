$(window).on("load", function () {
    let requestURL = "data/communitypartners.json"; 
    let datarequestURL = "data/facultydata.json"; 
    let request =  axios.get(requestURL);
    let datarequest =  axios.get(datarequestURL);
    let maincontentContainer = document.getElementsByClassName('main-content')[0];
    axios.all([request, datarequest]).then(axios.spread((...responses) => {
        let partnerspage =  responses[0].data;
        let data = responses[1].data;
        let partners = data.filter(function(item){
            return item["Q31_1"] == "Yes, I'd like to have my community organization included.";
        });
        let webelements = partnerspage.content;
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
        content +='<div id="experts-content">'+buildPartnersContent(partners)+'</div>';
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

let buildPartnersContent = function(partners){
    let content = '';
    for(var i=0; i< partners.length; i++){
        content +='<div class = "search-container expert-info"><img class = "expert-image" src = "assets/images/experts/' + (partners[i]["Q44_Name"] != ''? partners[i].ResponseId+'_'+partners[i]["Q44_Name"]  : 'placeholder.jpg') +'"/> <h2 class = "content-header-no-margin">' +
        '<a class = "no-link-decoration" href = ' + partners["Q4.3_4"] + '>' + partners[i].Q12 + ' '+ partners[i].Q11 + '</a></h2><h5 class = "content-header-no-margin faculty-title">'+ (partners[i].Q15 != ''? partners[i].Q15 + ',<br>':'') +
        getInstitution(partners[i]) + '</h5>'+'<p class = "faculty-description"><strong>Email: </strong> <a class = "email-link" href = mailto:' + partners[i].Q13 + 
        '>'+ partners[i].Q13+ '</a><br>'+ (partners[i].Q14 != ""? '<strong>Phone: </strong>'+ partners[i].Q14 + '<br>': "")+'<strong>Research Interests: </strong>'+ getResearchInterests(partners[i]) + '</p><p>' + 
        partners[i].Q61 +'</p></div>';
    }
    return content;
}

let getInstitution = function(partner){
    let institution = "";
    if(partner.Q16 == "University"){
        institution = partner.Q17;
    }
    else if(expert.Q16 == "Community Partner")
    {
        institution = expert.Q110;
    }
    else
    {
        institution = partner["Q17_4_TEXT"];
    }
    return institution;
}

let getResearchInterests = function(partner){
    let interests = "";
    interests += (partner["Q51_1"] == ''?"": partner["Q51_1"]+"; ") + (partner["Q51_14"] == ''?"": partner["Q51_14"]+"; ")+ (partner["Q51_15"] == ''?"": partner["Q51_15"]+"; ")+ (partner["Q51_16"] == ''?"": partner["Q51_16"]+"; ") + partner["Q51_17"]; 
    return interests;
}

$('.carousel').carousel({pause: false});