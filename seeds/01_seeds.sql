INSERT INTO users (name, email, password) VALUES ('Maria Jovovich', 'maria@bt.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'), 

('Riviera Fernandes', 'rivers.f@hotmail.co.uk', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),

('Phoebe Judge', 'peebs@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (title, owner_id, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)VALUES ('Villa for Hire', 1, 'description', 'http;//images.net/ofimage.png', 'http;//images.net/ofimage.png', 3499, 1, 1, 2, 'Canada', '1234 ABC Street', 'Vancouver', 'BC', 'V1N 7L7', false),

('Downtown Condo available near Yaletown', 3,'description', 'http;//images.net/ofimage1.png', 'http;//images.net/ofimage1.png', 5500, 1, 1, 1, 'Canada', '567 XYZ Avenue', 'Vancouver', 'BC', 'V6T 7P0', true),

('Luxury Cabin close to Whistler', 2, 'description', 'http;//images.net/ofimage2.png', 'http;//images.net/ofimage2.png', 3499, 2, 1, 3, 'Canada', '1 Cabin Lake Street', 'Whistler', 'BC', 'V7S 8L1', false);

INSERT INTO reservations (guest_id, property_id, start_date, end_date) VALUES (1, 2,'2020-07-05', '2020-07-10'), 
(2, 2,'2020-10-23', '2020-11-12'),
(3, 3, '2020-05-31', '2020-06-02');

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message) VALUES (1, 1, 1, 4, 'message'),
(3, 2, 2, 3, 'message'),
(2, 3, 3, 5, 'message');