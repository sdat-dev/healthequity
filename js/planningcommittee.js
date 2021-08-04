let requestURL = "https://sdat-dev.github.io/resources/healthequity/data/planningcommittee.json"; 
let request = new XMLHttpRequest();
//getting content Element to append grants information
let maincontentContainer = document.getElementsByClassName('main-content')[0];
request.open('GET', requestURL);
request.responseType = 'json';
request.send();
request.onload = function(){
    const committeepagejson = request.response;
    //condition for checking if browser is Internet Explorer
    let committee =  ((false || !!document.documentMode))? JSON.parse(committeepagejson): committeepagejson;
    let webelements = committee.content;
    let members = committee.members;
    let content = getContent(webelements);
    content +=buildMembersContent(members);
    let contentElement = document.createElement('div');
    contentElement.classList.add('content');
    contentElement.innerHTML = content.trim();
    maincontentContainer.appendChild(contentElement);
    addfooter();
}

let buildMembersContent = function(members){
    let content = '<div class="display-flex">';
    for(var i=0; i< members.length; i++){
        let member = members[i];
        content +=  buildMemberElement(member);
    }
    content += '</div>'
    return content;
}

let buildMemberElement = function(member){
    let content = '';
    content +=  '<div class= "col-lg-4 col-md-4 col-sm-6 search-container" id="'+ (member.firstName.replace(/ /g, '')) +'">'+
    '   <p class="text-center"><a target="_blank" href="' + member.profilepage + '"><img class="img-fluid mx-auto d-block member-img img-thumbnail" src="https://sdat-dev.github.io/resources/healthequity/assets/images/Planning_Committee/' + member.photo + '" alt="member photo"></a></p>'  +
    '   <p class="member-info">' + buildNameElement(member) +
    '   <br><span class="jobtitle">' + member.title +
    '   <br><span class="organization">' + member.organization +
    '   <br><a href = mailto:' + member.email + ' class ="dont-break-out email-link">'+ member.email+ '</a>'+
    '   <br>'+ (member.phone != ""? member.phone : "" )+ 
    '   </p>' + 
    '</div>';   
    console.log("content:"+content);
    return content;
}

let buildNameElement = function(member){
  let content = '';
  if(member.profilepage != '')
  {
      content += '<a href = "'+ member.profilepage +'"><span class="name"><strong>' + member.firstName + ' ' + member.lastName + '</strong></a>';
  }
  else
  {
    content += '<span class="name"><strong>' + member.firstName + ' ' + member.lastName + '</strong>';
  }
  return content
}

$('.carousel').carousel({pause: false});