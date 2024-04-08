document.addEventListener('DOMContentLoaded', function() {
    // Assuming you have a way to get the user ID, e.g., from a cookie or session
    const userId = getUserIdFromCookie(); // Implement this function based on how you store the user ID

    if (!userId) {
        alert('User ID not found');
        return;
    }

    fetch(`/getCartItems?userId=${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch cart items');
            }
            return response.json();
        })
        .then(cartItems => {
            console.log(cartItems);
            displayCartItems(cartItems);
        })
        .catch(error => console.error('Error fetching cart items:', error));
});

function getUserIdFromCookie() {
    const cookies = document.cookie.split('; ');
    const userIdCookie = cookies.find(cookie => cookie.startsWith('userId='));
    if (userIdCookie) {
        return userIdCookie.split('=')[1];
    }
    return null;
}

function displayCartItems(cartItems) {
    const productDisplay = document.getElementById('product-display');
    productDisplay.innerHTML = ''; // Clear previous items

    const userId = getUserIdFromCookie();

    cartItems.forEach(item => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product-item');

        const productName = document.createElement('h3');
        productName.textContent = item.name;
        productName.className = 'pName';

        const newPrice = item.quantity * item.price;
        const productQuantity = document.createElement('p');
        productQuantity.textContent = `Price: ${item.quantity} * ${item.price} = ₱${newPrice}`;

        const productImage = document.createElement('img');
        productImage.classList.add('product-image');
        productImage.src = `data:image/png;base64,${item.image}`;

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');

        // Create a "Cancel" button
        const cancelButton = document.createElement('button');
        cancelButton.className = 'cancelButton';
        cancelButton.textContent = 'Cancel';
        cancelButton.addEventListener('click', () => {
            // Send a request to the server to increase the quantity and remove the item from the cart
            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/updateQuantityAndRemoveFromCart', true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        // Remove the item from the display
                        productDiv.remove();
                    } else {
                        console.error('Error:', xhr.statusText);
                    }
                }
            };
            xhr.send(JSON.stringify({
                productId: item.id,
                userId: userId,
                action: 'cancel',
                quantity: item.quantity // Pass the quantity of the canceled item
            }));
        });
        // Create a "Check-out" button
        const checkOutButton = document.createElement('button');
        checkOutButton.className = 'checkButton';
        checkOutButton.textContent = 'Check-out';
        checkOutButton.addEventListener('click', () => {
            const productId = item.id;
            const userId = getUserIdFromCookie();

            // Send a request to the server to remove the item from the cart
            fetch(`/deleteCartItem?productId=${productId}&userId=${userId}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to check out the item');
                }
                // Optionally, you can update the UI to reflect the item being checked out
                console.log('Item checked out successfully');
                // Remove the item from the display
                productDiv.remove();
            })
            .catch(error => console.error('Error checking out item:', error));
        });


        productDiv.appendChild(productImage);
        productDiv.appendChild(productName);
        productDiv.appendChild(productQuantity);
        buttonContainer.appendChild(cancelButton);
        buttonContainer.appendChild(checkOutButton);

        // Append the button container to the product div
        productDiv.appendChild(buttonContainer);

        productDisplay.appendChild(productDiv);
    });

    const logoButton = document.getElementById('logoBtn');
    logoButton.addEventListener('click', () => {
        window.location.href = 'userPage';
    });
}




