const properties = require('./json/properties.json');
const users = require('./json/users.json');
// const { Pool } = require('pg');
const db = require('./db');



/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */

const getUserWithEmail = function(email) {
// $1 is grabbing the (1st element = [email]), the require email has been passed through the server.js file.
  return db.query(`
  SELECT * 
  FROM users 
  WHERE email = $1`, [email])
    .then(res => {
      if (res.rows.length === 0) {
        return null;
      }
      return res.rows[0];
    });
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return db.query(`
  SELECT name 
  FROM users 
  WHERE id = $1`, [id])
    .then(res => {
      if (res.rows.length === 0) {
        return null;
      }
      return res.rows[0];
    });
};

exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  return db.query(`
  INSERT INTO users (name, email, password) 
  VALUES ($1, $2, $3) 
  RETURNING users.id`, [user.name, user.email, user.password])
    .then(res => {
      if (res.rows.length === 0) {
        return null;
      }
      return res.rows;
    });
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  
  return db.query(`
  SELECT reservations.*, 
  properties.*, 
  AVG(rating) as average_rating 
  FROM reservations 
  JOIN properties ON property_id = properties.id 
  JOIN property_reviews ON reservation_id = reservations.id 
  WHERE reservations.guest_id = $1
  GROUP BY reservations.id, properties.id`, [guest_id])
    .then(res => (res.rows));
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
//console.log(options, limit)
  const queryParams = [];
  let queryString = `
  SELECT properties.*, 
  AVG(rating) AS average_rating 
  FROM properties 
  LEFT OUTER JOIN property_reviews ON property_id = properties.id 
  `;

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }
  // Ternary operator used to determine whether the statement is a addition to the WHERE or a new WHERE condition
  if (options.owner_id) {
    queryParams.push(`${options.owner_id}`);
    queryString += `${queryParams.length === 1 ? "WHERE" : "AND"} properties.owner_id = $${queryParams.length} `;
  }

  if (options.minimum_price_per_night) {
    queryParams.push(`${options.minimum_price_per_night}` * 100);
    queryString += `${queryParams.length === 1 ? "WHERE" : "AND"} cost_per_night >= $${queryParams.length} `;
  }

  if (options.maximum_price_per_night) {
    queryParams.push(`${options.maximum_price_per_night}` * 100);
    queryString += `${queryParams.length === 1 ? "WHERE" : "AND"}  cost_per_night <= $${queryParams.length} `;
  }
  queryString += `
  GROUP BY properties.id
  `;
  // parseInt used to convert rating from string to integer
  // Having average to ensure passed in rating executes
  if (options.minimum_rating) {
    queryParams.push(parseInt(`${options.minimum_rating}`));
    queryString += ` HAVING AVG(rating) >= $${queryParams.length} `;
  }

  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length}
  `;

  // console.log(queryString, queryParams);

  return db.query(queryString, queryParams)
    .then(res => (res.rows));
};

exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  //console.log(property)
  const queryParams =  [
    property.title,
    property.description,
    property.owner_id,
    property.cover_photo_url,
    property.thumbnail_photo_url,
    property.cost_per_night,
    property.parking_spaces,
    property.number_of_bathrooms,
    property.number_of_bedrooms,
    property.province,
    property.city,
    property.country,
    property.street,
    property.post_code
  ];

  let queryString = `
  INSERT INTO properties (
    title, 
    description, 
    owner_id, 
    cover_photo_url, 
    thumbnail_photo_url, 
    cost_per_night, 
    parking_spaces, 
    number_of_bathrooms, 
    number_of_bedrooms, 
    province, 
    city, 
    country, 
    street, 
    post_code
    ) VALUES (
    $1, $2, $3, $4, $5, $6, $7, 
    $8, $9, $10, $11, $12, $13, 
    $14)
    RETURNING *`;

  // if (property.owner_id) {
  //   queryParams.push(`${property.owner_id}`);
  // }
 
  //console.log(queryString, queryParams);

  return db.query(queryString, queryParams)
    .then(res => res.rows);

};
exports.addProperty = addProperty;
