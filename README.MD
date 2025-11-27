--Bertie’s Books is a simple, interactive web application for a small bookstore. It allows users to explore the store’s book collection, search for specific books, and add new books to the inventory. The app is designed with ease-of-use in mind and provides dynamic pages to make book browsing and management simple.

Homepage – Welcome page with links to all sections of the website.

Search Books – Users can search for books by title. Supports both exact matches and partial matches (e.g., searching “World” returns “Brave New World”).

View All Books – Lists all books in the database along with their prices.

Add a New Book – Users can submit a book name and price to add new books to the database.

Bargain Books – Displays all books priced under £20.

The website is built using Node.js, Express, EJS, and MySQL.

Book data is stored in a MySQL database with a books table containing id, name, and price columns.

The web pages are rendered dynamically using EJS templates.

Users interact with the website through forms and links:

Search for books using the search form.

Browse all books on the list page.

Add a new book using the add book form.

View bargains under £20 on a dedicated page.
