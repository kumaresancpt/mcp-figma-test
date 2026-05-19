import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import VisitorsPage from '../../pages/VisitorsPage';
import * as visitorService from '../../services/visitorService';

jest.mock('../../services/visitorService');

const mockVisitors = [
  {
    id: '1',
    name: 'John Doe',
    company: 'Tech Corp',
    host: 'Jane Smith',
    purpose: 'Meeting',
    checkInTime: '2026-05-19T10:00:00Z',
    checkOutTime: undefined,
    status: 'CheckIn',
    badge: 'BadgePrinted',
    email: 'john@example.com',
    phoneNumber: '555-0001',
    notes: 'Test visitor',
    createdAt: '2026-05-19T10:00:00Z',
    updatedAt: '2026-05-19T10:00:00Z',
  },
];

describe('VisitorsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (visitorService.visitorService.getVisitors as jest.Mock).mockResolvedValue({
      data: mockVisitors,
      total: 1,
      page: 1,
      pages: 1,
    });
  });

  it('renders page title "All Visitors"', async () => {
    render(
      <MemoryRouter>
        <VisitorsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('All Visitors')).toBeInTheDocument();
    });
  });

  it('renders "Add Visitor" button', async () => {
    render(
      <MemoryRouter>
        <VisitorsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      const addButton = screen.getByRole('button', { name: /Add Visitor/i });
      expect(addButton).toBeInTheDocument();
    });
  });

  it('fetches and displays visitor data on component mount', async () => {
    render(
      <MemoryRouter>
        <VisitorsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(visitorService.visitorService.getVisitors).toHaveBeenCalled();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  it('displays loading state while fetching', () => {
    (visitorService.visitorService.getVisitors as jest.Mock).mockImplementationOnce(
      () => new Promise(() => {})
    );

    render(
      <MemoryRouter>
        <VisitorsPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Loading visitors...')).toBeInTheDocument();
  });

  it('displays error message on API failure', async () => {
    (visitorService.visitorService.getVisitors as jest.Mock).mockRejectedValueOnce(
      new Error('Failed to fetch visitors')
    );

    render(
      <MemoryRouter>
        <VisitorsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch visitors')).toBeInTheDocument();
    });
  });

  it('handles pagination correctly', async () => {
    render(
      <MemoryRouter>
        <VisitorsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Showing 1 to/i)).toBeInTheDocument();
      expect(screen.getByText(/Page 1 of/i)).toBeInTheDocument();
    });
  });

  it('opens Add Visitor form when button is clicked', async () => {
    render(
      <MemoryRouter>
        <VisitorsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      const addButton = screen.getByRole('button', { name: /Add Visitor/i });
      expect(addButton).toBeInTheDocument();
    });

    const addButton = screen.getByRole('button', { name: /Add Visitor/i });
    addButton.click();

    await waitFor(() => {
      expect(screen.getByText('Add New Visitor')).toBeInTheDocument();
    });
  });
});