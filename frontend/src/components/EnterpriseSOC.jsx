import React, { useState } from 'react';
import { ShieldAlert, TrendingUp, DollarSign, Clock, Users, Building, Landmark, PhoneCall, AlertOctagon, CheckCircle2, ChevronRight, ShieldCheck } from 'lucide-react';

export default function EnterpriseSOC({ onSelectScenario }) {
  const [selectedSector, setSelectedSector] = useState('all');

  const simulatedQueue = [
    {
      id: 'CALL-9041',
      agent: 'Priya Sharma (Desk 04)',
      caller: 'Deepfake CFO Voice (Arup Pattern)',
      sector: 'corporate',
      sectorLabel: 'Corporate Approvals',
      amount: '₹25,60,00,000',
      duration: '42s',
      risk: 88,
      status: 'BLOCKED_TRANSACTION',
      badge: 'CRITICAL ATTACK'
    },
    {
      id: 'CALL-9042',
      agent: 'Aakash Verma (Desk 12)',
      caller: 'Rajesh Sharma (Savings A/c)',
      sector: 'banking',
      sectorLabel: 'Banking Operations',
      amount: '₹25,000',
      duration: '1m 18s',
      risk: 11,
      status: 'VERIFIED_GENUINE',
      badge: 'AUTHENTIC'
    },
    {
      id: 'CALL-9043',
      agent: 'Meera Iyer (Desk 08)',
      caller: 'Telecom Impersonation Bot',
      sector: 'government',
      sectorLabel: 'Government Helplines',
      amount: '₹1,50,000',
      duration: '29s',
      risk: 62,
      status: 'MFA_CHALLENGE_ISSUED',
      badge: 'ELEVATED'
    },
    {
      id: 'CALL-9044',
      agent: 'Siddharth Roy (Desk 01)',
      caller: 'Dr. Sunita Sen (Managing Director)',
      sector: 'corporate',
      sectorLabel: 'Corporate Approvals',
      amount: '₹8,00,000',
      duration: '2m 04s',
      risk: 9,
      status: 'VERIFIED_GENUINE',
      badge: 'AUTHENTIC'
    },
    {
      id: 'CALL-9045',
      agent: 'Neha Gupta (Desk 19)',
      caller: 'Voice Cloned Relative (Kidnap Scam)',
      sector: 'government',
      sectorLabel: 'Citizen Grievance Helpline',
      amount: '₹3,00,000',
      duration: '35s',
      risk: 91,
      status: 'ESCALATED_CYBER_CRIME',
      badge: 'CRITICAL ATTACK'
    }
  ];

  const filteredQueue = selectedSector === 'all'
    ? simulatedQueue
    : simulatedQueue.filter(item => item.sector === selectedSector);

  return (
    <div style={{ padding: '0 24px 30px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top SOC Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        
        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Calls Scanned Today</span>
            <PhoneCall size={18} color="#38bdf8" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', marginTop: '8px', color: '#f8fafc' }}>
            14,289
          </div>
          <span style={{ fontSize: '0.75rem', color: '#10b981' }}>+18% telecom traffic volume</span>
        </div>

        <div className="glass-panel" style={{ padding: '18px', borderLeft: '4px solid #ef4444' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Voice Clones Intercepted</span>
            <ShieldAlert size={18} color="#ef4444" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', marginTop: '8px', color: '#f87171' }}>
            318
          </div>
          <span style={{ fontSize: '0.75rem', color: '#f87171' }}>100% prevented before payout</span>
        </div>

        <div className="glass-panel" style={{ padding: '18px', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Fraud Losses Prevented</span>
            <DollarSign size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', marginTop: '8px', color: '#34d399' }}>
            ₹25.8 Crore
          </div>
          <span style={{ fontSize: '0.75rem', color: '#34d399' }}>$25.6M Arup-class scale</span>
        </div>

        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Mean Edge Latency</span>
            <Clock size={18} color="#38bdf8" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', marginTop: '8px', color: '#38bdf8' }}>
            14.2 ms
          </div>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Zero VoIP stream delay</span>
        </div>

      </div>

      {/* Real-World Case Study Highlight (Slide 6 Reference) */}
      <div className="glass-panel" style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(15, 23, 42, 0.8) 100%)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.2)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.4)' }}>
            <AlertOctagon size={28} color="#ef4444" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fca5a5' }}>
                Case Study: The $25.6M Arup Deepfake Wire Fraud (Jan 2024)
              </h3>
              <span className="badge badge-critical">Reference: CNN / SIH Slide 6</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '6px', lineHeight: '1.6' }}>
              In Hong Kong, a finance worker wired <strong>$25.6 Million (₹210+ Crore)</strong> after a conference call where every participant, including the UK Chief Financial Officer, was an AI deepfake clone. The audio sounded 100% convincing to the human ear.
            </p>
            
            {/* Before vs After Comparison */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', marginTop: '12px' }}>
              <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '10px 14px', borderRadius: '8px', borderLeft: '3px solid #ef4444' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#f87171' }}>WITHOUT SWARSURAKSHA:</span>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
                  Frontline staff relied on voice familiarity. Funds were wired via 15 transactions before the real CFO was contacted days later.
                </p>
              </div>
              <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '10px 14px', borderRadius: '8px', borderLeft: '3px solid #10b981' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#34d399' }}>WITH SWARSURAKSHA (IN-CALL DEFENSE):</span>
                <p style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '2px' }}>
                  AASIST model flags vocoder phase smearing in <strong>1.4 seconds</strong> (Risk: 88%). Auto-freezes RTGS gateway &amp; triggers secondary out-of-band biometric verification.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Enterprise Queue & Sector Breakdown */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800' }}>Active Enterprise Line Queue</h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Real-time voice verification streams across institutional channels</p>
          </div>

          {/* Sector Filter */}
          <div style={{ display: 'flex', gap: '6px', background: 'rgba(7, 11, 22, 0.6)', padding: '4px', borderRadius: '10px' }}>
            {[
              { id: 'all', label: 'All Sectors' },
              { id: 'corporate', label: 'Corporate Approvals' },
              { id: 'banking', label: 'Banking Desk' },
              { id: 'government', label: 'Govt Helplines' }
            ].map(sec => (
              <button
                key={sec.id}
                onClick={() => setSelectedSector(sec.id)}
                style={{
                  background: selectedSector === sec.id ? '#0284c7' : 'transparent',
                  color: selectedSector === sec.id ? '#fff' : '#94a3b8',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {sec.label}
              </button>
            ))}
          </div>
        </div>

        {/* Queue Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#64748b', textAlign: 'left' }}>
                <th style={{ padding: '10px 14px' }}>Session</th>
                <th style={{ padding: '10px 14px' }}>Desk / Operator</th>
                <th style={{ padding: '10px 14px' }}>Caller / Party</th>
                <th style={{ padding: '10px 14px' }}>Sector</th>
                <th style={{ padding: '10px 14px' }}>Approval Amount</th>
                <th style={{ padding: '10px 14px' }}>Risk Score</th>
                <th style={{ padding: '10px 14px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredQueue.map(item => {
                const isCrit = item.risk >= 65;
                return (
                  <tr
                    key={item.id}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      background: isCrit ? 'rgba(239, 68, 68, 0.06)' : 'transparent'
                    }}
                  >
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontWeight: '600', color: '#38bdf8' }}>
                      {item.id}
                    </td>
                    <td style={{ padding: '12px 14px', color: '#cbd5e1' }}>
                      {item.agent}
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: '#f8fafc' }}>
                      {item.caller}
                    </td>
                    <td style={{ padding: '12px 14px', color: '#94a3b8' }}>
                      {item.sectorLabel}
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: '700', color: isCrit ? '#f87171' : '#f8fafc' }}>
                      {item.amount}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '45px', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{
                            width: `${item.risk}%`,
                            height: '100%',
                            backgroundColor: isCrit ? '#ef4444' : item.risk >= 38 ? '#f59e0b' : '#10b981'
                          }} />
                        </div>
                        <span style={{ fontWeight: '800', color: isCrit ? '#f87171' : item.risk >= 38 ? '#fbbf24' : '#34d399' }}>
                          {item.risk}%
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span className={`badge ${isCrit ? 'badge-critical' : item.risk >= 38 ? 'badge-warning' : 'badge-authentic'}`}>
                        {item.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
