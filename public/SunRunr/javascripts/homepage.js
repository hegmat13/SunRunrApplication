var imageArray = ['./images/mountainHike.jpg', './images/forestHike.jpg', './images/oceanRun.jpg', './images/desertRun.jpg'];

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

// function logout() {

//   var ajax = new XMLHttpRequest();
//   ajax.open("GET", "controller.php?action=logout", true);
//   ajax.send();
//     ajax.onreadystatechange = function(){
//       if(ajax.readyState==4 && ajax.status==200){
//         window.location.replace("homepage.html");
//       }
//     }
// }
function logout(){
    document.getElementById("demo").style.color = "red";
    window.localStorage.removeItem('authToken');
    window.location.replace('login.html');
}