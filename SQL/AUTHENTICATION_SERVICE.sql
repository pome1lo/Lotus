create database AUTHENTICATION_SERVICE;
USE AUTHENTICATION_SERVICE;

DROP TABLE USERS;

CREATE TABLE USERS (
    ID INT PRIMARY KEY IDENTITY,
    GOOGLE_ID NVARCHAR(255),
    GITHUB_ID NVARCHAR(255),
    USERNAME NVARCHAR(255) NOT NULL,
    EMAIL NVARCHAR(255) NOT NULL,
    PASSWORD NVARCHAR(255),
    SALT NVARCHAR(255),
    IS_EMAIL_VERIFIED BIT DEFAULT 0,
    VERIFICATION_TOKEN NVARCHAR(255),
    RESET_PASSWORD_TOKEN NVARCHAR(255),
    RESET_PASSWORD_EXPIRES DATETIME
);

DELETE FROM USERS 

SELECT *  FROM USERS;


-- don't forget to delete the cache in Redis
-- redis-cli flushall