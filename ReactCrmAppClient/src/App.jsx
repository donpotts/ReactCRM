// src/App.jsx
import React, { useState, useEffect, useCallback } from 'react';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import LoginSuccessPage from './pages/LoginSuccessPage.jsx';
import GridContentPage from './pages/GridContentPage.jsx';
import CustomerPage from './pages/CustomerPage.jsx';
import AddresPage from './pages/AddresPage.jsx';
import ProductCategoryPage from './pages/ProductCategoryPage.jsx';
import ServiceCategoryPage from './pages/ServiceCategoryPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import OpportunityPage from './pages/OpportunityPage.jsx';
import LeadPage from './pages/LeadPage.jsx';
import ProductPage from './pages/ProductPage.jsx';
import ServicePage from './pages/ServicePage.jsx';
import SalePage from './pages/SalePage.jsx';
import VendorPage from './pages/VendorPage.jsx';
import SupportCasePage from './pages/SupportCasePage.jsx';
import TodoTaskPage from './pages/TodoTaskPage.jsx';
import RewardPage from './pages/RewardPage.jsx';
import Navbar from './components/Navbar.jsx';
import SideNav from './components/SideNav.jsx';
import { validateToken } from './api/auth.js';
import { getHomeGridData } from './data/homedata.js';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || null);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    setIsAuthenticated(!!authToken);
  }, [authToken]);

  useEffect(() => {
    const checkAuthStatus = async () => {
      if (authToken) {
        try {
          const validationResult = await validateToken(authToken);
          if (validationResult.success) {
            setIsAuthenticated(true);
            setCurrentPage('home');
          } else {
            setCurrentPage('home');
          }
        } catch (error) {
          console.error("Token validation error:", error); 
          localStorage.removeItem('authToken');
          setAuthToken(null);
          setIsAuthenticated(false);
          setCurrentPage('home');
        }
      }
      setAppLoading(false);
    };
    checkAuthStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goToLogin = useCallback(() => {
    setCurrentPage('login');
    setIsSideNavOpen(false);
  }, []);

  const handleLoginSuccess = useCallback((token) => {
    setIsAuthenticated(true);
    localStorage.setItem('authToken', token);
    setAuthToken(token);
    setCurrentPage('success');
  }, []);

  const handleOkAndOpenSideNav = useCallback(() => {
    setCurrentPage('home');
  }, []);

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    setCurrentPage('home');
    setIsSideNavOpen(false);
    localStorage.removeItem('authToken');
    setAuthToken(null);
  }, []);

  // --- THE FIX IS HERE ---
  // The line that closes the SideNav has been removed from this function.
  const handleNavigation = useCallback((page) => {
    setCurrentPage(page);
    // The line `setIsSideNavOpen(false);` has been removed to keep the nav open.
  }, []);
  // --- END FIX ---

  const goToHome = useCallback(() => {
    setCurrentPage('home');
    setIsSideNavOpen(false);
  }, []);

  const toggleSideNav = useCallback(() => {
    setIsSideNavOpen(prev => !prev);
  }, []);

  const handleGoToHomeFromPage = useCallback(() => {
    setCurrentPage('home');
  }, []);
  
  const renderContent = () => {
    if (appLoading) {
      return ( <div className="flex items-center justify-center min-h-screen text-white text-2xl animate-pulse"> Loading application... </div> );
    }
    switch (currentPage) {
        case 'home': return <HomePage onGoToLogin={goToLogin} />;
        case 'login': return <LoginPage onLoginSuccess={handleLoginSuccess} onGoToHome={handleLogout} />;
        case 'success': return <LoginSuccessPage onOpenSideNavAndNavigate={handleOkAndOpenSideNav} />;
        case 'grid': return <GridContentPage data={getHomeGridData} />;
        case 'customers': return <CustomerPage authToken={authToken} onGoToHome={handleGoToHomeFromPage} />;
        case 'addresses': return <AddresPage authToken={authToken} onGoToHome={handleGoToHomeFromPage} />;
        case 'productCategories': return <ProductCategoryPage authToken={authToken} onGoToHome={handleGoToHomeFromPage} />;
        case 'serviceCategories': return <ServiceCategoryPage authToken={authToken} onGoToHome={handleGoToHomeFromPage} />;
        case 'contacts': return <ContactPage authToken={authToken} onGoToHome={handleGoToHomeFromPage} />;
        case 'opportunities': return <OpportunityPage authToken={authToken} onGoToHome={handleGoToHomeFromPage} />;
        case 'leads': return <LeadPage authToken={authToken} onGoToHome={handleGoToHomeFromPage} />;
        case 'products': return <ProductPage authToken={authToken} onGoToHome={handleGoToHomeFromPage} />;
        case 'services': return <ServicePage authToken={authToken} onGoToHome={handleGoToHomeFromPage} />;
        case 'sales': return <SalePage authToken={authToken} onGoToHome={handleGoToHomeFromPage} />;
        case 'vendors': return <VendorPage authToken={authToken} onGoToHome={handleGoToHomeFromPage} />;
        case 'supportCases': return <SupportCasePage authToken={authToken} onGoToHome={handleGoToHomeFromPage} />;
        case 'todoTasks': return <TodoTaskPage authToken={authToken} onGoToHome={handleGoToHomeFromPage} />;
        case 'rewards': return <RewardPage authToken={authToken} onGoToHome={handleGoToHomeFromPage} />;
        default: return <HomePage onGoToLogin={goToLogin} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 flex flex-col items-center p-4 font-sans antialiased">
      <Navbar
        currentPage={currentPage}
        isAuthenticated={isAuthenticated}
        onGoToLogin={goToLogin}
        onLogout={handleLogout}
        onToggleSideNav={toggleSideNav}
        onGoToHome={goToHome}
      />
      {isAuthenticated && (
        <SideNav
          isOpen={isSideNavOpen}
          onClose={() => setIsSideNavOpen(false)}
          onNavigateToGridContent={() => handleNavigation('grid')}
          onNavigateToCustomerContent={() => handleNavigation('customers')}
          onNavigateToAddresContent={() => handleNavigation('addresses')}
          onNavigateToProductCategoryContent={() => handleNavigation('productCategories')}
          onNavigateToServiceCategoryContent={() => handleNavigation('serviceCategories')}
          onNavigateToContactContent={() => handleNavigation('contacts')}
          onNavigateToOpportunityContent={() => handleNavigation('opportunities')}
          onNavigateToLeadContent={() => handleNavigation('leads')}
          onNavigateToProductContent={() => handleNavigation('products')}
          onNavigateToServiceContent={() => handleNavigation('services')}
          onNavigateToSaleContent={() => handleNavigation('sales')}
          onNavigateToVendorContent={() => handleNavigation('vendors')}
          onNavigateToSupportCaseContent={() => handleNavigation('supportCases')}
          onNavigateToTodoTaskContent={() => handleNavigation('todoTasks')}
          onNavigateToRewardContent={() => handleNavigation('rewards')}
        />
      )}
      
      <div className="flex-grow flex items-center justify-center w-full">
        {renderContent()}
      </div>
    </div>
  );
}

export default App;