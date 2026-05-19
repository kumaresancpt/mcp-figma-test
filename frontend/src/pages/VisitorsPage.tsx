import { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Card from '../components/common/Card';
import VisitorTable from '../components/visitors/VisitorTable';
import { Visitor, visitorService } from '../services/visitorService';

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedVisitorId, setSelectedVisitorId] = useState<string | null>(null);
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // Load visitors on mount and when page changes
  useEffect(() => {
    loadVisitors();
  }, [page]);

  const loadVisitors = async () => {
    try {
      setLoading(true);
      setApiError(null);
      const response = await visitorService.getVisitors(page, limit);
      
      // Defensive programming: validate response structure
      if (!response) {
        throw new Error('Empty response from server');
      }
      
      const visitorData = response.data ?? [];
      if (!Array.isArray(visitorData)) {
        console.error('Invalid visitor data format:', response);
        throw new Error('Invalid data format received from server');
      }
      
      setVisitors(visitorData);
      setTotalCount(response.total ?? 0);
      setTotalPages(response.pages ?? 1);
      
      console.log('Visitors loaded successfully:', { count: visitorData.length, total: response.total, pages: response.pages });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : (error as any)?.message || 'Failed to load visitors';
      console.error('Error loading visitors:', errorMsg);
      setApiError(errorMsg);
      setVisitors([]);
      setTotalCount(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleViewVisitor = async (visitorId: string) => {
    try {
      setApiError(null);
      const visitor = await visitorService.getVisitorById(visitorId);
      setSelectedVisitor(visitor);
      setSelectedVisitorId(visitorId);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : (error as any)?.message || 'Failed to load visitor details';
      console.error('Error viewing visitor:', errorMsg);
      setApiError(errorMsg);
    }
  };

  const handleEditVisitor = async (visitorId: string) => {
    try {
      setApiError(null);
      const visitor = await visitorService.getVisitorById(visitorId);
      setSelectedVisitor(visitor);
      setSelectedVisitorId(visitorId);
      setShowAddForm(true);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : (error as any)?.message || 'Failed to load visitor details';
      console.error('Error editing visitor:', errorMsg);
      setApiError(errorMsg);
    }
  };

  const handleAddVisitor = () => {
    setShowAddForm(true);
    setSelectedVisitorId(null);
    setSelectedVisitor(null);
    setApiError(null);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setSelectedVisitorId(null);
    setSelectedVisitor(null);
    setSuccessMessage(null);
  };

  const handleVisitorSaved = () => {
    setSuccessMessage(selectedVisitorId ? 'Visitor updated successfully!' : 'Visitor created successfully!');
    setShowAddForm(false);
    setSelectedVisitorId(null);
    setSelectedVisitor(null);
    setPage(1);
    loadVisitors();
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#faf8f5',
        padding: '32px 16px',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Header title="All Visitors" subtitle="Manage and track visitor information" />
        {successMessage && (
          <div
            style={{
              marginBottom: '24px',
              padding: '16px 20px',
              backgroundColor: '#d1fae5',
              borderLeft: '4px solid #10b981',
              borderRadius: '8px',
              color: '#065f46',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>{successMessage}</span>
            <button
              onClick={() => setSuccessMessage(null)}
              style={{
                background: 'none',
                border: 'none',
                color: '#065f46',
                fontSize: '18px',
                cursor: 'pointer',
                padding: '0',
              }}
            >
              ✕
            </button>
          </div>
        )}
        {apiError && (
          <div
            style={{
              marginBottom: '24px',
              padding: '16px 20px',
              backgroundColor: '#fee2e2',
              borderLeft: '4px solid #ef4444',
              borderRadius: '8px',
              color: '#991b1b',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>{apiError}</span>
            <button
              onClick={() => setApiError(null)}
              style={{
                background: 'none',
                border: 'none',
                color: '#991b1b',
                fontSize: '18px',
                cursor: 'pointer',
                padding: '0',
              }}
            >
              ✕
            </button>
          </div>
        )}
        <div style={{ marginBottom: '24px' }}>
          <button
            onClick={handleAddVisitor}
            disabled={loading}
            style={{
              padding: '12px 24px',
              backgroundColor: loading ? '#d1d5db' : '#5B21B6',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              fontFamily: 'Inter, sans-serif',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = '#7c3aed';
            }}
            onMouseLeave={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = '#5B21B6';
            }}
          >
            + Add Visitor
          </button>
        </div>
        {showAddForm && (
          <Card>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <h2
                style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  color: '#171717',
                  margin: '0',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {selectedVisitorId ? 'Edit Visitor' : 'Add New Visitor'}
              </h2>
              <button
                onClick={handleCloseForm}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#727272',
                }}
              >
                ✕
              </button>
            </div>
            <div
              style={{
                padding: '24px',
                backgroundColor: '#faf8f5',
                borderRadius: '8px',
                color: '#727272',
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Form fields would be rendered here (Name, Email, Phone, Company, Purpose, Check-in Time)
              <br />
              <button
                onClick={handleCloseForm}
                style={{
                  marginTop: '16px',
                  padding: '8px 16px',
                  backgroundColor: '#e5e7eb',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 600,
                  fontFamily: 'Inter, sans-serif',
                  cursor: 'pointer',
                }}
              >
                Close Form
              </button>
            </div>
          </Card>
        )}
        <Card>
          {loading ? (
            <div
              style={{
                padding: '40px 24px',
                textAlign: 'center',
                color: '#727272',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Loading visitors...
            </div>
          ) : (
            <VisitorTable
              data={visitors}
              total={totalCount}
              pages={totalPages}
              page={page}
              limit={limit}
              onPageChange={setPage}
              onViewVisitor={handleViewVisitor}
              onEditVisitor={handleEditVisitor}
              onVisitorSaved={handleVisitorSaved}
            />
          )}
        </Card>
        <Footer />
      </div>
    </div>
  );
}