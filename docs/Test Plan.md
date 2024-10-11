
### Test Plan Overview

1. **Objective**: To verify the functionality, reliability, and robustness of each entity in the e-commerce API.
2. **Scope**: Unit testing for entities - Address, Admin, Contact, Customer, User, Comment, Review, Order, Order_detail, Inventory, Product_type, and Product.
3. **Tools**: Jest (testing framework), Supertest (HTTP assertions), TypeORM (for database interactions), NestJS testing utilities and Selenium.

### Test Plan Structure

1. **Setup**
2. **Test Cases for Each Entity**
   - **Basic CRUD Operations**
   - **Entity-specific Validations and Business Logic**
3. **Common Test Utilities**


### Entity: User

#### Test Cases for User

1. **Basic CRUD Operations**

   - **Create User**:
     - Ensure a user can be created successfully.
     - Validate that required fields are present.
     

   - **Read User**:
     - Fetch a user by ID.
     

   - **Update User**:
     - Update user details.
     - Validate that the fields are updated correctly.
     

   - **Delete User**:
     - Ensure a user can be deleted.
     


### Entity: Address

#### Test Cases for Address

1. **Basic CRUD Operations**

   - **Create Address**:
     - Ensure an address can be created successfully.
     - Validate that required fields are present.
     

   - **Read Address**:
     - Fetch an address by ID.
     

   - **Update Address**:
     - Update address details.
     - Validate that the fields are updated correctly.
    

   - **Delete Address**:
     - Ensure an address can be deleted.
     - Handle cases where the address does not exist.


### Entity: Contact

#### Test Cases for Contact

1. **Basic CRUD Operations**

   - **Create Contact**:
     - Ensure a contact can be created successfully.
     - Validate that required fields (e.g., name, email, message) are present.

   - **Read Contact**:
     - Fetch a contact by ID.
     - Handle cases where the contact does not exist.

   - **Update Contact**:
     - Update contact details.
     - Validate that the fields are updated correctly.

   - **Delete Contact**:
     - Ensure a contact can be deleted.
     - Handle cases where the contact does not exist.


### Entity: Comment

#### Test Cases for Comment

1. **Basic CRUD Operations**

   - **Create Comment**:
     - Ensure a comment can be created successfully.
     - Validate that required fields (e.g., content, author, related entity) are present.
     - Handle cases where required fields are missing.

   - **Read Comment**:
     - Fetch a comment by ID.
     - Handle cases where the comment does not exist.

   - **Update Comment**:
     - Update comment details.
     - Validate that the fields are updated correctly.
  

   - **Delete Comment**:
     - Ensure a comment can be deleted.
     - Handle cases where the comment does not exist.

### Entity: Review

#### Test Cases for Review

1. **Basic CRUD Operations**

   - **Create Review**:
     - Ensure a review can be created successfully.
     - Validate that required fields (e.g., rating, content, author, product) are present.

   - **Read Review**:
     - Fetch a review by ID.

   - **Update Review**:
     - Update review details.
     - Validate that the fields are updated correctly.

   - **Delete Review**:
     - Ensure a review can be deleted.
     - Handle cases where the review does not exist.

### Entity: Order

#### Test Cases for Order

1. **Basic CRUD Operations**

   - **Create Order**:
     - Ensure an order can be created successfully.
     - Validate that required fields (e.g., customer, order date, status) are present.
     - Handle cases where required fields are missing.

   - **Read Order**:
     - Fetch an order by ID.
     - Handle cases where the order does not exist.

   - **Update Order**:
     - Update order details.
     - Validate that the fields are updated correctly.

   - **Delete Order**:
     - Ensure an order can be deleted.
     - Handle cases where the order does not exist.

### Entity: Order_detail

#### Test Cases for Order_detail

1. **Basic CRUD Operations**

   - **Create Order_detail**:
     - Ensure an order detail can be created successfully.
     - Validate that required fields (e.g., order, product, quantity, price) are present.
     - Handle cases where required fields are missing.

   - **Read Order_detail**:
     - Fetch an order detail by ID.
     - Handle cases where the order detail does not exist.

   - **Update Order_detail**:
     - Update order detail details.
     - Validate that the fields are updated correctly.
     - Handle cases where the order detail does not exist.

   - **Delete Order_detail**:
     - Ensure an order detail can be deleted.
     - Handle cases where the order detail does not exist.

2. **Entity-specific Validations and Business Logic**

   - **Validation**:
     - Validate quantity and price values.
     - Ensure the relationship with Order entity (e.g., an order detail must belong to an order).
     - Validate product information (e.g., the product exists and is available).

### Entity: Inventory

#### Test Cases for Inventory

1. **Basic CRUD Operations**

   - **Create Inventory**:
     - Ensure an inventory record can be created successfully.
     - Validate that required fields (e.g., product, quantity, location) are present.
     - Handle cases where required fields are missing.

   - **Read Inventory**:
     - Fetch an inventory record by ID.
     - Handle cases where the inventory record does not exist.

   - **Update Inventory**:
     - Update inventory details.
     - Validate that the fields are updated correctly.
     - Handle cases where the inventory record does not exist.

   - **Delete Inventory**:
     - Ensure an inventory record can be deleted.
     - Handle cases where the inventory record does not exist.

