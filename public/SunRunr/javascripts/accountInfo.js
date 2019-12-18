$(function() {  
    // if (!window.localStorage.getItem('authToken')) {
    //     window.location.replace('login.html');
    // }
    // else {
        $('#email-button').click(changeEmail);
        $('#password-button').click(changePassword);
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
    window.localStorage.removeItem('authToken');
    window.location.replace('login.html');
}

function changeEmail() {
    let newEmail = $('#userName').val();
    let email2 = $('#userName2').val();

    if (!isValidEmail()) return;

    //TODO: check local token for email, then update in server.

}

function isValidEmail() {
    let newEmail = $('#userName');
    let email2 = $('#userName2');

    if (newEmail[0].validity.valid && (newEmail.val() == email2.val())) {
        return true;
    }
    if (newEmail.val() != email2.val()) {
        $('.email2').append('<span class="helper-text" data-error="Emails do not match." data-success="Nooice."></span>');
    } // TODO: make span removable and replace with original message on else{}

    return false;
}

function changePassword() {

    if (!isValidPassword()) return;

    $.ajax({
        url: '/users/account',
        type: 'GET',
        headers: { 'x-auth': window.localStorage.getItem("authToken") },
        dataType: 'json'
    })
        .done(checkAndChangePW)
        .fail(placeholder)
}

function checkAndChangePW(data, textStatus, jqXHR) {
    let oldp = $('#oldPassword').val();
    let newp = $('#newPassword').val();
    //TODO: Find way to do this:
    //          1. Send both old and new password to server and handle password change in server for security
    //          2. Get server to send back password, check, then send back request to change 
    //          (will need new endpoint either way)
}

function isValidPassword() {
    let oldp = $('#oldPassword');
    let newp = $('#newPassword');

    if (newp[0].validity.valid && (oldp.val() != newp.val())) {
        return true;
    }
    if (oldp.val() == newp.val()) {
        $('#removable').remove();
        $('.pw').append('<span class="helper-text" id="removable" data-error="Passwords cannot be the same." data-success="Nooice."></span>');
    }
    else {
        $('#removable').remove();
        $('.pw').append('<span class="helper-text" id="removable" data-error="Password is too weak." data-success="Nooice."></span>');
    }

    return false;
}