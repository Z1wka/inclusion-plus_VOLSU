import React from 'react';
export function Calendar({ selected, onSelect }){
  return <input type="date" value={selected? new Date(selected).toISOString().slice(0,10): ''} onChange={e=>onSelect(new Date(e.target.value))} />;
}