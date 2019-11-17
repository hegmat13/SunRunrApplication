var divToChange = $("#ifFailure");

function submitRegister() {
  let username = $('#username').val();
  let password = $('#password').val();
  let zipcode = $('#zipcode').val();

  if (!isValidInput()) return;

  $.ajax({
   url: '/users/register',
   type: 'POST',
   contentType: 'application/json',
   data: JSON.stringify({username:username, zipcode:zipcode, password:password}),
   dataType: 'json'
  })
    .done(registerSuccess)
    .fail(registerError);  
}

function registerSuccess(data, textStatus, jqXHR) {
  window.location = "homepage.html"
  // if (data.success) {  
  //   window.location = "homepage.html";
  // }
  // else {
  //   divToChange.html("<span class='red-text text-darken-2'>Error: " + data.message + "</span>");
  //   divToChange.show();
  // }
}

function registerError(jqXHR, textStatus, errorThrown) {
  window.location = "homepage.html"
  // if (jqXHR.statusCode == 404) {
  //   divToChange.html("<span class='red-text text-darken-2'>Server could not be reached.</p>");
	// 	divToChange.show();
  // }
  // else {
  //   divToChange.html("<span class='red-text text-darken-2'>Error: " + jqXHR.responseJSON.message + "</span>");
  //   divToChange.show();
  // }
}
  
function isValidInput() {
  let isValid = true;
	let email1 = $('#userName').val();
	let email2 = $('#userName2').val();
	let password = $('#password').val();
	let failHTML = '<ul>';

	let strongPasswordRe = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
	// Above requires password to have at least one lowercase letter, one uppercase, one digit, one special char,
	//   and at least 8 chars total

	// Could check email structure here as well

	if (email1 != email2) {  // Checks that both emails are the same
		failHTML += ("<li><span class='red-text text-darken-2'>Emails do not match.</span></li>");
		isValid = false;
	}

	if (!strongPasswordRe.test(password)) {
		failHTML += '<li><span class=\'red-text text-darken-2\'>Password must contain at least: <ul><li>1 lowercase character</li><li>1 uppercase character</li><li>1 special character</li><li>8 characters total</li></span></li>';
		isValid = false;
	}

	failHTML += '</ul>';

	if (isValid == false) {
		divToChange.html(failHTML);
    divToChange.show();
	}
	
    return isValid;
}

$(function () {
  $('.registerButton').click(submitRegister);
});

function openNav() { document.getElementById("menu").style.width = "250px";}

function closeNav() {document.getElementById("menu").style.width = "0";}