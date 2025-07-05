import React from 'react';
import Sidebar from './Sidebar';
import AdminNavbar from './AdminNavbar';
import { useNavigation } from '../contexts/NavigationContext';

const ConditionalNavigation = () => {
    // Get user info from localStorage
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    // Get navigation context
    const { isUserMode } = useNavigation();

    // Check if user is admin
    const isAdmin = user && user.role === 'admin';

    console.log('🔍 ConditionalNavigation Debug:');
    console.log('  - User:', user);
    console.log('  - User Role:', user?.role);
    console.log('  - Is Admin:', isAdmin);
    console.log('  - Is User Mode:', isUserMode);
    console.log('  - Should show AdminNavbar:', isAdmin && !isUserMode);
    console.log('  - Should show Sidebar:', !isAdmin || isUserMode);

    // Render appropriate navigation based on user role and mode
    if (isAdmin && !isUserMode) {
        console.log('👑 Rendering AdminNavbar for admin user in admin mode');
        return <AdminNavbar />;
    } else {
        console.log('👤 Rendering Sidebar for regular user or admin in user mode');
        return <Sidebar />;
    }
};

export default ConditionalNavigation; 