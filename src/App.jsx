// NOTE: This file mirrors the app you've seen in canvas, adapted to plain JS.
import React, { useMemo, useState, useEffect } from "react";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { Badge } from "./components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Progress } from "./components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Switch } from "./components/ui/switch";
import { Checkbox } from "./components/ui/checkbox";
import { Separator } from "./components/ui/separator";
import { Calendar } from "./components/ui/calendar";
// Browser-safe toast
function toast(message, duration = 2400) {
  try {
    const rootId = "__toast_root__";
    let root = document.getElementById(rootId);
    if (!root) {
      root = document.createElement("div");
      root.id = rootId;
      root.style.position = "fixed";
      root.style.bottom = "16px";
      root.style.left = "50%";
      root.style.transform = "translateX(-50%)";
      root.style.display = "flex";
      root.style.flexDirection = "column";
      root.style.gap = "8px";
      root.style.zIndex = "2147483647";
      document.body.appendChild(root);
    }
    const item = document.createElement("div");
    item.setAttribute("role", "status");
    item.style.padding = "10px 14px";
    item.style.background = "rgba(17,24,39,0.9)";
    item.style.color = "white";
    item.style.borderRadius = "9999px";
    item.style.boxShadow = "0 4px 14px rgba(0,0,0,0.25)";
    item.style.fontSize = "14px";
    item.textContent = message;
    root.appendChild(item);
    const t = setTimeout(() => {
      item.style.transition = "opacity .2s";
      item.style.opacity = "0";
      setTimeout(() => item.remove(), 200);
    }, duration);
    return () => { clearTimeout(t); item.remove(); };
  } catch (e) { alert(message); }
}
import {
  Brain,
  Users,
  Trophy,
  Video,
  CalendarDays,
  Search,
  ArrowRight,
  PlusCircle,
  Headphones,
  Sparkles,
  Star,
  MousePointerClick,
  Laptop,
  MapPin,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

function readEnv(key){
  try { if (typeof process !== 'undefined' && process.env && key in process.env) return process.env[key]; } catch{}
  try { if (typeof import.meta !== 'undefined' && import.meta.env && key in import.meta.env) return import.meta.env[key]; } catch{}
  try { if (globalThis.__ENV__ && key in globalThis.__ENV__) return globalThis.__ENV__[key]; } catch{}
  return undefined;
}

const CATEGORIES = ["UX/UI","Frontend","Backend","Data","SMM","Motion","Продакт","Копирайт","QA"];
const ALL_SKILLS = ["HTML","CSS","JS","React","Node.js","Python","Figma","SQL","Git","Коммуникация","Доступность"];

const mentorsSeed = [
  { id:"m1", name:"Анна Ромашина", role:"UX/UI Дизайнер", avatar:"https://i.pravatar.cc/150?img=47",
    categories:["UX/UI","Продакт"], skills:["Figma","Коммуникация","Доступность"], city:"Москва",
    formats:["online","offline"], accessibility:["сурдоперевод","субтитры"],
    about:"10 лет в продуктовой разработке. Консультирую по доступности интерфейсов и портфолио." },
  { id:"m2", name:"Дмитрий Соколов", role:"Frontend Engineer", avatar:"https://i.pravatar.cc/150?img=12",
    categories:["Frontend"], skills:["React","JS","Git","Доступность"], city:"Санкт‑Петербург",
    formats:["online"], accessibility:["экранный_диктор"], about:"Помогаю со входом во фронтенд, проектные задачи, собеседования." },
  { id:"m3", name:"Сара Ильина", role:"Data Analyst", avatar:"https://i.pravatar.cc/150?img=30",
    categories:["Data"], skills:["SQL","Python"], city:"Казань",
    formats:["online","offline"], accessibility:["пандус","лифт"], about:"BI‑дашборды, аналитика для маркетинга, обучение SQL с нуля." },
  { id:"m4", name:"Юрий Ким", role:"Motion Designer", avatar:"https://i.pravatar.cc/150?img=5",
    categories:["Motion","SMM"], skills:["After Effects","Коммуникация"], city:"Новосибирск",
    formats:["online"], accessibility:["субтитры"], about:"Моушн для соцсетей, питч‑видео, сторителлинг." },
];

const SUPABASE_URL = readEnv("NEXT_PUBLIC_SUPABASE_URL") || readEnv("VITE_SUPABASE_URL") || "https://project.supabase.co";
const SUPABASE_ANON_KEY = readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY") || readEnv("VITE_SUPABASE_ANON_KEY") || "public-anon-key";
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const DICT = { ru: { title:"Инклюзия+ · Экосистема наставничества", profile:"Профиль участника", signIn:"Войти", signOut:"Выйти", language:"Язык", export:"Экспорт CSV", reports:"Отчёты и экспорт", download:"Скачать" },
               en: { title:"Inclusion+ · Mentorship Ecosystem", profile:"Participant Profile", signIn:"Sign in", signOut:"Sign out", language:"Language", export:"Export CSV", reports:"Reports & Export", download:"Download" } };
function useI18n(){ const [lang, setLang] = useState('ru'); const t = (k)=> (DICT[lang]||{})[k] || k; return { lang, setLang, t }; }

function toCSV(rows){ if(!rows?.length) return ""; const cols=Object.keys(rows[0]); const esc=v=>`"${String(v ?? "").replace(/"/g,'""')}"`; return [cols.join(','), ...rows.map(r=>cols.map(c=>esc(r[c])).join(','))].join('\n'); }

function runInternalTests(){
  try {
    const sample=[{a:1,b:'x'},{a:2,b:'y"z'}]; const csv = toCSV(sample);
    console.assert(csv.startsWith('a,b\n'),'CSV header invalid'); console.assert(csv.includes('1,"x"'),'CSV first row invalid'); console.assert(csv.includes('2,"y""z"'),'CSV escaping invalid');
    const g=globalThis; const prev=g.__ENV__; g.__ENV__={FOO:'bar'}; console.assert(readEnv('FOO')==='bar','readEnv should read from global __ENV__'); g.__ENV__=prev;
    const user={ interests:['Frontend'], skills:['React'], prefers:{format:'online'}, city:'Москва', accessibility:{captions:false,sign:false,screenReader:false,mobility:false}};
    const mentor={ categories:['Frontend'], skills:['React','Git'], formats:['online'], city:'Москва', accessibility:[] };
    const base=scoreMatch(user,mentor); console.assert(base===55,`scoreMatch base expected 55, got ${base}`);
    const offlineUser={...user, prefers:{format:'offline'}}; const offlineScore=scoreMatch(offlineUser, mentor); console.assert(offlineScore===65,`scoreMatch offline city bonus expected 65, got ${offlineScore}`);
    const accUser={...user, accessibility:{captions:true,sign:false,screenReader:false,mobility:false}}; const accMentor={...mentor, accessibility:['субтитры']};
    const accScore=scoreMatch(accUser, accMentor); console.assert(accScore===63,`scoreMatch accessibility expected 63, got ${accScore}`);
    const capUser={...user, skills:['React','Git','SQL','Python','Figma','HTML','CSS','JS','Node.js'], interests:['Frontend','Backend','Data'], accessibility:{captions:true,sign:true,screenReader:true,mobility:true}, prefers:{format:'offline'}, city:'Москва'};
    const capMentor={ categories:['Frontend','Backend','Data'], skills:['React','Git','SQL','Python'], formats:['online','offline'], city:'Москва', accessibility:['субтитры','сурдоперевод','экранный_диктор','пандус'] };
    const capped=scoreMatch(capUser, capMentor); console.assert(capped===100,`scoreMatch must cap at 100, got ${capped}`);
    try { toast('Тест уведомления'); } catch(e){ console.assert(false,'toast should be safe in browser'); }
  } catch(e){ console.warn('Internal tests failed:', e); }
}
(()=>{ try { const g=globalThis; if(!g.__INCLUSION_PLUS_TESTED__){ runInternalTests(); g.__INCLUSION_PLUS_TESTED__=true; } } catch{} })();

function badgeByCategory(cat){
  const map={"UX/UI":"bg-blue-100 text-blue-800", Frontend:"bg-green-100 text-green-800", Backend:"bg-emerald-100 text-emerald-800", Data:"bg-purple-100 text-purple-800", SMM:"bg-pink-100 text-pink-800", Motion:"bg-amber-100 text-amber-900", "Продакт":"bg-slate-100 text-slate-800", "Копирайт":"bg-cyan-100 text-cyan-800", QA:"bg-rose-100 text-rose-800"};
  return map[cat] || "bg-gray-100 text-gray-800";
}

const initUser={ name:"", email:"", city:"", interests:["UX/UI","Frontend"], skills:["HTML","Figma"], goals:"Найти наставника и собрать портфолио за 3 месяца", accessibility:{captions:true,sign:false,screenReader:false,mobility:false}, prefers:{format:"online", schedule:"вечер"}, canTeach:["Коммуникация"] };

function scoreMatch(user, mentor){
  let score=0;
  score += mentor.categories.some(c=>user.interests.includes(c)) ? 35 : 0;
  score += mentor.skills.filter(s=>user.skills.includes(s)).length * 10;
  score += mentor.formats.includes(user.prefers.format) ? 10 : 0;
  if (user.prefers.format==='offline' && mentor.city===user.city) score += 10;
  if (user.accessibility.captions && (mentor.accessibility||[]).includes('субтитры')) score += 8;
  if (user.accessibility.sign && (mentor.accessibility||[]).includes('сурдоперевод')) score += 8;
  if (user.accessibility.screenReader && (mentor.accessibility||[]).includes('экранный_диктор')) score += 8;
  if (user.accessibility.mobility && (mentor.accessibility||[]).some(a=>['пандус','лифт'].includes(a))) score += 8;
  return Math.min(100, score);
}

function Pill({ children }){ return <span style={{padding:'2px 8px', borderRadius:9999, fontSize:12, background:'#f1f5f9'}}>{children}</span> }
function SectionTitle({ icon:Icon, title, hint }){
  return <div style={{display:'flex', gap:12, alignItems:'center', marginBottom:12}}>
    <div style={{padding:8, borderRadius:16, background:'#fff', boxShadow:'0 1px 3px rgba(0,0,0,.05)'}}><Icon size={18} aria-hidden/></div>
    <div><h3 style={{margin:0, fontWeight:600}}>{title}</h3>{hint && <p style={{margin:0, color:'#6b7280', fontSize:12}}>{hint}</p>}</div>
  </div>;
}

export default function App(){
  const { lang, setLang, t } = useI18n();
  const [session, setSession] = useState(null);
  useEffect(()=>{ try{ supabase.auth.getSession().then(({data})=>setSession(data?.session||null)); supabase.auth.onAuthStateChange((_e,s)=>setSession(s)); }catch{} },[]);
  const [user, setUser] = useState(initUser);
  const [mentors, setMentors] = useState(mentorsSeed);
  const [selected, setSelected] = useState(null);
  const [date, setDate] = useState();
  const [beMentor, setBeMentor] = useState(false);
  const [points, setPoints] = useState(120);

  const ranked = useMemo(()=> mentors.map(m=>({...m, score: scoreMatch(user,m)})).sort((a,b)=>b.score-a.score), [user, mentors]);
  const progress = Math.min(100, 30 + (user.skills.length + user.interests.length)*5);

  const handleBook=()=>{ if(!selected || !date){ toast('Выберите наставника и дату сессии'); return; } toast(`Сессия с ${selected.name} забронирована`); setPoints(p=>p+10); };
  const addMentorFromUser=()=>{
    const id = `u-${Date.now()}`;
    const newMentor = { id, name: user.name || 'Вы', role: user.canTeach[0] ? `Наставник по «${user.canTeach[0]}»` : 'Наставник',
      avatar:'https://i.pravatar.cc/150?img=64', categories:user.interests.slice(0,2),
      skills:[...new Set([...(user.canTeach||[]), ...user.skills])], city:user.city || 'Онлайн', formats:['online'],
      accessibility:[ user.accessibility.captions?'субтитры':null, user.accessibility.sign?'сурдоперевод':null, user.accessibility.screenReader?'экранный_диктор':null ].filter(Boolean),
      about:'Микрокурс от участника по модели 360° наставничества.' };
    setMentors(ms=>[newMentor, ...ms]); toast('Ваш мини‑курс опубликован в каталоге наставников'); setBeMentor(false);
  };

  return <div className="min-h-screen w-full" style={{background:'linear-gradient(to bottom, #f8fafc, #fff)', padding:'16px 32px'}}>
    <header className="container" style={{marginBottom:24}}>
      <div style={{display:'flex', gap:16, alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap'}}>
        <div>
          <h1 style={{fontSize:28, fontWeight:700, margin:0}}>{t('title')}</h1>
          <p style={{margin:'6px 0 0', color:'#6b7280', fontSize:14}}>Поиск наставников, гибридные программы, обмен ролями, геймификация и VR/AR‑сессии</p>
        </div>
        <div style={{display:'flex', gap:8, alignItems:'center'}}>
          <Badge variant='secondary'><Sparkles size={16} style={{marginRight:4}}/>AI‑подбор</Badge>
          <Badge variant='secondary'><Video size={16} style={{marginRight:4}}/>Онлайн</Badge>
          <Badge variant='secondary'><MapPin size={16} style={{marginRight:4}}/>Оффлайн</Badge>
        </div>
      </div>
    </header>

    <main className="container" style={{display:'grid', gridTemplateColumns:'1fr 2fr', gap:24}}>
      <div style={{display:'flex', flexDirection:'column', gap:24}}>
        <Card>
          <CardHeader>
            <CardTitle><Users size={20}/> {t('profile')}</CardTitle>
            <CardDescription>Расскажите о себе — это поможет точнее подобрать наставника</CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
              <div><label style={{fontSize:12, color:'#6b7280'}}>Имя</label><Input aria-label='Имя' value={user.name} onChange={e=>setUser({...user, name:e.target.value})} placeholder='Мария'/></div>
              <div><label style={{fontSize:12, color:'#6b7280'}}>Город</label><Input aria-label='Город' value={user.city} onChange={e=>setUser({...user, city:e.target.value})} placeholder='Пермь'/></div>
            </div>
            <div><label style={{fontSize:12, color:'#6b7280'}}>Email</label><Input type='email' aria-label='Email' value={user.email} onChange={e=>setUser({...user, email:e.target.value})} placeholder='you@example.com'/></div>
            <div><label style={{fontSize:12, color:'#6b7280'}}>Цель</label><Textarea aria-label='Цель' value={user.goals} onChange={e=>setUser({...user, goals:e.target.value})}/></div>
            <Separator/>
            <SectionTitle icon={Brain} title='Интересы' hint='Выберите до 3 направлений'/>
            <div style={{display:'flex', flexWrap:'wrap', gap:8}}>
              {CATEGORIES.map(c=>(
                <Button key={c} className='btn' onClick={()=>{
                  setUser(u=>({...u, interests: u.interests.includes(c) ? u.interests.filter(x=>x!==c) : (u.interests.length<3?[...u.interests, c]:u.interests)}))
                }}>{c}</Button>
              ))}
            </div>
            <SectionTitle icon={Laptop} title='Навыки' hint='Добавьте ключевые компетенции'/>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
              {ALL_SKILLS.map(s=>(
                <label key={s} style={{display:'flex', alignItems:'center', gap:8}}>
                  <Checkbox checked={user.skills.includes(s)} onCheckedChange={v=>setUser({...user, skills: v?[...user.skills, s]:user.skills.filter(x=>x!==s)})}/>
                  <span style={{fontSize:14}}>{s}</span>
                </label>
              ))}
            </div>
            <SectionTitle icon={Headphones} title='Доступность' hint='Подстройте формат взаимодействия'/>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
              <label style={{display:'flex', alignItems:'center', gap:8}}><Checkbox checked={user.accessibility.captions} onCheckedChange={v=>setUser({...user, accessibility:{...user.accessibility, captions:!!v}})}/>Субтитры</label>
              <label style={{display:'flex', alignItems:'center', gap:8}}><Checkbox checked={user.accessibility.sign} onCheckedChange={v=>setUser({...user, accessibility:{...user.accessibility, sign:!!v}})}/>Сурдоперевод</label>
              <label style={{display:'flex', alignItems:'center', gap:8}}><Checkbox checked={user.accessibility.screenReader} onCheckedChange={v=>setUser({...user, accessibility:{...user.accessibility, screenReader:!!v}})}/>Экранный диктор</label>
              <label style={{display:'flex', alignItems:'center', gap:8}}><Checkbox checked={user.accessibility.mobility} onCheckedChange={v=>setUser({...user, accessibility:{...user.accessibility, mobility:!!v}})}/>Мобильность (пандус/лифт)</label>
            </div>
            <Separator/>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
              <div><label style={{fontSize:12, color:'#6b7280'}}>Формат</label><div><Button className='btn secondary' onClick={()=>setUser({...user, prefers:{...user.prefers, format:'online'}})}>Онлайн</Button> <Button className='btn secondary' onClick={()=>setUser({...user, prefers:{...user.prefers, format:'offline'}})}>Оффлайн</Button></div></div>
              <div><label style={{fontSize:12, color:'#6b7280'}}>Время</label><div><Button className='btn secondary' onClick={()=>setUser({...user, prefers:{...user.prefers, schedule:'утро'}})}>Утро</Button> <Button className='btn secondary' onClick={()=>setUser({...user, prefers:{...user.prefers, schedule:'вечер'}})}>Вечер</Button></div></div>
            </div>
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:8}}>
              <label style={{display:'flex', alignItems:'center', gap:8}}><Switch id='beMentor' checked={beMentor} onCheckedChange={setBeMentor}/>Хочу вести мини‑курс</label>
              <Pill><Trophy size={12}/> {points} баллов</Pill>
            </div>
          </CardContent>
          <CardFooter style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
            <div style={{width:'75%'}}>
              <Progress value={progress}/>
              <p style={{fontSize:12, color:'#6b7280', marginTop:4}}>Заполненность профиля {progress}%</p>
            </div>
            <Button onClick={()=>toast('Профиль сохранён')}>Сохранить</Button>
          </CardFooter>
        </Card>

        {beMentor && <Card>
          <CardHeader><CardTitle><PlusCircle size={20}/> Создать мини‑курс</CardTitle><CardDescription>Модуль обмена ролями: станьте наставником по своим сильным сторонам</CardDescription></CardHeader>
          <CardContent>
            <label style={{fontSize:12, color:'#6b7280'}}>Чему готовы учить</label>
            <Input placeholder='Напр.: Коммуникация, Git, Figma' value={user.canTeach.join(', ')} onChange={e=>setUser({...user, canTeach:e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})}/>
            <Button className='btn' onClick={addMentorFromUser}><Star size={16}/>Опубликовать мини‑курс</Button>
          </CardContent>
        </Card>}
      </div>

      <div style={{display:'flex', flexDirection:'column', gap:24}}>
        <Card>
          <CardHeader>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div><CardTitle><Search size={20}/> Подбор наставника</CardTitle><CardDescription>ИИ сортирует список по совместимости и доступности</CardDescription></div>
              <div style={{fontSize:12, color:'#6b7280'}}>Предпочтения: {user.prefers.format} · {user.prefers.schedule}</div>
            </div>
          </CardHeader>
          <CardContent>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
              {ranked.map(m=>(
                <Card key={m.id}>
                  <CardHeader>
                    <div style={{display:'flex', gap:12}}>
                      <Avatar><AvatarImage src={m.avatar} alt={m.name}/><AvatarFallback>{(m.name||'??').slice(0,2).toUpperCase()}</AvatarFallback></Avatar>
                      <div style={{flex:1}}>
                        <CardTitle style={{fontSize:16}}>{m.name}</CardTitle>
                        <CardDescription><span>{m.role}</span> · <span style={{fontSize:12}}><MapPin size={12}/> {m.city}</span></CardDescription>
                      </div>
                      <div style={{textAlign:'right'}}>
                        <div style={{fontSize:14, fontWeight:600}}>Совпадение {m.score}%</div>
                        <div style={{display:'flex', gap:4, flexWrap:'wrap', marginTop:4}}>
                          {m.categories.map(c=>(<span key={c} style={{padding:'2px 6px', borderRadius:9999, fontSize:10, background:'#eef2ff'}}>{c}</span>))}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p style={{color:'#6b7280', fontSize:14}}>{m.about}</p>
                    <div style={{display:'flex', flexWrap:'wrap', gap:6}}>{m.skills.map(s=>(<Badge key={s} variant='outline'>{s}</Badge>))}</div>
                    <div style={{display:'flex', gap:6, fontSize:12}}>
                      {m.formats.includes('online') && <Pill><Video size={12}/>online</Pill>}
                      {m.formats.includes('offline') && <Pill><MapPin size={12}/>offline</Pill>}
                    </div>
                  </CardContent>
                  <CardFooter style={{display:'flex', justifyContent:'space-between'}}>
                    <Dialog>
                      <DialogTrigger asChild><Button className='btn secondary'>Профиль</Button></DialogTrigger>
                      <DialogContent>
                        <DialogHeader><DialogTitle>{m.name}</DialogTitle><DialogDescription>{m.role} · {m.city}</DialogDescription></DialogHeader>
                        <div style={{fontSize:14, color:'#6b7280'}}>{m.about}</div>
                        <Separator/>
                        <div style={{display:'flex', flexWrap:'wrap', gap:6}}>{m.skills.map(s=>(<Badge key={s} variant='outline'>{s}</Badge>))}</div>
                      </DialogContent>
                    </Dialog>
                    <Button onClick={()=>{ setSelected(m); toast('Наставник выбран'); }}>Выбрать <ArrowRight size={16}/></Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle><CalendarDays size={20}/> Сессия наставничества</CardTitle><CardDescription>Забронируйте Zoom‑встречу или офлайн мастер‑класс</CardDescription></CardHeader>
          <CardContent>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
              <div><label style={{fontSize:12, color:'#6b7280'}}>Дата</label><Calendar selected={date} onSelect={setDate}/></div>
              <div style={{display:'flex', flexDirection:'column', gap:8}}>
                <div style={{fontSize:14}}>
                  <p><span style={{color:'#6b7280'}}>Наставник:</span> {selected?selected.name:'не выбран'}</p>
                  <p><span style={{color:'#6b7280'}}>Формат:</span> {user.prefers.format}</p>
                </div>
                <Textarea placeholder='Цели сессии (напр.: разобрать резюме, собрать кейс, подготовиться к собеседованию)'></Textarea>
                <div style={{display:'flex', gap:8}}>
                  <Button onClick={handleBook}>Забронировать <MousePointerClick size={16}/></Button>
                  <Button className='btn secondary' onClick={()=>toast('Встреча в VR‑пространстве будет доступна в релизе 2.0')}>VR/AR</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle><Trophy size={20}/> Геймификация</CardTitle><CardDescription>Баллы → сертификаты, стажировки, мерч</CardDescription></CardHeader>
          <CardContent>
            <Tabs defaultValue='progress'>
              <TabsList className='grid grid-cols-3'>
                <TabsTrigger value='progress'>Прогресс</TabsTrigger>
                <TabsTrigger value='achv'>Ачивки</TabsTrigger>
                <TabsTrigger value='rewards'>Награды</TabsTrigger>
              </TabsList>
              <TabsContent value='progress'>
                <div style={{display:'flex', justifyContent:'space-between'}}><span>Ваши баллы</span><span style={{fontWeight:600}}>{points}</span></div>
                <Progress value={(points%200)/2}/>
                <p style={{fontSize:12, color:'#6b7280'}}>Ещё {200-(points%200)} до следующего уровня</p>
              </TabsContent>
              <TabsContent value='achv'>
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8}}>
                  {[{t:'Первый созвон', d:'Назначьте первую встречу'},{t:'Портфолио готово', d:'Загрузите 3 кейса'},{t:'360°', d:'Опубликуйте мини‑курс'}].map(a=>(
                    <Card key={a.t}><CardHeader><CardTitle style={{fontSize:14}}>{a.t}</CardTitle></CardHeader><CardContent style={{fontSize:13, color:'#6b7280'}}>{a.d}</CardContent></Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value='rewards'>
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8}}>
                  {[{t:'Сертификат наставничества', need:100},{t:'Собеседование у партнёра', need:180},{t:'Мерч «Инклюзия+»', need:150}].map(r=>(
                    <Card key={r.t}><CardHeader><CardTitle style={{fontSize:14}}>{r.t}</CardTitle></CardHeader><CardContent><p style={{fontSize:13, color:'#6b7280'}}>Требуется: {r.need} баллов</p><Button className='btn secondary' disabled={points<r.need}>Получить</Button></CardContent></Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Отчёты и экспорт</CardTitle><CardDescription>Сформируйте выгрузку для грантового отчёта</CardDescription></CardHeader>
          <CardContent style={{display:'flex', gap:8, flexWrap:'wrap'}}>
            <Button onClick={()=>{ const csv = toCSV(mentors.map(({id,name,role,city,categories,skills,formats})=>({id,name,role,city,categories:categories.join('|'),skills:skills.join('|'),formats:formats.join('|')}))); const blob=new Blob([csv],{type:'text/csv;charset=utf-8;'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='mentors.csv'; a.click(); URL.revokeObjectURL(url); }}>Экспорт CSV (mentors.csv)</Button>
            <Button className='btn secondary' onClick={()=>{ const csv=toCSV(ranked.slice(0,10).map(m=>({name:m.name,score:m.score,city:m.city}))); const blob=new Blob([csv],{type:'text/csv;charset=utf-8;'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='matches.csv'; a.click(); URL.revokeObjectURL(url); }}>Экспорт CSV (matches.csv)</Button>
          </CardContent>
        </Card>
      </div>
    </main>

    <footer className="container" style={{marginTop:24, fontSize:12, color:'#6b7280'}}>
      <hr/>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:8}}>
        <p>© 2025 «Инклюзия+». Наставничество 360° для цифровых и креативных профессий.</p>
        <div style={{display:'flex', gap:8, alignItems:'center'}}>
          <Badge variant='outline'>MVP</Badge><Badge variant='outline'>Пилот · вуз/регион</Badge>
          <span>Язык:</span>
          <Button className='btn secondary' onClick={()=>setLang('ru')}>RU</Button>
          <Button className='btn secondary' onClick={()=>setLang('en')}>EN</Button>
          {session ? <Button className='btn secondary' onClick={()=>{ try{ supabase.auth.signOut(); }catch{} }}>Выйти</Button>
                   : <Button onClick={()=>{ const email = prompt('Email для входа (magic link)') || ''; if (email) supabase.auth.signInWithOtp({ email }).then(()=>toast('Письмо со ссылкой отправлено')); }}>Войти</Button>}
        </div>
      </div>
    </footer>
  </div>;
}