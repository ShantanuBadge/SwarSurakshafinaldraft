import React from 'react';
import { Shield, Activity, Radio, Cpu, Lock, CheckCircle2 } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, systemStatus }) {
  return (
    <header className="glass-panel" style={{ margin: '16px 24px 20px 24px', padding: '16px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Logo & Branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            position: 'relative',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0284c7 0%, #0f172a 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            boxShadow: '0 0 20px rgba(56, 189, 248, 0.35)'
          }}>
            <Shield size={26} color="#38bdf8" />
            <Radio size={14} color="#10b981" style={{ position: 'absolute', bottom: '6px', right: '6px' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '1.45rem', fontWeight: '800', letterSpacing: '-0.02em', background: 'linear-gradient(to right, #ffffff, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                SwarSuraksha <span style={{ fontSize: '0.95rem', fontWeight: '500', color: '#94a3b8' }}>(स्वर सुरक्षा)</span>
              </h1>
              <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
                SIH 2026 • PS #26104
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>
              Real-Time AI Voice Clone & Impersonation Attack Prevention Engine
            </p>
          </div>
        </div>

        {/* Engine Live Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(15, 23, 42, 0.8)',
            padding: '6px 14px',
            borderRadius: '20px',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            fontSize: '0.8rem'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              boxShadow: '0 0 8px #10b981'
            }}></span>
            <span style={{ color: '#f8fafc', fontWeight: '600' }}>Engine: Active</span>
            <span style={{ color: '#64748b' }}>|</span>
            <span style={{ color: '#38bdf8' }}>ONNX Runtime 1.30</span>
            <span style={{ color: '#64748b' }}>|</span>
            <span style={{ color: '#94a3b8' }}>~14ms Latency</span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(16, 185, 129, 0.12)',
            color: '#34d399',
            padding: '6px 12px',
            borderRadius: '20px',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            fontSize: '0.8rem',
            fontWeight: '600'
          }}>
            <Lock size={13} />
            <span>Edge On-Device (Zero Audio Leakage)</span>
          </div>
        </div>

      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '14px', flexWrap: 'wrap' }}>
        {[
          { id: 'live', label: '🛡️ Live Call Shield', desc: 'Real-time Mic & Telephony Stream' },
          { id: 'forensic', label: '🔬 Forensic Audio Inspector', desc: 'Deep Biomarker & Spectrogram' },
          { id: 'ledger', label: '⛓️ Blockchain Audit Ledger', desc: 'Tamper-Evident SHA-256 Blocks' },
          { id: 'soc', label: '🏢 Enterprise SOC Monitor', desc: 'Contact Center Queue & Scenarios' }
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: isActive ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.35) 0%, rgba(15, 23, 42, 0.8) 100%)' : 'rgba(15, 23, 42, 0.4)',
                border: isActive ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '10px',
                padding: '8px 16px',
                color: isActive ? '#38bdf8' : '#94a3b8',
                fontWeight: isActive ? '700' : '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.85rem',
                boxShadow: isActive ? '0 0 16px rgba(56, 189, 248, 0.25)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
