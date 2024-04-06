document.addEventListener('DOMContentLoaded', function() { 
    document.querySelectorAll('.category').forEach(categoryDiv => {
        categoryDiv.addEventListener('click', () => {
            const category = categoryDiv.textContent.trim();
            window.location.href = `userProduct?category=${encodeURIComponent(category)}`;
        });
    });

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
        const categorytDisplay = document.getElementById('pCat');
        categorytDisplay.innerHTML = ''; // Clear previous results
        const categorytDisp = document.getElementById('cat');
        categorytDisp.innerHTML = 'Results:'; // Clear previous results
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

    const logoButton = document.getElementById('logoBtn');
    logoButton.addEventListener('click', () => {
        // Navigate to the user page
        window.location.href = 'userPage';
    })

    const cartButton = document.getElementById('cartBtn');
    cartButton.addEventListener('click', () => {
        window.location.href = 'cartPage';
    })
});
