# How to start

please add the instructions about how to start the app

create env

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mydb?schema=public"
JWT_SECRET="veryverysecret"
ALLOWED_ORIGINS="http://localhost:5173"
```

run database: `docker compose up -d`

generate prisma `client: npx prisma db push`

seed data: `node prisma/seed/script.js`

install dependencies: `yarn`

run the app: `yarn start:dev`

recording: https://www.loom.com/share/467b33c9742845a2bb78b84d633fb3cf

# How it works

## 1. Seller Login and Product Management

- **Login**: Sellers can log in to the system using their credentials.
- **Product Upload**: Once logged in, sellers can upload new products to the system, which can either be for sale or rent. Each product will have details like name, price, rental price, description, and availability.

### Flow:

1. Seller logs in with username and password.
2. Upon successful login, the seller is presented with a dashboard where they can upload products.
3. Seller can provide details such as product name, price, rental price, description, and select if the product is for sale or rent.

---

## 2. Customer Product Viewing

- **Product Listing**: Customers can browse and view available products without needing to log in.
- **Product Details**: Each product will have details such as name, description, price (for sale), or rental price (for rent), and availability.

### Flow:

1. The customer navigates to the product listing page.
2. A list of available products is displayed.
3. The customer clicks on a product to view its details.

---

## 3. Customer Purchasing or Renting Products

- **Purchasing**: The customer can click a "Buy Now" button to purchase the product.
- **Renting**: The customer can click a "Rent Now" button to rent the product for a specified period.

### Flow:

1. The customer selects the product they wish to buy or rent.
2. For purchasing, the customer is redirected to the checkout page to make payment.
3. For renting, the customer selects rental duration and is directed to checkout to make payment.

---

## 4. Order Creation and Pending Status

- Once the customer selects a product for purchase or rent and proceeds with the payment, an order is created with a **pending** status.
- The order will remain in the **pending** state until the payment is successfully processed.

### Flow:

1. Customer selects a product.
2. Order is created with a **pending** status and awaits payment.
3. The order will remain pending until the customer completes the payment.

---

## 5. Order Expiry and Product Reversion

- If an order remains in the **pending** state for a set duration without payment, it will expire.
- After the expiration, the product will be reverted back to available status for sale or rent.

### Flow:

1. After the order is created in the pending status, a timer is initiated.
2. If the order is not completed within the expiration time, the order status changes to **expired**.
3. The product is made available for purchase or rent again.

---

## 6. Payment and Order Status Change

- **Payment Completion**: Once the customer makes the payment, the order status changes to either **placed** (for purchased products) or **on_rent** (for rented products).

### Flow:

1. Customer proceeds to the payment gateway.
2. Once the payment is successful, the order status updates:
   - For purchase: status changes to **placed**.
   - For rent: status changes to **on_rent**.

---

## 7. Seller Order Management

- **View Orders**: Sellers can log in to view the orders associated with their products.
- **Complete Orders**: The seller can mark orders as completed once the product is delivered (for purchased items) or returned (for rental items).
- **Delete Expired/Cancelled Orders**: The seller can delete orders that are either expired or cancelled.

### Flow:

1. Seller logs in and navigates to the order management page.
2. Seller can view all orders associated with their products.
3. Seller can complete an order once the transaction is finished or the product is returned.
4. Seller can delete orders marked as expired or cancelled.
