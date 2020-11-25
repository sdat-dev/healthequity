let addTopMenu = function(){
    let navheader = document.getElementById('navbar-header');
    let headerContent = '<div class="ualbany-logo-wrapper">'+
                            '<div class = "display-flex">'+
                                '<div class = "col-xl-3 col-lg-3 col-md-3 d-flex justify-content-center">' +
                                    '<a href="https://www.ualbany.edu/">'+
                                        '<img class="img-fluid ualbany-logo" alt="Responsive image" src="assets/images/logo.png" />'+
                                    '</a>'+
                                '</div>'+ 
                                '<div class = "col-xl-2 col-lg-2 col-md-2 d-flex justify-content-center">' +
                                    '<a href="https://health.ny.gov/">'+
                                        '<img class="img-fluid nysdoh-logo" alt="Responsive image" src="assets/images/NYSDoH.png" />'+
                                    '</a>'+
                                '</div>'+ 
                                '<div class = "col-xl-2 col-lg-2 col-md-2 d-flex justify-content-center">' +
                                    '<a href="https://www.suny.edu/">'+
                                        '<img class="img-fluid sunny-logo" alt="Responsive image" src="assets/images/SUNY-Logo.png" />'+
                                    '</a>'+
                                '</div>'+  
                                '<div class = "col-xl-2 col-lg-2 col-md-2 d-flex justify-content-center">' +
                                    '<a href="https://www.downstate.edu/">'+
                                        '<img class="img-fluid downstate-logo" alt="Responsive image" src="assets/images/SUNY-Downstate-Logo.png" />'+
                                    '</a>'+
                                '</div>'+  
                                '<div class = "col-xl-3 col-lg-3 col-md-3 d-flex justify-content-center">' +
                                    '<a href="https://www.upstate.edu/">'+
                                        '<img class="img-fluid upstate-logo" alt="Responsive image" src="assets/images/SUNY-Upstate-Logo.png" />'+
                                    '</a>'+
                                '</div>'+  
                            '</div>'+     
                        '</div>';
    navheader.innerHTML = headerContent;
}

addTopMenu();

