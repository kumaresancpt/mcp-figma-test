import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ActionButtons from '../../components/visitors/ActionButtons';
import * as visitorService from '../../services/visitorService';

jest.mock('../../services/visitorService');

const mockVisitorData = {
  id: 'test-id',
  name: 'Test Visitor',
  company: 'Test Company',
  host: 'Test Host',
  purpose: 'Test Purpose',
  checkInTime: '2026-05-19T10:00:00Z',
  status: 'CheckIn',
  badge: 'BadgePrinted',
  email: 'test@example.com',
  phoneNumber: '555-0001',
  notes: 'Test note',
  createdAt: '2026-05-19T10:00:00Z',
  updatedAt: '2026-05-19T10:00:00Z',
};

describe('ActionButtons', () => {
  const mockOnView = jest.fn();
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (visitorService.visitorService.getVisitorById as jest.Mock).mockResolvedValue(mockVisitorData);
  });

  it('renders view icon', () => {
    render(
      <MemoryRouter>
        <ActionButtons visitorId="test-id" onView={mockOnView} onEdit={mockOnEdit} />
      </MemoryRouter>
    );

    const viewButtons = screen.getAllByRole('button');
    expect(viewButtons[0]).toHaveAttribute('aria-label', 'View visitor');
  });

  it('renders edit icon', () => {
    render(
      <MemoryRouter>
        <ActionButtons visitorId="test-id" onView={mockOnView} onEdit={mockOnEdit} />
      </MemoryRouter>
    );

    const editButtons = screen.getAllByRole('button');
    expect(editButtons[1]).toHaveAttribute('aria-label', 'Edit visitor');
  });

  it('view button is clickable and calls handler', async () => {
    render(
      <MemoryRouter>
        <ActionButtons visitorId="test-id" onView={mockOnView} onEdit={mockOnEdit} />
      </MemoryRouter>
    );

    const viewButton = screen.getByLabelText('View visitor');
    fireEvent.click(viewButton);

    await waitFor(() => {
      expect(visitorService.visitorService.getVisitorById).toHaveBeenCalledWith('test-id');
      expect(mockOnView).toHaveBeenCalledWith('test-id');
    });
  });

  it('edit button is clickable and calls handler', async () => {
    render(
      <MemoryRouter>
        <ActionButtons visitorId="test-id" onView={mockOnView} onEdit={mockOnEdit} />
      </MemoryRouter>
    );

    const editButton = screen.getByLabelText('Edit visitor');
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(visitorService.visitorService.getVisitorById).toHaveBeenCalledWith('test-id');
      expect(mockOnEdit).toHaveBeenCalledWith('test-id');
    });
  });

  it('delete button is clickable and calls handler when provided', async () => {
    render(
      <MemoryRouter>
        <ActionButtons
          visitorId="test-id"
          onView={mockOnView}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      </MemoryRouter>
    );

    const deleteButton = screen.getByLabelText('Delete visitor');
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveStyle('color: #ef4444');

    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockOnDelete).toHaveBeenCalledWith('test-id');
    });
  });
});