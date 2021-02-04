alter table expense_schemas
    add constraint schema_comp_unique unique(name, company_id);

alter table company_expenses_types
    add constraint type_comp_unique unique(name, company_id)