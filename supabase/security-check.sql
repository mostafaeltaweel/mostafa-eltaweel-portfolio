-- Run in SQL Editor AFTER schema.sql and seed.sql. All fixture changes roll back.
begin;
insert into public.portfolio_projects (id,data)
select 'security-check-hidden', jsonb_set(jsonb_set(data,'{id}','"security-check-hidden"'),'{visible}','false')
from public.portfolio_projects where id='financial-fraud';
do $$ begin
  if not exists(select 1 from public.portfolio_projects where id='security-check-hidden') then
    raise exception 'Run seed.sql before this check.';
  end if;
end $$;
set local role anon;
do $$ begin
  if exists(select 1 from public.portfolio_projects where id='security-check-hidden') then
    raise exception 'SECURITY FAILURE: anonymous visitor can read hidden project';
  end if;
  begin
    insert into public.portfolio_site(id,data) values ('main','{}');
    raise exception 'SECURITY FAILURE: anonymous visitor can write profile';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000000',true);
select set_config('request.jwt.claims','{"sub":"00000000-0000-0000-0000-000000000000","role":"authenticated"}',true);
set local role authenticated;
do $$ begin
  if public.is_portfolio_admin() then raise exception 'Unexpected admin fixture'; end if;
  if exists(select 1 from public.portfolio_projects where id='security-check-hidden') then
    raise exception 'SECURITY FAILURE: non-admin can read hidden project';
  end if;
  update public.portfolio_projects set data=jsonb_set(data,'{title}','"unauthorized"') where id='financial-fraud';
  if found then raise exception 'SECURITY FAILURE: non-admin can update projects'; end if;
  begin
    insert into storage.objects(bucket_id,name) values ('portfolio-media','security-check-unauthorized.txt');
    raise exception 'SECURITY FAILURE: non-admin can upload';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;
rollback;
select 'PASS: anonymous/non-admin restrictions checked; test changes rolled back.' as result;
