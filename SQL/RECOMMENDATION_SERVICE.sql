
CREATE DATABASE RECOMMENDATION_SERVICE;
use RECOMMENDATION_SERVICE

create table topics (
    ID        int primary key identity (1,1),
    TOPIC_NAME nvarchar(255) not null,
)
create table news (
    ID int primary key identity,
    HEADING nvarchar(255) not null,
    PARAGRAPH nvarchar(max) not null,
    DATE nvarchar(255) not null,
    TOPIC_ID int,
    foreign key (TOPIC_ID) references topics(id)
);



DELETE FROM NEWS;

drop table topics;
drop table news;

SELECT * FROM NEWS;