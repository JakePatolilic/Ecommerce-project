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
        specs.forEach(spec => {
            const listItem = document.createElement('li');
            // Assuming specs are stored in a specific format, adjust as necessary
            listItem.textContent = `${spec.spec_name}`;
            specsList.appendChild(listItem);
        });
        document.querySelector('.product-specs').appendChild(specsList);
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
    }

    const logoButton = document.getElementById('logoBtn');
    logoButton.addEventListener('click', () => {
        // Navigate to the user page
        window.location.href = 'userPage';
    });

    document.getElementById('buyNowBtn').addEventListener('click', function() {
        const urlParams = new URLSearchParams(window.location.search);
        let productId = urlParams.get('id');
        console.log(productId);
        fetch(`/reduceQuantity?productId=${productId}`)
        .then(response => {
            if (!response.ok) {
                // If the response is not OK, throw an error with the response status text
                throw new Error(response.statusText);
            }
            return response.json();
        })
        .then(data => {
            alert('Product purchased!');
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
        })
        .catch(error => {
            alert('The Product is not available!');
        });
    });
});



