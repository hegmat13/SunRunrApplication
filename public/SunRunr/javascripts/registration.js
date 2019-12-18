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
    window.location.replace("registerDevice.html"); // Directs user to register their first device when successfully registered.
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
	let email1 = $('#userName').val();
	let email2 = $('#userName2');

	if (email1 != email2.val()) {
		email2.removeClass('validate');
		email2.addClass('invalid');
		$('.email2').append('<span class="helper-text" data-error="Emails do not match."></span>');
		return false;
	}
	else {
		email2.removeClass('invalid');
		email2.addClass('validate');
		$('.email2').append('<span class="helper-text" data-error="Enter a valid email address."></span>');
		return true;
	}
}

$(function () {
	if (window.localStorage.getItem('authToken')) {
		window.location.replace('index.html'); // Detects if user is already logged in and redirects them if they are
	}
	else {
		$('#download-button').click(submitRegister);
		$('#password').keypress(function(event) {
			if( event.which === 13 ) {
				submitRegister();
			}
		});
	}
});

function openNav() { document.getElementById("menu").style.width = "250px";}

function closeNav() {document.getElementById("menu").style.width = "0";}