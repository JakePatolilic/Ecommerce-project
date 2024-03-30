  document.addEventListener('DOMContentLoaded', function() {
    var modal = document.getElementById("addProductModal");
    var btn = document.getElementById("addProductBtn");
    var span = document.getElementsByClassName("close")[0];

    btn.onclick = function() {
        modal.style.display = "block";
    }

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Event listener for form submission
    document.getElementById('addProductForm').addEventListener('submit', function(event) {
        event.preventDefault();

        var productName = document.getElementById('name').value;
        var productPrice = document.getElementById('price').value;
        var productImage = document.getElementById('image').files[0];
        var productQuantity = document.getElementById('quantity').value;
        var productStatus = document.getElementById('status').value;
        var productCategory = document.getElementById('category').value;

        if (!productImage || !productImage.type.startsWith('image/')) {
            alert('Please select a valid image file for the product picture.');
            return;
        }

        var formData = new FormData();
        formData.append('productName', productName);
        formData.append('productPrice', productPrice);
        formData.append('productImage', productImage);
        formData.append('productQuantity', productQuantity);
        formData.append('productStatus', productStatus);
        formData.append('productCategory', productCategory);

        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/addProduct', true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    console.log('Product data saved successfully');
                    fetchAndDisplayProducts();
                    modal.style.display = "none"; // Close the modal after successful submission
                } else {
                    console.error('Error saving product data');
                    alert('Error saving product data');
                }
            }
        };
        xhr.send(formData);
    });
});

