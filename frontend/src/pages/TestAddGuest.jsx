import React from 'react';
import axios from 'axios';
import { Button, Box, Typography } from '@mui/material';

const token = localStorage.getItem("token");

const TestAddGuest = () => {
    const handleAddGuest = async () => {
        try {
            const token = localStorage.getItem("token"); // ✅ get token from local storage

            const res = await axios.post(
                'http://localhost:5000/api/guests',
                {
                    name: "Rajendra P Hiran",
                    email: "admin@example.com",
                    mobile: "9999999999",
                    eventId: "683351a3b1029853e0be1ca0"
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}` // ✅ include token
                    }
                }
            );

            console.log("✅ Guest created:", res.data);
            alert("Guest added successfully");
        } catch (err) {
            console.error("❌ Error creating guest:", err.response?.data || err.message);
            alert("Failed to add guest");
        }

    };

    return (
        <Box p={4}>
            <Typography variant="h6">Test Guest Creation</Typography>
            <Button variant="contained" onClick={handleAddGuest}>Add Test Guest</Button>
        </Box>
    );
};

export default TestAddGuest;
