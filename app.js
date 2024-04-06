const express = require("express");
const path = require("path");
const mysql = require("mysql");
const dotenv = require("dotenv");
const multer = require('multer');
const upload = multer({ storage:multer.memoryStorage()}); 
const cookieParser = require('cookie-parser');

dotenv.config({ path: './.env'});

const app = express();

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})
app.use(cookieParser());
const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

app.set('view engine', 'html');

db.connect( (error) => {
    if(error) {
        console.log(error);
    }
    else{
        console.log("MYSQL Connected");
    }
})

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'loginPage.html'));
});

app.get("/adminPage", (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'adminPage.html'));
});

app.get("/userPage", (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'userPage.html'));
});

app.get("/productPage", (req,res) => {
    res.sendFile(path.join(__dirname, 'views', 'productPage.html'));
})

app.get("/userProduct", (req,res) => {
    res.sendFile(path.join(__dirname, 'views', 'userProduct.html'));
})

app.get("/productInfo", (req,res) => {
    res.sendFile(path.join(__dirname, 'views', 'productInfo.html'));
})

app.get("/registerPage", (req,res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
})

app.get("/cartPage", (req,res) => {
    res.sendFile(path.join(__dirname, 'views', 'cartPage.html'));
})

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(query, [username, password], (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
            res.json({ userId: results[0].id, authority: results[0].authority });
        } else {
            res.status(401).send('Invalid username or password');
        }
    });
});

app.post('/addProduct', upload.single('productImage'), (req, res) => {
    const productName = req.body.productName;
    const productPrice = req.body.productPrice;
    const productImage = req.file.buffer.toString("base64");
    const productQuantity = req.body.productQuantity;
    const productStatus = req.body.productStatus;
    const productCategory = req.body.productCategory;
    
    const sql = 'INSERT INTO products (name, price, image, quantity, status, category) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [productName, productPrice, productImage, productQuantity, productStatus, productCategory], (err, result) => {
        if (err) {
            console.error('Error saving product data: ' + err.message);
            res.status(500).send('Error saving product data');
            return;
        }
        console.log('Product data saved successfully');
        res.status(200).send('Product data saved successfully');
    });
});

app.get('/displayProducts', (req, res) => {
    const sql = 'SELECT * FROM products';
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Error fetching products: ' + err.message);
        res.status(500).send('Error fetching products');
        return;
      }
      res.json(results);
    });
  });

app.post('/editProduct', upload.single('updatedProductImage'), (req, res) => {
    const { productId, updatedProductName, updatedProductPrice, updatedProductQuantity, updatedProductStatus, updatedProductCategory } = req.body;
    const updatedProductImageBuffer = req.file.buffer; // Access the uploaded file buffer
    const updatedProductImage = updatedProductImageBuffer.toString("base64"); // Convert buffer to base64 string

    const sql = 'UPDATE products SET name = ?, price = ?, quantity = ?, status = ?, category = ?, image = ? WHERE id = ?';
    db.query(sql, [updatedProductName, updatedProductPrice, updatedProductQuantity, updatedProductStatus, updatedProductCategory, updatedProductImage, productId], (err, result) => {
        if (err) {
            console.error('Error updating product: ' + err.message);
            res.status(500).send('Error updating product');
            return;
        }
        console.log('Product updated successfully');
        res.status(200).send('Product updated successfully');
    });
});

app.post('/deleteProduct', (req, res) => {
    const { productId } = req.body;

    const sql = 'DELETE FROM products WHERE id = ?';
    db.query(sql, [productId], (err, result) => {
        if (err) {
            console.error('Error deleting product: ' + err.message);
            res.status(500).send('Error deleting product');
            return;
        }
        console.log('Product deleted successfully');
        res.status(200).send('Product deleted successfully');
    });
});

