document.getElementById('loginBtn').addEventListener('click', function() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    console.log(username);
    console.log(password);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'login', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if(xhr.readyState === XMLHttpRequest.DONE) {
            if(xhr.status === 200){
                var response = JSON.parse(xhr.responseText);
                if(response.authority === 0) {
                    window.location.href = 'adminPage';
                } else if(response.authority === 1) {
                    window.location.href = 'userPage';
                } else {
                    alert('Invalid authority');
                }
            } else {
                alert('Invalid username or password');
            }
        }
    }
    xhr.send(JSON.stringify({username: username, password: password}));
});
