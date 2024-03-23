CREATE DATABASE PROFILE_SERVICE;
USE PROFILE_SERVICE

CREATE TABLE USERS
(
    id INT IDENTITY(1,1) PRIMARY KEY,
    UserName NVARCHAR(255) NOT NULL,
    Email NVARCHAR(255) NOT NULL,
    CountOfPosts INT DEFAULT 0,
    SubscribersList NVARCHAR(MAX),
    SubscribersCount INT DEFAULT 0,
    SubscriptionsList NVARCHAR(MAX)
)
DROP TABLE USERS;