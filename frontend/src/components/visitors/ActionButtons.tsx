import { useState } from 'react';
import { visitorService } from '../../services/visitorService';

interface ActionButtonsProps {
  visitorId: string;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function ActionButtons({ visitorId, onView, onEdit, onDelete }: ActionButtonsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleView = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await visitorService.getVisitorById(visitorId);
      onView(visitorId);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : (err as any)?.message || 'Failed to load visitor';
      setError(errorMsg);
      console.error('Failed to view visitor:', errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await visitorService.getVisitorById(visitorId);
      onEdit(visitorId);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : (err as any)?.message || 'Failed to load visitor';
      setError(errorMsg);
      console.error('Failed to edit visitor:', errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      setError(null);
      if (onDelete) {
        onDelete(visitorId);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : (err as any)?.message || 'Failed to delete visitor';
      setError(errorMsg);
      console.error('Failed to delete visitor:', errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      {error && (
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            whiteSpace: 'nowrap',
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '11px',
            marginBottom: '4px',
            zIndex: 10,
          }}
        >
          {error}
        </div>
      )}
      <button
        onClick={handleView}
        disabled={isLoading}
        aria-label="View visitor"
        title="View"
        style={{
          background: 'none',
          border: 'none',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#5B21B6',
          fontSize: '18px',
          opacity: isLoading ? 0.6 : 1,
          transition: 'opacity 0.2s',
        }}
      >
        👁️
      </button>
      <button
        onClick={handleEdit}
        disabled={isLoading}
        aria-label="Edit visitor"
        title="Edit"
        style={{
          background: 'none',
          border: 'none',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#5B21B6',
          fontSize: '18px',
          opacity: isLoading ? 0.6 : 1,
          transition: 'opacity 0.2s',
        }}
      >
        ✏️
      </button>
      {onDelete && (
        <button
          onClick={handleDelete}
          disabled={isLoading}
          aria-label="Delete visitor"
          title="Delete"
          style={{
            background: 'none',
            border: 'none',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ef4444',
            fontSize: '18px',
            opacity: isLoading ? 0.6 : 1,
            transition: 'opacity 0.2s',
          }}
        >
          🗑️
        </button>
      )}
    </div>
  );
}