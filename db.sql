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
`email_id` varchar(255) not null,
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
