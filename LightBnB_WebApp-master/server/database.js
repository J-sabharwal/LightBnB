const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */

const getUserWithEmail = function(email) {
// $1 is grabbing the (1st element = [email]), the require email has been passed through the server.js file.
    return pool.query('SELECT * FROM users WHERE email = $1', [email])
    .then(res => {
      if(res.rows.length === 0) {
        return null;
      }
      return res.rows[0];
    })
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool.query('SELECT name FROM users WHERE id = $1', [id])
  .then(res => {
    if(res.rows.length === 0) {
      return null;
    }
    return res.rows[0];
  })
}

exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  return pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING users.id', [user.name, user.email, user.password])
  .then(res => {
    if(res.rows.length === 0) {
      return null;
    }
    return res.rows;
  })
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return pool.query('SELECT reservations FROM reservations WHERE guest_id = $1', [guest_id])
  .then(res => res.rows);
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  return pool.query(`SELECT * FROM properties LIMIT $1`, [limit])
  .then(res => res.rows)

}
exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {

  return pool.query(`
  INSERT INTO properties (
    title, description, owner_id, 
    cover_photo_url, thumbnail_photo_url, 
    cost_per_night, parking_spaces, 
    number_of_bathrooms, number_of_bedrooms, 
    active, province, city, country, 
    street, post_code
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, 
      $8, $9, $10, $11, $12, $13, 
      $14, $15)`, [
        property.title, 
        property.description, 
        property.owner_id, 
        property.cover_photo_url, 
        property.thumbnail_photo_url, 
        property.cost_per_night, 
        property.parking_spaces, 
        property.number_of_bathrooms, 
        property.number_of_bedrooms, 
        property.active, 
        property.province, 
        property.city, 
        property.country, 
        property.street, 
        property.post_code
      ])
  .then(res => res.rows)

}
exports.addProperty = addProperty;
