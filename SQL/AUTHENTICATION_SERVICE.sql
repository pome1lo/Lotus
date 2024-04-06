USE AUTHENTICATION_SERVICE;
create database AUTHENTICATION_SERVICE;

CREATE TABLE USERS (
    id INT PRIMARY KEY IDENTITY,
    username NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) NOT NULL,
    password NVARCHAR(255) NOT NULL,
    salt NVARCHAR(255) NOT NULL,
    isEmailVerified BIT DEFAULT 0,
    verificationToken NVARCHAR(255),
    resetPasswordToken NVARCHAR(255),
    resetPasswordExpires DATETIME
);


DROP TABLE USERS;

DELETE FROM USERS 

SELECT *  FROM USERS;


-- don't forget to delete the cache in Redis
-- redis-cli flushall