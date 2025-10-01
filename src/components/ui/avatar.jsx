import React from 'react';
export function Avatar({ className='', children }) { return <div className={className} style={{width:48, height:48, borderRadius:'50%', overflow:'hidden', background:'#e5e7eb'}}>{children}</div>; }
export function AvatarImage({ src, alt }) { return <img src={src} alt={alt} style={{width:'100%', height:'100%', objectFit:'cover'}}/> }
export function AvatarFallback({ children }) { return <div style={{display:'flex', alignItems:'center', justifyContent:'center', width:'100%', height:'100%'}}>{children}</div> }