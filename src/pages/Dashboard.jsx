// src/pages/Dashboard.jsx
import React, { useRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import PassportCard from '../components/PassportCard';

const Page = React.forwardRef((props, ref) => {
  return (
    <div className="page" ref={ref} style={{
      backgroundColor: '#1f2937', 
      border: '1px solid rgba(255,255,255,0.1)',
      padding: '20px',
      color: 'white',
      boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)',
      overflow: 'hidden'
    }}>
      <div className="page-content" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {props.children}
      </div>
    </div>
  );
});

export default function Dashboard() {
  const bookRef = useRef();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '40px' }}>
      
      {/* Top Navigation Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button className="btn-glow" onClick={() => bookRef.current.pageFlip().turnToPage(1)}>Profile</button>
        <button className="btn-glow" onClick={() => bookRef.current.pageFlip().turnToPage(2)}>Stamps</button>
        <button className="btn-glow" onClick={() => bookRef.current.pageFlip().turnToPage(3)}>Skill Tree</button>
      </div>

      {/* The Flipping Book */}
      <HTMLFlipBook 
        width={350} 
        height={500} 
        size="fixed"
        minWidth={300}
        maxWidth={400}
        minHeight={400}
        maxHeight={600}
        maxShadowOpacity={0.5}
        showCover={true}
        mobileScrollSupport={true}
        ref={bookRef}
      >
        {/* Page 0: Cover */}
        <Page>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', textAlign: 'center' }}>
            <h1 style={{ color: 'var(--neon-purple)', fontSize: '32px' }}>AWS Passport</h1>
            <p style={{ color: '#aaa' }}>Murdoch University</p>
            <p style={{ marginTop: 'auto', fontSize: '12px', color: '#666' }}>Swipe or click tabs to open</p>
          </div>
        </Page>
        
        {/* Page 1: Profile & Card */}
        <Page>
          <h2 style={{ borderBottom: '2px solid var(--aws-orange)', paddingBottom: '10px', marginTop: 0 }}>Identity</h2>
          <PassportCard />
          <button style={{ marginTop: 'auto', width: '100%', padding: '10px', background: 'transparent', border: '1px solid var(--neon-blue)', color: 'var(--neon-blue)', borderRadius: '8px', cursor: 'pointer' }}>
            Download PNG
          </button>
        </Page>

        {/* Page 2: Attendance Stamps */}
        <Page>
          <h2 style={{ borderBottom: '2px solid var(--neon-pink)', paddingBottom: '10px', marginTop: 0 }}>Event Stamps</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' }}>
            <div style={{ padding: '20px 10px', border: '2px dashed var(--neon-green)', borderRadius: '50%', textAlign: 'center' }}>
              <span style={{ color: 'var(--neon-green)', fontWeight: 'bold', fontSize: '14px' }}>S3 Lab</span><br/>
              <span style={{ fontSize: '10px', color: '#aaa' }}>May 15</span>
            </div>
            <div style={{ padding: '20px 10px', border: '2px dashed #444', borderRadius: '50%', textAlign: 'center', opacity: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '12px' }}>Empty</span>
            </div>
          </div>
        </Page>

        {/* Page 3: Skill Tree */}
        <Page>
          <h2 style={{ borderBottom: '2px solid var(--neon-blue)', paddingBottom: '10px', marginTop: 0 }}>Skill Tree</h2>
          <div style={{ marginTop: '10px' }}>
            <h3 style={{ fontSize: '16px', color: '#ccc' }}>Level 1: Basics</h3>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              <li style={{ color: 'var(--neon-green)', margin: '10px 0' }}>✅ EC2 Basics (100 XP)</li>
              <li style={{ color: 'var(--neon-green)', margin: '10px 0' }}>✅ VPC Basics (100 XP)</li>
              <li style={{ color: '#666', margin: '10px 0' }}>🔒 IAM Basics</li>
            </ul>
          </div>
        </Page>
      </HTMLFlipBook>
    </div>
  );
}