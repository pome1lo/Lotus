
CREATE DATABASE RECOMMENDATION_SERVICE;
use RECOMMENDATION_SERVICE

create table topics (
    id        int primary key identity (1,1),
    topicname nvarchar(255) not null,
)
create table news (
    id int primary key identity,
    heading nvarchar(255) not null,
    paragraph nvarchar(max) not null,
    date nvarchar(255) not null,
    topicid int,
    foreign key (topicid) references topics(id)
);



DELETE FROM NEWS;

drop table news;

SELECT * FROM NEWS;