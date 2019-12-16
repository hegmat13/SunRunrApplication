var divToChange = $("#ifFailure");

function submitRegister() {
	let username = $('#userName').val();
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
  if (data.success) {  
    window.location.replace("registerDevice.html");
  }
  else {
    divToChange.html("<span class='red-text text-darken-2'>Error: " + data.message + "</span>");
    divToChange.show();
  }
}

function registerError(jqXHR, textStatus, errorThrown) {
  if (jqXHR.statusCode == 404) {
    divToChange.html("<span class='red-text text-darken-2'>Server could not be reached.</p>");
	divToChange.show();
  }
  else {
    divToChange.html("<span class='red-text text-darken-2'>Error: " + jqXHR.responseJSON.message + "</span>");
    divToChange.show();
  }
}
  
function isValidInput() {
  let isValid = true;
	let email1 = $('#userName').val();
	let email2 = $('#userName2').val();
	let password = $('#password').val();
	let zipcode = $('#zipcode').val();
	let failHTML = '';

	let emailRe = /^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
	let zipcodeRe = /^\d{5}$/;
	let strongPasswordRe = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

	if (!emailRe.test(email1)) {
		$('.inputEmail').addClass('error');
    	failHTML += ("<p><span class='red-text text-darken-2'>Please enter valid email address.</span></p>");
		isValid = false;
	}
	else {
		$('.inputEmail').removeClass('error');
	}
	
	if ((email1 != email2) || (email1 == '')) {
    	$('.inputEmail').addClass('error');
    	failHTML += ("<p><span class='red-text text-darken-2'>Emails do not match.</span></p>");
		isValid = false;
	}
	else {
		$('.inputEmail').removeClass('error');
	}

	if (!zipcodeRe.test(zipcode)) {
		$('#zipcode').addClass('error');
		failHTML += '<p><span class=\'red-text text-darken-2\'>Invalid zipcode.</span></p>';
		isValid = false;
	}
	else {
		$('#zipcode').removeClass('error');
	}

	if (!strongPasswordRe.test(password)) {
		$('#password').addClass('error');
		failHTML += '<p><span class=\'red-text text-darken-2\'>Password must contain at least: <ul><li>1 Lowercase character</li><li>1 Uppercase character</li><li>1 Special character</li><li>1 Number</li><li>8 Characters</li></span></p>';
		isValid = false;
	}
	else {
		$('#password').removeClass('error');
	}

	if (isValid == false) {
		divToChange.html(failHTML);
    	divToChange.show();
	}
	
  	return isValid;
}

$(function () {
	if (window.localStorage.getItem('authToken')) {
		window.location.replace('homepage.html'); // Detects if user is already logged in and redirects them if they are
	}
	else {
		$('.registerButton').click(submitRegister);
		$('#password').keypress(function(event) {
			if( event.which === 13 ) {
				submitRegister();
			}
		});
	}
});

function openNav() { document.getElementById("menu").style.width = "250px";}

function closeNav() {document.getElementById("menu").style.width = "0";}