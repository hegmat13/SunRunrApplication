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
    <a class = "menu1" href = "homepage.php">Home</a><br>
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

    <h1 class = "mainTitle">About Us</h1>
  <span class = "spanStyle" onclick="openNav()"><img src = "images/runningManSidebar.svg" class = "menuButtonImage"></span>
  <br><br><br><br><br><br>
    
  <div class = "welcomeToOurPage">
      <p class = "subTitleMain">We will put our data in here</p>
      <p class = "bodyText"> XXXX.</p>
    </div>
</div>
<script>

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
