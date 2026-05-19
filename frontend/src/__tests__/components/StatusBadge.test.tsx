import { render, screen } from '@testing-library/react';
import StatusBadge from '../../components/visitors/StatusBadge';

describe('StatusBadge', () => {
  it('displays green background for "CheckIn" status', () => {
    const { container } = render(<StatusBadge status="CheckIn" />);
    
    const badge = container.querySelector('span');
    expect(badge).toHaveStyle('backgroundColor: #10b981');
    expect(screen.getByText('Checked In')).toBeInTheDocument();
  });

  it('displays orange background for "Waiting" status', () => {
    const { container } = render(<StatusBadge status="Waiting" />);
    
    const badge = container.querySelector('span');
    expect(badge).toHaveStyle('backgroundColor: #f59e0b');
    expect(screen.getByText('Waiting')).toBeInTheDocument();
  });

  it('displays purple background for "CheckedOut" status', () => {
    const { container } = render(<StatusBadge status="CheckedOut" />);
    
    const badge = container.querySelector('span');
    expect(badge).toHaveStyle('backgroundColor: #8b5cf6');
    expect(screen.getByText('Checked Out')).toBeInTheDocument();
  });

  it('displays red background for "ExpiredPass" status', () => {
    const { container } = render(<StatusBadge status="ExpiredPass" />);
    
    const badge = container.querySelector('span');
    expect(badge).toHaveStyle('backgroundColor: #ef4444');
    expect(screen.getByText('Expired Pass')).toBeInTheDocument();
  });

  it('shows correct status text label for PendingApproval', () => {
    render(<StatusBadge status="PendingApproval" />);
    
    expect(screen.getByText('Pending Approval')).toBeInTheDocument();
  });

  it('badge has correct styling properties', () => {
    const { container } = render(<StatusBadge status="CheckIn" />);
    
    const badge = container.querySelector('span');
    expect(badge).toHaveStyle('display: inline-flex');
    expect(badge).toHaveStyle('alignItems: center');
    expect(badge).toHaveStyle('justifyContent: center');
    expect(badge).toHaveStyle('padding: 4px 12px');
    expect(badge).toHaveStyle('borderRadius: 16px');
    expect(badge).toHaveStyle('fontSize: 12px');
    expect(badge).toHaveStyle('fontWeight: 600');
    expect(badge).toHaveStyle('color: #ffffff');
  });
});