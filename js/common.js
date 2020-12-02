let sidemenuItems = [{"item":"Home","link":"home.html"},{"item":"Background","link":"background.html"},{"item":"Agenda","link":"agenda.html"},{"item":"Who is Participating","link":"whoisparticipating.html"},{"item":"How to Join","link":"howtojoin.html"},{"item":"Faculty Experts","link":"facultyexperts.html"},{"item":"Questions","link":"questions.html"}]
//SideMenu Start
//What evet written  before '//SideMenu Start' will be relace with sidemenuItems in automation scripts

let addsidemenu = function(page){
    let sidemenu = document.getElementById('navigation-bar');

    for(let i = 0; i < sidemenuItems.length; i++){
        let item = sidemenuItems[i];
        var addsubmenu = false;
        if(item.hasOwnProperty('subItems')){
            if(item == page)
            {
                addsubmenu = true;
            }
            else
            {
                let subitems = item.subItems;
                subitems.forEach(element => {
                    if(element.item == page)
                    {
                        addsubmenu = true;
                        return;
                    }
                });
            }
        }

        if( addsubmenu == false)
        {
            let link = '';
            if(item.hasOwnProperty('subItems') && item.link == '#')
            {
                link = item.subItems[0].link;
            } 
            else
            {
                link = item.link;
            }

            let menuItem = document.createElement("li");
            let menuItemContent = '<a href="' + link + '">'+ item.item +'</a>'; 
            menuItem.innerHTML = menuItemContent;
            menuItem.classList.add('navigation-items');
            menuItem.classList.add('hover-highlight');
            if(page == item.item)
            {
                menuItem.setAttribute("id", "active-page");
            }
            sidemenu.appendChild(menuItem);
        }
        else
        {
            if(item == page && item.link != '#')
            {
                let menuItem = document.createElement("li");
                let menuItemContent = '<a href="' + link + '">'+ item.item +'</a>'; 
                menuItem.innerHTML = menuItemContent;
                menuItem.classList.add('navigation-items');
                menuItem.classList.add('hover-highlight');
                if(page == item.item)
                {
                    menuItem.setAttribute("id", "active-page");
                }
                sidemenu.appendChild(menuItem);
            }

            let subitems = item.subItems;
            let submenu = '<ul id="sub-navigation-bar">';
            for(var j = 0; j< subitems.length; j++)
            {
                if(j == 0)
                {
                    submenu +='<li class="first-sub-navigation-item hover-highlight"';
                    if(page == subitems[j].item)
                    {
                        submenu += ' id = "active-page"';
                    }
                    submenu += '><a href="'+ subitems[j].link +'">'+ subitems[j].item +'</a></li>';
                }
                else if(j == subitems.length-1)
                {
                    submenu +='<li class="last-sub-navigation-item hover-highlight"';
                    if(page == subitems[j].item)
                    {
                        submenu += ' id = "active-page"';
                    }
                    submenu += '><a href="'+ subitems[j].link +'">'+ subitems[j].item +'</a></li>';
                }
                else
                {
                    submenu +='<li class="sub-navigation-items hover-highlight"';
                    if(page == subitems[j].item)
                    {
                        submenu += ' id = "active-page"';
                    }
                    submenu += '><a href="'+ subitems[j].link +'">'+ subitems[j].item +'</a></li>';
                }
            }
            let menuItem = document.createElement("li");
            let menuItemContent = '<a href="' + subitems[0].link + '">'+ item.item +'</a>' + submenu; 
            menuItem.innerHTML = menuItemContent;
            menuItem.setAttribute("id", "expanded-navigation-item");
            sidemenu.appendChild(menuItem);
        }
    }
}

