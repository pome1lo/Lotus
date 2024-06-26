CREATE DATABASE AUTHENTICATION_SERVICE;
USE AUTHENTICATION_SERVICE;

CREATE TABLE USERS (
    ID INT PRIMARY KEY IDENTITY,
    USERNAME NVARCHAR(255) NOT NULL,
    EMAIL NVARCHAR(255) NOT NULL,
    PASSWORD NVARCHAR(255),
    SALT NVARCHAR(255),
    IS_EMAIL_VERIFIED BIT DEFAULT 0,
    VERIFICATION_TOKEN NVARCHAR(255),
    RESET_PASSWORD_TOKEN NVARCHAR(255),
    RESET_PASSWORD_EXPIRES DATETIME
);


CREATE DATABASE NOTIFICATION_SERVICE;
USE NOTIFICATION_SERVICE;

CREATE TABLE NOTIFICATIONS
(
    ID INT PRIMARY KEY IDENTITY,
    AUTHOR NVARCHAR(255) NOT NULL,
	USER_ID INT NOT NULL,
    CONTENT TEXT NOT NULL,
    IMAGE NVARCHAR(255) DEFAULT 'default_profile.png',
    PUBLISHED_AT DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE DATABASE PROFILE_SERVICE;
USE PROFILE_SERVICE

CREATE TABLE USERS (
    ID INT PRIMARY KEY IDENTITY,
    USERNAME NVARCHAR(255),
    EMAIL NVARCHAR(255),
    FIRSTNAME NVARCHAR(255),
    LASTNAME NVARCHAR(255),
    PHONE_NUMBER NVARCHAR(255),
    PROFILE_PICTURE NVARCHAR(255) DEFAULT 'default_profile.png',
    SUBSCRIBERS_COUNT INT DEFAULT 0,
    SUBSCRIPTIONS_COUNT INT DEFAULT 0,
    POSTS_COUNT INT DEFAULT 0
);

CREATE TABLE POSTS (
    ID INT PRIMARY KEY IDENTITY,
    USER_ID INT FOREIGN KEY REFERENCES USERS(ID),
    TITLE NVARCHAR(255) NOT NULL,
    CONTENT NVARCHAR(MAX) NOT NULL,
    IMAGE NVARCHAR(255),
    PUBLISHED_AT DATETIME DEFAULT GETDATE()
);

CREATE TABLE SUBSCRIPTION (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    SUBSCRIBER_ID INT,
    SUBSCRIBED_TO_ID INT,
    FOREIGN KEY (SUBSCRIBER_ID) REFERENCES USERS(ID),
    FOREIGN KEY (SUBSCRIBED_TO_ID) REFERENCES USERS(ID)
);

CREATE TABLE COMMENTS (
    ID INT PRIMARY KEY IDENTITY,
    USER_ID INT,
    POST_ID INT,
    USERNAME NVARCHAR(255),
    USER_PICTURE NVARCHAR(255) DEFAULT 'default_profile.png',
    COMMENT NVARCHAR(MAX) NOT NULL,
    CREATED_AT DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (USER_ID) REFERENCES USERS(ID),
    FOREIGN KEY (POST_ID) REFERENCES POSTS(ID)
);
 