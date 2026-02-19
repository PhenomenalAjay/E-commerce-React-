# Famous Shopin - E-Commerce Application

A modern, responsive E-commerce web application built with React , Tailwind CSS and MySql. This project demonstrates a functional frontend for an online store, including product browsing, searching, wishlist management, and simulated user authentication.

## Features

- **Home Page**: Features a hero section, auto-rotating product image carousel, and service highlights.
- **Product Collection**:
  - Fetches real product data from Fake Store API = "https://fakestoreapi.com/".
  - Real-time search filtering.
  - Product detail popovers.
- **Wishlist**:
  - Add products to a personal wishlist.
  - Persists data using LocalStorage.
  - Remove items from the wishlist.
- **Authentication**:
  - Simulated Sign Up and Login functionality.
  - User credentials and session state stored in LocalStorage.
- **Responsive Design**:
  - Mobile-friendly navigation with a side drawer.
  - Responsive grid layouts for products.
- **404 Page**: Custom error page for undefined routes.

## Tech Stack

- **Frontend**: React.js
- **Styling**: Tailwind CSS
- **Database**: MySql
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Icons**: FontAwesome

## Folder Structure

Here is the structure of the source code for this project:

```text
src/
├── views/
│   ├── 404.jsx         
│   ├── collection.jsx   
│   ├── home.jsx         
│   └── wishlist.jsx     
├── tailwind.css         
├── App.js               
└── index.js             
```


   The app should now be running on "http://localhost:3000".
