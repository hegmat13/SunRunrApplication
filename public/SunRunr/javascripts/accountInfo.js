$(function() {  
    // if (!window.localStorage.getItem('authToken')) {
    //     window.location.replace('login.html');
    // }
    // else {
        updatePageEmail();
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

function updatePageEmail() {
    $('.actInfo').html('<h5 class="white-text">youshouldntseethis@test.com</h5>');
    $.ajax({
        url: '/users/account',
        type: 'GET',
        headers: { 'x-auth': window.localStorage.getItem("authToken") },
        dataType: 'json'
    })
        .done(function(data, textStatus, jqXHR) {
            $('.actInfo').html('<h5 class="white-text">' + data.username + '</h5>');
        })
        .fail(function() {
            $('.actInfo').html('<h5 class="red-text">Could not get email.</h5>');
        })
}

function changeEmail() {
    if (!isValidEmail()) return;

    let username = $('#userName').val();

    $.ajax({
        url: '/users/newemail',
        type: 'POST',
        contentType: 'application/json',
        headers: { 'x-auth': window.localStorage.getItem("authToken") },
        data: JSON.stringify({username: username}),
        dataType: 'json'
    })
        .done(emailSuccess)
        .fail(emailError);
}

function isValidEmail() {
    let newEmail = $('#userName');
    let email2 = $('#userName2');
    let trueEmail = window.localStorage.getItem('authToken');

    if (newEmail[0].validity.valid && (newEmail.val() == email2.val()) && trueEmail.emai) {
        return true;
    }
    if (newEmail.val() != email2.val()) {
        $('.removable2').remove();
        $('.email2').append('<span class="helper-text removable2" data-error="Emails do not match." data-success="Nooice."></span>');
    }
    else {
        $('.removable2').remove();
    }

    return false;
}

function emailSuccess(data, textStatus, jqXHR) {
    if (data.success) {
        window.localStorage.removeItem('authToken');
        window.localStorage.setItem('authToken', data.authToken);
        $('.removable2').remove();
        $('.email2').append('<span class="helper-text removable2" data-error="Idk how this happened but email changed." data-success="Email changed successfully."></span>');
    }
    else {
      divToChange.html("<span class='red-text text-darken-2'>Error: " + data.message + "</span>");
      divToChange.show();
    }
}

function emailError(data, textStatus, jqXHR) {
    if (data.hasOwnProperty('userExists')) {
        $('.removable2').remove();
        $('.email2').append('<span class="helper-text removable2 red-text">This email is already in use.</span>');
    }
    else {
        divToChange.html("<span class='red-text text-darken-2'>Error: " + jqXHR.responseJSON.message + "</span>");
        divToChange.show();
    }
}

function changePassword() {

    if (!isValidPassword()) return;
    let oldp = $('#oldPassword').val();
    let newp = $('#newPassword').val();

    $.ajax({
        url: '/users/newpw',
        type: 'POST',
        contentType: 'application/json',
        headers: { 'x-auth': window.localStorage.getItem("authToken") },
        data: JSON.stringify({oldp: oldp, newp: newp}),
        dataType: 'json'
    })
        .done(passSuccess)
        .fail(passError);
}

function passSuccess(data, textStatus, jqXHR) {
    if (data.success) {
        $('#removable').remove();
        $('.pw').append('<span class="helper-text" id="removable">Password changed successfully.</span>');
    }
    else {
      divToChange.html("<span class='red-text text-darken-2'>Error: " + data.message + "</span>");
      divToChange.show();
    }
}

function passError(data, textStatus, jqXHR) {
    if (data.hasOwnProperty('flag')) {
        $('#removable3').remove();
        $('.oldp2').addClass('invalid');
        $('.oldp').append('<span class="helper-text red-text" id="removable3">Password is incorrect.</span>');
    }
    else {
        divToChange.html("<span class='red-text text-darken-2'>Error: " + data.message + "</span>");
        divToChange.show();
    }
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