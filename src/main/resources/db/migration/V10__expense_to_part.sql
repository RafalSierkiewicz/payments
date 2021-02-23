ALTER table expenses
    add column price_part int not null default 1;

ALTER table expenses
    add constraint fk_price_part foreign key (price_part) references expenses_price_part(id);