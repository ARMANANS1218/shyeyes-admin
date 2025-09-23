import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const useDocumentTitle = (pageTitle = '') => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  // Get role from user object
  const role = user?.role;

  useEffect(() => {
    let title = 'ShyEyes Admin Dashboard';

    if (isAuthenticated && role) {
      // Format role name properly
      let roleTitle = '';
      if (role.toLowerCase() === 'superadmin') {
        roleTitle = 'SuperAdmin';
      } else {
        roleTitle = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
      }
      
      if (pageTitle) {
        title = `${pageTitle} - ${roleTitle} Dashboard | ShyEyes`;
      } else {
        title = `${roleTitle} Dashboard | ShyEyes`;
      }
    } else if (pageTitle) {
      title = `${pageTitle} | ShyEyes`;
    }

    document.title = title;
    console.log('Document title updated to:', title, 'Role:', role, 'Authenticated:', isAuthenticated); // Debug log
  }, [role, isAuthenticated, pageTitle]);
};

export default useDocumentTitle;