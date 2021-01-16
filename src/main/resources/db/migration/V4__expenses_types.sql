create table company_expenses_types (
    id bigserial primary key,
    company_id int not null,
    name text not null,
    CONSTRAINT fk_company_expenses_types FOREIGN KEY (company_id) REFERENCES companies(id)
);

alter table expenses
add column expense_type_id int not null default -1,
    add constraint fk_expense_type foreign key (expense_type_id) references company_expenses_types(id)

