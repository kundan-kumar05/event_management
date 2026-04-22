import React, { useState, useEffect } from 'react';
import { getMyMembership, addMembership, updateMembership } from '../services/membershipService';
import LoadingSpinner from '../components/LoadingSpinner';

const PLANS = [
  { value: '6m', label: '6 Months', price: '₹499', plan: 'basic', desc: 'Basic access, 6-month duration' },
  { value: '1y', label: '1 Year', price: '₹899', plan: 'standard', desc: 'Standard access, best value' },
  { value: '2y', label: '2 Years', price: '₹1499', plan: 'premium', desc: 'Premium access, maximum savings' },
];

const MembershipPage = () => {
  const [membership, setMembership] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDuration, setSelectedDuration] = useState('6m');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    getMyMembership()
      .then(res => setMembership(res.data.membership))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const showMsg = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleAdd = async () => {
    const plan = PLANS.find(p => p.value === selectedDuration);
    setSubmitting(true);
    try {
      const res = await addMembership({ duration: selectedDuration, plan: plan.plan });
      setMembership(res.data.membership);
      showMsg('🎉 Membership activated successfully!');
    } catch (err) {
      showMsg(err.response?.data?.message || 'Failed to add membership', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleExtend = async () => {
    setSubmitting(true);
    try {
      const res = await updateMembership({ action: 'extend', duration: selectedDuration });
      setMembership(res.data.membership);
      showMsg('✅ Membership extended successfully!');
    } catch (err) {
      showMsg(err.response?.data?.message || 'Failed to extend membership', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Cancel your membership? This cannot be undone.')) return;
    setSubmitting(true);
    try {
      const res = await updateMembership({ action: 'cancel' });
      setMembership(res.data.membership);
      showMsg('Membership cancelled.', 'error');
    } catch (err) {
      showMsg(err.response?.data?.message || 'Failed to cancel', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : '—';
  const isActive = membership?.status === 'active';

  if (loading) return <LoadingSpinner />;

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>🎫 Membership</h1>
          <p>Choose a plan that works best for you</p>
        </div>

        {message && (
          <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'}`}>{message.text}</div>
        )}

        {/* Current Membership Status */}
        {membership && (
          <div className="card mb-3" style={{ borderColor: isActive ? 'var(--green)' : 'var(--border)' }}>
            <div className="flex-between" style={{ flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Current Plan</div>
                <div style={{ fontSize: '22px', fontWeight: '800', textTransform: 'capitalize' }}>{membership.plan} — {membership.duration}</div>
                <div className="text-muted mt-1">
                  {formatDate(membership.startDate)} → {formatDate(membership.endDate)}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                <span className={`badge badge-${membership.status}`}>{membership.status}</span>
                {isActive && (
                  <button className="btn btn-sm btn-danger" onClick={handleCancel} disabled={submitting}>Cancel Plan</button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Plan Selector */}
        <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>
          {membership && isActive ? 'Extend Your Plan' : 'Choose a Plan'}
        </h2>

        <div className="plan-grid mb-3">
          {PLANS.map((plan) => (
            <div
              key={plan.value}
              className={`plan-card ${selectedDuration === plan.value ? 'selected' : ''}`}
              onClick={() => setSelectedDuration(plan.value)}
            >
              {/* Radio button (hidden visually, semantically present) */}
              <input
                type="radio"
                name="membershipDuration"
                value={plan.value}
                checked={selectedDuration === plan.value}
                onChange={() => setSelectedDuration(plan.value)}
                style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
                id={`plan-${plan.value}`}
              />
              <div className="plan-duration">{plan.label}</div>
              <div className="plan-name">{plan.desc}</div>
              <div className="plan-price">{plan.price}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {(!membership || !isActive) && (
            <button className="btn btn-primary btn-lg" onClick={handleAdd} disabled={submitting}>
              {submitting ? 'Activating…' : '🚀 Activate Membership'}
            </button>
          )}
          {membership && isActive && (
            <button className="btn btn-secondary btn-lg" onClick={handleExtend} disabled={submitting}>
              {submitting ? 'Extending…' : '🔄 Extend Membership'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MembershipPage;
