create table `users` (
`user_id` varchar(255) not null primary key,
`name` varchar(128) not null,
`google_token` varchar(255),
`reg_time` timestamp not null default current_timestamp(),
`isverified` boolean default false,
`updated_at` timestamp not null default current_timestamp()
)engine=InnoDB default charset=utf8mb4;

create table `form`(
`form_id` varchar(255) not null primary key,
`title` varchar(128) not null default "Untitled form",
`theme` int not null default 0,
`description` text,
`data` longtext,
`istest` boolean not null default false,
`duration` int default 0,
`ans_key` longtext,
`user_id` varchar(255) not null,
`created_at` timestamp not null default current_timestamp(),
`updated_at` timestamp not null default current_timestamp()
)engine=InnoDB default charset=utf8mb4;

create table `response`(
`response_id` varchar(255) not null primary key,
`user_id` varchar(255) not null,
`form_id` varchar(255) not null,
`response` longtext,
`submitted_at` timestamp not null default current_timestamp(),
`edited_at` timestamp not null default current_timestamp()
)engine=InnoDB default charset=utf8mb4;

create table `tests_results`(
`result_id` varchar(255) not null primary key,
`response_id` varchar (255) not null,
`result` int not null,
`remarks` varchar(255) not null
)engine=InnoDB default charset=utf8mb4;

create table `logs`(
`log_id` int not null auto_increment primary key,
`info`  text,
`endpoint` varchar(255) not null,
`timestamp` timestamp not null default current_timestamp(),
`status` text not null,
`ip` varchar(64) not null
) engine=InnoDB default charset=utf8mb4;

create table `admin` (
`admin_id` varchar(255) not null primary key,
`issuper` boolean default false,
`username` varchar(255) not null unique,
`email_id` varchar(255) not null unique,
`password` text not null,
`created` timestamp default current_timestamp(),
`enabled` boolean default false
) engine=InnoDB default charset=utf8mb4;

create table `template`(
`template_id` varchar(255) not null primary key,
`title` varchar(255) not null default "Untitled form",
`theme` varchar(128) not null,
`description` text,
`data` longtext,
`enabled` boolean default true,
`created_by` varchar(128) not null,
`created_at` timestamp not null
)engine=InnoDB default charset=utf8mb4;

create table `akp_forms`(
`id`int not null auto_increment primary key,
`title` varchar(256) not null default "Untitled",
`description` text,
`active` boolean default true,
`edit` boolean default true,
`send` boolean default false,
`who` varchar(256) not null,
`theme` varchar(256),
`when` timestamp not null default current_timestamp
)engine=InnoDB default charset=utf8mb4;
 
 create table `akp_section`(
 `id` int not null auto_increment primary key,
 `title` varchar(256) not null default "Untitled section",
 `description` text,
 `order` int not null default 1,
 `theme` varchar(256),
 `who` varchar(256) not null,
 `when` timestamp not null default current_timestamp
 )engine=InnoDB default charset=utf8mb4;
 
 create table `akp_question`(
 `id` int not null auto_increment primary key,
 `title` text,
 `description` text,
 `order` int default 1,
 `type` int default 1 not null,
 `who` varchar(256) not null,
 `when` timestamp not null default current_timestamp
 )engine=InnoDB default charset=utf8mb4;
 
 create table `akp_option`(
 `id` int not null auto_increment primary key,
 `title` varchar(256) not null default "New option",
 `is_right` boolean not null default false,
 `marks` boolean not null,
 `who` varchar(265) not null,
 `when` timestamp not null default current_timestamp
 )engine = InnoDB default charset=utf8mb4;
 
 create table `attachments`(
 `id` int not null auto_increment primary key,
 `name` varchar(256) not null,
 `active` boolean not null default true,
 `for` int default 0,
 `who` varchar(256) not null,
 `when` timestamp not null default current_timestamp
 )engine=InnoDB default charset=utf8mb4;

 create table `sessions`(
 `id` varchar(255) not null primary key,
 `uid` varchar(255) not null,
 `active` boolean default true,
 `last_login` timestamp,
 `logout_time`timestamp,
 `created_at` timestamp not null default current_timestamp
 )  engine=InnoDB default charset=utf8mb4;
 
 alter table `akp_forms` add column `tid` varchar(256);
 
 alter table `template` add column `uses` int default 0;
 
 alter table akp_forms modify column `title` varchar(256) default "Untitled";
 
 alter table sessions add column `first_ip` varchar(256) not null;
 
 alter table sessions add column `last_ip` varchar(256) not null;
 
 alter table users add column `email_id` varchar(256);
 
 alter table form drop column `form_id`;
 
 alter table form add column `form_id` int not null primary key auto_increment;
 alter table form add column `active` boolean default true;
 alter table form add column `isSent` boolean default false;
 alter table form modify column `created_at` timestamp default current_timestamp;
 alter table form modify column `updated_at` timestamp default current_timestamp;
 alter table form modify column `theme` text;
 alter table template add column `used_by` int default 0;
 
 -- adding form id -> fid as foreign key
 alter table akp_section add column `fid` int not null;
 alter table akp_section add constraint fk_fid foreign key (fid) references akp_forms(id);
 alter table akp_section add column `last_edited` timestamp default current_timestamp;
 
alter table akp_section add column `active` boolean default true;
alter table akp_forms add column `last_edited` timestamp default current_timestamp;

alter table akp_question add column `active` boolean default true;
alter table akp_question add column `last_edited` timestamp default current_timestamp;
alter table akp_question add column `sid` int not null;
alter table akp_question add constraint fk_sid foreign key (sid) references akp_section(id);
alter table akp_question add column `required` boolean default false;
alter table akp_question add column `marks` int default 0;

alter table akp_question add column `fid` int not null;
alter table akp_question add constraint fk_qfid foreign key (fid) references akp_forms(id);
alter table akp_question modify column `title` text;

alter table akp_option add column `last_edited` timestamp default current_timestamp;
alter table akp_option add column `qid` int not null;
alter table akp_option add constraint fk_oqid foreign key(qid) references akp_question(id);
alter table akp_option add column `sid` int not null;
alter table akp_option add constraint fk_osid foreign key(sid) references akp_section(id);
alter table akp_option add column `fid` int not null;
alter table akp_option add constraint fk_ofid foreign key(fid) references akp_forms(id);
alter table akp_option modify column `marks` int default 0;
alter table akp_option add column `active` boolean default true;

-- new table lov(list of value)
create table `akp_lov`(
	`id` int not null primary key auto_increment,
    `group` varchar(32) not null,
    `abbr` varchar(8) not null unique,
    `meaning` varchar(128) not null,
    `who_created` varchar(256) not null,
    `when_created` timestamp default current_timestamp,
    key `fk_lov_uid`(`who_created`),
    constraint `fk_lov_uid` foreign key (`who_created`) references `admin`(`admin_id`) on update cascade on delete cascade
) engine=InnoDB default charset=utf8mb4;

alter table akp_question modify column `type` varchar(4) default 'ST';
  -- new
create table `akp_response`(
	`id` int not null primary key auto_increment,
    `fid` int not null,
    `uid` varchar(256) not null,
    `saved` boolean not null default false,
    `when` timestamp not null default current_timestamp,
    key `fk_res_fid`(`fid`),
    constraint `fk_res_fid` foreign key(`fid`) references `akp_forms`(`id`) on update cascade on delete cascade,
    key `fk_res_uid`(`uid`),
    constraint `fk_res_uid` foreign key(`uid`) references `users`(`user_id`) on update cascade on delete cascade
)engine=InnoDB default charset=utf8mb4;
  