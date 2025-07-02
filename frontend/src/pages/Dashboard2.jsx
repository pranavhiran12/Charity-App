import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';
import { Box, Toolbar, Typography, Divider, Container } from '@mui/material';

const Dashboard2 = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: '#f9fafb', // or your preferred color
          minHeight: '100vh',
          overflow: 'auto',
        }}
      >

        <Toolbar /> {/* Keeps top spacing for AppBar */}

        <Container maxWidth="xl" sx={{ pt: 3 }}>


          <Divider sx={{ mb: 4 }} />

          {/* Dynamic Page Content */}
          <Box sx={{ px: 2 }}>
            <Outlet />
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard2;
