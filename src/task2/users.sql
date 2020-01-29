create sequence users_user_id_seq
    start 2
    increment 2;

create TABLE public.users (
    age integer NOT NULL,
    login text NOT NULL,
    password character varying(26) NOT NULL,
    is_deleted boolean,
    user_id integer NOT NULL DEFAULT nextval('users_user_id_seq'),
    CONSTRAINT users_pkey PRIMARY KEY (user_id),
    CONSTRAINT users_login_key UNIQUE (login)
);

alter table public.users
    OWNER to postgres;

insert into users
    select
        floor(random() * (130 - 4 + 1) + 4)::int,
        concat('user_', generate_series(1,100)),
        concat('Password_', generate_series(1,100));
