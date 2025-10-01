import React, { useState } from 'react';
export function Tabs({ defaultValue, children }) {
  const [value, setValue] = useState(defaultValue);
  return React.Children.map(children, child => React.cloneElement(child, { __value:value, __set:setValue }));
}
export function TabsList({ children, className='' }) { return <div className={className} style={{display:'grid', gap:8, gridAutoColumns:'1fr'}}>{children}</div>; }
export function TabsTrigger({ value, children, __value, __set }) {
  const active = __value === value;
  return <button className={'btn ' + (active?'':'secondary')} onClick={()=>__set(value)}>{children}</button>;
}
export function TabsContent({ value, children, className='', __value }) {
  if (__value !== value) return null;
  return <div className={className}>{children}</div>;
}