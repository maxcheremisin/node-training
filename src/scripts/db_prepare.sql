/* Drop existed sequences and tables */
drop table IF EXISTS users, groups, user_group;
drop sequence IF EXISTS users_user_id_seq, groups_group_id_seq;

/* Permissions Enum */
create type permission as ENUM ('READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES');

/* Auto incremental id sequences */
create sequence users_user_id_seq
    start 100
    increment 1;

create sequence groups_group_id_seq
    start 1
    increment 1;

/* Data Tables creation */
create TABLE public.users (
    age         integer NOT NULL,
    login       text    NOT NULL,
    password    character varying(26) NOT NULL,
    is_deleted  boolean,
    user_id     integer NOT NULL DEFAULT nextval('users_user_id_seq'),
    CONSTRAINT users_pkey PRIMARY KEY (user_id),
    CONSTRAINT users_login_key UNIQUE (login)
);

alter table public.users
    OWNER to postgres;

create TABLE public.groups (
    group_id    integer     NOT NULL    DEFAULT nextval('groups_group_id_seq'),
    name        text        NOT NULL,
    permissions permission[]            DEFAULT ARRAY[]::permission[],
    CONSTRAINT groups_pkey PRIMARY KEY (group_id),
    CONSTRAINT groups_name_key UNIQUE (name)
);

alter table public.groups
    OWNER to postgres;

/* Relation Table creation */
CREATE TABLE user_group (
  user_id   int REFERENCES users (user_id) ON UPDATE CASCADE ON DELETE CASCADE,
  group_id  int REFERENCES groups (group_id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT user_group_pkey PRIMARY KEY (user_id, group_id)
);

/* Autofill the tables with test data */
insert into users (age, login, password)
    select
        floor(random() * (130 - 4 + 1) + 4)::int,
        concat('user_', generate_series(1,100)),
        concat('Password_', generate_series(1,100));

insert into groups (name, permissions)
    select
        concat('group_', generate_series(1,10)),
        ARRAY['READ']::permission[];
