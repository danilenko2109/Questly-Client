import { Box } from "@mui/material";

const UserImage = ({ image, size = "60px", borderColor = "#1976d2", showBorder = true, hoverEffect = true }) => {
  const isBase64 = image?.startsWith('data:image');
  const isExternalUrl = image?.startsWith('http');

  return (
    <Box 
      width={size} 
      height={size}
      sx={{
        borderRadius: '50%',
        overflow: 'hidden',
        position: 'relative',
        border: showBorder ? `2px solid ${borderColor}` : 'none',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
        '&:hover': hoverEffect ? {
          transform: 'scale(1.05)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
        } : {},
        backgroundColor: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {(isBase64 || isExternalUrl) ? (
        <img
          style={{ 
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block'
          }}
          alt="user"
          src={image}
          loading="lazy"
        />
      ) : image ? (
        <img
          style={{ 
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block'
          }}
          alt="user"
          src={`${process.env.REACT_APP_API_BASE_URL}/assets/${image}`}
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';
          }}
        />
      ) : (
        <img
          style={{ 
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block'
          }}
          alt="default user"
          src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
        />
      )}
    </Box>
  );
};

export default UserImage;