import ConditionalNavigation from '../components/ConditionalNavigation';
import { Outlet } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';
import '../components/UIEvent1.css'; // Reuse or extend for dashboard background polish

const Dashboard2 = () => {
  return (
    <Box className="ui-event1-bg" sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Conditional Navigation - Shows Sidebar for users, AdminNavbar for admins */}
      <ConditionalNavigation />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Toolbar /> {/* Keeps top spacing for AppBar */}

        {/* Dashboard Header */}
        <div className="dashboard-header" style={{ animation: 'fadeInUp 0.7s cubic-bezier(.4,2,.6,1)' }}>
          <span className="dashboard-header-avatar">A</span>
        </div>

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch', px: { xs: 1, md: 4 }, pt: 2 }}>
          {/* Dynamic Page Content */}
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard2;
