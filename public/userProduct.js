document.addEventListener('DOMContentLoaded', function() {
    function displayProducts(category) {
        console.log(category);
        // Fetch and display products
        fetch(`/products?category=${category}`)
            .then(response => response.json())
            .then(products => {
                const productDisplay = document.getElementById('product-display');
                productDisplay.innerHTML = '';
                const title = document.getElementById('cat');
                title.innerHTML = category;
    
                products.forEach(product => {
                    const productDiv = document.createElement('div');
                    productDiv.innerHTML = `
                        <img src="data:image/jpeg;base64,${product.image}" alt="${product.name}">
                        <p>${product.name}</p>
                        <p>Price: ₱${product.price}</p>
                    `;
                    productDiv.addEventListener('click', () => {
                        window.location.href = `productInfo?id=${encodeURIComponent(product.id)}`;
                    });
                    productDisplay.appendChild(productDiv);
                });
            })
            .catch(error => console.error('Error fetching products:', error));
    }

    const searchForm = document.querySelector('.search-bar');
    searchForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting normally
        const searchQuery = event.target.querySelector('input').value;
        searchProducts(searchQuery);
    });

    function searchProducts(query) {
        fetch(`/search?query=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(data => {
                displaySearchResults(data);
            })
            .catch(error => {
                console.error('Error fetching search results:', error);
            });
    }

    function displaySearchResults(results) {
        const productDisplay = document.getElementById('product-display');
        productDisplay.innerHTML = ''; // Clear previous results
        const categorytDisp = document.getElementById('cat');
        categorytDisp.innerHTML = 'Results:';
        if (results.length === 0) {
            productDisplay.innerHTML = '<p>No products found.</p>';
            return;
        }
    
        // Display each product in the search results
        results.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.innerHTML = `
                <img src="data:image/jpeg;base64,${product.image}" alt="${product.name}">
                <p>${product.name}</p>
                <p>Price: ₱${product.price}</p>
            `;
            productDiv.addEventListener('click', () => {
                window.location.href = `productInfo?id=${encodeURIComponent(product.id)}`;
            });
            productDisplay.appendChild(productDiv);
        });
    }

    const urlParams = new URLSearchParams(window.location.search);
    let cat = urlParams.get('category');
    console.log(cat);
    // If a category is found in the URL, display products for it
    if (cat) {
        displayProducts(cat);
        console.log(cat);
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
});
