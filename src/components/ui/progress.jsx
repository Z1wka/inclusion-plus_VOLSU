import React from 'react';
export function Progress({ value=0 }) {
  return <div style={{width:'100%', height:8, background:'#e5e7eb', borderRadius:9999}}>
    <div style={{width: Math.max(0, Math.min(100, value))+'%', height:'100%', borderRadius:9999, background:'#0ea5e9'}}/>
  </div>
}