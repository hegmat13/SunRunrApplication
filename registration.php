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
  var anObj = new XMLHttpRequest();
  var username = document.getElementById("userName").value;
  var password = document.getElementById("passWord").value;
  var zipcode = document.getElementById("zipcode").value;
  console.log(username + password + zipcode);
  anObj.open("GET", "controller.php?action=register&email=" + username + "&password=" + password + "&zipcode=" + zipcode, true);
  anObj.send();

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

</script>
</body>
</html>


