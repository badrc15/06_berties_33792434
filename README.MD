Bertie's Books Web Application
Overview

Bertie's Books is a web application that allows users to register, log in, and view a list of registered users. The application also keeps a record of all login attempts for security and auditing purposes.

Features

User Registration

Users can sign up with a username, first name, last name, email, and password.

Passwords are securely stored and not visible to anyone.

User Login

Registered users can log in using their username and password.

The system verifies the credentials and prevents login if they are incorrect.

List Users

A page displays all registered users, but passwords are never shown.

Audit Logging

Every login attempt, whether successful or failed, is recorded in an audit log.

The audit page shows who tried to log in, whether it was successful, and the time of the attempt.

Database Security

Database credentials are stored in a secure environment file, not in the code, to prevent unauthorized access.

This keeps sensitive information safe, even if the code is shared publicly.

Test User

A pre-registered user named “gold” with password “smiths” is included for testing purposes.

How It Works

Users register through a form and their details are stored securely.

Login attempts are checked against stored data and recorded in an audit log.

Admins or users can view registered users and audit logs.

Database credentials are hidden using environment variables to ensure security.

Getting Started

Set up the database and tables.

Add initial test data, including the “gold” user.

Start the web application.

Use the app through a web browser to register, log in, view users, and check audit logs.

Summary

This application demonstrates secure user registration and login, proper password handling, an audit system for login activity, and secure storage of database credentials. It provides a safe and organized way to manage users in a web application.
