document.addEventListener('DOMContentLoaded', function() {
    // Function to get the product ID from the URL
    function getProductIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    // Function to display product details
    function displayProductDetails(product) {
        document.getElementById('product-name').textContent = product.name;
        document.getElementById('product-price').textContent = `Price: ₱${product.price}`;
        document.getElementById('imgs').src = `data:image/jpeg;base64,${product.image}`;
        document.getElementById('product-quantity').textContent = `Quantity: ${product.quantity}`;
    }

    // Function to display product specifications
    function displayProductSpecs(specs) {
        const specsList = document.createElement('ul');
    
        for (let i = 0; i < 5; i++) {
            const spec = specs[i];
            const listItem = document.createElement('li');
            listItem.textContent = `${spec.spec_name}`;
            specsList.appendChild(listItem);
        }
    
        document.querySelector('.product-specs').appendChild(specsList);
    }

    function displayProductSpecs1(specs) {
        const specsList = document.createElement('ul');
    
        for (let i = 0; i < specs.length; i++) {
            const spec = specs[i];
            const listItem = document.createElement('li');
            listItem.textContent = `${spec.spec_name}`;
            specsList.appendChild(listItem);
        }
    
        document.querySelector('.prodSpecs').appendChild(specsList);
    }
    

    // Get the product ID from the URL
    const productId = getProductIdFromURL();
    if (productId) {
        // Fetch product details
        fetch(`/productInfoDisp?id=${productId}`)
            .then(response => response.json())
            .then(product => {
                const specsDisplayContainer = document.querySelector('.product-specs');
                specsDisplayContainer.innerHTML = '';
                displayProductDetails(product);
                // Fetch product specifications
                fetch(`/getSpecs?id=${productId}`)
                    .then(response => response.json())
                    .then(specs => {
                        displayProductSpecs(specs);
                    })
                    .catch(error => console.error('Error fetching product specs:', error));
            })
            .catch(error => console.error('Error fetching product details:', error));

            fetch(`/productInfoDisp?id=${productId}`)
            .then(response => response.json())
            .then(product => {
                fetch(`/getSpecs?id=${productId}`)
                    .then(response => response.json())
                    .then(specs => {
                        displayProductSpecs1(specs);
                    })
                    .catch(error => console.error('Error fetching product specs:', error));
            })
            .catch(error => console.error('Error fetching product details:', error));
    }

    const logoButton = document.getElementById('logoBtn');
    logoButton.addEventListener('click', () => {
        // Navigate to the user page
        window.location.href = 'userPage';
    });

    const cartButton = document.getElementById('cartBtn');
    cartButton.addEventListener('click', () => {
        window.location.href = 'cartPage';
    })

    document.getElementById('addToCartBtn').addEventListener('click', function() {
        const productId = getProductIdFromURL();
        if (!productId) {
            alert('Product ID not found');
            return;
        }
    
        // Prompt the user for the quantity to add to the cart
        const quantityToAdd = prompt('How many would you like to add to the cart?');
        if (quantityToAdd === null || quantityToAdd === '' || isNaN(quantityToAdd)) {
            alert('Please enter a valid quantity.');
            return;
        }
    
        // Function to get the user ID from the cookie
        function getUserIdFromCookie() {
            const cookies = document.cookie.split('; ');
            const userIdCookie = cookies.find(cookie => cookie.startsWith('userId='));
            if (userIdCookie) {
                return userIdCookie.split('=')[1];
            }
            return null;
        }
    
        const userId = getUserIdFromCookie();
        if (!userId) {
            alert('User ID not found in cookie');
            return;
        }
    
    
        // Include the user ID in the request to the server
    fetch(`/addToCart?productId=${productId}&quantity=${quantityToAdd}&userId=${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add to cart');
            }
            fetch(`/productInfoDisp?id=${productId}`)
            .then(response => response.json())
            .then(product => {
                const specsDisplayContainer = document.querySelector('.product-specs');
                specsDisplayContainer.innerHTML = '';
                displayProductDetails(product);
                const imgs = product.img;
                // Fetch product specifications
                fetch(`/getSpecs?id=${productId}`)
                    .then(response => response.json())
                    .then(specs => {
                        displayProductSpecs(specs);
                    })
                    .catch(error => console.error('Error fetching product specs:', error));
            })
            alert('Product added to cart');
        })
        .catch(error => console.error('Error adding to cart:', error));
        console.log(`user ID: ${userId}`);
    });    

    document.getElementById('buyNowBtn').addEventListener('click', function() {
        const urlParams = new URLSearchParams(window.location.search);
        let productId = urlParams.get('id');
        console.log(productId);
    
        // Prompt the user for the quantity to purchase
        const quantityToPurchase = prompt('How many would you like to purchase?');
        if (quantityToPurchase === null || quantityToPurchase === '') {
            alert('Please enter a valid quantity.');
            return;
        }
    
        fetch(`/reduceQuantity?productId=${productId}&quantity=${quantityToPurchase}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('quantity exceeds the current stock!');
            }
            return response.json();
        })
        .then(data => {
            if (data.message.includes('updated successfully')) {
                alert('Product purchased!');
                // Fetch and display updated product details
                fetch(`/productInfoDisp?id=${productId}`)
                .then(response => response.json())
                .then(product => {
                    const specsDisplayContainer = document.querySelector('.product-specs');
                    specsDisplayContainer.innerHTML = '';
                    displayProductDetails(product);
                    // Fetch product specifications
                    fetch(`/getSpecs?id=${productId}`)
                        .then(response => response.json())
                        .then(specs => {
                            displayProductSpecs(specs);
                        })
                        .catch(error => console.error('Error fetching product specs:', error));
                })
                .catch(error => console.error('Error fetching product details:', error));
            } else {
                alert('The Product is not available in the requested quantity!');
            }
        })
        .catch(error => {
            alert('An error occurred: ' + error.message);
        });
    });  
    
    function isProductInfoPage() {
        return window.location.pathname.includes('/productInfo');
    }

    // Disable the search bar if on the product information page
    if (isProductInfoPage()) {
        const searchBar = document.querySelector('.search-bar');
        const searchInput = searchBar.querySelector('input');
        const searchButton = searchBar.querySelector('button');

        // Disable the input field and the submit button
        searchInput.disabled = true;
        searchButton.disabled = true;
    } 
});



