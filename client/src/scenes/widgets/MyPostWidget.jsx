import { ImageOutlined, DeleteOutlined, CloudUpload } from "@mui/icons-material";
import {
  Box,
  Divider,
  Typography,
  InputBase,
  useTheme,
  Button,
  IconButton,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Dropzone from "react-dropzone";
import WidgetWrapper from "components/WidgetWrapper";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";

const MyPostWidget = ({ picturePath }) => {
  const dispatch = useDispatch();
  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [postText, setPostText] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const { palette } = useTheme();
  const { _id } = useSelector((state) => state.user || {});
  const token = useSelector((state) => state.token);
  const { neutral, primary, background } = palette;

  useEffect(() => {
    if (!image) {
      setImagePreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(image);
    setImagePreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  const handlePost = async () => {
    if (!postText.trim()) return;

    setIsPosting(true);
    try {
      const formData = new FormData();
      formData.append("userId", _id);
      formData.append("description", postText);
      if (image) {
        formData.append("picture", image);
        formData.append("picturePath", image.name);
      }

      const response = await fetch(`http://localhost:3001/posts`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        console.error("Create post failed:", err);
        return;
      }

      const createdPost = await response.json();
      dispatch(setPost({ post: createdPost }));

      setImage(null);
      setPostText("");
      setIsImage(false);
    } catch (error) {
      console.error("Post error:", error);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <WidgetWrapper
      sx={{
        background: `linear-gradient(135deg, ${background.alt} 0%, ${background.default} 100%)`,
        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
        borderRadius: "20px",
        padding: "1.5rem",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.18)",
          transform: "translateY(-4px)",
        },
      }}
    >
      {/* Input Area */}
      <FlexBetween gap="1rem" alignItems="flex-start" pb="1.5rem">
        <Typography
          variant="subtitle1"
          fontWeight="600"
          color={neutral.dark}
          sx={{ minWidth: "40px" }}
        >
          You
        </Typography>
        <InputBase
          placeholder="What's on your mind?"
          onChange={(e) => setPostText(e.target.value)}
          value={postText}
          multiline
          maxRows={5}
          sx={{
            flex: 1,
            backgroundColor: neutral.light,
            borderRadius: "28px",
            padding: "16px 20px",
            fontSize: "1rem",
            fontWeight: 400,
            color: neutral.dark,
            boxShadow: `inset 0 0 8px ${neutral.light}`,
            transition: "background-color 0.3s ease",
            "& .MuiInputBase-input": {
              padding: 0,
              "&::placeholder": {
                color: neutral.medium,
                opacity: 1,
                fontWeight: 400,
              },
            },
            "&:focus-within": {
              backgroundColor: neutral.light + "dd",
              boxShadow: `0 0 12px ${primary.main}80`,
            },
          }}
        />
      </FlexBetween>

      {/* Image Upload Area */}
      {isImage && (
        <Box
          mt="0.8rem"
          p="1rem"
          sx={{
            border: `2px dashed ${primary.main}`,
            borderRadius: "14px",
            backgroundColor: primary.light + "10",
            transition: "background-color 0.3s ease",
            "&:hover": {
              backgroundColor: primary.light + "20",
            },
          }}
        >
          <Dropzone
            accept={{ "image/*": [] }}
            multiple={false}
            onDrop={(acceptedFiles) => {
              if (acceptedFiles.length > 0) setImage(acceptedFiles[0]);
            }}
            maxSize={5000000}
          >
            {({ getRootProps, getInputProps }) => (
              <Box
                {...getRootProps()}
                sx={{
                  cursor: "pointer",
                  userSelect: "none",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "130px",
                  gap: 1,
                }}
              >
                <input {...getInputProps()} />
                {!image ? (
                  <>
                    <CloudUpload
                      sx={{
                        color: primary.main,
                        fontSize: "3rem",
                        mb: 1,
                        transition: "transform 0.3s ease",
                        "&:hover": { transform: "scale(1.1)" },
                      }}
                    />
                    <Typography
                      color={neutral.dark}
                      fontWeight="600"
                      variant="body2"
                      sx={{ userSelect: "none" }}
                    >
                      Drag & drop or click to upload
                    </Typography>
                    <Typography
                      variant="caption"
                      color={neutral.medium}
                      mt={0.5}
                      sx={{ userSelect: "none" }}
                    >
                      Max size: 5MB
                    </Typography>
                  </>
                ) : (
                  <Box width="100%" px={1}>
                    <FlexBetween>
                      <Typography
                        color={neutral.dark}
                        fontWeight="600"
                        noWrap
                        sx={{ fontSize: "0.95rem" }}
                      >
                        {image.name}
                      </Typography>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          setImage(null);
                        }}
                        sx={{
                          backgroundColor: primary.light + "30",
                          "&:hover": {
                            backgroundColor: primary.light + "50",
                          },
                        }}
                        aria-label="Remove image"
                      >
                        <DeleteOutlined sx={{ color: primary.main }} />
                      </IconButton>
                    </FlexBetween>
                    {imagePreview && (
                      <Box
                        component="img"
                        src={imagePreview}
                        alt="Preview"
                        sx={{
                          mt: 2,
                          width: "100%",
                          maxHeight: 220,
                          objectFit: "contain",
                          borderRadius: "14px",
                          boxShadow: `0 4px 15px ${primary.main}50`,
                          transition: "transform 0.3s ease",
                          "&:hover": {
                            transform: "scale(1.02)",
                          },
                        }}
                      />
                    )}
                  </Box>
                )}
              </Box>
            )}
          </Dropzone>
        </Box>
      )}

      <Divider
        sx={{
          borderColor: neutral.light,
          margin: "1.5rem 0",
        }}
      />

      {/* Action Buttons */}
      <FlexBetween>
        <FlexBetween
          gap="0.7rem"
          onClick={() => setIsImage(!isImage)}
          sx={{
            px: "1.2rem",
            py: "0.6rem",
            borderRadius: "14px",
            cursor: "pointer",
            backgroundColor: isImage ? primary.light + "30" : neutral.light,
            transition: "background-color 0.3s ease",
            "&:hover": {
              backgroundColor: primary.light + "40",
            },
            boxShadow: isImage ? `0 0 10px ${primary.main}80` : "none",
          }}
        >
          <ImageOutlined
            sx={{
              color: isImage ? primary.main : neutral.medium,
              fontSize: "2rem",
              transition: "color 0.3s ease",
            }}
          />
          <Typography
            color={isImage ? primary.main : neutral.medium}
            sx={{
              fontWeight: 600,
              fontSize: "1rem",
              userSelect: "none",
            }}
          >
            Photo
          </Typography>
        </FlexBetween>

        <Button
          disabled={!postText.trim() || isPosting}
          onClick={handlePost}
          sx={{
            px: 4,
            py: 1.25,
            backgroundColor: primary.main,
            color: background.alt,
            borderRadius: "18px",
            textTransform: "none",
            fontWeight: 700,
            fontSize: "1rem",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            transition: "background-color 0.3s ease, box-shadow 0.3s ease",
            "&:hover": {
              backgroundColor: primary.dark,
              boxShadow: `0 6px 18px ${primary.light}`,
            },
            "&:disabled": {
              backgroundColor: neutral.medium,
              color: neutral.dark,
              boxShadow: "none",
            },
          }}
        >
          {isPosting ? "Posting..." : "Post"}
        </Button>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default MyPostWidget;
