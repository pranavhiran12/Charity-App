import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';
import { Box, Toolbar, Typography } from '@mui/material';

const Dashboard2 = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Typography variant="h4" gutterBottom>
          Welcome to Your Dashboard
        </Typography>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Dashboard2;
