CREATE TABLE users (
  id         BIGSERIAL PRIMARY KEY,
  username   TEXT,
  email      TEXT NOT NULL,
  password   TEXT NOT NULL
);

CREATE TABLE expense_schemas (
   id         BIGSERIAL PRIMARY KEY,
   user_id int not null,
   name TEXT  NOT NULL,
   created_at timestamp with time zone not null,
   CONSTRAINT fk_users_schemas FOREIGN KEY(user_id) references users(id)
);

ALTER TABLE expenses
    ADD COLUMN schema_id INT NOT NULL DEFAULT 1,
    ADD CONSTRAINT fk_expenses_schema FOREIGN KEY (schema_id) REFERENCES expense_schemas(id);
