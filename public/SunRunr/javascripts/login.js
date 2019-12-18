var divToChange = $("#ifFailure");

function submitLogin() {
  let username = $('#userName').val();
  let password = $('#password').val();
  
  if (password == "") {
    $('#password').addClass('invalid');
    $('.pw').append('<span class="helper-text" data-error="Please enter a password."></span>');
  }
  else {
    $('#password').removeClass('invalid');
  }

  if (htmlTxt != '') {
    divToChange.html(htmlTxt);
    divToChange.show();
    return;
  }
  else {
    divToChange.hide();
  }

  $.ajax({
  url: '/users/login',
  type: 'POST',
  contentType: 'application/json',
  data: JSON.stringify({username:username, password:password}),
  dataType: 'json'
  })
    .done(loginSuccess)
    .fail(loginError);
}

function loginSuccess(data, textStatus, jqXHR) {
  if (data.success) {
    window.localStorage.setItem('authToken', data.authToken);
    window.localStorage.setItem('username', $('#userName').val()); 
    window.location.replace("homepage.html");
  }
  else {
    divToChange.html("<span class='red-text text-darken-2'>Error: " + data.message + "</span>");
    divToChange.show();
  }
}

function loginError(jqXHR, textStatus, errorThrown) {
  if (jqXHR.statusCode == 404) {
    divToChange.html("<span class='red-text text-darken-2'>Server could not be reached.</p>");
	  divToChange.show();
  }
  else {
    divToChange.html("<span class='red-text text-darken-2'>Error: " + jqXHR.responseJSON.message + "</span>");
    divToChange.show();
  }
}

$(function() {  
  if (window.localStorage.getItem('authToken')) {
    window.location.replace('homepage.html'); // Detects if user is already logged in and redirects them if they are
  }
  else {
    $('#download-button').click(submitLogin);
    $('#password').keypress(function(event) {
      if (event.which === 13) {
        submitLogin();
      }
    });
  }
});

function openNav() { document.getElementById("menu").style.width = "250px";}

function closeNav() {document.getElementById("menu").style.width = "0";}


/*
function logout() {

var ajax = new XMLHttpRequest();
ajax.open("GET", "controller.php?action=logout", true);
ajax.send();  // Logging out might need local storage of the login info to be cleared, not sure though
    ajax.onreadystatechange = function(){
    if(ajax.readyState==4 && ajax.status==200){
        window.location.replace("homepage.php");
    }
    }
} */ 