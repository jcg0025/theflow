$(document).ready(function() {
    var hamburger = document.getElementsByClassName('bar');
    var drop = document.getElementById('drop');
    var navDrop = document.getElementById('navDrop');
    var viewAdjust = null;
    var scrollTop = null;
    var navAdjust = null;
    var difference = null;

    $(window).scroll(function() { 
        scrollTop = $(this).scrollTop();
        viewAdjust = String((scrollTop + 139) * -1);
        navAdjust = String(scrollTop + 34);
        $('#view').css('margin-top', viewAdjust + 'px');
        navDrop.style.marginTop = navAdjust + 'px';
    });
    
    navDrop.addEventListener('mouseover', function() {
        drop.style.fill = '#216688';
        drop.style.stroke = '#04d7e9'
        for (var i = 0; i < hamburger.length; i++) {
            hamburger[i].style.background = 'white';
        }
    });
    navDrop.addEventListener('mouseleave', function() {
        drop.style.fill = '#216688';
        drop.style.stroke = 'white'
        for (var i = 0; i < hamburger.length; i++) {
            hamburger[i].style.background = '#04d7e9';
        }
    });
    
    // function mobileView() {
    //     console.log('mobile');
    // }
    // function defaultView() {
    //     console.log('default');
    // }

    // if (/Mobi/.test(navigator.userAgent)) {
    //     mobileView();
    // } 
    // window.addEventListener('resize', function(){
    //     if (/Mobi/.test(navigator.userAgent)) {
    //         mobileView();
    //     } else {
    //         defaultView();
    //     }
    // });
    

  
});