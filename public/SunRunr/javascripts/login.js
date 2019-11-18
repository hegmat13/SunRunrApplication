function openNav() { document.getElementById("menu").style.width = "250px";}

function closeNav() {document.getElementById("menu").style.width = "0";}
var divToChange = document.getElementById("ifFailure");
function submitRegister() {
var anObj = new XMLHttpRequest();
var username = document.getElementById("userName").value;
var password = document.getElementById("passWord").value;
// Might want to do a post to /login, putting username and hashed password in the body
anObj.open("POST", "http://ec2-18-221-169-9.us-east-2.compute.amazonaws.com:3000/register/?email=" + username + "&password=" + password , true);
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
            //	window.location.replace("products.php");
            }
    }
}
}

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