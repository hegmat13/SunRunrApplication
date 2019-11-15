<?php
	session_start();
?>
<html>
<head>
	<title>SunRunr Registration</title>
	<link rel="stylesheet" type="text/css" href="stylesheet.css">
</head>

<body>
	<br>
<div class = "title">
	<table>
		<tr>
			<th>&nbsp;</th>
		</tr>
	</table>
</div>
<br>
<button onclick="window.location.href='homepage.php'" class = "homeButton" width = 200px>Home</button>
<h2 class = "subTitle">Register Now</h2>
<p class = "registerButtonToCenter" >By registering with us, you will have access too XXX YYY ZZZ XYZ</p>

<form id = "registerId" onsubmit="submitRegister();return false;">
	<div class = "registerPageDiv">
		<div class = "rightColumn">

			<input class = "inputEmail" type= "text" pattern = "[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$" id = "userName" required value = "" placeholder = "email@SunRunr.com" title = "Please enter a valid email address">
			<!--MAKE SURE TO VERIFY EMAIL ADDRESSES ARE THE SAME-->
			<br>
			<input class = "inputEmail" type= "text" pattern = "[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$" id = "userName2" required value = "" title = "Please confirm your email address">

			<br>
			<input class = "inputZip" paid="zipCode" size = "5" pattern="[0-9]{5}" id="zipcode" title = "Please enter a valid 5-digit zip code" required>

			<br>

			<input type = "password" class = "inputPassword" type = "text" id = "passWord" required>
			
			<br>
			<div id="ifFailure"></div>
		</div>
		<div class = "leftColumn">
			Email Address <br><br>
			Confirm Email <br><br>
			Zip Code <br><br>
			Password <br>
		</div>
	</div>
	<br><br><br><br><br><br><br>
	<div class = "registerButtonToCenter">
		<button class = "registerButton"  type = "submit" value = "Register" >Create an Account</button><br><br>
		Already have an account?<br>
		<a onclick = "window.location.href='login.php'" class = "haveAccount">Log in</a>
	</div>
</form>
<script>
var divToChange = document.getElementById("ifFailure");
function submitRegister() {

  if (!isValidInput()) return;

  var anObj = new XMLHttpRequest();
  var username = document.getElementById("userName").value;
  var password = document.getElementById("passWord").value;
  var zipcode = document.getElementById("zipcode").value;
  console.log(username + password + zipcode);
  anObj.open("GET", "controller.php?action=register&email=" + username + "&password=" + password + "&zipcode=" + zipcode, true);
  anObj.send(); // Might also want to pass all the register info through a post to /register for security

  anObj.onreadystatechange = function () {
      if (anObj.readyState == 4 && anObj.status == 200) {
      		// Ask the server if the registration is legit
          	var success = JSON.parse(anObj.responseText);

          	// Login failed
          	if(!success){
          		divToChange.innerHTML = "Username already exists";
				document.getElementById("registerId").reset();
			// Login succeeded 
          	} else {
          		window.location.replace("homepage.php");
          	}
      }
   }
 }
  
 function isValidInput() {
    let isValid = true;
	let email1 = document.getElementById('userName');
	let email2 = document.getElementById('userName2');
	let password = document.getElementById('passWord');
	let failDiv = document.getElementById('ifFailure');  // Also using this div for these types of errors, if that works
	let failHTML = '<ul>';

	let strongPasswordRe = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
	// Above requires password to have at least one lowercase letter, one uppercase, one digit, one special char,
	//   and at least 8 chars total

	// Could check email structure here as well

	if (email1.value() == email2.value()) {  // Checks that both emails are the same
		email1.classList.remove('error');
		email2.classList.remove('error');
	}
	else {
		email1.classList.add('error');
		email2.classList.add('error');
		failHTML += '<li>Emails must match</li>';
		isValid = false;
	}

	if (strongPasswordRe.test(password.value())) {
		password.classList.remove('error');
	}
	else {
		password.classList.add('error');
		failHTML += '<li>Password must contain at least: <ul><li>1 lowercase character</li><li>1 uppercase character</li><li>1 special character</li><li>8 characters total</li></li>';
		isValid = false;
	}

	if (isValid == false) {
		failDiv.innerHTML = failHTML;
		failDiv.css('display', 'inline-block');  // Not sure if I did this correctly
	}
	else {
		failDiv.css('display', 'none');
	}
	
    return isValid;
}

</script>
</body>
</html>

