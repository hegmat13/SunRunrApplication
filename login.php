<?php
	session_start();
?>
<html>
<head>
	<title>SunRunr Login</title>
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
<!--MENU -->
	<div class = "menu" id = "menu" style="width: 0px;">
	<a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>
	    <?php
	    if(isset($_SESSION["user"])){
	      echo '<p class = "menuName" > Welcome, '.$_SESSION["user"].'</p>';
	    }
	    ?>
		<a class = "menu1" href = "aboutUs.php">About Us</a><br>
		<a class = "menu1" href = "forecast.php">Weather Forecast</a><br>
		<a class = "menu1" href = "summary.php">Summary View</a><br>
		<a class = "menu1" href = "activitySummary.php">Activities Summary View</a><br>
		<a class = "menu1" href = "activityDetail.php">Activity Detail View</a><br>

	    <?php
	      if(isset($_SESSION["user"])){
	          echo '
	          <a class = "menu1" onclick = "logout();">Logout</a>
	          ';
	      }
	      else
	        echo '
	          <a class = "menu1" href = "login.php">Login</a><br>
	          <a class = "menu1" href = "registration.php">Register</a>
	          ';
	    ?>
	</div>
<!--END OF MENU-->
<h2 class = "subTitle">Log in</h2>
<p class = "registerButtonToCenter">Log in to access XXX YYY ZZZ</p>

<form id = "registerId" onsubmit="submitRegister();return false;">
	<div class = "registerPageDiv">
		<div class = "rightColumn">

			<input class = "inputEmail" type= "text" pattern = "[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$" id = "userName" required value = "" placeholder = "email@SunRunr.com" title = "Please enter a valid email address">
			<br>

			<input type = "password" class = "inputPassword" type = "text" id = "passWord" required>
			
			<br>
			<div id="ifFailure"></div>
		</div>
		<div class = "leftColumn">
			Email Address <br><br>
			Password <br>
		</div>
	</div>
	<br><br><br>
	<div class = "registerButtonToCenter">
		<button class = "registerButton"  type = "submit" value = "Register" >Login</button>
		<br><br>
		Need to create an account?<br>
		<a onclick = "window.location.href='registration.php'" class = "haveAccount">Register Now</a>
	</div>
</form>

<script>
var divToChange = document.getElementById("ifFailure");
function submitRegister() {
  var anObj = new XMLHttpRequest();
  var username = document.getElementById("userName").value;
  var password = document.getElementById("passWord").value;
  // Might want to do a post to /login, putting username and hashed password in the body
  anObj.open("GET", "controller.php?action=login&email=" + username + "&password=" + password , true);
  anObj.send();

  console.log("Sent it");

  anObj.onreadystatechange = function () {
      if (anObj.readyState == 4 && anObj.status == 200) {  
          	var status = JSON.parse(anObj.responseText);

          	if(status == -1){
          		divToChange.innerHTML = "Username not registered";
				document.getElementById("registerId").reset();
          	} else if(status == -2){
          		divToChange.innerHTML = "Invalid password";
				document.getElementById("registerId").reset();
          	} else {
          		window.location.replace("products.php");
          	}
      }
   }
}

function openNav() { document.getElementById("menu").style.width = "250px";}

function closeNav() {document.getElementById("menu").style.width = "0";}

function logout() {

  var ajax = new XMLHttpRequest();
  ajax.open("GET", "controller.php?action=logout", true);
  ajax.send();  // Logging out might need local storage of the login info to be cleared, not sure though
    ajax.onreadystatechange = function(){
      if(ajax.readyState==4 && ajax.status==200){
        window.location.replace("homepage.php");
      }
    }
}
</script>
</body>
</html>
