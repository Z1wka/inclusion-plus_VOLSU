import React from 'react';
export function Button({ className='', variant, children, ...props }) {
  return <button className={className + ' btn ' + (variant==='secondary'?'secondary':'')} {...props}>{children}</button>;
}