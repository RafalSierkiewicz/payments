alter table expenses
    add column user_id int not null default -1,
    add constraint fk_expense_user foreign key (user_id) references users(id);