<?php
session_start();
?>	
<html>
<head>
	<!--set up for top of page-->
	<meta charset="UTF-8">

	<title>SunRunr</title>
	<link rel="icon" href="images/runMan.ico">
	
	<link rel="stylesheet" type="text/css" href="stylesheet.css">

</head>

<body onload = "loadImage()">

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
<div class = "bigDiv">

		<h1 class = "mainTitle">SunRunr</h1>
	<span class = "spanStyle" onclick="openNav()"><img src = "images/runningManSidebar.svg" class = "menuButtonImage"></span>
		<div>
			<img src = "images/oceanRun.jpg" id = "FrontPageImage" class = "FrontPageImage"><br>
		</div>
		
	<div class = "welcomeToOurPage">
			<p class = "subTitleMain">Welcome to SunRunr!</p>
			<p class = "bodyText"> The SunRunr application is a web application for monitoring your outdoor fitness activities, sun exposure, and weather conditions during those activities.</p>
			<p class = "bodyText">Here is where we will describe our site</p>
			<p class = "bodyText">Here is what you need to get started!</p>
			<p class = "bodyText">Insert List Here</p>
			<p class = "bodyText">Click the Running Man to start your Journey!</p>
			<p class = "bodyTextB">Thanks! ~SunRunr Team</p>
		</div>
</div>
<script>
var imageArray = ['images/mountainHike.jpg', 'images/forestHike.jpg', 'images/oceanRun.jpg', 'images/desertRun.jpg'];

 var whereTheFrontPageImageGoes = document.getElementById("FrontPageImage");
 var i;
function loadImage(){
		i = 0;
		var newImage =  setInterval(changeImage, 5000);
}
function changeImage(){
	if(imageArray.length - 1== i){
		i = 0;
			whereTheFrontPageImageGoes.src = imageArray[i];
	}
	else{
 		i++;
		whereTheFrontPageImageGoes.src = imageArray[i];
	}
}

	function openNav() { document.getElementById("menu").style.width = "250px";}

	function closeNav() {document.getElementById("menu").style.width = "0";}

function logout() {

  var ajax = new XMLHttpRequest();
  ajax.open("GET", "controller.php?action=logout", true);
  ajax.send();
    ajax.onreadystatechange = function(){
      if(ajax.readyState==4 && ajax.status==200){
        window.location.replace("homepage.php");
      }
    }
}
</script>

</body>
</html>
