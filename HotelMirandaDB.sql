DROP DATABASE IF EXISTS HotelMirandaDB;
CREATE DATABASE IF NOT EXISTS HotelMirandaDB;
USE HotelMirandaDB;


CREATE TABLE users (
	_id INT AUTO_INCREMENT,
    photo TEXT NOT NULL,
	full_name VARCHAR(50) NOT NULL,
	email VARCHAR(50) NOT NULL,
	start_date TIMESTAMP NOT NULL,
	`description` VARCHAR(250) NOT NULL,
	phone_number VARCHAR(20) NOT NULL,
	`status` ENUM('active', 'inactive') NOT NULL,
	`password` VARCHAR(255) NOT NULL,

	PRIMARY KEY(_id)
);

CREATE TABLE contacts (
	_id INT AUTO_INCREMENT,
	publish_date TIMESTAMP NOT NULL,
	full_name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
	phone_number VARCHAR(20) NOT NULL,
	`comment` VARCHAR(250) NOT NULL,
    archived ENUM('archived', 'notArchived') NOT NULL,

	PRIMARY KEY(_id)
);

CREATE TABLE rooms (
	_id INT AUTO_INCREMENT,
    photos TEXT NOT NULL,
	`number` VARCHAR(3) UNIQUE NOT NULL,
    `type` VARCHAR(15) NOT NULL,
	amenities TEXT NOT NULL,
    price DECIMAL(8,2) NOT NULL,
    discount DECIMAL(5,2) NOT NULL,

	PRIMARY KEY(_id)
);

CREATE TABLE bookings (
	_id INT AUTO_INCREMENT,
    photo VARCHAR(255) NOT NULL,
	full_name_guest VARCHAR(50) NOT NULL,
    order_date TIMESTAMP NOT NULL,
	check_in_date TIMESTAMP NOT NULL,
    check_out_date TIMESTAMP NOT NULL,
    special_request VARCHAR(250) NOT NULL,
    room_id INT NOT NULL,

	PRIMARY KEY(_id),
    FOREIGN KEY (room_id) REFERENCES rooms(_id) ON DELETE CASCADE
);

SELECT * FROM users;
SELECT * FROM contacts;
SELECT * FROM rooms;
SELECT * FROM bookings;

INSERT INTO users (photo, full_name, email, start_date, description, phone_number, status, password) VALUES (
    "https://avatars.githubusercontent.com/u/83874929", 
    "Lindsay Dooley", 
    "Ashly.Rice92@gmail.com", 
    "2025-11-01T23:09:46.319+00:00", 
    "Aeger creber depulso. Tergeo natus adsidue. Curatio repudiandae vigilo…", 
    "969264508", 
    "inactive", 
    "$2b$10$WTspksQjt95roheuvXBYW.yyEU77xdawJUdTBAFxvDasWNJ3dUp9a"
);
INSERT INTO contacts (publish_date, full_name, email, phone_number, comment, archived) VALUES (
    "2024-12-29T23:16:50.088+00:00", 
    "Essie Bogisich", 
    "Nadia53@gmail.com", 
    "453763707", 
    "Quos ait substantia attonbitus thorax officia barba ipsum. Vobis tum a…", 
    "archived"
),
(
    "2024-06-15T23:16:50.088+00:00", 
    "Pepe Luís", 
    "Pepito@hotmail.com", 
    "971 44 55 66", 
    "Quos ait substantia attonbitus thorax officia barba ipsum. Sakaletum ketum", 
    "notArchived"
);
INSERT INTO rooms (photos, number, type, amenities, price, discount) VALUES (
    '["https://picsum.photos/seed/ee2ZHNgM02/2707/3299?grayscale&blur=4", "https://picsum.photos/seed/82bQ6spwAL/3443/324?blur=3", "https://picsum.photos/seed/koaHxbj8/3508/1945?grayscale&blur=4"]', 
    "361", 
    "Single Bed", 
    '["Minibar", "WiFi", "3 Bed Space"]', 
    85150.41, 
    70.47
),
(
    '["https://picsum.photos/seed/82bQ6spwAL/3443/324?blur=3", "https://picsum.photos/seed/ee2ZHNgM02/2707/3299?grayscale&blur=4", "https://picsum.photos/seed/koaHxbj8/3508/1945?grayscale&blur=4"]', 
    "202", 
    "Suite", 
    '["WiFi"]', 
    394.55, 
    25.55
);
INSERT INTO bookings (photo, full_name_guest, order_date, check_in_date, check_out_date, special_request, room_id) VALUES 
(
    "https://avatars.githubusercontent.com/u/2865354", 
    "Dana Leuschke-Dare", 
    "2025-02-21T20:52:16.057+00:00", 
    "2026-11-06T16:46:13.355+00:00", 
    "2027-04-14T12:58:30.959+00:00", 
    "Uter statim vivo vorax verus cibus coaegresco ater surgo vetus cursus …", 
    1
),
(
    "https://avatars.githubusercontent.com/u/33528283", 
    "Jeff Gottlieb", 
    "2025-02-25T15:15:11.259+00:00", 
    "2026-07-07T05:16:22.904+00:00", 
    "2026-08-13T14:00:53.110+00:00", 
    "Usus decens tabernus totam tempus quod umquam deporto velut cursim utr…", 
    1
),
(
    "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/61.jpg", 
    "Wallace Emard", 
    "2025-02-23T23:41:11.703+00:00", 
    "2025-03-12T00:11:41.101+00:00", 
    "2025-03-12T19:42:13.929+00:00", 
    "Odit carus bestia virgo amet caries peior accusator vergo crinis bellu…", 
    1
);



/*
SELECT * FROM bookings WHERE _id = 3;
DELETE FROM rooms WHERE _id = 1;
*/