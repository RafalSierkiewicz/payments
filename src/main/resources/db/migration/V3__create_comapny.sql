create table companies (
    id bigserial primary key,
    name text,
    created_at timestamp with time zone
);

alter table users
    add column company_id int not null default -1,
    add constraint fk_users_companies foreign key (company_id) references companies(id);