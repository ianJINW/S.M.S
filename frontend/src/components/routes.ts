export type AppRoute = {
  path: string;
  label: string;
  public?: boolean; // visible to unauthenticated users
  roles?: string[] | null; // null = any authenticated user, [] = no one
};

export const appRoutes: AppRoute[] = [
  { path: '/dashboard', label: 'Dashboard', roles: null },
  { path: '/students', label: 'Students', roles: ['admin', 'academic_admin', 'teacher'] },
  { path: '/academics', label: 'Academics', public: true, roles: ['admin', 'academic_admin'] },
  { path: '/exams', label: 'Exams', public: true, roles: ['admin', 'academic_admin', 'teacher'] },
  { path: '/finance', label: 'Finance', roles: ['admin', 'finance'] },
  { path: '/about', label: 'About', public: true },
  { path: '/staff', label: 'Staff', public: true, roles: ['admin', 'teacher'] },
  { path: '/attendance', label: 'Attendance', public: true, roles: ['teacher', 'admin'] },
  { path: '/reports', label: 'Reports', roles: ['admin'] },
  { path: '/student', label: 'Student', roles: ['student'] },
  { path: '/parent', label: 'Parent', roles: ['parent'] },
];

export default appRoutes;
