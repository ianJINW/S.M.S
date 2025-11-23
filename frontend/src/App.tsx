import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './app/Login';
import { Dashboard } from './app/Dashboard';
import { Students } from './app/Students';
import Academics from './app/Academics';
import Exams from './app/Exams';
import Finance from './app/Finance';
import About from './app/About';
import Staff from './app/Staff';
import AttendancePage from './app/Attendance';
import Reports from './app/Reports';
import StudentDashboard from './app/StudentDashboard';
import ParentDashboard from './app/ParentDashboard';
import StudentProfile from './app/StudentProfile';
import Profile from './app/Profile';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import { appRoutes } from './components/routes';

function App() {
  const location = useLocation();
  const hideLayout = location.pathname === '/login';

  return (
    <div className="min-h-screen flex flex-col">
      {!hideLayout && <NavBar />}

      <main className="flex-1">
        <Routes>
          <Route path="/login" element={<Login />} />

          {appRoutes.map((r) => {
            // map path to component
            const componentMap: Record<string, JSX.Element> = {
              '/dashboard': <Dashboard />,
              '/students': <Students />,
              '/academics': <Academics />,
              '/exams': <Exams />,
              '/finance': <Finance />,
              '/about': <About />,
              '/staff': <Staff />,
              '/attendance': <AttendancePage />,
              '/reports': <Reports />,
              '/student': <StudentDashboard />,
              '/parent': <ParentDashboard />,
            };

            const element = componentMap[r.path] || <Navigate to="/dashboard" replace />;

            // If route declares `roles` (null = any authenticated user, [] = none), treat as protected
            if (typeof r.roles !== 'undefined') {
              if (r.roles === null) {
                return (
                  <Route key={r.path} path={r.path} element={<ProtectedRoute>{element}</ProtectedRoute>} />
                );
              }

              return (
                <Route key={r.path} path={r.path} element={<ProtectedRoute allowedRoles={r.roles || []}>{element}</ProtectedRoute>} />
              );
            }

            // Public route (no roles specified)
            return <Route key={r.path} path={r.path} element={element} />;
          })}

          {/* Student profile route */}
          <Route
            path="/students/:id"
            element={<ProtectedRoute allowedRoles={['admin', 'academic_admin', 'teacher']}><StudentProfile /></ProtectedRoute>}
          />

          {/* User profile (authenticated) */}
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          <Route path="/" element={<Navigate to="/about" replace />} />
        </Routes>
      </main>

      {!hideLayout && <Footer />}
    </div>
  );
}

export default App;


