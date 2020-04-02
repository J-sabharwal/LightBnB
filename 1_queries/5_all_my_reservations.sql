SELECT properties.*, reservations.*, AVG(property_reviews.rating) AS average_rating
FROM reservations
JOIN properties ON properties.id = property_id
JOIN users ON users.id = guest_id
JOIN property_reviews ON properties.id = property_reviews.property_id
WHERE users.id = 1 
AND end_date < now()::date
GROUP BY properties.id, reservations.id
ORDER BY start_date
LIMIT 10;
