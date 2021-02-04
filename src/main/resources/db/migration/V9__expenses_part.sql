create table expenses_price_part(
  id bigserial primary key,
  company_id int not null,
  name text not null,
  percentile real not null,
  constraint fk_company_price_part FOREIGN KEY (company_id) REFERENCES companies(id)
)