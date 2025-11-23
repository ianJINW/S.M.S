import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { appRoutes } from './routes';
import { useState } from 'react';

const NavBar: React.FC = () => {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [publicOpen, setPublicOpen] = useState(false);
  const [privateOpen, setPrivateOpen] = useState(false);

  const handleLogout = async () => {
    clearAuth();
    navigate('/login');
  };

  const linkClass = (isActive: boolean) =>
    `block px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-indigo-700 text-white' : 'text-gray-200 hover:bg-indigo-600 hover:text-white'}`;

  const visibleRoutes = appRoutes.filter((r) => r.public || (user && (r.roles === null || (r.roles && r.roles.includes(user.role)))));

  const publicRoutes = visibleRoutes.filter((r) => r.public);
  const privateRoutes = visibleRoutes.filter((r) => !r.public);

  return (
    <nav className="bg-indigo-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="text-white font-bold text-lg">SMS</div>
            {/* Desktop menu */}
            <div className="hidden md:flex items-center space-x-1">
              {visibleRoutes.map((r) => (
                <NavLink key={r.path} to={r.path} className={({ isActive }) => linkClass(isActive)}>
                  {r.label}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="text-indigo-100 text-sm">{user.firstName} {user.lastName}</div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 bg-white text-indigo-700 rounded-md text-sm font-medium hover:bg-gray-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <NavLink to="/login" className="px-3 py-1 bg-white text-indigo-700 rounded-md text-sm font-medium hover:bg-gray-100">
                Login
              </NavLink>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="inline-flex md:hidden items-center justify-center p-2 rounded-md text-indigo-200 hover:text-white hover:bg-indigo-500 focus:outline-none"
              aria-expanded={mobileOpen}
            >
              <span className="sr-only">Open main menu</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu with accordion sections for overflow */}
      {mobileOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1">
          <div>
            <button
              onClick={() => setPublicOpen(!publicOpen)}
              className="w-full flex justify-between items-center px-3 py-2 text-left text-gray-200 hover:bg-indigo-500 rounded-md"
            >
              <span>Public</span>
              <span>{publicOpen ? '−' : '+'}</span>
            </button>
            {publicOpen && (
              <div className="mt-2 space-y-1 pl-4">
                {publicRoutes.map((r) => (
                  <NavLink key={r.path} to={r.path} className={({ isActive }) => linkClass(isActive)} onClick={() => setMobileOpen(false)}>
                    {r.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => setPrivateOpen(!privateOpen)}
              className="w-full flex justify-between items-center px-3 py-2 text-left text-gray-200 hover:bg-indigo-500 rounded-md"
            >
              <span>Links</span>
              <span>{privateOpen ? '−' : '+'}</span>
            </button>
            {privateOpen && (
              <div className="mt-2 space-y-1 pl-4">
                {privateRoutes.map((r) => (
                  <NavLink key={r.path} to={r.path} className={({ isActive }) => linkClass(isActive)} onClick={() => setMobileOpen(false)}>
                    {r.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
