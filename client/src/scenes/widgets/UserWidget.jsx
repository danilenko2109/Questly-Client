import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  useTheme,
  Box,
  Typography,
  Divider,
  IconButton,
  TextField,
  Button,
  Avatar,
} from "@mui/material";
import {
  ManageAccountsOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
  CloudUpload,
} from "@mui/icons-material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { NavLink } from "react-router-dom";

const UserWidget = ({ userId, picturePath }) => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    location: "",
    occupation: "",
    picturePath: "",
  });

  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const currentUserId = useSelector((state) => state.user._id);

  const getUser = useCallback(async () => {
    try {
      const response = await fetch(`https://questly-server-5.onrender.com/users/${userId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setUser(data);
      setFormData({
        firstName: data.firstName,
        lastName: data.lastName,
        location: data.location || "",
        occupation: data.occupation || "",
        picturePath: data.picturePath || "",
      });
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  }, [userId, token]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
    if (!isEditing && user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        location: user.location || "",
        occupation: user.occupation || "",
        picturePath: user.picturePath || "",
      });
      setSelectedFile(null);
      setPreviewUrl("");
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("firstName", formData.firstName);
      formDataToSend.append("lastName", formData.lastName);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("occupation", formData.occupation);

      if (selectedFile) {
        formDataToSend.append("picture", selectedFile);
      } else if (formData.picturePath) {
        formDataToSend.append("picturePath", formData.picturePath);
      }

      const response = await fetch(`https://questly-server-5.onrender.com/users/${userId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user");
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setIsEditing(false);
      setSelectedFile(null);
      setPreviewUrl("");
    } catch (error) {
      console.error("Update error:", error);
      alert(error.message || "An error occurred while updating");
    }
  };

  if (!user) return null;

  const isCurrentUser = userId === currentUserId;
  const displayImage = previewUrl || (isEditing ? formData.picturePath : user.picturePath);

  return (
    <WidgetWrapper
      sx={{
        background: `linear-gradient(135deg, ${palette.background.alt} 0%, ${palette.background.default} 100%)`,
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        borderRadius: "16px",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.15)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <FlexBetween gap="1.5rem" pb="1.1rem" alignItems="center">
        <FlexBetween
          component={NavLink}
          to={`/profile/${userId}`}
          gap="1.5rem"
          sx={{
            textDecoration: "none",
            color: "inherit",
            alignItems: "center",
            flexGrow: 1,
            "&:hover h4": {
              color: palette.primary.light,
              textDecoration: "underline",
            },
          }}
        >
          <Avatar
            src={displayImage}
            alt={`${user.firstName} ${user.lastName}`}
            sx={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              border: `4px solid ${palette.primary.main}`,
              boxShadow: `0 4px 12px rgba(0,0,0,0.25)`,
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              cursor: "pointer",
              objectFit: "cover",
              flexShrink: 0,
              "&:hover": {
                transform: "scale(1.1)",
                boxShadow: `0 8px 20px rgba(0,0,0,0.35)`,
              },
            }}
          />
          <Box sx={{ flexGrow: 1 }}>
            {isEditing ? (
              <>
                <TextField
                  name="firstName"
                  label="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  size="small"
                  sx={{
                    mb: "0.5rem",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: palette.neutral.medium,
                      },
                      "&:hover fieldset": {
                        borderColor: palette.primary.light,
                      },
                    },
                  }}
                />
                <TextField
                  name="lastName"
                  label="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: palette.neutral.medium,
                      },
                      "&:hover fieldset": {
                        borderColor: palette.primary.light,
                      },
                    },
                  }}
                />
              </>
            ) : (
              <>
                <Typography
                  variant="h4"
                  fontWeight="600"
                  color={palette.neutral.dark}
                  sx={{
                    textTransform: "capitalize",
                    letterSpacing: "0.5px",
                  }}
                >
                  {user.firstName} {user.lastName}
                </Typography>
                <Typography
                  color={palette.neutral.medium}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "0.9rem",
                  }}
                >
                  <span
                    style={{
                      backgroundColor: palette.primary.light,
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      display: "inline-block",
                    }}
                  />
                  {user.friends.length} {user.friends.length === 1 ? "friend" : "friends"}
                </Typography>
              </>
            )}
          </Box>
        </FlexBetween>

        {isCurrentUser && (
          <IconButton
            onClick={handleEditToggle}
            sx={{
              backgroundColor: palette.primary.light + "20",
              "&:hover": {
                backgroundColor: palette.primary.light + "40",
              },
              ml: 1,
            }}
          >
            <ManageAccountsOutlined
              sx={{
                color: palette.primary.main,
                fontSize: "1.8rem",
              }}
            />
          </IconButton>
        )}
      </FlexBetween>

      <Divider
        sx={{
          borderColor: palette.neutral.light,
          margin: "0.5rem 0",
        }}
      />

      <Box p="1rem 0">
        <Box display="flex" alignItems="center" gap="1rem" mb="1rem">
          <LocationOnOutlined
            fontSize="large"
            sx={{
              color: palette.primary.main,
              backgroundColor: palette.primary.light + "20",
              borderRadius: "50%",
              padding: "0.6rem",
            }}
          />
          {isEditing ? (
            <TextField
              fullWidth
              variant="outlined"
              size="medium"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Enter your location"
              sx={{
                fontSize: "1.1rem",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: palette.neutral.medium,
                  },
                  "&:hover fieldset": {
                    borderColor: palette.primary.light,
                  },
                },
              }}
            />
          ) : (
            <Typography
              color={palette.neutral.medium}
              sx={{
                fontWeight: user.location ? "600" : "400",
                fontStyle: user.location ? "normal" : "italic",
                fontSize: "1.1rem",
              }}
            >
              {user.location || "No location specified"}
            </Typography>
          )}
        </Box>

        <Box display="flex" alignItems="center" gap="1rem">
          <WorkOutlineOutlined
            fontSize="large"
            sx={{
              color: palette.primary.main,
              backgroundColor: palette.primary.light + "20",
              borderRadius: "50%",
              padding: "0.6rem",
            }}
          />
          {isEditing ? (
            <TextField
              fullWidth
              variant="outlined"
              size="medium"
              name="occupation"
              value={formData.occupation}
              onChange={handleInputChange}
              placeholder="Enter your occupation"
              sx={{
                fontSize: "1.1rem",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: palette.neutral.medium,
                  },
                  "&:hover fieldset": {
                    borderColor: palette.primary.light,
                  },
                },
              }}
            />
          ) : (
            <Typography
              color={palette.neutral.medium}
              sx={{
                fontWeight: user.occupation ? "600" : "400",
                fontStyle: user.occupation ? "normal" : "italic",
                fontSize: "1.1rem",
              }}
            >
              {user.occupation || "No occupation specified"}
            </Typography>
          )}
        </Box>

        {isEditing && (
          <Box mt="1.5rem">
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="profile-picture-upload"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="profile-picture-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<CloudUpload />}
                fullWidth
                sx={{
                  mb: 2,
                  borderStyle: "dashed",
                  borderColor: palette.neutral.medium,
                  color: palette.neutral.dark,
                  "&:hover": {
                    borderColor: palette.primary.main,
                  },
                }}
              >
                Upload Profile Picture
              </Button>
            </label>

            {previewUrl && (
              <Box display="flex" justifyContent="center" mb={2}>
                <Avatar
                  src={previewUrl}
                  sx={{
                    width: 120,
                    height: 120,
                    border: `4px solid ${palette.primary.main}`,
                    boxShadow: `0 4px 12px rgba(0,0,0,0.3)`,
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                />
              </Box>
            )}

            <TextField
              label="Or enter image URL"
              name="picturePath"
              value={formData.picturePath}
              onChange={handleInputChange}
              fullWidth
              size="small"
              placeholder="https://example.com/profile.jpg"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: palette.neutral.medium,
                  },
                  "&:hover fieldset": {
                    borderColor: palette.primary.light,
                  },
                },
              }}
            />
          </Box>
        )}
      </Box>

      {isEditing && (
        <Box mt="1.5rem" display="flex" justifyContent="flex-end" gap="1rem">
          <Button
            onClick={handleEditToggle}
            variant="outlined"
            sx={{
              color: palette.neutral.dark,
              borderColor: palette.neutral.medium,
              borderRadius: "12px",
              "&:hover": {
                borderColor: palette.primary.main,
                color: palette.primary.main,
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              borderRadius: "12px",
            }}
          >
            Save
          </Button>
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default UserWidget;
