import { Box, Typography, useTheme, Badge } from '@mui/material';
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Friend from 'components/Friend';
import WidgetWrapper from 'components/WidgetWrapper';
import { setFriends } from 'state';

const FriendListWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const currentUserId = useSelector((state) => state.user?._id);
  const friends = useSelector((state) => state.user?.friends || []);

  const getFriends = useCallback(async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/users/${userId}/friends`,
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error(`Failed to fetch friends`);

      const data = await response.json();
      dispatch(setFriends({ friends: data }));
    } catch (error) {
      console.error('Error fetching friends:', error.message);
    }
  }, [userId, token, dispatch]);

  useEffect(() => {
    getFriends();
  }, [getFriends]);

  return (
    <WidgetWrapper
      sx={{
        background: `linear-gradient(135deg, ${palette.background.alt} 0%, ${palette.background.default} 100%)`,
        boxShadow: "0 8px 28px rgba(0, 0, 0, 0.14)",
        borderRadius: "22px",
        padding: "2rem 2.5rem",
        maxWidth: 560,
        margin: "auto",
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb="2rem"
      >
        <Typography
          variant="h5"
          fontWeight="700"
          color={palette.neutral.dark}
          sx={{
            position: 'relative',
            paddingLeft: '1.2rem',
            fontSize: '1.4rem',
            letterSpacing: '0.02em',
            "&:before": {
              content: '""',
              position: "absolute",
              left: 0,
              top: "50%",
              transform: "translateY(-50%)",
              width: "7px",
              height: "2.3rem",
              borderRadius: "4px",
              backgroundColor: palette.primary.main,
              boxShadow: `0 0 12px ${palette.primary.main}80`,
            },
          }}
        >
          Friend List
        </Typography>
        <Badge
          badgeContent={friends.length}
          color="primary"
          sx={{
            "& .MuiBadge-badge": {
              right: -10,
              top: -10,
              backgroundColor: palette.primary.main,
              color: "#fff",
              fontWeight: "700",
              fontSize: '0.9rem',
              minWidth: 26,
              height: 26,
              borderRadius: '13px',
              boxShadow: `0 0 12px ${palette.primary.main}aa`,
              transition: "all 0.3s ease",
            },
          }}
        />
      </Box>

      <Box display="flex" flexDirection="column" gap="1.6rem">
        {friends.length > 0 ? (
          friends
            .filter(friend => friend._id !== currentUserId)
            .map((friend) => (
              <Friend
                key={friend._id}
                friendId={friend._id}
                name={`${friend.firstName} ${friend.lastName}`}
                subtitle={friend.occupation}
                userPicturePath={friend.picturePath}
                sx={{
                  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                  borderRadius: "18px",
                  padding: "0.75rem 1.2rem",
                  cursor: "pointer",
                  boxShadow: `0 3px 10px rgba(0,0,0,0.08)`,
                  backgroundColor: palette.background.paper,
                  "&:hover": {
                    transform: "translateX(10px) scale(1.04)",
                    boxShadow: `0 10px 25px rgba(0,0,0,0.15)`,
                    backgroundColor: palette.primary.light + "20",
                  },
                }}
              />
            ))
        ) : (
          <Box
            textAlign="center"
            py={6}
            sx={{
              border: `2.5px dashed ${palette.neutral.light}`,
              borderRadius: "18px",
              backgroundColor: palette.neutral.light + "33",
              userSelect: "none",
            }}
          >
            <Typography
              color={palette.neutral.medium}
              fontStyle="italic"
              variant="body1"
              mb={1.2}
              sx={{ fontSize: '1rem' }}
            >
              Your friend list is empty
            </Typography>
            <Typography
              color={palette.primary.main}
              fontWeight="700"
              variant="subtitle1"
              sx={{ fontSize: '1.1rem' }}
            >
              Connect with others to see them here
            </Typography>
          </Box>
        )}
      </Box>
    </WidgetWrapper>
  );
};

export default FriendListWidget;
