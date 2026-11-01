"use client";

import { ArrowUpRight, Github, Link2 } from "lucide-react";
import { useState } from "react";
import { projects } from "@/data/portfolio";

const filters = ["All", "Full-Stack", "AI/ML", "Experimental"];

function ProjectPreview({ id, title }: { id: string; title: string }) {
  if (id === "01") return <div className="project-preview preview-psy" aria-label={`${title} interface preview`}><div className="preview-window"><div className="preview-bar"><i/><i/><i/><span>PSYTRACE / SESSION_01</span></div><div className="chat-line user">How has today felt?</div><div className="chat-line ai"><b>Emotion signal detected</b><span>Let&apos;s unpack that together.</span></div><div className="preview-wave"/></div></div>;
  if (id === "02") return <div className="project-preview preview-ticket" aria-label={`${title} interface preview`}><div className="ticket-side">TS<br/><small>SYNC</small></div><div className="ticket-board"><div className="preview-bar"><span>OPEN TICKETS</span><b>LIVE</b></div>{["Hostel maintenance", "Network access", "Faculty review"].map((ticket, index) => <div className="ticket-row" key={ticket}><i className={`priority p${index}`}/><span>{ticket}</span><b>↗</b></div>)}</div></div>;
  if (id === "03") return <div className="project-preview preview-nutri" aria-label={`${title} interface preview`}><div className="nutri-top">🥗 <b>NutriGuard</b><span>AI nutrition scan</span></div><div className="nutri-upload"><span>⌁</span><b>Upload a food image</b><small>JPG · JPEG · PNG</small></div><div className="nutri-action">⌕ ANALYZE PICTURE</div></div>;
  return <div className="project-preview preview-market" aria-label={`${title} interface preview`}><div className="market-top"><span>MARKET SIGNAL / RESEARCH</span><b>LIVE DATA</b></div><div className="market-chart"><i/><i/><i/><i/><i/><i/><svg viewBox="0 0 300 100" preserveAspectRatio="none" aria-hidden="true"><polyline points="0,76 24,60 50,68 78,37 108,50 137,27 164,49 196,32 222,38 250,15 280,28 300,9"/></svg></div><div className="market-foot"><span>FORECAST</span><span>SENTIMENT</span><span>HISTORY</span></div></div>;
}

export function ProjectGrid() {
  const [filter, setFilter] = useState("All");
  const visible = filter === "All" ? projects : projects.filter(p => p.category === filter);
  return <><div className="filter-row" role="tablist">{filters.map(item => <button key={item} role="tab" aria-selected={filter === item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item}</button>)}</div><div className="project-grid">{visible.map(p => <article className={`project-card ${p.accent}`} key={p.id}><ProjectPreview id={p.id} title={p.title}/><div className="project-content"><div className="project-meta"><span>{p.category}</span><span>{p.status}</span></div><h3>{p.title} <em>{p.subtitle}</em></h3><p>{p.description}</p><ul>{p.features.map(f => <li key={f}>{f}</li>)}</ul><div className="project-bottom"><div>{p.stack.map(s => <span className="tag" key={s}>{s}</span>)}</div><div className="project-links">{p.repository ? <a aria-label={`${p.title} GitHub repository`} href={p.repository} target="_blank" rel="noreferrer"><Github size={14}/> Source</a> : <span title="Repository link has not been added"><Github size={14}/> Pending</span>}{p.live ? <a aria-label={`${p.title} live project`} href={p.live} target="_blank" rel="noreferrer"><ArrowUpRight size={15}/> Demo</a> : <span title="Live demo link has not been added"><Link2 size={14}/> Pending</span>}</div></div></div></article>)}</div></>;
}
