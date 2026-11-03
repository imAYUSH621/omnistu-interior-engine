import React from 'react';
import { render, screen } from '@testing-library/react';
import { it, expect } from 'vitest';
import { OwnerInbox } from '../src/components/OwnerInbox';
it('browser-local owner preview shows only current studio enquiries', () => {
 localStorage.setItem('omnistu_leads', JSON.stringify([
  { name: 'Studio A Visitor', client: 'Studio A' }, { name: 'Studio B Visitor', client: 'Studio B' }
 ]));
 render(<OwnerInbox isOpen={true} onClose={() => {}} client={{ name: 'Studio A' }} />);
 expect(screen.getByText('Studio A Visitor')).toBeDefined();
 expect(screen.queryByText('Studio B Visitor')).toBeNull();
 localStorage.clear();
});
