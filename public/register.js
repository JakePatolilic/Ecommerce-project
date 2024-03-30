document.getElementById('regBtn').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Create a JSON object from the form data
    const jsonData = {
        username: username,
        password: password
    };

    // Create an XMLHttpRequest object
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/register', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                // Registration successful
                console.log("Registration successful");
                alert('Registration successful');
                // Redirect to login page or show a success message
            } else {
                console.log("Username:", username);
                console.log("Password:", password);
                console.log('Error registering user');
                alert('Password must contain at least 6 characters');
            }
        }
    };
    // Send the JSON stringified data
    xhr.send(JSON.stringify(jsonData));
    console.log("Username:", username);
    console.log("Password:", password);
});
