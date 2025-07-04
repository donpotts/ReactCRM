// src/components/SideNav.jsx
import React from 'react';

const NavButton = ({ onClick, icon, label }) => (
  <button
    onClick={onClick}
    className="flex items-center font-semibold text-purple-100 hover:text-white hover:bg-black/20 p-3 rounded-lg w-full text-left transition-colors duration-200"
  >
    {icon}
    {label}
  </button>
);

const Icon = ({ children, className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`mr-3 flex-shrink-0 ${className}`}
  >
    {children}
  </svg>
);

function SideNav({
    isOpen,
    onClose,
    onNavigateToGridContent,
    onNavigateToCustomerContent,
    onNavigateToAddresContent,
    onNavigateToProductCategoryContent,
    onNavigateToServiceCategoryContent,
    onNavigateToContactContent,
    onNavigateToOpportunityContent,
    onNavigateToLeadContent,
    onNavigateToProductContent,
    onNavigateToServiceContent,
    onNavigateToSaleContent,
    onNavigateToVendorContent,
    onNavigateToSupportCaseContent,
    onNavigateToTodoTaskContent,
    onNavigateToRewardContent
}) {
    // Handlers remain the same
    const handleGridClick = () => onNavigateToGridContent();
    const handleCustomersClick = () => onNavigateToCustomerContent();
    const handleAddressesClick = () => onNavigateToAddresContent();
    const handleProductCategoriesClick = () => onNavigateToProductCategoryContent();
    const handleServiceCategoriesClick = () => onNavigateToServiceCategoryContent();
    const handleContactsClick = () => onNavigateToContactContent();
    const handleOpportunitiesClick = () => onNavigateToOpportunityContent();
    const handleLeadsClick = () => onNavigateToLeadContent();
    const handleProductsClick = () => onNavigateToProductContent();
    const handleServicesClick = () => onNavigateToServiceContent();
    const handleSalesClick = () => onNavigateToSaleContent();
    const handleVendorsClick = () => onNavigateToVendorContent();
    const handleSupportCasesClick = () => onNavigateToSupportCaseContent();
    const handleTodoTasksClick = () => onNavigateToTodoTaskContent();
    const handleRewardsClick = () => onNavigateToRewardContent();

  return (
    // The <> fragment is used to return multiple elements
    <>
      {/* 
        THE OVERLAY BLOCK THAT WAS HERE HAS BEEN REMOVED.
        
        This is the block that was removed:
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20..."
            onClick={onClose}
          ></div>
        )}
      */}

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-purple-700 to-purple-900 shadow-xl z-30 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-6 text-white h-full flex flex-col">
          <div className="flex justify-between items-center mb-8 flex-shrink-0">
            <h3 className="text-xl font-bold text-purple-300">Menu</h3>
            <button
              onClick={onClose}
              className="text-gray-200 hover:text-white transition-colors duration-200"
              aria-label="Close menu"
            >
              <Icon className="mr-0">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </Icon>
            </button>
          </div>
          <nav className="space-y-2 overflow-y-auto flex-grow">
            {/* All NavButton components remain unchanged */}
            <NavButton onClick={handleGridClick} label="Grid Items" icon={<Icon><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z"/></Icon>} />
            <NavButton onClick={handleCustomersClick} label="Customers" icon={<Icon><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></Icon>} />
            <NavButton onClick={handleAddressesClick} label="Addresses" icon={<Icon><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></Icon>} />
            <NavButton onClick={handleProductCategoriesClick} label="Product Categories" icon={<Icon><path d="M12 2H2v10l9.29 9.29a1 1 0 0 0 1.41 0L22 13.41a1 1 0 0 0 0-1.41L12 2z"/><path d="M7 7h.01"/></Icon>} />
            <NavButton onClick={handleServiceCategoriesClick} label="Service Categories" icon={<Icon><path d="m14 7 5 5-5 5"/><path d="m10 7-5 5 5 5"/></Icon>} />
            <NavButton onClick={handleContactsClick} label="Contacts" icon={<Icon><path d="M16 18a4 4 0 0 0-8 0"/><rect x="3" y="4" width="18" height="18" rx="2"/><circle cx="12" cy="10" r="2"/><line x1="8" y1="2" x2="8" y2="4"/><line x1="16" y1="2" x2="16" y2="4"/></Icon>} />
            <NavButton onClick={handleOpportunitiesClick} label="Opportunities" icon={<Icon><path d="M12 1v4"/><path d="M12 23v-4"/><path d="m4.93 4.93 2.83 2.83"/><path d="m16.24 16.24 2.83 2.83"/><path d="M1 12h4"/><path d="M19 12h4"/><path d="m4.93 19.07 2.83-2.83"/><path d="m16.24 7.76-2.83-2.83"/><circle cx="12" cy="12" r="3"/></Icon>} />
            <NavButton onClick={handleLeadsClick} label="Leads" icon={<Icon><path d="m22 11-1.4-4-1.6.5L17.6 3H4l3 8-3 8h13.6l1.4-4.5-1.6-.5L22 11z"/><path d="m11 15-2 3"/><path d="m16.5 11.5 2 3"/></Icon>} />
            <NavButton onClick={handleProductsClick} label="Products" icon={<Icon><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></Icon>} />
            <NavButton onClick={handleServicesClick} label="Services" icon={<Icon><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l-.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></Icon>} />
            <NavButton onClick={handleSalesClick} label="Sales" icon={<Icon><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></Icon>} />
            <NavButton onClick={handleVendorsClick} label="Vendors" icon={<Icon><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect x="2" y="20" width="20" height="2" rx="1"/><path d="M10 12H8"/><path d="M10 8H8"/><path d="M10 16H8"/></Icon>} />
            <NavButton onClick={handleSupportCasesClick} label="Support Cases" icon={<Icon><path d="M18.36 6.64a9 9 0 0 1 0 12.72"/><path d="M14.83 3.17a4 4 0 0 1 0 5.66"/><circle cx="12" cy="12" r="2"/><path d="m12 18-2 4"/><path d="m12 6 2-4"/><path d="m5.17 3.17 2.83 2.83"/><path d="m2 12h3"/><path d="M19 12h3"/><path d="m5.17 20.83 2.83-2.83"/><path d="m16.03 16.03 2.83 2.83"/></Icon>} />
            <NavButton onClick={handleTodoTasksClick} label="Todo Tasks" icon={<Icon><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></Icon>} />
            <NavButton onClick={handleRewardsClick} label="Rewards" icon={<Icon><path d="M10 21h4"/><path d="M6 17H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-1"/><path d="M6 17a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-3H6v3Z"/><path d="M12 12a3 3 0 0 0-3 3H7a5 5 0 0 1 5-5 5 5 0 0 1 5 5h-2a3 3 0 0 0-3-3Z"/><path d="M10.4 4.2a2 2 0 0 1 3.2 0"/></Icon>} />
          </nav>
        </div>
      </div>
    </>
  );
}

export default SideNav;