import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import VisitorTable from '../../components/visitors/VisitorTable';
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
  {
    id: '2',
    name: 'Jane Smith',
    company: 'Design Inc',
    host: 'John Doe',
    purpose: 'Presentation',
    checkInTime: '2026-05-19T11:00:00Z',
    checkOutTime: undefined,
    status: 'Waiting',
    badge: 'NoBadge',
    email: 'jane@example.com',
    phoneNumber: '555-0002',
    notes: 'Another test',
    createdAt: '2026-05-19T11:00:00Z',
    updatedAt: '2026-05-19T11:00:00Z',
  },
];

describe('VisitorTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders table headers correctly', () => {
    render(
      <MemoryRouter>
        <VisitorTable data={mockVisitors} />
      </MemoryRouter>
    );

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Phone')).toBeInTheDocument();
    expect(screen.getByText('Company')).toBeInTheDocument();
    expect(screen.getByText('Purpose')).toBeInTheDocument();
    expect(screen.getByText('Check-In')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('renders visitor rows with data', () => {
    render(
      <MemoryRouter>
        <VisitorTable data={mockVisitors} />
      </MemoryRouter>
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('Tech Corp')).toBeInTheDocument();
    expect(screen.getByText('Design Inc')).toBeInTheDocument();
  });

  it('displays correct number of rows', () => {
    render(
      <MemoryRouter>
        <VisitorTable data={mockVisitors} />
      </MemoryRouter>
    );

    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(3);
  });

  it('applies header background color correctly', () => {
    const { container } = render(
      <MemoryRouter>
        <VisitorTable data={mockVisitors} />
      </MemoryRouter>
    );

    const thead = container.querySelector('thead');
    const headerRow = thead?.querySelector('tr');
    
    expect(headerRow).toHaveStyle('backgroundColor: #faf8f5');
  });

  it('rows have proper borders and spacing', () => {
    const { container } = render(
      <MemoryRouter>
        <VisitorTable data={mockVisitors} />
      </MemoryRouter>
    );

    const tbody = container.querySelector('tbody');
    const dataRows = tbody?.querySelectorAll('tr');
    
    dataRows?.forEach((row) => {
      expect(row).toHaveStyle('borderBottom: 1px solid #e5e7eb');
      expect(row).toHaveStyle('backgroundColor: #ffffff');
    });
  });
});