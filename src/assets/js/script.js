// Active Class JS
function toggleActive(Id, db) {
  var element = document.querySelector(Id);
  element.classList.toggle(db);
}
function addActive(Id, db) {
  var element = document.querySelector(Id); 
  element.classList.add(db);
}
function removeActive(Id, db) {
  var element = document.querySelector(Id);
  element.classList.remove(db);
}

// 
$(document).ready(function () {
  $('.teb-holder button').click(function () {
    var tab_id = $(this).attr('data-tab');
    $('.teb-holder button').removeClass('active');
    $('.tab-main').removeClass('active');
    $(this).addClass('active');
    $("#" + tab_id).addClass('active');
  });
});

var $titleTab = $('.title_tab');
$('.title_tab.active').next('.inner_content').slideDown();
$titleTab.on('click', function(e) {  
e.preventDefault();  
  if ( $(this).hasClass('active') ) {
    $(this).removeClass('active');
    $(this).next().stop().slideUp(500);
    $(this).next().find('p').removeClass('show');
  } else {
    $(this).addClass('active');
    $(this).next().stop().slideDown(500);
    $(this).parent().siblings().children('.title_tab').removeClass('active');
    $(this).parent().siblings().children('.inner_content').slideUp(500);
    $(this).parent().siblings().children('.inner_content').find('p').removeClass('show');
    $(this).next().find('p').addClass('show');
  }
});

// otp
let digitValidate = function(ele){
  ele.value = ele.value.replace(/[^0-9]/g,'');
}

let tabChange = function(val){
    let ele = document.querySelectorAll('input');
    if(ele[val-1].value != ''){
      ele[val].focus()
    }else if(ele[val-1].value == ''){
      ele[val-2].focus()
    }   
}



