import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../state";
import PostWidget from "./PostWidget";
import { Button, Box, CircularProgress, Typography } from "@mui/material";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts || []);
  const token = useSelector((state) => state.token);

  const [page, setPage] = useState(1);
  const [limit] = useState(5); // можно менять
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = useCallback(
    async (pageToLoad = 1, append = false) => {
      setIsLoading(true);
      try {
        const base = isProfile
          ? `http://localhost:3001/posts/${userId}/posts`
          : `http://localhost:3001/posts`;
        const url = new URL(base);
        url.searchParams.set("page", String(pageToLoad));
        url.searchParams.set("limit", String(limit));

        const response = await fetch(url.toString(), {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          console.error("Failed to fetch posts");
          setIsLoading(false);
          return;
        }

        const data = await response.json();
        // data shape: { posts: [...], totalPages, currentPage, totalItems }
        const incoming = data.posts || [];
        // dispatch: append or replace
        dispatch(setPosts({ posts: incoming, append }));
        // determine hasMore by pages or by received count
        if (typeof data.totalPages !== "undefined") {
          setHasMore(pageToLoad < data.totalPages);
        } else {
          setHasMore(incoming.length === limit); // heuristic
        }
      } catch (err) {
        console.error("Fetch posts error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch, isProfile, limit, token, userId]
  );

  useEffect(() => {
    // load first page (replace)
    setPage(1);
    fetchPosts(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, isProfile, token, fetchPosts]);

  const loadMore = async () => {
    const next = page + 1;
    await fetchPosts(next, true);
    setPage(next);
  };

  return (
    <Box>
      {Array.isArray(posts) && posts.length === 0 && !isLoading && (
        <Typography variant="body2" sx={{ mb: 2 }}>
          Нет постов.
        </Typography>
      )}

      {Array.isArray(posts) &&
        posts.map(
          ({
            _id,
            userId: postUserId,
            firstName,
            lastName,
            description,
            location,
            picturePath,
            userPicturePath,
            likes,
            comments,
          }) => (
            <PostWidget
              key={_id}
              postId={_id}
              postUserId={postUserId}
              name={`${firstName} ${lastName}`}
              description={description}
              location={location}
              picturePath={picturePath}
              userPicturePath={userPicturePath}
              likes={likes}
              comments={comments}
            />
          )
        )}

      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      {!isLoading && hasMore && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Button variant="contained" onClick={loadMore}>
            Load more
          </Button>
        </Box>
      )}

      {!hasMore && !isLoading && (
        <Typography variant="caption" sx={{ display: "block", textAlign: "center", mt: 2 }}>
          No posts anymore
        </Typography>
      )}
    </Box>
  );
};

export default PostsWidget;
