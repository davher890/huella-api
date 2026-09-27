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

-- Used by checkLocationWithinGeofence in lib/services/locationService.ts.
-- PostgREST's query builder has no join/ST_Intersects support, so the spatial
-- check has to happen in a single SQL statement server-side, with lon/lat as
-- bound parameters (not string-interpolated, to avoid injection).
create or replace function is_location_within_geofence(
  p_device_id text,
  p_lon double precision,
  p_lat double precision
)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from device_geofences dg
    inner join devices d on d.id = dg.device_id
    where d.device_id = p_device_id
      and st_intersects(dg.area, st_setsrid(st_point(p_lon, p_lat), 4326))
  );
$$;

CREATE INDEX push_tokens_user_id_idx ON public.push_tokens(user_id);