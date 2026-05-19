interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CheckIn':
        return { background: '#10b981', text: '#ffffff', label: 'Checked In' };
      case 'Waiting':
        return { background: '#f59e0b', text: '#ffffff', label: 'Waiting' };
      case 'CheckedOut':
        return { background: '#8b5cf6', text: '#ffffff', label: 'Checked Out' };
      case 'ExpiredPass':
        return { background: '#ef4444', text: '#ffffff', label: 'Expired Pass' };
      case 'PendingApproval':
        return { background: '#06b6d4', text: '#ffffff', label: 'Pending Approval' };
      default:
        return { background: '#e5e7eb', text: '#171717', label: status };
    }
  };

  const colors = getStatusColor(status);

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4px 12px',
        borderRadius: '16px',
        backgroundColor: colors.background,
        color: colors.text,
        fontSize: '12px',
        fontWeight: 600,
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {colors.label}
    </span>
  );
}