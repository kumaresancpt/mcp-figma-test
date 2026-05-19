import StatusBadge from './StatusBadge';
import ActionButtons from './ActionButtons';
import { Visitor } from '../../services/visitorService';

interface VisitorTableRowProps {
  visitor: Visitor;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function VisitorTableRow({ visitor, onView, onEdit, onDelete }: VisitorTableRowProps) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch {
      return dateString;
    }
  };

  return (
    <tr
      style={{
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: '#ffffff',
      }}
    >
      <td
        style={{
          padding: '16px',
          fontSize: '14px',
          color: '#171717',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {visitor.name}
      </td>
      <td
        style={{
          padding: '16px',
          fontSize: '14px',
          color: '#727272',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {visitor.email || '-'}
      </td>
      <td
        style={{
          padding: '16px',
          fontSize: '14px',
          color: '#727272',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {visitor.phoneNumber || '-'}
      </td>
      <td
        style={{
          padding: '16px',
          fontSize: '14px',
          color: '#727272',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {visitor.company}
      </td>
      <td
        style={{
          padding: '16px',
          fontSize: '14px',
          color: '#727272',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {visitor.purpose || '-'}
      </td>
      <td
        style={{
          padding: '16px',
          fontSize: '14px',
          color: '#727272',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {formatDate(visitor.checkInTime)}
      </td>
      <td
        style={{
          padding: '16px',
        }}
      >
        <StatusBadge status={visitor.status} />
      </td>
      <td
        style={{
          padding: '16px',
        }}
      >
        <ActionButtons
          visitorId={visitor.id}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </td>
    </tr>
  );
}