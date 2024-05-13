CREATE DATABASE PROFILE_SERVICE;
USE PROFILE_SERVICE

DROP TABLE SAVED_POSTS;
DROP TABLE COMMENTS;
DROP TABLE SUBSCRIPTION;
DROP TABLE POSTS;
DROP TABLE USERS;

CREATE TABLE USERS (
    ID INT PRIMARY KEY IDENTITY,
    USERNAME NVARCHAR(255),
    EMAIL NVARCHAR(255),
    FIRSTNAME NVARCHAR(255),
    LASTNAME NVARCHAR(255),
    DESCRIPTION NVARCHAR(MAX),
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

CREATE TABLE SAVED_POSTS (
    USER_ID INT NOT NULL,
    POST_ID INT NOT NULL,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    CONSTRAINT PK_SAVED_POSTS PRIMARY KEY (USER_ID, POST_ID),
    CONSTRAINT FK_SAVED_POSTS_USER_ID FOREIGN KEY (USER_ID) REFERENCES USERS (ID),
    CONSTRAINT FK_SAVED_POSTS_POST_ID FOREIGN KEY (POST_ID) REFERENCES POSTS (ID)
);

CREATE TABLE SUPPORT (
    ID INT PRIMARY KEY IDENTITY,
    PROBLEM_MESSAGE TEXT NOT NULL,
    USER_ID INT NOT NULL,
    DATE DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (USER_ID) REFERENCES USERS(ID)
);


DELETE from POSTS;

SELECT * FROM COMMENTS;
SELECT * FROM SUPPORT;
SELECT * FROM POSTS;

SELECT * FROM USERS;
SELECT * FROM Subscription;
SELECT * FROM SAVED_POSTS;

-- don't forget to delete the cache in Redis
-- redis-cli flushall