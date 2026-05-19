interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <div style={{
      marginBottom: '24px',
      paddingBottom: '16px',
      borderBottom: '1px solid #e5e7eb',
    }}>
      <h1 style={{
        fontSize: '32px',
        fontWeight: 700,
        color: '#171717',
        margin: '0 0 4px 0',
        fontFamily: 'Inter, sans-serif',
      }}>
        {title}
      </h1>
      {subtitle && (
        <p style={{
          fontSize: '14px',
          color: '#727272',
          margin: '0',
          fontFamily: 'Inter, sans-serif',
        }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}