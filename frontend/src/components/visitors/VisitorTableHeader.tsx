interface VisitorTableHeaderProps {
  onSortChange?: (field: string) => void;
}

export default function VisitorTableHeader({ onSortChange }: VisitorTableHeaderProps) {
  return (
    <thead>
      <tr
        style={{
          backgroundColor: '#faf8f5',
          borderBottom: '2px solid #e5e7eb',
        }}
      >
        <th
          onClick={() => onSortChange?.('name')}
          style={{
            padding: '16px',
            textAlign: 'left',
            fontSize: '12px',
            fontWeight: 600,
            color: '#171717',
            fontFamily: 'Inter, sans-serif',
            cursor: onSortChange ? 'pointer' : 'default',
            userSelect: 'none',
          }}
        >
          Name
        </th>
        <th
          onClick={() => onSortChange?.('email')}
          style={{
            padding: '16px',
            textAlign: 'left',
            fontSize: '12px',
            fontWeight: 600,
            color: '#171717',
            fontFamily: 'Inter, sans-serif',
            cursor: onSortChange ? 'pointer' : 'default',
            userSelect: 'none',
          }}
        >
          Email
        </th>
        <th
          style={{
            padding: '16px',
            textAlign: 'left',
            fontSize: '12px',
            fontWeight: 600,
            color: '#171717',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Phone
        </th>
        <th
          style={{
            padding: '16px',
            textAlign: 'left',
            fontSize: '12px',
            fontWeight: 600,
            color: '#171717',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Company
        </th>
        <th
          style={{
            padding: '16px',
            textAlign: 'left',
            fontSize: '12px',
            fontWeight: 600,
            color: '#171717',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Purpose
        </th>
        <th
          style={{
            padding: '16px',
            textAlign: 'left',
            fontSize: '12px',
            fontWeight: 600,
            color: '#171717',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Check-In
        </th>
        <th
          style={{
            padding: '16px',
            textAlign: 'left',
            fontSize: '12px',
            fontWeight: 600,
            color: '#171717',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Status
        </th>
        <th
          style={{
            padding: '16px',
            textAlign: 'center',
            fontSize: '12px',
            fontWeight: 600,
            color: '#171717',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Actions
        </th>
      </tr>
    </thead>
  );
}