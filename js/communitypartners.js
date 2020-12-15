$(window).on("load", function () {
    let requestURL = "data/communitypartners.json"; 
    let datarequestURL = "data/researchersdata.json"; 
    let request =  axios.get(requestURL);
    let datarequest =  axios.get(datarequestURL);
    let maincontentContainer = document.getElementsByClassName('main-content')[0];
    axios.all([request, datarequest]).then(axios.spread((...responses) => {
        let partnerspage =  responses[0].data;
        let data = responses[1].data;
        let partners = data.filter(function(item){
            return item["Q31_2"] == "Yes, I'd like to have my community organization included.";
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
        if(partners[i].Q12 == "")
            continue;
        content +='<div class = "search-container partner-info">'+//<img class = "expert-image" src = "assets/images/experts/' + (partners[i]["Q44_Name"] != ''? partners[i].ResponseId+'_'+partners[i]["Q44_Name"]  : 'placeholder.jpg') +'"/>'+
        '<h2 class = "content-header-no-margin">'+ (partners[i].Q62 != ""? '<a class = "no-link-decoration" href = ' + partners[i].Q62 + '>' + partners[i].Q61 + '</a>': partners[i].Q61) +'</h2>'+
        '<p class = "address"><span>Address: </span>'+ getAddress(partners[i]) + '</p>'+
        '<p class = "poc"><span>Point Of Contact: </span>'+ getPointOfContact(partners[i]) + '</p>'+
        '<p class = "mav"><span>Mission and Vision: </span></br>' + formatText(partners[i].Q64) +'</p></div>';
    }
    return content;
}

let getAddress = function(partner){
    let address = "";
    if(partner.Q65 != ""){
        address += partner.Q65;
    }
    if(partner.Q66 != "")
    {
        address = address == ""? partner.Q66 : (address + ", " +  partner.Q66);
    }
    if(partner.Q67 != "")
    {
        address = address == ""? partner.Q67 : (address + ", " +  partner.Q67);
    }
    if(partner.Q68 != "")
    {
        address = address == ""? partner.Q68 : (address + ", " +  partner.Q68);
    }
    if(partner.Q69 != "")
    {
        address = address == ""? partner.Q69 : (address + ", " +  partner.Q69);
    }
    return address;
}

let getPointOfContact = function(partner){
    let pointofcontact = "";
    pointofcontact += partner.Q72 + " " + partner.Q71+ ", "+ partner.Q75 + ' (<a class = "email-link" href = mailto:' + partner.Q73 + 
    '>'+ partner.Q73+ '</a>'+ (partner.Q74 == ""? '' : ', '+ partner.Q74) +')'; 
    return pointofcontact;
}

let formatText = function(text){
    let result = '';
    let paras = text.split("\n\n");
    for(var i=0; i< paras.length; i++){
        let para = paras[i];
        if(para.includes("\n") == false && para.search(/d.\t/) == -1)
        {
            result += para;
        }
        else
        {
            let lines = para.split(/\n/);
            if(lines.length == 1)
            {
                result += lines[0]; 
            }
            else
            {
                for(var j =0; j< lines.length; j++)
                {
                    if(lines[j] == '') continue;
                    result += '<p>'+lines[j]+'</p>'; 
                }
            }
        }        
    }


    return result;
}

$('.carousel').carousel({pause: false});