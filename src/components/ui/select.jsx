import React from 'react';
export function Select({ value, onValueChange, children }){ return <div data-value={value}>{children}</div> }
export function SelectTrigger({ children, className='' }){ return <div className={className}>{children}</div> }
export function SelectValue({ placeholder }){ return <span>{placeholder}</span> }
export function SelectContent({ children }){ return <div style={{display:'flex', gap:8}}>{children}</div> }
export function SelectItem({ value, children, onClick }){ return <button className='btn secondary' onClick={onClick}>{children}</button> }