app.get('/products', (req, res) => {
    const category = req.query.category;
    const sql = 'SELECT * FROM products WHERE category = ?';
    db.query(sql, [category], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.post('/saveSpecs', (req, res) => {
    const specsName = req.body.specsName;
    const url = require('url');
    const referer = req.headers.referer;
    console.log("Specs Name:", specsName);
    const parsedUrl = url.parse(referer, true);

    const equipId = parsedUrl.query.id;

    const query = 'INSERT INTO specs (product_id, spec_name) VALUES (?, ?)';
    db.query(query, [equipId, specsName], (error, results) => {
        if (error) {
            console.error('Error inserting specs:', error);
            return res.status(500).send('Error inserting specs');
        }
        console.log('Specs inserted successfully');
        res.sendStatus(200);
    });
});

app.get('/getSpecs', (req, res) => {
    const url = require('url');
    const referer = req.headers.referer;

    const parsedUrl = url.parse(referer, true);

    const equipId = parsedUrl.query.id;
    const query = 'SELECT * FROM specs WHERE product_id = ?';
    db.query(query, [equipId], (error, results) => {
        if (error) {
            console.error('Error fetching specs:', error);
            return res.status(500).send('Error fetching specs');
        }
        res.json(results);
    });
});

app.post('/updateSpec', function(req, res) {
    const specId = req.body.id;
    const newSpecName = req.body.name;

    if (!specId || !newSpecName) {
        return res.status(400).send('Missing required fields');
    }

    const sql = "UPDATE specs SET spec_name = ? WHERE id = ?";

    db.query(sql, [newSpecName, specId], function(err, result) {
        if (err) {
            console.error('Error updating spec:', err);
            return res.status(500).send('Internal Server Error');
        }

        console.log(`Spec with ID ${specId} updated successfully`);
        res.sendStatus(200);
    });
});

app.delete('/deleteSpec/:id', function(req, res) {
    const specId = req.params.id;

    const sql = "DELETE FROM specs WHERE id = ?";
    db.query(sql, [specId], function(err, result) {
        if (err) {
            console.error('Error deleting spec:', err);
            return res.status(500).send('Internal Server Error');
        }
        console.log(`Spec with ID ${specId} deleted successfully`);
        res.sendStatus(200);
    });
});

app.get('/productInfoDisp', (req, res) => {

    const url = require('url');
    const referer = req.headers.referer;

    const parsedUrl = url.parse(referer, true);

    const productId = parsedUrl.query.id;
    const sql = 'SELECT * FROM products WHERE id = ?';
    db.query(sql, [productId], (error, results) => {
        if (error) {
            console.error('Error fetching product from database:', error);
            res.status(500).send('Internal Server Error');
        } else {
            if (results.length > 0) {
                res.json(results[0]); // Send the first product as JSON response
            } else {
                console.log('No product found for ID:', productId);
                res.status(404).send('Product not found');
            }
        }
    });
});

app.get('/productSpecs', (req, res) => {

    const url = require('url');
    const referer = req.headers.referer;

    const parsedUrl = url.parse(referer, true);

    const productId = parsedUrl.query.id;
    const sql = 'SELECT * FROM specs WHERE product_id = ?';
    db.query(sql, [productId], (error, results) => {
        if (error) {
            console.error('Error fetching specs from database:', error);
            res.status(500).send('Internal Server Error');
        } else {
            if (results.length > 0) {
                res.json(results[0]); // Send the first product as JSON response
            } else {
                console.log('No specs found for product_id:', productId);
                res.status(404).send('specs not found');
            }
        }
    });
});

app.get('/reduceQuantity', (req, res) => {
    const productId = req.query.productId;
    const requestedQuantity = parseInt(req.query.quantity, 10);

    if (!productId || !requestedQuantity) {
        return res.status(400).send('Product ID and quantity are required');
    }

    const fetchQuantityQuery = 'SELECT quantity FROM products WHERE id = ?';
    db.query(fetchQuantityQuery, [productId], (error, results) => {
        if (error) {
            console.error('Error fetching product quantity:', error);
            return res.status(500).send('Error fetching product quantity');
        }
        if (results.length === 0) {
            console.log('Product not found');
            return res.status(404).send('Product not found');
        }
        const currentQuantity = results[0].quantity;

        if (requestedQuantity > currentQuantity) {
            return res.status(400).send('Requested quantity is greater than available quantity');
        }

        const updateQuantityQuery = 'UPDATE products SET quantity = quantity - ? WHERE id = ?';
        db.query(updateQuantityQuery, [requestedQuantity, productId], (error, results) => {
            if (error) {
                console.error('Error updating product quantity:', error);
                return res.status(500).send('Error updating product quantity');
            }
            console.log('Product quantity updated successfully');

            const checkQuantityQuery = 'SELECT quantity FROM products WHERE id = ?';
            db.query(checkQuantityQuery, [productId], (error, results) => {
                if (error) {
                    console.error('Error fetching updated product quantity:', error);
                    return res.status(500).send('Error fetching updated product quantity');
                }
                const newQuantity = results[0].quantity;

                if (newQuantity === 0) {
                    const updateStatusQuery = 'UPDATE products SET Status = "out of stock" WHERE id = ?';
                    db.query(updateStatusQuery, [productId], (error, results) => {
                        if (error) {
                            console.error('Error updating product Status:', error);
                            return res.status(500).send('Error updating product Status');
                        }
                        console.log('Product Status updated to "out of stock"');
                        res.json({ message: 'Product quantity updated successfully, Status updated to "out of stock"' });
                    });
                } else {
                    res.json({ message: 'Product quantity updated successfully' });
                }
            });
        });
    });
});

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const authority = 1;

    console.log(username);
    console.log(password);
    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }

    if (!username || !password || username.length < 3 || password.length < 6) {
        return res.status(400).json({ success: false, message: 'Invalid username or password.' });
    }

    // Insert the new user into the database
    const query = 'INSERT INTO users (username, password, authority) VALUES (?, ?, 1)';
    db.query(query, [username, password], (error, results) => {
        if (error) {
            console.error('Error inserting user:', error);
            // Log the error for debugging
            console.error('SQL Query:', query);
            console.error('Values:', [username, password, 1]);
            return res.status(500).json({ success: false, message: 'An error occurred during registration.' });
        }
        console.log('User registered successfully');
        res.json({ success: true, message: 'Registration successful!' });
    });
});

