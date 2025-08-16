import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Fade,
  Slide,
  Grow,
  Zoom,
  IconButton,
  InputAdornment,
  Skeleton,
  useTheme
} from "@mui/material";
import { NavLink } from "react-router-dom";
import {
  Search as SearchIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import WidgetWrapper from "components/WidgetWrapper";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const token = useSelector((state) => state.token);
  const theme = useTheme();

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setHasSearched(true);

    try {
      const res = await fetch(
        `http://localhost:3001/users/search/users?query=${encodeURIComponent(query)}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setHasSearched(false);
  };

  useEffect(() => {
    if (!query.trim() && hasSearched) {
      setResults([]);
      setHasSearched(false);
    }
  }, [query, hasSearched]);

  return (
    <WidgetWrapper 
      sx={{
        background: theme.palette.background.alt,
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: theme.shadows[4]
        },
        maxWidth: 600,
        margin: 'auto',
        borderRadius: '20px',
        p: 3
      }}
    >
      <Fade in timeout={500}>
        <Typography 
          variant="h3" 
          gutterBottom
          sx={{
            color: theme.palette.neutral.dark,
            textAlign: 'center',
            fontWeight: 700,
            mb: 3,
            userSelect: 'none'
          }}
        >
          Discover People
        </Typography>
      </Fade>
      
      <Slide in direction="down" timeout={600}>
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            fullWidth
            label="Search by name"
            variant="outlined"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: theme.palette.neutral.medium }} />
                </InputAdornment>
              ),
              endAdornment: query && (
                <InputAdornment position="end">
                  <IconButton onClick={handleClear} size="small">
                    <ClearIcon sx={{ 
                      color: theme.palette.neutral.medium,
                      '&:hover': {
                        color: theme.palette.error.main
                      }
                    }} />
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                borderRadius: '12px',
                backgroundColor: theme.palette.background.paper,
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.light
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.main,
                  boxShadow: `0 0 0 3px ${theme.palette.primary.light}33`
                }
              }
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            disabled={!query.trim() || isLoading}
            startIcon={<SearchIcon />}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              px: 3,
              fontWeight: 600,
              boxShadow: theme.shadows[1],
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[3]
              },
              '&:disabled': {
                backgroundColor: theme.palette.neutral.light,
                color: theme.palette.neutral.medium
              }
            }}
          >
            {isLoading ? "Searching..." : "Search"}
          </Button>
        </Box>
      </Slide>

      <Box sx={{ minHeight: '320px' }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[...Array(5)].map((_, index) => (
              <Grow in timeout={index * 200} key={index}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
                  <Skeleton 
                    variant="circular" 
                    width={56} 
                    height={56} 
                    sx={{ bgcolor: theme.palette.neutral.light }} 
                  />
                  <Skeleton 
                    variant="text" 
                    width="60%" 
                    height={28} 
                    sx={{ bgcolor: theme.palette.neutral.light }} 
                  />
                </Box>
              </Grow>
            ))}
          </Box>
        ) : results.length > 0 ? (
          <List sx={{ p: 0 }}>
            {results.map((user, index) => (
              <Zoom in timeout={500 + (index * 100)} key={user._id}>
                <Box sx={{ mb: 1 }}>
                  <ListItem
                    alignItems="center"
                    component={NavLink}
                    to={`/profile/${user._id}`}
                    sx={{
                      textDecoration: 'none',
                      color: theme.palette.text.primary,
                      borderRadius: '14px',
                      p: 2,
                      backgroundColor: theme.palette.background.paper,
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      gap: 2,
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                        transform: 'translateX(5px)',
                        boxShadow: theme.shadows[2]
                      }
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar 
                        src={user.picturePath} 
                        alt={`${user.firstName} ${user.lastName}`}
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: '50%',
                          border: `2px solid ${theme.palette.primary.light}`,
                          transition: 'transform 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.1)'
                          }
                        }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${user.firstName} ${user.lastName}`}
                      primaryTypographyProps={{
                        fontWeight: 600,
                        fontSize: '1.1rem',
                      }}
                      sx={{ ml: 1 }}
                    />
                  </ListItem>
                  <Divider sx={{ opacity: 0.3, my: 0.5 }} />
                </Box>
              </Zoom>
            ))}
          </List>
        ) : hasSearched ? (
          <Fade in timeout={800}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              textAlign: 'center', 
              p: 4, 
              height: '200px',
              userSelect: 'none',
            }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600, 
                  mb: 2,
                  color: theme.palette.text.primary 
                }}
              >
                No users found
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: theme.palette.text.secondary,
                  maxWidth: 320
                }}
              >
                Try different search terms
              </Typography>
            </Box>
          </Fade>
        ) : (
          <Fade in timeout={800}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              textAlign: 'center', 
              p: 4, 
              height: '200px',
              userSelect: 'none',
            }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600, 
                  mb: 2,
                  color: theme.palette.text.primary,
                  opacity: 0.75
                }}
              >
                Search for friends, colleagues, or influencers
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: theme.palette.text.secondary,
                  maxWidth: 320
                }}
              >
                Enter a name to get started
              </Typography>
            </Box>
          </Fade>
        )}
      </Box>
    </WidgetWrapper>
  );
};

export default SearchPage;
