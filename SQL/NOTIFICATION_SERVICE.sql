--CREATE DATABASE NOTIFICATION_SERVICE;

USE NOTIFICATION_SERVICE;

DROP TABLE NOTIFICATIONS;

CREATE TABLE NOTIFICATIONS
(
    ID INT PRIMARY KEY IDENTITY,
    AUTHOR NVARCHAR(255) NOT NULL,
	USER_ID INT NOT NULL,
    CONTENT TEXT NOT NULL,
    IMAGE NVARCHAR(255) DEFAULT 'default_profile.png',
    PUBLISHED_AT DATETIME DEFAULT CURRENT_TIMESTAMP
);

SELECT * FROM NOTIFICATIONS