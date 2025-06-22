import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CircularProgress, Box, Typography } from '@mui/material';

const OAuthSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get("token");
        const name = searchParams.get("name");
        const profilePic = searchParams.get("profilePic");

        if (token) {
            // Save token & user info in localStorage
            localStorage.setItem("token", token);
            localStorage.setItem("userName", decodeURIComponent(name || ''));
            localStorage.setItem("profilePic", decodeURIComponent(profilePic || ''));

            // Redirect to dashboard
            navigate("/dashboard2");
        } else {
            navigate("/login"); // fallback
        }
    }, [searchParams, navigate]);

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100vh"
        >
            <CircularProgress />
            <Typography mt={2}>Logging you in...</Typography>
        </Box>
    );
};

export default OAuthSuccess;