function fetchAndDisplayProducts() {
    fetch('/displayProducts') // Adjust the URL as necessary
    .then(response => response.json())
    .then(data => {
        const row2 = document.querySelector('.row2');
        row2.innerHTML = ''; // Clear previous content

        data.forEach(item => {
            const productBox = document.createElement('div');
            productBox.className = 'productBox';

            productBox.addEventListener('click', function() {
                // Redirect to the productPage with the product ID as a query parameter
                window.location.href = `/productPage?id=${item.id}`;
            });

            // Create a container for product details
            const productDetails = document.createElement('div');
            productDetails.className = 'productDetails';

            // Display product details without labels
            const nameP = document.createElement('p');
            nameP.textContent = item.name;
            nameP.className = 'productText';
            productDetails.appendChild(nameP);

            const img = document.createElement('img');
            img.src = `data:image/jpeg;base64,${item.image}`;
            img.alt = item.name;
            img.className = 'productImage'; // Add class for styling
            productDetails.appendChild(img);

            const priceP = document.createElement('p');
            priceP.textContent = `${item.price}`;
            productDetails.appendChild(priceP);

            const quantityP = document.createElement('p');
            quantityP.textContent = `${item.quantity}`;
            productDetails.appendChild(quantityP);

            const statusP = document.createElement('p');
            statusP.className = 'statusText';
            statusP.textContent = item.Status;
            productDetails.appendChild(statusP);

            const categoryP = document.createElement('p');
            categoryP.className = 'categoryText';
            categoryP.textContent = item.Category;
            productDetails.appendChild(categoryP);

            productBox.appendChild(productDetails);

            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'button-container';

            const editButton = document.createElement('button');
            editButton.className = 'ebutton';
            editButton.addEventListener('click', function() {
                event.stopPropagation();
                // Create a form for editing the product
                const editForm = document.createElement('form');
                editForm.id = 'editProductForm';
                editForm.innerHTML = `
                    <input type="text" id="editProductName" name="editProductName" value="${item.name}" required>
                    <input type="file" id="editProductImage" name="editProductImage" accept="image/*">
                    <input type="text" id="editProductPrice" name="editProductPrice" value="${item.price}" required>
                    <input type="text" id="editProductQuantity" name="editProductQuantity" value="${item.quantity}" required>
                    <select id="editProductStatus" name="editProductStatus" required>
                        <option value="Available" ${item.status === 'Available' ? 'selected' : ''}>Available</option>
                        <option value="Out of Stock" ${item.status === 'Out of Stock' ? 'selected' : ''}>Out of Stock</option>
                    </select>
                    <select id="editProductCategory" name="editProductCategory" required>
                        <option value="Footwear" ${item.category === 'Footwear' ? 'selected' : ''}>Footwear</option>
                        <option value="Clothes" ${item.category === 'Clothes' ? 'selected' : ''}>Clothes</option>
                        <option value="Accessories" ${item.category === 'Accessories' ? 'selected' : ''}>Accessories</option>
                        <option value="Toys" ${item.category === 'Toys' ? 'selected' : ''}>Toys</option>
                        <option value="Cosmetics" ${item.category === 'Cosmetics' ? 'selected' : ''}>Cosmetics</option>
                        <option value="Device" ${item.category === 'Device' ? 'selected' : ''}>Device</option>
                    </select>
                    <button type="submit">Save</button>
                `;
                // Replace the product's display box with the edit form
                productBox.innerHTML = '';
                productBox.appendChild(editForm);

                editForm.addEventListener('submit', function(event) {
                    event.stopPropagation();
                    event.preventDefault();
                    const updatedProductName = document.getElementById('editProductName').value;
                    const updatedProductPrice = document.getElementById('editProductPrice').value;
                    const updatedProductQuantity = document.getElementById('editProductQuantity').value;
                    const updatedProductStatus = document.getElementById('editProductStatus').value;
                    const updatedProductCategory = document.getElementById('editProductCategory').value;
                    const updatedProductImage = document.getElementById('editProductImage').files[0];

                    if (updatedProductImage && !updatedProductImage.type.startsWith('image/')) {
                        alert('Please select an image file for the product image.');
                        return;
                    }

                    const formData = new FormData();
                    formData.append('productId', item.id);
                    formData.append('updatedProductName', updatedProductName);
                    formData.append('updatedProductPrice', updatedProductPrice);
                    formData.append('updatedProductQuantity', updatedProductQuantity);
                    formData.append('updatedProductStatus', updatedProductStatus);
                    formData.append('updatedProductCategory', updatedProductCategory);
                    formData.append('updatedProductImage', updatedProductImage); // Append the file

                    // Send data to server using XMLHttpRequest
                    const xhr = new XMLHttpRequest();
                    xhr.open('POST', '/editProduct', true);
                    xhr.onreadystatechange = function() {
                        if (xhr.readyState === XMLHttpRequest.DONE) {
                            if (xhr.status === 200) {
                                console.log('Product updated successfully');
                                fetchAndDisplayProducts();
                            } else {
                                console.error('Error updating product data');
                                alert('Error updating product data');
                            }
                        }
                    };
                    xhr.send(formData);
                });

                editForm.querySelectorAll('input, select, button').forEach(function(element) {
                    element.addEventListener('click', function(event) {
                        event.stopPropagation();
                    });
                });
            });
            buttonContainer.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.className = 'dbutton';
            deleteButton.addEventListener('click', function() {
                event.stopPropagation();
                // Confirm the deletion
                const confirmDelete = window.confirm('Are you sure you want to delete this product?');
                if (confirmDelete) {
                    // Send a request to the server to delete the product
                    const xhr = new XMLHttpRequest();
                    xhr.open('POST', '/deleteProduct', true);
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.onreadystatechange = function() {
                        if (xhr.readyState === XMLHttpRequest.DONE) {
                            if (xhr.status === 200) {
                                console.log('Product deleted successfully');
                                // Refresh the product list to reflect the deletion
                                fetchAndDisplayProducts();
                            } else {
                                console.error('Error deleting product');
                                alert('Error deleting product');
                            }
                        }
                    };
                    xhr.send(JSON.stringify({ productId: item.id }));
                }
            });
            buttonContainer.appendChild(deleteButton);

            productBox.appendChild(buttonContainer);
            row2.appendChild(productBox);
        });
    })
    .catch(error => console.error('Error fetching product data:', error));
}

document.addEventListener("DOMContentLoaded", function() {
    fetchAndDisplayProducts();
});