let generateAccordionElem = function(level, collapseId, headerId, parentId, childId, header, accordionContent){
    var headerno = level + 2;
    let accordionElem =  '<div class = "card"><div class="card-header level'+ level +'" id="'+ headerId + '">' +
                            '<button class="btn btn-link" data-toggle="collapse" data-target="#'+ collapseId + '" aria-expanded="false" aria-controls="' + collapseId + '">'+
                            '<h'+ headerno +' class = "content-header-no-margin">' + header + '<i class="fas fa-chevron-down" style="padding-left:10px;"  ></i></h'+ headerno +'></button></div>'
                        + '<div id="'+ collapseId + '" class = "collapse" aria-labelledby= "'+ headerId + '" data-parent="#'+ parentId +'"> <div class = "card-body" id="'+ childId +'">'
                        + accordionContent +'</div></div></div>';  
    return accordionElem;
}

let createTabNavigation = function(distincttabs, tabname)
{
    let navigationContent = '<ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">';
    for(let i = 0; i< distincttabs.length; i++)
    {
        let buttonContent = '';
        let tabId = tabname + i.toString();
        if(i == 0)
        {
            buttonContent = '<a class="nav-link active" id="pills-'+ tabId +'-tab" data-toggle="pill" href="#pills-'+ tabId +'" role="tab" aria-controls="pills-'+ tabId +'" aria-selected="true">'+ distincttabs[i] +'</a>';
        }
        else
        {
            buttonContent = '<a class="nav-link" id="pills-'+ tabId +'-tab" data-toggle="pill" href="#pills-'+ tabId +'" role="tab" aria-controls="pills-'+ tabId +'" aria-selected="true">'+ distincttabs[i] +'</a>';
        }
        
        let linkElement = '<li class="nav-item">' + buttonContent + '</li>';
        navigationContent = navigationContent + linkElement;
    }
    navigationContent += '</ul>';
    return navigationContent;
}

let buildTabContent = function(distincttabs, tabname, tabContent){
    let content = '<div class="tab-content" id="pills-tabContent">';
    
    for(let i = 0; i< distincttabs.length; i++)
    {
        let tabId = tabname + i.toString();
        if(i == 0)
        {
            content +='<div class="tab-pane fade show active" id="pills-'+ tabId +'" role="tabpanel" aria-labelledby="pills-'+ tabId +'-tab">';
        }
        else
        {
            content +='<div class="tab-pane fade" id="pills-'+ tabId +'" role="tabpanel" aria-labelledby="pills-'+ tabId +'-tab">';
        }
        content += tabContent[i];
        content += '</div>';
    }
    content += '</div>';
    return content;
}

function getDate(serial){
    let utc_days  = Math.floor(serial - 25569);
    let utc_value = utc_days * 86400;                                        
    let date_info = new Date(utc_value * 1000);
    return (parseInt(date_info.getMonth(),10) + 1) + '/' + (parseInt(date_info.getDate(),10) + 1) + '/' + date_info.getFullYear();//, 0, minutes, seconds);
}

