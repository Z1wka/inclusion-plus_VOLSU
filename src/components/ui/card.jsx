import React from 'react';
export function Card({ className='', children }) { return <div className={className + ' card'}>{children}</div>; }
export function CardHeader({ children, className='' }) { return <div className={className} style={{padding:'16px 16px 0'}}>{children}</div>; }
export function CardTitle({ children, className='' }) { return <div className={className} style={{fontWeight:600}}>{children}</div>; }
export function CardDescription({ children, className='' }) { return <div className={className} style={{color:'#6b7280', fontSize:12}}>{children}</div>; }
export function CardContent({ children, className='' }) { return <div className={className} style={{padding:'12px 16px'}}>{children}</div>; }
export function CardFooter({ children, className='' }) { return <div className={className} style={{padding:'0 16px 16px'}}>{children}</div>; }