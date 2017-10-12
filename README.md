# vindb-web
A Node.js-based website for viewing and comparing products from Vinmonopolet's database.

## Frameworks/technologies used
- Express as HTTP server
- Pug/Jade as HTML template engine
- A mix of pure JavaScript and jQuery in the frontend
- MySQL as database backend

## Requirements
- Node.js and NPM
- MySQL

## Installing
1. Clone the repository
2. Run `npm install` in the cloned directory
3. Import db.sql to a new MySQL database
4. Input your database details to the `.env` file

## Running
- Run `set DEBUG=vindb-web:* & npm start`
