import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  DeleteOutlined,
  MoreVertOutlined,
  LocationOnOutlined,
  SendOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  Typography,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  TextField,
  InputAdornment,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost, deletePost } from "state";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes = {},
  comments = [],
}) => {
  const [isComments, setIsComments] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [commentText, setCommentText] = useState("");
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user?._id);
  const loggedInUser = useSelector((state) => state.user);
  const isOwnPost = postUserId === loggedInUserId;

  const isLiked = Boolean(likes?.[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;
  const error = palette.error.main;

  const patchLike = async () => {
    const response = await fetch(`https://questly-server-5.onrender.com/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      const response = await fetch(
        `https://questly-server-5.onrender.com/posts/${postId}/comment`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: loggedInUserId,
            text: commentText,
          }),
        }
      );

      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
      setCommentText("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(
        `https://questly-server-5.onrender.com/posts/${postId}/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: loggedInUserId }),
        }
      );

      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    setDeleteModalOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`https://questly-server-5.onrender.com/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId }),
      });

      if (!response.ok) throw new Error(await response.text());

      dispatch(deletePost({ postId }));
    } catch (error) {
      console.error("Delete error:", error);
      alert(`Delete failed: ${error.message}`);
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  const handleDeleteCancel = () => setDeleteModalOpen(false);

  return (
    <WidgetWrapper
      m="1.5rem 0"
      sx={{
        maxWidth: "550px",
        background: `linear-gradient(135deg, ${palette.background.alt} 0%, ${palette.background.default} 100%)`,
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        borderRadius: "16px",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
          transform: "translateY(-4px)",
        },
      }}
    >
      {isOwnPost ? (
        <Box
          display="flex"
          alignItems="center"
          gap="0.8rem"
          mb="0.8rem"
          position="relative"
        >
          <UserImage 
            image={userPicturePath} 
            size="48px" 
            borderColor={primary.main}
          />
          <Box flexGrow={1}>
            <Typography variant="h5" fontWeight="600" fontSize="1.05rem">
              {`${loggedInUser.firstName} ${loggedInUser.lastName}`}
            </Typography>
            {location && (
              <Typography
                color={palette.neutral.medium}
                fontSize="0.8rem"
                display="flex"
                alignItems="center"
                gap="0.3rem"
              >
                <LocationOnOutlined sx={{ fontSize: "0.9rem" }} />
                {location}
              </Typography>
            )}
          </Box>

          <IconButton
            onClick={handleMenuOpen}
            sx={{
              color: palette.neutral.medium,
              "&:hover": {
                color: palette.neutral.dark,
              },
            }}
          >
            <MoreVertOutlined />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem onClick={handleDeleteClick}>
              <ListItemIcon>
                <DeleteOutlined color="error" />
              </ListItemIcon>
              <ListItemText
                primary="Delete Post"
                primaryTypographyProps={{ color: "error", fontSize: "0.9rem" }}
              />
            </MenuItem>
          </Menu>
        </Box>
      ) : (
        <Friend
          friendId={postUserId}
          name={name}
          subtitle={location}
          userPicturePath={userPicturePath}
        />
      )}

      <Typography
        color={main}
        sx={{
          mt: "0.8rem",
          fontSize: "0.95rem",
          lineHeight: "1.5",
          whiteSpace: "pre-line",
        }}
      >
        {description}
      </Typography>

      {picturePath && (
        <Box
          component="img"
          width="100%"
          height="auto"
          alt="post"
          src={`http://localhost:3001/assets/${picturePath}`}
          sx={{
            borderRadius: "14px",
            marginTop: "0.8rem",
            border: `1px solid ${palette.neutral.light}`,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
            transition: "transform 0.3s ease",
            cursor: "pointer",
            "&:hover": {
              transform: "scale(1.03)",
            },
          }}
        />
      )}

      <FlexBetween mt="0.8rem">
        <FlexBetween gap="1.2rem">
          <FlexBetween gap="0.3rem">
            <IconButton
              onClick={patchLike}
              size="small"
              sx={{
                backgroundColor: isLiked ? primary + "20" : "transparent",
                "&:hover": {
                  backgroundColor: primary + "15",
                },
                borderRadius: "50%",
              }}
            >
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary, fontSize: "1.2rem" }} />
              ) : (
                <FavoriteBorderOutlined sx={{ fontSize: "1.2rem" }} />
              )}
            </IconButton>
            <Typography fontWeight="500" fontSize="0.9rem">
              {likeCount}
            </Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton
              onClick={() => setIsComments(!isComments)}
              size="small"
              sx={{
                "&:hover": {
                  backgroundColor: palette.primary.light + "15",
                },
                borderRadius: "50%",
              }}
            >
              <ChatBubbleOutlineOutlined sx={{ fontSize: "1.2rem" }} />
            </IconButton>
            <Typography fontWeight="500" fontSize="0.9rem">
              {comments.length}
            </Typography>
          </FlexBetween>
        </FlexBetween>

        <IconButton
          size="small"
          sx={{
            "&:hover": {
              backgroundColor: palette.primary.light + "15",
            },
            borderRadius: "50%",
          }}
        >
          <ShareOutlined sx={{ fontSize: "1.2rem" }} />
        </IconButton>
      </FlexBetween>

      {isComments && (
        <Box mt="0.8rem">
          <Divider sx={{ mb: "0.8rem", borderColor: palette.neutral.light }} />

          <Box display="flex" alignItems="center" gap="0.5rem" mb="0.8rem">
              <p>You</p>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleAddComment}
                      disabled={!commentText.trim()}
                      size="small"
                      sx={{ color: palette.primary.main }}
                    >
                      <SendOutlined sx={{ fontSize: "1.2rem" }} />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: "20px",
                  backgroundColor: palette.background.paper,
                  fontSize: "0.9rem",
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: palette.neutral.light,
                  },
                  "&:hover fieldset": {
                    borderColor: palette.primary.light,
                  },
                },
              }}
            />
          </Box>

          {comments.length > 0 ? (
            comments.map((comment) => (
              <Box key={comment._id} position="relative" mb="0.8rem">
                <Box display="flex" gap="0.8rem" alignItems="flex-start">
                  <UserImage 
                    image={comment.userPicturePath} 
                    size="28px" 
                    borderColor={primary.main}
                  />
                  <Box flexGrow={1}>
                    <Box display="flex" alignItems="center" gap="0.3rem">
                      <Typography fontWeight="600" fontSize="0.9rem">
                        {`${comment.userFirstName} ${comment.userLastName}`}
                      </Typography>
                      <Typography color={palette.neutral.medium} fontSize="0.7rem">
                        {new Date(comment.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Typography>
                    </Box>
                    <Typography
                      fontSize="0.9rem"
                      sx={{ wordBreak: "break-word", whiteSpace: "pre-line" }}
                    >
                      {comment.text}
                    </Typography>
                  </Box>

                  {(comment.userId === loggedInUserId || isOwnPost) && (
                    <IconButton
                      onClick={() => handleDeleteComment(comment._id)}
                      size="small"
                      sx={{
                        color: error,
                        "&:hover": {
                          backgroundColor: error + "20",
                        },
                      }}
                    >
                      <DeleteOutlined fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              </Box>
            ))
          ) : (
            <Typography
              color={palette.neutral.medium}
              textAlign="center"
              fontStyle="italic"
              py={1.5}
              fontSize="0.9rem"
            >
              No comments yet
            </Typography>
          )}
        </Box>
      )}

      <Dialog
        open={deleteModalOpen}
        onClose={handleDeleteCancel}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            padding: "0.8rem",
            maxWidth: "400px",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "600", fontSize: "1rem", p: "1rem 1rem 0.5rem" }}>
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: "0.9rem" }}>
            Are you sure you want to permanently delete this post? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: "0.8rem 1rem" }}>
          <Button
            onClick={handleDeleteCancel}
            disabled={isDeleting}
            sx={{
              color: palette.neutral.dark,
              textTransform: "none",
              fontWeight: "600",
              padding: "0.4rem 1.2rem",
              borderRadius: "6px",
              fontSize: "0.9rem",
              "&:hover": {
                backgroundColor: palette.neutral.light,
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            disabled={isDeleting}
            variant="contained"
            color="error"
            sx={{
              textTransform: "none",
              fontWeight: "600",
              padding: "0.4rem 1.2rem",
              borderRadius: "6px",
              fontSize: "0.9rem",
              "&:hover": {
                backgroundColor: palette.error.dark,
              },
            }}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </WidgetWrapper>
  );
};

export default PostWidget;