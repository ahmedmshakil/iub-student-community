
import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UNIVERSITY_SHORT_NAME } from '../constants';
import { Avatar } from '../components/common/Avatar';
import { Button } from '../components/common/Button';
import { MenuIcon, CloseIcon, ChatBubbleIcon, StoreIcon, PlusCircleIcon, UserCircleIcon, LogoutIcon } from '../components/icons';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  currentPath: string;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, currentPath, onClick }) => {
  const isActive = currentPath.startsWith(to);
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center px-3 py-3 rounded-lg transition-colors duration-200
                  ${isActive ? 'bg-iub-primary/20 text-iub-primary font-semibold' : 'text-gray-600 hover:bg-gray-200 hover:text-gray-800'}`}
    >
      <span className="mr-3">{icon}</span>
      {label}
    </Link>
  );
};

const MainLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/chat', icon: <ChatBubbleIcon className="w-5 h-5" />, label: 'Course Chats' },
    { to: '/marketplace', icon: <StoreIcon className="w-5 h-5" />, label: 'Marketplace' },
    { to: '/sell', icon: <PlusCircleIcon className="w-5 h-5" />, label: 'Sell Item' },
    { to: '/profile', icon: <UserCircleIcon className="w-5 h-5" />, label: 'Profile' },
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <Link to="/" className="flex items-center space-x-2">
          <img src={`https://picsum.photos/seed/${UNIVERSITY_SHORT_NAME}/40/40`} alt={`${UNIVERSITY_SHORT_NAME} Logo`} className="w-10 h-10 rounded-md object-cover"/>
          <span className="text-2xl font-bold text-iub-primary">{UNIVERSITY_SHORT_NAME}</span>
        </Link>
      </div>

      <nav className="flex-grow p-4 space-y-2">
        {navItems.map(item => (
          <NavItem 
            key={item.to} 
            to={item.to} 
            icon={item.icon} 
            label={item.label} 
            currentPath={location.pathname}
            onClick={() => setIsSidebarOpen(false)}
          />
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        {user && (
          <div className="flex items-center mb-4">
            <Avatar name={user.name} size="md" className="mr-3"/>
            <div>
              <p className="font-semibold text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
        )}
        <Button onClick={handleLogout} variant="secondary" size="sm" className="w-full" leftIcon={<LogoutIcon className="w-4 h-4" />}>
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 bg-white shadow-lg flex-col fixed inset-y-0">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <aside className="w-64 bg-white shadow-lg flex-col">
            {sidebarContent}
          </aside>
          <div className="flex-1 bg-black opacity-50" onClick={() => setIsSidebarOpen(false)}></div>
        </div>
      )}
      
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Top Navbar for Mobile */}
        <header className="md:hidden bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-30">
          <Link to="/" className="flex items-center space-x-2">
            <img src={`https://picsum.photos/seed/${UNIVERSITY_SHORT_NAME}/32/32`} alt={`${UNIVERSITY_SHORT_NAME} Logo`} className="w-8 h-8 rounded-md object-cover"/>
            <span className="text-xl font-bold text-iub-primary">{UNIVERSITY_SHORT_NAME}</span>
          </Link>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-600 hover:text-iub-primary">
            {isSidebarOpen ? <CloseIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
