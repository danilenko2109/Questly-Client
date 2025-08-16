import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FlexBetween from 'components/FlexBetween';
import { Box, Typography, useTheme, IconButton, Snackbar, Alert } from '@mui/material';
import { PersonRemoveOutlined, PersonAddOutlined } from '@mui/icons-material';
import UserImage from 'components/UserImage';
import { setFriends } from 'state';

const Friend = ({ friendId, name, subtitle, userPicturePath }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const currentUserId = useSelector((state) => state.user?._id);
  const friends = useSelector((state) => state.user?.friends || []);
  
  const [isFriend, setIsFriend] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    setIsFriend(friends.some(friend => friend._id === friendId));
  }, [friends, friendId]);

  const handleFriendAction = async () => {
    if (friendId === currentUserId) {
      setSnackbar({ open: true, message: "You can't follow yourself", severity: 'error' });
      return;
    }
    
    try {
      const response = await fetch(
        `http://localhost:3001/users/${currentUserId}/${friendId}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!response.ok) throw new Error('Failed to update friend status');
      
      const updatedUser = await response.json();
      dispatch(setFriends({ friends: updatedUser.friends }));
      
      setSnackbar({ 
        open: true, 
        message: isFriend ? 'Successfully unfollowed' : 'Successfully followed',
        severity: 'success'
      });
      
    } catch (error) {
      console.error('Error updating friend status:', error);
      setSnackbar({ open: true, message: 'Operation failed', severity: 'error' });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (friendId === currentUserId) return null;

  return (
    <>
      <FlexBetween>
        <FlexBetween gap="1rem">
          <UserImage image={userPicturePath} size="55px" />
          <Box>
            <Typography
              color={palette.neutral.main}
              variant="h5"
              fontWeight="500"
              sx={{
                '&:hover': {
                  color: palette.primary.light,
                  cursor: 'pointer',
                },
              }}
            >
              {name}
            </Typography>
            <Typography color={palette.neutral.medium} fontSize="0.75rem">
              {subtitle}
            </Typography>
          </Box>
        </FlexBetween>
        <IconButton
          onClick={handleFriendAction}
          sx={{ 
            backgroundColor: palette.primary.light, 
            p: '0.6rem',
            '&:hover': {
              backgroundColor: palette.primary.main,
            }
          }}
        >
          {isFriend ? (
            <PersonRemoveOutlined sx={{ color: palette.primary.dark }} />
          ) : (
            <PersonAddOutlined sx={{ color: palette.primary.dark }} />
          )}
        </IconButton>
      </FlexBetween>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Friend;