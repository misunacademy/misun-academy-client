// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CertificateStatusBadge, { normalizeStatus } from '@/components/shared/CertificateStatusBadge';

describe('normalizeStatus', () => {
  it('maps active/approved to approved', () => {
    expect(normalizeStatus('active')).toBe('approved');
    expect(normalizeStatus('APPROVED')).toBe('approved');
  });

  it('maps revoked/rejected to rejected', () => {
    expect(normalizeStatus('revoked')).toBe('rejected');
    expect(normalizeStatus('Rejected')).toBe('rejected');
  });

  it('falls back to pending for anything else', () => {
    expect(normalizeStatus('pending')).toBe('pending');
    expect(normalizeStatus('something-else')).toBe('pending');
    expect(normalizeStatus(undefined)).toBe('pending');
    expect(normalizeStatus('')).toBe('pending');
  });
});

describe('CertificateStatusBadge', () => {
  it('renders Approved for active statuses', () => {
    render(<CertificateStatusBadge status="active" />);
    expect(screen.getByText('Approved')).toBeInTheDocument();
  });

  it('renders Rejected for revoked statuses', () => {
    render(<CertificateStatusBadge status="revoked" />);
    expect(screen.getByText('Rejected')).toBeInTheDocument();
  });

  it('renders Pending by default', () => {
    render(<CertificateStatusBadge status="pending" />);
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('renders Pending when status is missing', () => {
    render(<CertificateStatusBadge />);
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });
});
