import React from 'react';
export function Badge({ children, className='', variant='default' }) {
  const base = { padding:'2px 8px', borderRadius:9999, fontSize:12, border: variant==='outline'?'1px solid #e5e7eb':'none', background: variant==='secondary'?'#f1f5f9':'#e2e8f0' };
  return <span className={className} style={base}>{children}</span>;
}