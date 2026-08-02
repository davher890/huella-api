create or replace function update_device_location_clusters(
  p_device_id text,
  p_updates jsonb
)
returns setof device_locations
language sql
as $$
  update device_locations dl
  set cluster = u.cluster
  from jsonb_to_recordset(p_updates) as u(id bigint, cluster int)
  where dl.id = u.id
    and dl.device_id = p_device_id
  returning dl.*;
$$;

CREATE UNIQUE INDEX unique_user_devices ON public.user_devices(user_id, device_id);

