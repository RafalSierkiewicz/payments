CREATE TABLE expenses
(
    id         BIGSERIAL PRIMARY KEY,
    name       TEXT,
    price      REAL NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    month INT NOT NULL
);