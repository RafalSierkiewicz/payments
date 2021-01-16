alter table expense_schemas
    drop constraint fk_users_schemas;

alter table expense_schemas
    rename column user_id to company_id;

alter table expense_schemas
    add constraint fk_schema_companies foreign key (company_id) references companies(id);