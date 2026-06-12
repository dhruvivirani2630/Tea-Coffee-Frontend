# AccessDesk — React + Vite RBAC App

Production-ready React application with JWT authentication, role-based access control (Admin / User), protected routes, and a mock API backed by `localStorage`.

## Quick start

```bash
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:5173`.

## Environment variables

| Variable | Description |
| --- | --- |
| `VITE_API_BASE_URL` | Backend API base URL (default: `http://localhost:3001/api`) |
| `VITE_USE_MOCK_API` | Set to `true` for localStorage mock; set to `false` for a real backend |

## Demo accounts (seed data)

| Role | Email | Phone | Password |
| --- | --- | --- | --- |
| Admin | `admin@company.com` | `9876543210` | `Admin@123` |
| User | `user@company.com` | `9876501234` | `User@1234` |

The admin account is created only through seed data. All signups receive the **User** role.

## Features

- **Authentication**: Signup, login (email or phone), logout, session persistence, JWT token storage
- **Authorization**: Protected routes, admin-only routes, role-based sidebar
- **User profile**: View and edit profile (role is read-only for users)
- **Admin panel**: User list, search, role/status filters, pagination, view/edit/delete, activate/deactivate
- **Validation**: Full name, unique employee ID, email/phone formats, strong password rules
- **UI**: Responsive dashboard layout with header, sidebar, footer, loaders, modals, alerts

## Folder structure

```
src/
├── api/axiosClient.js
├── assets/
├── components/
│   ├── common/       # Loader, ProtectedRoute, RoleBasedRoute, SearchBar, Pagination, ConfirmationModal
│   ├── forms/        # AuthForm, ProfileForm
│   ├── layouts/      # Header, Sidebar, Footer, DashboardLayout
│   └── tables/       # UserTable
├── constants/        # roles, storageKeys
├── context/          # AuthProvider stub (Redux is primary state layer)
├── hooks/            # useAuth, useAsync
├── pages/
│   ├── auth/         # Login, Signup, Forgot Password
│   ├── admin/        # Admin dashboard, user management
│   └── user/         # User dashboard, profile
├── routes/AppRoutes.jsx
├── services/         # authService, userService
├── store/            # Redux Toolkit slices
├── utils/            # validators, mockDb, session, date
├── App.jsx
└── main.jsx
```

## State management

Redux Toolkit stores:

- **auth**: user, token, session bootstrap status
- **users**: admin user list, selected user, loading/error state

## API layer

Services in `src/services/`:

| Service | Methods |
| --- | --- |
| `authService` | `signup`, `login`, `logout`, `getSession` |
| `userService` | `getProfile`, `updateProfile`, `getUsers`, `getUserById`, `updateUser`, `deleteUser`, `setUserStatus` |

With `VITE_USE_MOCK_API=true`, Axios uses a mock adapter and services read/write seeded data in `localStorage`.

## Routes

| Path | Access |
| --- | --- |
| `/login`, `/signup`, `/forgot-password` | Public |
| `/dashboard`, `/profile`, `/profile/edit` | Authenticated users |
| `/admin`, `/admin/users`, `/admin/users/:id`, `/admin/users/:id/edit` | Admin only |

## Scripts

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # ESLint
```

## Security notes

- JWT tokens expire after 1 hour; expired sessions redirect to login
- Axios request/response interceptors attach tokens and handle 401 responses
- Users cannot change their own role; only one admin exists in seed data
- Admin accounts cannot be deleted
