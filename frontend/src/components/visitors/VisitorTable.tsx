import { useState } from 'react';
import VisitorTableHeader from './VisitorTableHeader';
import VisitorTableRow from './VisitorTableRow';
import { Visitor, visitorService } from '../../services/visitorService';

interface VisitorTableProps {
  data?: Visitor[];
  total?: number;
  pages?: number;
  page?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
  onViewVisitor?: (id: string) => void;
  onEditVisitor?: (id: string) => void;
  onDeleteVisitor?: (id: string) => void;
  onVisitorSaved?: () => void;
}

export default function VisitorTable({
  data = [],
  total = 0,
  pages = 1,
  page = 1,
  limit = 10,
  onPageChange,
  onViewVisitor,
  onEditVisitor,
  onDeleteVisitor,
  onVisitorSaved,
}: VisitorTableProps) {
  const [error, setError] = useState<string | null>(null);

  const handleDeleteVisitor = async (visitorId: string) => {
    if (window.confirm('Are you sure you want to delete this visitor?')) {
      try {
        setError(null);
        await visitorService.deleteVisitor(visitorId);
        onDeleteVisitor?.(visitorId);
        onVisitorSaved?.();
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : (err as any)?.message || 'Failed to delete visitor';
        console.error('Error deleting visitor:', errorMsg);
        setError(errorMsg);
      }
    }
  };

  const visitors = Array.isArray(data) ? data : [];
  const totalPages = Math.max(1, pages || 1);
  const currentPage = Math.max(1, page || 1);

  if (error) {
    return (
      <div
        style={{
          padding: '24px',
          backgroundColor: '#fee2e2',
          borderRadius: '8px',
          color: '#991b1b',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <strong>Error:</strong> {error}
        <button
          onClick={() => setError(null)}
          style={{
            marginLeft: '16px',
            padding: '6px 12px',
            backgroundColor: '#f87171',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          Dismiss
        </button>
      </div>
    );
  }

  return (
    <div>
      {visitors && visitors.length > 0 ? (
        <>
          <div
            style={{
              overflowX: 'auto',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
            }}
          >
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              <VisitorTableHeader />
              <tbody>
                {visitors.map((visitor) => {
                  if (!visitor || !visitor.id) {
                    console.warn('Invalid visitor data:', visitor);
                    return null;
                  }
                  
                  return (
                    <VisitorTableRow
                      key={visitor.id}
                      visitor={visitor}
                      onView={onViewVisitor || (() => {})}
                      onEdit={onEditVisitor || (() => {})}
                      onDelete={handleDeleteVisitor}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '24px',
              fontSize: '14px',
              color: '#727272',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            <span>
              Showing {visitors.length > 0 ? (currentPage - 1) * limit + 1 : 0} to {Math.min(currentPage * limit, total)} of {total} visitors
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  backgroundColor: currentPage === 1 ? '#e5e7eb' : '#5B21B6',
                  color: currentPage === 1 ? '#727272' : '#ffffff',
                  border: 'none',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                Previous
              </button>
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 12px',
                }}
              >
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  backgroundColor: currentPage === totalPages ? '#e5e7eb' : '#5B21B6',
                  color: currentPage === totalPages ? '#727272' : '#ffffff',
                  border: 'none',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                Next
              </button>
            </div>
          </div>
        </>
      ) : (
        <div
          style={{
            padding: '40px 24px',
            textAlign: 'center',
            color: '#727272',
            fontFamily: 'Inter, sans-serif',
            backgroundColor: '#faf8f5',
            borderRadius: '8px',
          }}
        >
          No visitors found. Click "Add Visitor" to create one.
        </div>
      )}
    </div>
  );
}