2. **Entity-specific Validations and Business Logic**

   - **Validation**:
     - Validate quantity values (e.g., non-negative values).
     - Ensure the relationship with Product entity (e.g., inventory must be for a valid product).
     - Validate location information (e.g., valid warehouse locations).

### Entity: Product_type

#### Test Cases for Product_type

1. **Basic CRUD Operations**

   - **Create Product_type**:
     - Ensure a product type can be created successfully.
     - Validate that required fields (e.g., name, description) are present.
     - Handle cases where required fields are missing.

   - **Read Product_type**:
     - Fetch a product type by ID.
     - Handle cases where the product type does not exist.

   - **Update Product_type**:
     - Update product type details.
     - Validate that the fields are updated correctly.
     - Handle cases where the product type does not exist.

   - **Delete Product_type**:
     - Ensure a product type can be deleted.
     - Handle cases where the product type does not exist.

2. **Entity-specific Validations and Business Logic**

   - **Validation**:
     - Validate unique name constraints.
     - Ensure the description meets length requirements.

### Entity: Product

#### Test Cases for Product

1. **Basic CRUD Operations**

   - **Create Product**:
     - Ensure a product can be created successfully.
     - Validate that required fields (e.g., name, price, product type, inventory) are present.
     - Handle cases where required fields are missing.

   - **Read Product**:
     - Fetch a product by ID.
     - Handle cases where the product does not exist.

   - **Update Product**:
     - Update product details.
     - Validate that the fields are updated correctly.
     - Handle cases where the product does not exist.

   - **Delete Product**:
     - Ensure a product can be deleted.
     - Handle cases where the product does not exist.

2. **Entity-specific Validations and Business Logic**

   - **Validation**:
     - Validate price values (e.g., non-negative values).
     - Ensure the relationship with Product_type entity (e.g., product must belong to a valid product type).
     - Validate inventory levels (e.g., product must have associated inventory).

### Automated Testing With Selenium

#### Objective
To ensure the e-commerce platform's web interface is functionin correctly and providing a seamless user experience through automated browser testing.


#### Scope

Automated testing with Selenium will cover the following scenarios:
- User registration and login
- Product browsing and search functionality
- Adding products to the cart
- Checkout process
- User account management (e.g., updating profile information, viewing order history)
- Contact form submission
- Review and comment submission on products

#### Tools
- Selenium WebDriver
- Jest

#### Test Cases

1. **User Registration and Login**

   - **Registration**:
     - Test the user registration form for required fields.
     - Validate successful registration.
     - Handle cases where required fields are missing or invalid.

   - **Login**:
     - Test the login form for required fields.
     - Validate successful login with correct credentials.
     - Handle cases with incorrect credentials.

2. **Product Browsing and Search**

   - **Product Listing**:
     - Verify that product listings are displayed correctly.
     - Test filtering and sorting options.

   - **Product Search**:
     - Validate the search functionality.
     - Test search results for various queries.

3. **Adding Products to Cart**

   - **Add to Cart**:
     - Verify that products can be added to the cart.
     - Validate the cart's total price and item count.
     - Test the removal of items from the cart.

4. **Checkout Process**

   - **Checkout**:
     - Test the checkout process from cart to order confirmation.
     - Validate payment and shipping information forms.
     - Verify order summary and confirmation details.

5. **Order History and Details**

   - **Order History**:
     - Verify that order history is displayed correctly for logged-in users.
     - Test the details of individual orders.




### Selenium Test Plan

1. **User Registration and Login**

   - **Registration**:
     - Navigate to the registration page.
     - Fill in the registration form with valid data.
     - Submit the form and verify successful registration.
     - Repeat with missing/invalid data and verify appropriate error messages.

   - **Login**:
     - Navigate to the login page.
     - Fill in the login form with valid credentials.
     - Submit the form and verify successful login.
     - Repeat with invalid credentials and verify appropriate error messages.

2. **Product Browsing and Search**

   - **Product Listing**:
     - Navigate to the product listing page.
     - Verify that all products are displayed correctly.
     - Apply filters and sorting options and verify the results.

   - **Product Search**:
     - Use the search bar to search for products.
     - Verify that search results are accurate and relevant.

3. **Adding Products to Cart**

   - **Add to Cart**:
     - Navigate to a product detail page.
     - Add the product to the cart.
     - Verify that the cart is updated correctly.
     - Remove the product from the cart and verify the changes.

4. **Checkout Process**

   - **Checkout**:
     - Proceed to checkout from the cart.
     - Fill in the shipping and payment information.
     - Verify the order summary.
     - Submit the order and verify the order confirmation.

5. **Order History and Details**

   - **Order History**:
     - Navigate to the user's order history page.
     - Verify that all previous orders are listed correctly.
     - Click on an order to view its details and verify the information.

6. **Contact Form Submission**

   - **Contact Form**:
     - Navigate to the contact page.
     - Fill in the contact form with valid data.
     - Submit the form and verify successful submission.
     - Repeat with missing/invalid data and verify appropriate error messages.
7. **Review and Comment Submission**

   - **Review Submission**:
     - Navigate to a product detail page.
     - Submit a review with valid data.
     - Verify that the review is displayed correctly.
     - Repeat with missing/invalid data and verify appropriate error messages.

   - **Comment Submission**:
     - Navigate to a product detail page.
     - Submit a comment with valid data.
     - Verify that the comment is displayed correctly.
     - Repeat with missing/invalid data and verify appropriate error messages.

