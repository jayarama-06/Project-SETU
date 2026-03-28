/**
 * SETU – Chip Showcase Component
 * Visual reference for all chip variants and states
 * Use this component in Storybook or development mode
 */

import { StatusChip, IssueStatus } from './StatusChip';
import { UrgencyChip, UrgencyLevel } from './UrgencyChip';
import { EscalationChip, EscalationLevel } from './EscalationChip';

/**
 * ChipShowcase – Development-only component showing all chip variants
 * 
 * @example
 * // Add to a test route for visual QA
 * <Route path="/chip-showcase" element={<ChipShowcase />} />
 */
export function ChipShowcase() {
  const statusValues: IssueStatus[] = [
    'submitted',
    'acknowledged',
    'in_progress',
    'awaiting',
    'resolved_pending',
    'dispute',
    'resolved',
    'closed',
    'open', // legacy
  ];

  const urgencyValues: UrgencyLevel[] = ['low', 'medium', 'high', 'critical'];
  const escalationValues: EscalationLevel[] = [0, 1, 2, 3, 4];

  return (
    <div style={{ 
      backgroundColor: '#F8F9FA', 
      minHeight: '100vh', 
      padding: '24px',
      fontFamily: 'Noto Sans',
    }}>
      <h1 style={{ 
        fontSize: '28px', 
        fontWeight: 700, 
        color: '#0D1B2A',
        marginBottom: '32px',
      }}>
        SETU Chip System — Visual Reference
      </h1>

      {/* Status Chips */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ 
          fontSize: '20px', 
          fontWeight: 600, 
          color: '#0D1B2A',
          marginBottom: '16px',
        }}>
          Status Chips (AP-03)
        </h2>
        
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#6B7280', marginBottom: '8px' }}>
            Small (default)
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {statusValues.map((status) => (
              <div key={status} style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '4px',
              }}>
                <StatusChip status={status} size="sm" />
                <span style={{ fontSize: '10px', color: '#9CA3AF' }}>{status}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#6B7280', marginBottom: '8px' }}>
            Medium
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {statusValues.map((status) => (
              <StatusChip key={status} status={status} size="md" />
            ))}
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#6B7280', marginBottom: '8px' }}>
            Extra Small
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {statusValues.map((status) => (
              <StatusChip key={status} status={status} size="xs" />
            ))}
          </div>
        </div>
      </section>

      {/* Urgency Chips */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ 
          fontSize: '20px', 
          fontWeight: 600, 
          color: '#0D1B2A',
          marginBottom: '16px',
        }}>
          Urgency Chips
        </h2>
        
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#6B7280', marginBottom: '8px' }}>
            Small (default)
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {urgencyValues.map((urgency) => (
              <div key={urgency} style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '4px',
              }}>
                <UrgencyChip urgency={urgency} size="sm" />
                <span style={{ fontSize: '10px', color: '#9CA3AF' }}>{urgency}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#6B7280', marginBottom: '8px' }}>
            Medium with Icon
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {urgencyValues.map((urgency) => (
              <UrgencyChip key={urgency} urgency={urgency} size="md" showIcon />
            ))}
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#6B7280', marginBottom: '8px' }}>
            Extra Small
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {urgencyValues.map((urgency) => (
              <UrgencyChip key={urgency} urgency={urgency} size="xs" />
            ))}
          </div>
        </div>
      </section>

      {/* Escalation Chips */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ 
          fontSize: '20px', 
          fontWeight: 600, 
          color: '#0D1B2A',
          marginBottom: '16px',
        }}>
          Escalation Chips (L0–L4)
        </h2>
        
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#6B7280', marginBottom: '8px' }}>
            Badge Mode (default)
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {escalationValues.map((level) => (
              <div key={level} style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '4px',
              }}>
                <EscalationChip level={level} mode="badge" size="sm" />
                <span style={{ fontSize: '10px', color: '#9CA3AF' }}>Level {level}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#6B7280', marginBottom: '8px' }}>
            Full Text Mode
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {escalationValues.map((level) => (
              <EscalationChip key={level} level={level} mode="full" size="md" />
            ))}
          </div>
        </div>
      </section>

      {/* Card Examples */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ 
          fontSize: '20px', 
          fontWeight: 600, 
          color: '#0D1B2A',
          marginBottom: '16px',
        }}>
          Usage Examples
        </h2>

        {/* Critical Issue Card */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          padding: '16px',
          border: '1px solid #E5E7EB',
          marginBottom: '16px',
          position: 'relative',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
        }}>
          {/* 4px urgency border (AP-05) */}
          <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '4px',
            backgroundColor: '#DC2626', // critical urgency
          }} />
          
          <div style={{ marginLeft: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="material-symbols-rounded" style={{ fontSize: '20px', color: '#6B7280' }}>
                error
              </span>
              <span style={{ fontSize: '11px', color: '#6B7280' }}>GRV-4092</span>
            </div>
            
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: 600, 
              color: '#0D1B2A',
              marginBottom: '12px',
            }}>
              Water pump malfunction in girls hostel block
            </h3>
            
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <StatusChip status="in_progress" />
              <EscalationChip level={2} />
              <UrgencyChip urgency="critical" showIcon />
            </div>
            
            <p style={{ fontSize: '11px', color: '#6B7280', textAlign: 'right' }}>
              10 mins ago
            </p>
          </div>
        </div>

        {/* Low Priority Card */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          padding: '16px',
          border: '1px solid #E5E7EB',
          position: 'relative',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
        }}>
          <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '4px',
            backgroundColor: '#6B7280', // low urgency
          }} />
          
          <div style={{ marginLeft: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="material-symbols-rounded" style={{ fontSize: '20px', color: '#6B7280' }}>
                menu_book
              </span>
              <span style={{ fontSize: '11px', color: '#6B7280' }}>GRV-4075</span>
            </div>
            
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: 600, 
              color: '#0D1B2A',
              marginBottom: '12px',
            }}>
              Textbook shortage for Class 8 students
            </h3>
            
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <StatusChip status="acknowledged" />
              <EscalationChip level={0} />
              <UrgencyChip urgency="low" />
            </div>
            
            <p style={{ fontSize: '11px', color: '#6B7280', textAlign: 'right' }}>
              2 days ago
            </p>
          </div>
        </div>
      </section>

      {/* Design Specs */}
      <section style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '8px',
        padding: '24px',
        border: '1px solid #E5E7EB',
      }}>
        <h2 style={{ 
          fontSize: '20px', 
          fontWeight: 600, 
          color: '#0D1B2A',
          marginBottom: '16px',
        }}>
          Design Specifications (AP-03 / AP-05)
        </h2>
        
        <div style={{ 
          fontSize: '14px', 
          lineHeight: '1.6',
          color: '#374151',
        }}>
          <p style={{ marginBottom: '12px' }}>
            <strong>Font:</strong> Noto Sans (all weights)
          </p>
          <p style={{ marginBottom: '12px' }}>
            <strong>Border Radius:</strong> 4px (xs) | 6px (sm) | 8px (md)
          </p>
          <p style={{ marginBottom: '12px' }}>
            <strong>Urgency Border:</strong> 4px left border on cards
          </p>
          <p style={{ marginBottom: '12px' }}>
            <strong>Page Background:</strong> #F8F9FA (not pure white)
          </p>
          <p style={{ marginBottom: '12px' }}>
            <strong>Saffron Gold:</strong> #F0A500 (CTAs, active states, toggle fill only)
          </p>
          <p style={{ marginBottom: '12px' }}>
            <strong>Deep Navy:</strong> #0D1B2A (primary text)
          </p>
          <p>
            <strong>i18n Annotation:</strong> All text nodes have <code>data-i18n</code> attributes
          </p>
        </div>
      </section>
    </div>
  );
}
