
-- Delete fake/demo posts and related data
DELETE FROM public.likes WHERE post_id IN (
  SELECT id FROM public.posts WHERE user_id NOT IN (
    SELECT id FROM auth.users
  )
);

DELETE FROM public.comments WHERE post_id IN (
  SELECT id FROM public.posts WHERE user_id NOT IN (
    SELECT id FROM auth.users
  )
);

DELETE FROM public.notifications WHERE post_id IN (
  SELECT id FROM public.posts WHERE user_id NOT IN (
    SELECT id FROM auth.users
  )
);

DELETE FROM public.posts WHERE user_id NOT IN (
  SELECT id FROM auth.users
);

-- Delete fake follows
DELETE FROM public.follows WHERE follower_id NOT IN (
  SELECT id FROM auth.users
) OR following_id NOT IN (
  SELECT id FROM auth.users
);

-- Delete fake profiles that don't correspond to real users
DELETE FROM public.profiles WHERE id NOT IN (
  SELECT id FROM auth.users
);

-- Delete fake stories
DELETE FROM public.stories WHERE user_id NOT IN (
  SELECT id FROM auth.users
);

-- Delete fake messages
DELETE FROM public.messages WHERE sender_id NOT IN (
  SELECT id FROM auth.users
) OR receiver_id NOT IN (
  SELECT id FROM auth.users
);

-- Reset counts for real users
UPDATE public.profiles SET 
  posts_count = (
    SELECT COUNT(*) FROM public.posts WHERE user_id = profiles.id
  ),
  followers_count = (
    SELECT COUNT(*) FROM public.follows WHERE following_id = profiles.id
  ),
  following_count = (
    SELECT COUNT(*) FROM public.follows WHERE follower_id = profiles.id
  );

-- Update post counts
UPDATE public.posts SET 
  likes_count = (
    SELECT COUNT(*) FROM public.likes WHERE post_id = posts.id
  ),
  comments_count = (
    SELECT COUNT(*) FROM public.comments WHERE post_id = posts.id
  );
