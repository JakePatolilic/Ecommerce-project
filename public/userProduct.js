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
});
