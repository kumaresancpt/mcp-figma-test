export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      marginTop: '48px',
      paddingTop: '24px',
      borderTop: '1px solid #e5e7eb',
      textAlign: 'center',
      fontSize: '12px',
      color: '#727272',
      fontFamily: 'Inter, sans-serif',
    }}>
      <p style={{ margin: '0' }}>
        &copy; {currentYear} Visitor Management System. All rights reserved.
      </p>
    </footer>
  );
}