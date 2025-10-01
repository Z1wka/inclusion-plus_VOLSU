import React, { useState, createContext, useContext } from 'react';
const Ctx = createContext(null);
export function Dialog({ children }){
  const [open, setOpen] = useState(false);
  return <Ctx.Provider value={{open,setOpen}}>{children}</Ctx.Provider>;
}
export function DialogTrigger({ asChild, children }){
  const { setOpen } = useContext(Ctx);
  const child = React.Children.only(children);
  return React.cloneElement(child, { onClick: ()=>setOpen(true) });
}
export function DialogContent({ children, className='' }){
  const { open, setOpen } = useContext(Ctx);
  if (!open) return null;
  return <div className={className} style={{position:'fixed', inset:0, background:'rgba(0,0,0,.3)', display:'flex', alignItems:'center', justifyContent:'center'}} onClick={()=>setOpen(false)}>
    <div onClick={e=>e.stopPropagation()} style={{background:'#fff', borderRadius:12, padding:16, width:'min(640px, 92vw)'}}>{children}</div>
  </div>;
}
export function DialogHeader({ children }){ return <div style={{marginBottom:8}}>{children}</div> }
export function DialogTitle({ children }){ return <div style={{fontWeight:600, fontSize:18}}>{children}</div> }
export function DialogDescription({ children }){ return <div style={{color:'#6b7280', fontSize:12}}>{children}</div> }