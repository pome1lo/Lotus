USE AUTHENTICATION_SERVICE;
create database AUTHENTICATION_SERVICE;

CREATE TABLE USERS (
    id INT IDENTITY(1,1) PRIMARY KEY,
    username NVARCHAR(255) NOT NULL,
	email NVARCHAR(255) NOT NULL,
    password NVARCHAR(255) NOT NULL,
	salt NVARCHAR(255) NOT NULL
);

DROP TABLE USERS;

DELETE FROM USERS 

SELECT *  FROM USERS;


-- don't forget to delete the cache in Redis
-- redis-cli flushall