app.get('/addToCart', (req, res) => {
    const userId = req.query.userId;
    const productId = req.query.productId;
    const quantityToAdd = parseInt(req.query.quantity, 10);

    // Check if productId, userId, and quantityToAdd are provided
    if (!productId || !userId || isNaN(quantityToAdd)) {
        return res.status(400).send('Product ID, User ID, and Quantity are required');
    }

    // First, fetch the current quantity of the product
    const fetchQuantityQuery = 'SELECT quantity FROM products WHERE id = ?';
    db.query(fetchQuantityQuery, [productId], (error, results) => {
        if (error) {
            console.error('Error fetching product quantity:', error);
            return res.status(500).send('Error fetching product quantity');
        }
        if (results.length === 0) {
            console.log('Product not found');
            return res.status(404).send('Product not found');
        }
        const currentQuantity = results[0].quantity;

        if (quantityToAdd > currentQuantity) {
            return res.status(400).send('Requested quantity exceeds available quantity');
        }

        // Proceed with adding the product to the cart
        const addToCartQuery = 'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)';
        db.query(addToCartQuery, [userId, productId, quantityToAdd], (error, results) => {
            if (error) {
                console.error('Error adding to cart:', error);
                return res.status(500).send('Error adding to cart');
            }

            // Reduce the product's quantity in the products table
            const newQuantity = currentQuantity - quantityToAdd;
            const updateQuantityQuery = 'UPDATE products SET quantity = ? WHERE id = ?';
            db.query(updateQuantityQuery, [newQuantity, productId], (error, results) => {
                if (error) {
                    console.error('Error updating product quantity:', error);
                    return res.status(500).send('Error updating product quantity');
                }
                res.send('Product added to cart and quantity updated');
            });
        });
    });
});

app.get('/getCartItems', (req, res) => {
    const userId = req.query.userId;

    // SQL query to fetch cart items for the given user ID
    const query = 'SELECT products.*, cart_items.quantity FROM cart_items JOIN products ON cart_items.product_id = products.id WHERE cart_items.user_id = ?';

    db.query(query, [userId], (error, results) => {
        if (error) {
            console.error('Error fetching cart items:', error);
            return res.status(500).send('Error fetching cart items');
        }
        res.json(results);
    });
});

app.post('/updateQuantityAndRemoveFromCart', (req, res) => {
    const { productId, userId, quantity } = req.body;
    const action = req.body.action;

    if (action === 'cancel') {
        // Find the product in the products table and increase its quantity
        const fetchQuantityQuery = 'SELECT quantity FROM products WHERE id = ?';
        db.query(fetchQuantityQuery, [productId], (error, results) => {
            if (error) {
                console.error('Error fetching product quantity:', error);
                return res.status(500).send('Error fetching product quantity');
            }
            if (results.length === 0) {
                console.log('Product not found');
                return res.status(404).send('Product not found');
            }
            const currentQuantity = results[0].quantity;

            // Increase the quantity by the specified amount
            const newQuantity = currentQuantity + quantity;

            // Update the quantity in the products table
            const updateQuantityQuery = 'UPDATE products SET quantity = ? WHERE id = ?';
            db.query(updateQuantityQuery, [newQuantity, productId], (error, results) => {
                if (error) {
                    console.error('Error updating product quantity:', error);
                    return res.status(500).send('Error updating product quantity');
                }

                // Remove the item from the user's cart
                const removeFromCartQuery = 'DELETE FROM cart_items WHERE product_id = ? AND user_id = ?';
                db.query(removeFromCartQuery, [productId, userId], (error, results) => {
                    if (error) {
                        console.error('Error removing item from cart:', error);
                        return res.status(500).send('Error removing item from cart');
                    }

                    res.status(200).send('Product quantity updated and item removed from cart');
                });
            });
        });
    } else {
        res.status(400).send('Invalid action');
    }
});

app.delete('/deleteCartItem', (req, res) => {
    const { productId, userId } = req.query;

    // Perform deletion from the cart_items table
    const deleteCartItemQuery = 'DELETE FROM cart_items WHERE product_id = ? AND user_id = ?';
    db.query(deleteCartItemQuery, [productId, userId], (error, results) => {
        if (error) {
            console.error('Error deleting item from cart:', error);
            return res.status(500).send('Error deleting item from cart');
        }
        
        console.log('Item removed from cart successfully');
        res.sendStatus(200); // Send success response
    });
});

app.get('/search', (req, res) => {
    const searchQuery = req.query.query;
    if (!searchQuery) {
        return res.status(400).send('Search query is required');
    }

    // SQL query to search for products that match the search query
    const sql = 'SELECT * FROM products WHERE name LIKE ?';
    const searchTerm = `%${searchQuery}%`; // Use LIKE operator to find matches

    db.query(sql, [searchTerm], (error, results) => {
        if (error) {
            console.error('Error searching products:', error);
            return res.status(500).send('Error searching products');
        }
        res.json(results); // Send the search results as JSON
    });
});


const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Starting server a ${port}`);
})