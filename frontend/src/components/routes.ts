export type AppRoute = {
  path: string;
  label: string;
  public?: boolean; // visible to unauthenticated users
  roles?: string[] | null; // null = any authenticated user, [] = no one
};

export const appRoutes: AppRoute[] = [
  // Most pages are public/teasers; sensitive operations remain protected
  { path: '/dashboard', label: 'Dashboard', roles: ['admin', 'academic_admin', 'teacher'] },
  { path: '/students', label: 'Students', public: true, roles: ['admin', 'academic_admin', 'teacher'] },
  { path: '/academics', label: 'Academics', public: true },
  { path: '/exams', label: 'Exams', public: true },
  { path: '/finance', label: 'Finance', public: true, roles: ['admin', 'finance'] },
  { path: '/about', label: 'About', public: true },
  { path: '/staff', label: 'Staff', public: true },
  { path: '/attendance', label: 'Attendance', public: true, roles: ['teacher', 'admin'] },
  { path: '/reports', label: 'Reports', roles: ['admin'] },
  { path: '/student', label: 'Student', roles: ['student'] },
  { path: '/parent', label: 'Parent', roles: ['parent'] },
  { path: '/profile', label: 'Profile', roles: null },
];

export default appRoutes;