addfooter = function(){
    let footer = document.getElementById("footer");
    let content = "";
    content +='<div id="footer-content" class = "display-flex">'+
                    '<div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">'+
                        '<div class="footer-logo-wrapper">'+
                                '<img class="footer-logo" src="assets/images/footer-logo.JPG" />'+
                            '</a>'+
                        '</div>'+
                    '</div>'+
                    '<div class="col-lg-3 col-md-3 col-sm-3 col-xs-5">'+
                        '<ul class="footer-navigation">'+
                            '<li><a href="https://www.suny.edu/contact/">Contact Us</a></li>'+
                            '<li><a href="https://www.suny.edu/careers/">Careers at SUNY</a></li>'+
                            '<li><a href="https://www.suny.edu/attend/">Attend SUNY</a></li>'+
                            '<li><a href="https://www.suny.edu/about/">What is SUNY?</a></li>'+
                            '<li><a href="https://www.suny.edu/impact/">Why does SUNY Matter?</a></li>'+
                        '</ul>'+
                    '</div>'+
                    '<div class="col-lg-3 col-md-3 col-sm-3 col-xs-5">'+
                        '<ul class="footer-navigation">'+
                            '<li><a href="https://www.suny.edu/news/">News</a></li>'+
                            '<li><a href="https://www.suny.edu/privacy-policy/">Privacy Policies</a></li>'+
                            '<li><a href="https://www.suny.edu/accessibility/eit/">Web Accessibility</a></li>'+
                            '<li><a href="https://www.suny.edu/about/leadership/board-of-trustees/">Board of Trustees</a></li>'+
                            '<li><a href="https://www.suny.edu/covid19-tracker/">Health Alert</a></li>'+   
                        '</ul>'+
                    '</div>'+
                    '<div class="col-lg-3 col-md-3 col-sm-3 col-xs-5">'+
                        '<ul class="footer-navigation">'+
                        '<li><a href="https://idm.suny.edu/security/login/loginForm.do?redirectUrl=https://www2.sysadm.suny.edu/employeeservices%2Fmain%2Femployeeportal%2Ecfm%3F">SUNY Portal</a></li>'+
                        '<li><a href="https://idm.suny.edu/security/login/loginForm.do?redirectUrl=https%3A%2F%2Fidm.suny.edu%3A443%2FSSSO%2Fcustomauthn.jsp%3Frefid%3Did-khkcIOVKeZ4ZOuw4uvLpgcAuwXM-">SUNY Blue Login</a></li>'+
                        '<li><a href="https://sts.sysadm.suny.edu/adfs/ls/?client-request-id=4db6db32-4103-49b0-b03d-13feee01bac4&username=&wa=wsignin1.0&wtrealm=urn%3afederation%3aMicrosoftOnline&wctx=estsredirect%3d2%26estsrequest%3drQIIAY2Rv28SUQDH73FwAmok1cHFpGmMg-bgvcf9TjocHFYwnFRFShdy3L1XLsI9uB-t9C9wcOjk0NGRqXEwhsnBqS7MbdLZOBjjopMR4uLY7_DNd_om38_3Po-KyLgL_wmLKxchpUh0ySr9p3AtX8DnH5q8eVI_2bz55zuYfz4G2SgJpkXiJTOwMYjjcWSUSiyJh4y9LDJKfZeUFbnoslGJHTiljwAsAJilVKWsSlDTZLwslhFSZFR0dKyoiqSKLpYVUdJlKjqy1hdJGRMi9SFWMT1L3XhiJvEAr4yF_iH5mcpRFo56YxbFx_zQcqNXNWbuWWalAu1JUK9ubVcaklWdtDtW0pIIakVeh9hNJ3aGZseudZVn9S2vaj42t0fNBqmqjYNa4O5F7eThYJK0R2L0lEDNbj-qdOlzr7evt3taL8Q0kuiMvxS397ywnD9iwSkvsDEJfG-RBt_S1yBvZLP5AnebW-d-p8G7zJLvxZ23O-NMxn5z79eXcrTGnWZKktUZPNgJYR0dyn4iOy8sZ9-bUj0YmkpN9xu1QX9Xn4aMdLubyEBHAjgShLmQy_IFboOvttBXAfwQwOsr3Dx3iYfO8rcwxFBESETldaQaWDEkuLu4Cj5d5_4C0#">SUNY Email Login</a></li>'+
                        '<li><a href="https://www.suny.edu/sunytogether/">#SUNYTogether</a></li>'+
                        '</ul>'+
                    '</div>'+
                '</div>'+
                '<section id="copyright-content">'+
                '<p>© 2020 SUNY. All Rights Reserved.</p>'+
                '</section>';
    footer.innerHTML = content;
}

let getDistinctAttributes = function(objects, attribute){
    let mappedAttributes = objects.map(function(object){
        return object[attribute];
    });
    let distinctAttributes = mappedAttributes.filter(function(v, i, a){
        return a.indexOf(v) === i;
     });

    return distinctAttributes;
}

let appendMainContent = function(maincontentContainer, content){
    let mainContentElement = document.createElement('div');
    mainContentElement.classList.add('accordion');
    mainContentElement.id = 'accordionExample';
    mainContentElement.innerHTML = content.trim();
    maincontentContainer.appendChild(mainContentElement);
}
