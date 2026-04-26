// src/pages/Dashboard.jsx
import React, { useRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import Passport from './Passport';
import Checkin from './Checkin';
import Stamps from './Stamps';
import SkillTree from './SkillTree';
import { supabase } from '../lib/supabase';

// The High-Quality Physical White Page Wrapper
const Page = React.forwardRef((props, ref) => {
  return (
    <div className="page" ref={ref} style={{
      backgroundColor: '#ffffff', // Solid white paper
      color: '#0f172a',           // Dark text for contrast
      border: '1px solid #e2e8f0',
      boxShadow: 'inset 0 0 30px rgba(0,0,0,0.05)',
      overflowY: 'auto',
      overflowX: 'hidden',
      position: 'relative',
      height: '100%',
      display: 'block'
    }}>
      {/* Spine shadow for the 3D fold effect on interior pages */}
      <div style={{
        position: 'absolute', top: 0, bottom: 0, left: 0, width: '40px',
        background: 'linear-gradient(to right, rgba(0,0,0,0.08), transparent)',
        pointerEvents: 'none', zIndex: 10
      }} />
      <div className="page-content" style={{ height: '100%', padding: '30px', position: 'relative', zIndex: 1 }}>
        {props.children}
      </div>
    </div>
  );
});

export default function Dashboard({ user }) {
  const bookRef = useRef();

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      paddingTop: '40px', 
      height: '100vh',
      width: '100%',
      background: '#0b1120', // Dark cinematic background
      overflow: 'hidden'
    }}>
      
      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '40px', flexWrap: 'wrap', justifyContent: 'center', zIndex: 100 }}>
        <button className="btn-glow" onClick={() => bookRef.current.pageFlip().turnToPage(2)}>Profile</button>
        <button className="btn-glow" onClick={() => bookRef.current.pageFlip().turnToPage(4)}>Scanner & Stamps</button>
        <button className="btn-glow" onClick={() => bookRef.current.pageFlip().turnToPage(6)}>Skill Tree</button>
        <button 
          className="btn-outline" 
          style={{ borderColor: '#ff4444', color: '#ff4444', background: 'rgba(255, 68, 68, 0.05)' }}
          onClick={() => supabase.auth.signOut()}
        >
          Logout
        </button>
      </div>

      {/* THE BOOK CONTAINER */}
      <div style={{ 
        boxShadow: '0 50px 100px rgba(0,0,0,0.6), 0 15px 35px rgba(0,0,0,0.3)', 
        borderRadius: '8px',
        background: '#ffffff',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <HTMLFlipBook 
          width={550}               // Width of a SINGLE page
          height={733}              // Height of the book
          size="stretch"            
          minWidth={315}
          maxWidth={1000}
          minHeight={420}
          maxHeight={1333}
          maxShadowOpacity={0.5}
          showCover={true}          // Page 0 (Cover) is single and centered
          mobileScrollSupport={true}
          usePortrait={false}       // Forces 2-page spread for the interior
          startPage={0}
          drawShadow={true}
          flippingTime={1000}
          useMouseEvents={true}
          ref={bookRef}
          style={{ backgroundColor: '#ffffff', borderRadius: '0 8px 8px 0' }} 
        >
          {/* PAGE 0: FRONT COVER (Single Page when closed) */}
          <div className="page" style={{ 
            background: '#0a0f18', 
            borderRight: '5px solid #1e293b', 
            color: 'white', 
            borderRadius: '0 8px 8px 0',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: '40px'
          }}>
            <div style={{ fontSize: '90px', marginBottom: '20px' }}>☁️</div>
            <h1 style={{ color: '#FF9900', fontSize: '38px', fontWeight: '900', margin: '0 0 5px 0' }}>AWS CLOUD CLUB</h1>
            <h2 style={{ color: '#fff', fontSize: '16px', letterSpacing: '8px', margin: 0, opacity: 0.8 }}>E-PASSPORT</h2>
            <div style={{ marginTop: 'auto', color: '#475569', fontSize: '12px', fontWeight: 'bold' }}>
              CLICK TABS OR SWIPE CORNERS TO OPEN
            </div>
          </div>
          
          {/* PAGE 1: INSIDE COVER (Left side of first spread) */}
          <Page>
            <div style={{ padding: '20px', color: '#94a3b8', fontSize: '14px', textAlign: 'center', marginTop: '80px', border: '1px dashed #e2e8f0', borderRadius: '12px' }}>
              <p style={{ fontWeight: '900', color: '#64748b', marginBottom: '15px', letterSpacing: '0.1em' }}>OFFICIAL RECORD</p>
              <p>This e-Passport is an official digital credential of the AWS Cloud Club at Murdoch University Dubai.</p>
              <p style={{ marginTop: '20px' }}>Your attendance, skills, and achievements are tracked live via AWS infrastructure.</p>
            </div>
          </Page>

          {/* PAGE 2: PROFILE (Right side of first spread) */}
          <Page>
            <h2 style={{ fontSize: '24px', color: '#0f172a', fontWeight: '900', borderBottom: '3px solid #f1f5f9', paddingBottom: '12px', marginTop: 0 }}>IDENTITY DETAILS</h2>
            <Passport user={user} />
          </Page>

          {/* PAGE 3: VISA ENTRY (Left side of second spread) */}
          <Page>
            <h2 style={{ fontSize: '24px', color: '#0f172a', fontWeight: '900', borderBottom: '3px solid #f1f5f9', paddingBottom: '12px', marginTop: 0 }}>VISA ENTRY</h2>
            <Checkin user={user} />
          </Page>

          {/* PAGE 4: ENTRY STAMPS (Right side of second spread) */}
          <Page>
            <h2 style={{ fontSize: '24px', color: '#0f172a', fontWeight: '900', borderBottom: '3px solid #f1f5f9', paddingBottom: '12px', marginTop: 0 }}>ENTRY STAMPS</h2>
            <Stamps user={user} />
          </Page>

          {/* PAGE 5: MASTERY MAP Pt 1 (Left side of third spread) */}
          <Page>
            <h2 style={{ fontSize: '24px', color: '#0f172a', fontWeight: '900', borderBottom: '3px solid #f1f5f9', paddingBottom: '12px', marginTop: 0 }}>MASTERY MAP (I)</h2>
            <SkillTree user={user} tracksToShow={['Compute', 'Networking']} />
          </Page>

          {/* PAGE 6: MASTERY MAP Pt 2 (Right side of third spread) */}
          <Page>
            <h2 style={{ fontSize: '24px', color: '#0f172a', fontWeight: '900', borderBottom: '3px solid #f1f5f9', paddingBottom: '12px', marginTop: 0 }}>MASTERY MAP (II)</h2>
            <SkillTree user={user} tracksToShow={['Security', 'AI/ML']} />
          </Page>

        </HTMLFlipBook>
      </div>
    </div>
  );
}