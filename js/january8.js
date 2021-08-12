window.onload = function () {
    let requestURL = "https://sdat-dev.github.io/resources/healthequity/data/january8.json"; 
    let datarequestURL = "https://sdat-dev.github.io/resources/healthequity/data/sessiondata.json"; 
    let request =  axios.get(requestURL);
    let datarequest =  axios.get(datarequestURL);
    let maincontentContainer = document.getElementsByClassName('main-content')[0];
    axios.all([request, datarequest]).then(axios.spread((...responses) => {
        let webelements =  responses[0].data;
        let sessiondata  = responses[1].data;

        let content = getContent(webelements);
        sessions = sessiondata.filter(function(item){
            return item.Day == "1/8/2021";
        });
        content += buildSessionContent(sessions);
        let contentElement = document.createElement('div');
        contentElement.classList.add('content');
        contentElement.innerHTML = content.trim();
        maincontentContainer.appendChild(contentElement);
        addfooter();
    })).catch(errors => {
        console.log(errors);
    })
}

function getTime(decimaltime) {
    var hrs = parseInt(Number(decimaltime * 24));
    var min = Math.round((Number(decimaltime * 24)-hrs) * 60);
    if(min < 10){
        min = '0' + min;
    }
    let time  = "";
    if(hrs < 12 )
        time = hrs+':'+min + ' ' + 'AM';
    else if (hrs > 12)
        time = (hrs -12) +':'+min + ' ' + 'PM';
    else
        time = hrs+':'+min + ' ' + 'PM';

    return time; 
}

let buildSessionContent =  function (sessions){
    let conent  = '';
    let distinctTitles = getDistinctAttributes(sessions, "SessionTitle");
    for(var i =0; i < distinctTitles.length; i++){
        let session = sessions.filter(function(session){
            return session.SessionTitle == distinctTitles[i];
        });

        let panelists = session.filter(function(object){
            return object.Role == "Panelist" && 
            object.FirstName != "" && object.LastName != "";
        });

        let moderators = session.filter(function(object){
            return object.Role == "Moderator" && 
            object.FirstName != "" && object.LastName != "";
        });
        console.log(session[0]);
        conent +=   '<section class="session">'+
                        '<h3 class="content-header">'+ session[0].SessionTitle +'</h3>'+ 
                        '<h4>Time: '+ getTime(session[0].StartTime) +' - '+ getTime(session[0].EndTime) +', January 8</h4>'+
                        (session[0].ZoomLink == ""? "": '<h4>Session Link: <a href="'+ session[0].Video + '">Click here!</a></h4>') +
                        '<h4><a href="'+ session[0].Summary +'">Summary</a></h4>'+
                        '<p><b>Description: </b>'+ session[0].PanelDescription +'</p>';
        if(panelists.length != 0){
            conent +='<div class = "display-flex">'+
            '<div class= "col-xs-12"><h3 class="content-header">Panelists</h3></div>';
            for(var j = 0; j < panelists.length; j++){
                let panelist = panelists[j];
                conent += '<div class= "col-lg-3 col-md-3 col-sm-3" id="'+ (panelist.FirstName.replace(/ /g, '')) +'">'+
                '   <p class="text-center"><a href="'+ ((panelist.FirstName == ""|| panelist.LastName == "")? '#':'agenda/' + 
                (panelist.FirstName.split(/\.|\ |\,|-/).join("") + panelist.LastName.split(/\.|\ |\,|-/).join("")).toLowerCase()+ '.html') +'">'+
                '   <img class="img-fluid mx-auto d-block panelist-img img-thumbnail" src="https://sdat-dev.github.io/resources/healthequity/assets/images/Panelists/' + panelist.Photo + '" alt="panelist photo"></a></p>'  +
                '   <p class="panelist-info dont-break-out"><span class="name">' +  panelist.FirstName + ' ' + panelist.LastName + '</span>' + (panelist.DegreeCredential == ''? "": ', ' + panelist.DegreeCredential) +
                (panelist.JobTitle == ""? "" : '<br><span class="jobtitle">' + panelist.JobTitle + '</span>,')+
                (panelist.Department == ""? "": '<br><span class="department">' + panelist.Department + '</span>,') + 
                (panelist.Organization  == ""? "": '<br><span class="organization">' + panelist.Organization + '</span>')+
                '   </p>' + 
                '</div>';   
            }
            conent +='</div>';
        }
        if(moderators.length != 0){
            conent +='<div class = "display-flex">'+
                        '<div class= "col-xs-12"><h3 class="content-header">Moderator</h3></div>';
            for(var j = 0; j < moderators.length; j++){
                let moderator = moderators[j];
                conent += '<div class= "col-lg-3 col-md-3 col-sm-3" id="'+ (moderator.FirstName.replace(/ /g, '')) +'">'+
                '   <p class="text-center"><a href="'+ ((moderator.FirstName == ""|| moderator.LastName == "")? '#':'agenda/' + 
                (moderator.FirstName.split(/\.|\ |\,|-/).join("") + moderator.LastName.split(/\.|\ |\,|-/).join("")).toLowerCase()+ '.html') +'">'+
                '   <img class="img-fluid mx-auto d-block panelist-img img-thumbnail" src="https://sdat-dev.github.io/resources/healthequity/assets/images/Panelists/' + moderator.Photo + '" alt="panelist photo"></a></p>'  +
                '   <p class="panelist-info dont-break-out"><span class="name">' +  moderator.FirstName + ' ' + moderator.LastName + '</span>' + (moderator.DegreeCredential == ''? "": ', ' + moderator.DegreeCredential) +
                (moderator.JobTitle == ""? "" : '<br><span class="jobtitle">' + moderator.JobTitle + '</span>,')+
                (moderator.Department == ""? "": '<br><span class="department">' + moderator.Department + '</span>,') + 
                (moderator.Organization  == ""? "": '<br><span class="organization">' + moderator.Organization + '</span>')+
                '   </p>' + 
                '</div>'; 
            }
            conent += '</div>';
        }
        conent += '</section>';
    }
    return conent;
}