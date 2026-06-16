import { http, HttpResponse } from 'msw';

const API_URL = 'http://localhost:3001/api';

export const handlers = [
  // Auth handlers
  http.post(`${API_URL}/auth/login`, async ({ request }) => {
    const body = await request.json();
    
    if (body.email === 'test@example.com' && body.password === 'Test@123') {
      return HttpResponse.json({
        ok: true,
        data: {
          user: {
            id: '1',
            email: 'test@example.com',
            fullName: 'Test User',
            phone: '1234567890',
            role: 'user',
            status: 'active',
            employeeId: 'EMP001'
          },
          token: 'mock-jwt-token-12345'
        }
      });
    }

    return HttpResponse.json(
      {
        ok: false,
        message: 'Invalid credentials'
      },
      { status: 401 }
    );
  }),

  http.post(`${API_URL}/auth/signup`, async ({ request }) => {
    const body = await request.json();
    
    return HttpResponse.json({
      ok: true,
      data: {
        user: {
          id: '2',
          email: body.email,
          fullName: body.fullName,
          phone: body.phone,
          role: 'user',
          status: 'active',
          employeeId: 'EMP002'
        },
        token: 'mock-jwt-token-new-user'
      }
    });
  }),

  http.post(`${API_URL}/auth/logout`, () => {
    return HttpResponse.json({
      ok: true,
      message: 'Logged out successfully'
    });
  }),

  // Profile handlers
  http.get(`${API_URL}/profile`, () => {
    return HttpResponse.json({
      ok: true,
      data: {
        user: {
          id: '1',
          email: 'test@example.com',
          fullName: 'Test User',
          phone: '1234567890',
          role: 'user',
          status: 'active',
          employeeId: 'EMP001'
        }
      }
    });
  }),

  http.put(`${API_URL}/users/update-profile`, async ({ request }) => {
    const body = await request.json();
    
    return HttpResponse.json({
      ok: true,
      data: {
        user: {
          id: '1',
          email: body.email || 'test@example.com',
          fullName: body.fullName || 'Test User',
          phone: body.phone || '1234567890',
          role: 'user',
          status: 'active',
          employeeId: 'EMP001'
        }
      }
    });
  }),

  // Users handlers
  http.get(`${API_URL}/users`, () => {
    return HttpResponse.json({
      ok: true,
      data: {
        users: [
          {
            id: '1',
            email: 'test@example.com',
            fullName: 'Test User',
            phone: '1234567890',
            role: 'user',
            status: 'active',
            employeeId: 'EMP001'
          },
          {
            id: '2',
            email: 'admin@example.com',
            fullName: 'Admin User',
            phone: '0987654321',
            role: 'admin',
            status: 'active',
            employeeId: 'EMP002'
          }
        ]
      }
    });
  }),

  http.get(`${API_URL}/users/:id`, ({ params }) => {
    return HttpResponse.json({
      ok: true,
      data: {
        user: {
          id: params.id,
          email: 'test@example.com',
          fullName: 'Test User',
          phone: '1234567890',
          role: 'user',
          status: 'active',
          employeeId: 'EMP001'
        }
      }
    });
  }),

  http.put(`${API_URL}/users/:id`, async ({ request, params }) => {
    const body = await request.json();
    
    return HttpResponse.json({
      ok: true,
      data: {
        user: {
          id: params.id,
          email: body.email || 'test@example.com',
          fullName: body.fullName || 'Test User',
          phone: body.phone || '1234567890',
          role: body.role || 'user',
          status: body.status || 'active',
          employeeId: body.employeeId || 'EMP001'
        }
      }
    });
  }),

  http.delete(`${API_URL}/users/:id`, ({ params }) => {
    return HttpResponse.json({
      ok: true,
      message: `User ${params.id} deleted successfully`
    });
  })
];
