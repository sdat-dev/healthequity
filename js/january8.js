let requestURL = "data/january8.json";
let request = new XMLHttpRequest();
//getting content Element to append grants information
let maincontentContainer = document.getElementsByClassName('main-content')[0];
request.open('GET', requestURL);
request.responseType = 'json';
request.send();
request.onload = function(){
    let content = '';
    const sessionsjson = request.response;
    //condition for checking if browser is Internet Explorer
    let sessions =  ((false || !!document.documentMode))? JSON.parse(sessionsjson): sessionsjson;
    content = buildSessionContent(sessions);
    let contentElement = document.createElement('div');
    contentElement.classList.add('content');
    contentElement.innerHTML = content.trim();
    maincontentContainer.appendChild(contentElement);
    addfooter();
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
            return object.Role == "Panelist";
        });

        let moderators = session.filter(function(object){
            return object.Role == "Moderator";
        });

        conent +=   '<section class="session">'+
                        '<h3 class="content-header">'+ session[0].SessionTitle +'</h3>'+ 
                        '<h4>Time: '+ getTime(session[0].StartTime) +' - '+ getTime(session[0].EndTime) +', January 8</h4>'+
                        '<h4>Zoon Link: <a href="'+ session[0].ZoomLink + '">'+session[0].ZoomLink+'</a></h4>' +
                        '<p>'+ session[0].PanelDescription +'</p>'+
                        '<div class = "display-flex">'+
                        '<div class= "col-xs-12"><h3 class="content-header">Panelists</h3></div>';
        for(var j = 0; j < panelists.length; j++){
            let member = panelists[j];
            conent += '<div class= "col-lg-3 col-md-3 col-sm-3" id="'+ (member.FirstName.replace(/ /g, '')) +'">'+
            '   <p class="text-center"><a target="_blank" href="' + member.FirstName.toLowerCase() + member.LastName.toLowerCase()+ '.html">'+
            '   <img class="img-fluid mx-auto d-block panelist-img img-thumbnail" src="assets/images/Panelists/' + member.Photo + '" alt="panelist photo"></a></p>'  +
            '   <p class="panelist-info dont-break-out"><class="name">' +  member.FirstName + ' ' + member.LastName + (member.DegreeCredential == ''? ",": ', ' + member.DegreeCredential+ ',') + '</name>'+
            '   <br><span class="jobtitle">' + member.JobTitle + ',' +
            (member.Department == ""? "": '<br><span class="department">' + member.Department + ',') +  
            '   <br><span class="organization">' + member.Organization +
            '   </p>' + 
            '</div>';   
        }
        if(moderators.length != 0){
            conent +=   '</div>'+
                    '<div class = "display-flex">'+
                        '<div class= "col-xs-12"><h3 class="content-header">Moderator</h3></div>';
            for(var j = 0; j < moderators.length; j++){
                let member = moderators[j];
                conent += '<div class= "col-lg-3 col-md-3 col-sm-3" id="'+ (member.FirstName.replace(/ /g, '')) +'">'+
                '   <p class="text-center"><a target="_blank" href="' + member.FirstName.toLowerCase() + member.LastName.toLowerCase()+ '.html">'+
                '   <img class="img-fluid mx-auto d-block member-img img-thumbnail" src="assets/images/Panelists/' + member.Photo + '" alt="member photo"></a></p>'  +
                '   <p class="member-info dont-break-out">' +  member.FirstName + ' ' + member.LastName + (member.DegreeCredential == ''? "": ', ' + member.DegreeCredential) +
                '   <br><span class="jobtitle dont-break-out">' + member.JobTitle +
                (member.Department == ""? "": '<br><span class="department dont-break-out">' + member.Department) +  
                '   <br><span class="organization dont-break-out">' + member.Organization +
                '   </p>' + 
                '</div>'; 
            }
        }
        conent += '</div></section>';
    }
    return conent;
}