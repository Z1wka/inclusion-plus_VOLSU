import React from 'react';
export function Switch({ id, checked, onCheckedChange }){
  return <input id={id} type="checkbox" role="switch" checked={!!checked} onChange={e=>onCheckedChange(e.target.checked)} />;
}