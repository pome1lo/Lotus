CREATE DATABASE PROFILE_SERVICE;
USE PROFILE_SERVICE

CREATE TABLE USERS (
    id INT IDENTITY(1,1) PRIMARY KEY,
    UserName NVARCHAR(255) NOT NULL,
    Email NVARCHAR(255) NOT NULL,
    FirstName NVARCHAR(255),
    LastName NVARCHAR(255),
    BirthDate DATE,
	PhoneNumber NVARCHAR(255),
    CountOfPosts INT DEFAULT 0,
    SubscribersList NVARCHAR(MAX),
    SubscribersCount INT DEFAULT 0,
    SubscriptionsList NVARCHAR(MAX)
)

DROP TABLE USERS;

DELETE FROM USERS;


SELECT * FROM USERS;

-- don't forget to delete the cache in Redis
-- redis-cli flushall