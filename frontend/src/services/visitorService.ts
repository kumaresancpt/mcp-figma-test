const API_BASE_URL = '/api';

export interface Visitor {
  id: string;
  name: string;
  company: string;
  host: string;
  purpose?: string;
  checkInTime: string;
  checkOutTime?: string;
  status: string;
  badge: string;
  visitorImage?: string;
  phoneNumber?: string;
  email?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetVisitorsResponse {
  data: Visitor[];
  total: number;
  page: number;
  pages: number;
}

export interface VisitorServiceError {
  message: string;
  code?: string;
}

class VisitorService {
  private getAuthHeader(): { 'Content-Type': string; 'Authorization'?: string } {
    const token = localStorage.getItem('accessToken');
    const headers: { 'Content-Type': string; 'Authorization'?: string } = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async getVisitors(page: number = 1, limit: number = 10): Promise<GetVisitorsResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/visitors?page=${page}&limit=${limit}`,
        {
          method: 'GET',
          headers: this.getAuthHeader(),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          await this.handleUnauthorized();
          return this.getVisitors(page, limit);
        }
        const errorData = await response.json().catch(() => ({ detail: 'Failed to fetch visitors' }));
        throw new Error(errorData.detail || `Failed to fetch visitors: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw { message: errorMessage } as VisitorServiceError;
    }
  }

  async getVisitorById(visitorId: string): Promise<Visitor> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/visitors/${visitorId}`,
        {
          method: 'GET',
          headers: this.getAuthHeader(),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          await this.handleUnauthorized();
          return this.getVisitorById(visitorId);
        }
        const errorData = await response.json().catch(() => ({ detail: 'Failed to fetch visitor' }));
        throw new Error(errorData.detail || `Failed to fetch visitor: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw { message: errorMessage } as VisitorServiceError;
    }
  }

  async createVisitor(visitorData: Omit<Visitor, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'badge'>): Promise<Visitor> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/visitors`,
        {
          method: 'POST',
          headers: this.getAuthHeader(),
          body: JSON.stringify(visitorData),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          await this.handleUnauthorized();
          return this.createVisitor(visitorData);
        }
        const errorData = await response.json().catch(() => ({ detail: 'Failed to create visitor' }));
        throw new Error(errorData.detail || `Failed to create visitor: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw { message: errorMessage } as VisitorServiceError;
    }
  }

  async updateVisitor(visitorId: string, visitorData: Partial<Omit<Visitor, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Visitor> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/visitors/${visitorId}`,
        {
          method: 'PUT',
          headers: this.getAuthHeader(),
          body: JSON.stringify(visitorData),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          await this.handleUnauthorized();
          return this.updateVisitor(visitorId, visitorData);
        }
        const errorData = await response.json().catch(() => ({ detail: 'Failed to update visitor' }));
        throw new Error(errorData.detail || `Failed to update visitor: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw { message: errorMessage } as VisitorServiceError;
    }
  }

  async deleteVisitor(visitorId: string): Promise<void> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/visitors/${visitorId}`,
        {
          method: 'DELETE',
          headers: this.getAuthHeader(),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          await this.handleUnauthorized();
          return this.deleteVisitor(visitorId);
        }
        const errorData = await response.json().catch(() => ({ detail: 'Failed to delete visitor' }));
        throw new Error(errorData.detail || `Failed to delete visitor: ${response.statusText}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw { message: errorMessage } as VisitorServiceError;
    }
  }

  private async handleUnauthorized(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return;
      }

      const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return;
      }

      const data = await response.json();
      localStorage.setItem('accessToken', data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
  }
}

export const visitorService = new VisitorService();