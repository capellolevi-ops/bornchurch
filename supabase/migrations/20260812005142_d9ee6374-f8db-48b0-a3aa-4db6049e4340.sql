REVOKE EXECUTE ON FUNCTION public.increment_prayer_count(uuid) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.notify_new_submission() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.notify_new_prayer() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM anon, authenticated, public;
GRANT EXECUTE ON FUNCTION public.increment_prayer_count(uuid) TO service_role;