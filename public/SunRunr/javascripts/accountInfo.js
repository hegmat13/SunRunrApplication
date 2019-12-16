$(function() {  
    // if (!window.localStorage.getItem('authToken')) {
    //     window.location.replace('login.html');
    // }
    // else {
        $('.emailButton').click(changeEmail);
        $('#password').keypress(function(event) {
            if (event.which === 13) {
                loadDeviceData();
            }
      });
    // }
});

function openNav() { document.getElementById("menu").style.width = "250px";}

function closeNav() {document.getElementById("menu").style.width = "0";}

function logout() {
    document.getElementById("demo").style.color = "red";
    window.localStorage.removeItem('authToken');
    window.location.replace('login.html');
}

function changeEmail() {
    let newEmail = $('#userName').val()
    let email2 = $('#userName2').val()

    if (!isValidEmail) return;




}

function isValidEmail() {
    
}