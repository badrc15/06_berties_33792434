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

README – Input Validation and Sanitisation Changes

Overview:
I improved the registration and login system by adding server-side validation and sanitisation. These changes ensure users enter valid information and help protect the site from XSS attacks. All updates were made inside users.js and the sanitiser was enabled in index.js.

Server-Side Validation (express-validator)
I added validation rules to ensure the user enters correct information when registering. These checks stop invalid or unsafe data from being processed or stored.

Validation rules added:

Email: Checked with isEmail() to ensure it is a valid email format, and isLength({ max: 50 }) to prevent extremely long inputs that could be harmful.

Username: Checked with isLength({ min: 5, max: 20 }) to force usernames to be within a sensible range.

Password: Checked with isLength({ min: 8 }) to enforce a minimum password strength.

If any validation fails, the user is sent back to the registration page and given error messages.

Input Sanitisation (express-sanitizer)
I installed and enabled express-sanitizer to strip out any HTML or JavaScript from user input. This prevents XSS attacks, where a user could try to inject script tags or malicious HTML into the app.

Fields sanitised:

username: to prevent JavaScript being injected into a value that may be displayed back to users.

first name: sanitised because it is displayed on the confirmation page after registration.

last name: sanitised for the same reason as the first name.

email: even after being validated, sanitatisation ensures no HTML or JavaScript remains.

password: sanitised to avoid any script-based input being stored before hashing.

Only user input is sanitised. The hashed password created by bcrypt is not sanitised, because changing it would break login verification.

Improvements to Login and Logout
I corrected issues in the login and logout routes:

Sanitised login input fields (username and password).

Logged all login attempts in the database.

Fixed the logout route by removing the redirectLogin middleware so logout no longer redirects in a loop and the logout page displays correctly.

Fixes to Rendering EJS Templates
I corrected incorrect usage like res.render("/register.ejs") which caused “Failed to lookup view” errors. Views are now rendered using res.render("register"), which correctly loads templates from the views directory.

Summary of Security Improvements

Invalid or harmful data is blocked before being processed.

XSS attacks are prevented by sanitising user input.

Passwords must meet a minimum strength requirement.

Usernames and emails must meet acceptable length and format rules.

Login and logout routes now behave correctly and reliably.

Error messages are shown clearly when validation fails.

Conclusion:
These changes make the system more secure and more reliable. Validation ensures only correct data is accepted, and sanitisation protects against malicious scripts. Together, these updates make the registration and login process safer for users and more robust for the application.
