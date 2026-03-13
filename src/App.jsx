import { useState, useEffect } from "react";
import { ComposedChart, Area, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from "recharts";

// ─── CSS ─────────────────────────────────────────────────────────────────────

const css = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#07090d;--sur:#0d1117;--s2:#111820;--s3:#161f2c;
  --bdr:#1c2636;--b2:#243040;
  --G:#00e87a;--B:#29b6f6;--O:#ff7043;--Y:#ffd54f;--P:#ce93d8;--R:#ef5350;--T:#80cbc4;
  --tx:#dce8f5;--mu:#5a7a9a;--dim:#2a3d52;
  --fn:'Syne',sans-serif;--mo:'JetBrains Mono',monospace;
}
body{background:var(--bg);}
.app{min-height:100vh;background:var(--bg);color:var(--tx);font-family:var(--fn);}

/* HDR */
.hdr{position:sticky;top:0;z-index:200;background:rgba(7,9,13,.95);backdrop-filter:blur(16px);
  border-bottom:1px solid var(--bdr);padding:12px 28px;display:flex;align-items:center;justify-content:space-between;}
.logo{display:flex;align-items:center;gap:10px;}
.pulse{width:7px;height:7px;border-radius:50%;background:var(--G);box-shadow:0 0 8px var(--G);animation:blink 2s infinite;}
@keyframes blink{0%,100%{opacity:1;}50%{opacity:.3;}}
.logo-name{font-size:14px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;}
.logo-tag{font-family:var(--mo);font-size:9px;color:var(--mu);letter-spacing:.1em;}
.hdr-r{display:flex;align-items:center;gap:14px;font-family:var(--mo);font-size:10px;color:var(--mu);}
.hdr-nav{display:flex;align-items:center;gap:2px;}
.nav-btn{padding:6px 14px;border-radius:6px;border:none;background:transparent;
  color:var(--mu);font-family:var(--fn);font-size:11px;font-weight:700;letter-spacing:.08em;
  text-transform:uppercase;cursor:pointer;transition:all .18s;}
.nav-btn:hover{color:var(--tx);}
.nav-btn.nav-act{background:var(--s2);color:var(--tx);border:1px solid var(--bdr);}

/* SOURCE CITATIONS */
.src-refs{display:flex;flex-wrap:wrap;gap:5px;padding:8px 20px 10px;border-top:1px solid var(--bdr);background:rgba(41,182,246,.018);}
.src-ref-pill{display:flex;align-items:flex-start;gap:5px;
  background:var(--s2);border:1px solid var(--bdr);border-radius:5px;
  padding:4px 8px;font-family:var(--mo);font-size:9px;line-height:1.5;
  transition:border-color .15s;}
.src-ref-pill:hover{border-color:var(--B);}
.src-ref-name{color:var(--B);font-weight:600;white-space:nowrap;flex-shrink:0;}
.src-ref-sep{color:var(--dim);flex-shrink:0;margin:0 2px;}
.src-ref-insight{color:var(--mu);}
.src-refs-lbl{font-family:var(--mo);font-size:8px;color:var(--dim);letter-spacing:.12em;
  text-transform:uppercase;width:100%;margin-bottom:3px;}
.theme-refs{margin-top:12px;padding-top:12px;border-top:1px solid var(--bdr);}
.theme-refs-lbl{font-family:var(--mo);font-size:8px;color:var(--mu);letter-spacing:.14em;
  text-transform:uppercase;margin-bottom:7px;}
.con-src-ref{margin-top:5px;font-family:var(--mo);font-size:9px;color:#8a6a6a;line-height:1.5;}
.con-src-ref span{color:#c07070;margin-right:3px;font-weight:600;}
.dt-src-refs{display:flex;flex-wrap:wrap;gap:5px;padding:10px 20px 14px;border-top:1px solid var(--bdr);}
.dt-src-refs-lbl{font-family:var(--mo);font-size:8px;color:var(--mu);letter-spacing:.12em;
  text-transform:uppercase;width:100%;margin-bottom:4px;}
.dt-key-headlines{padding:10px 20px 14px;border-top:1px solid var(--bdr);display:flex;flex-direction:column;gap:6px;}
.dt-hl-item{display:flex;flex-direction:column;gap:2px;padding:7px 10px;background:var(--s2);border:1px solid var(--bdr);border-radius:6px;text-decoration:none;color:inherit;transition:border-color .15s;}
.dt-hl-item:hover{border-color:var(--B);}
.dt-hl-meta{font-family:var(--mo);font-size:8px;color:var(--mu);letter-spacing:.04em;display:flex;align-items:center;gap:6px;}
.dt-hl-hint{color:var(--B);font-size:8px;margin-left:auto;}
.dt-hl-title{font-size:11px;color:var(--tx);line-height:1.4;margin-top:1px;}
.live-hl-section{margin-top:14px;}
.live-hl-lbl{font-family:var(--mo);font-size:8px;color:var(--mu);letter-spacing:.12em;text-transform:uppercase;margin-bottom:6px;}
.live-hl-item{display:flex;flex-direction:column;gap:2px;padding:7px 10px;background:var(--s2);border:1px solid var(--bdr);border-radius:6px;margin-bottom:5px;text-decoration:none;color:inherit;transition:border-color .15s;}
.live-hl-item:hover{border-color:var(--B);}
.live-hl-meta{font-family:var(--mo);font-size:8px;color:var(--mu);display:flex;align-items:center;gap:6px;}
.live-hl-hint{color:var(--B);font-size:8px;margin-left:auto;}
.live-hl-title{font-size:11px;color:var(--tx);line-height:1.4;margin-top:1px;}

/* ── PORTFOLIO ── */
.port-wrap{display:flex;height:calc(100vh - 54px);overflow:hidden;}
.port-left{flex:1;min-width:0;min-height:0;overflow-y:auto;padding:24px;border-right:1px solid var(--bdr);display:flex;flex-direction:column;gap:18px;}
.port-left>*{flex-shrink:0;}
.port-right{width:420px;flex-shrink:0;min-height:0;overflow-y:auto;padding:18px;display:flex;flex-direction:column;gap:10px;}
.port-right>*{flex-shrink:0;}

/* Summary bar */
.port-summary{background:var(--sur);border:1px solid var(--bdr);border-radius:12px;padding:16px 18px;}
.port-summary-title{font-size:13px;font-weight:800;margin-bottom:12px;display:flex;align-items:center;justify-content:space-between;}
.port-kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;}
.port-kpi{background:var(--s2);border:1px solid var(--bdr);border-radius:8px;padding:10px;text-align:center;}
.port-kv{font-family:var(--mo);font-size:14px;font-weight:700;}
.port-kl{font-family:var(--mo);font-size:8px;color:var(--mu);text-transform:uppercase;letter-spacing:.1em;margin-top:2px;}

/* Position cards */
.pos-card{background:var(--sur);border:1px solid var(--bdr);border-radius:10px;
  padding:12px 14px;cursor:pointer;transition:all .18s;position:relative;}
.pos-card:hover{border-color:var(--b2);transform:translateX(-2px);}
.pos-card.selected{border-color:var(--B);background:rgba(41,182,246,.04);}
.pos-card-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:8px;}
.pos-tkr{font-family:var(--mo);font-size:12px;font-weight:700;color:var(--G);
  background:rgba(0,232,122,.07);padding:2px 8px;border-radius:5px;border:1px solid rgba(0,232,122,.18);}
.pos-name{font-size:12px;font-weight:700;margin-top:1px;}
.pos-date{font-family:var(--mo);font-size:9px;color:var(--mu);margin-top:1px;}
.pos-price-block{text-align:right;}
.pos-price{font-family:var(--mo);font-size:15px;font-weight:700;}
.pos-1d{font-family:var(--mo);font-size:10px;margin-top:1px;}
.pos-pnl-row{display:flex;align-items:center;justify-content:space-between;
  padding-top:8px;border-top:1px solid var(--bdr);margin-top:4px;}
.pos-pnl{font-family:var(--mo);font-size:12px;font-weight:700;}
.pos-changes{display:flex;gap:6px;flex-wrap:wrap;}
.pos-chg{font-family:var(--mo);font-size:9px;padding:2px 5px;background:var(--s2);
  border:1px solid var(--bdr);border-radius:3px;color:var(--mu);}
.pos-chg.up{color:var(--G);border-color:rgba(0,232,122,.2);background:rgba(0,232,122,.05);}
.pos-chg.dn{color:var(--O);border-color:rgba(255,112,67,.2);background:rgba(255,112,67,.05);}
.pos-entry-chg{font-family:var(--mo);font-size:10px;padding:2px 7px;border-radius:4px;}
.pos-entry-chg.up{color:var(--G);background:rgba(0,232,122,.08);border:1px solid rgba(0,232,122,.2);}
.pos-entry-chg.dn{color:var(--O);background:rgba(255,112,67,.08);border:1px solid rgba(255,112,67,.2);}

/* Add position button */
.add-pos-btn{display:flex;align-items:center;justify-content:center;gap:8px;
  padding:11px;border-radius:10px;border:1px dashed var(--bdr);background:transparent;
  color:var(--mu);font-family:var(--fn);font-size:11px;font-weight:700;letter-spacing:.08em;
  cursor:pointer;transition:all .18s;text-transform:uppercase;}
.add-pos-btn:hover{border-color:var(--G);color:var(--G);}

/* Empty state */
.port-empty{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:10px;color:var(--mu);font-family:var(--mo);font-size:11px;text-align:center;padding:40px;}
.port-empty-icon{font-size:40px;opacity:.4;}

/* Detail: chart + news */
.detail-header{background:var(--sur);border:1px solid var(--bdr);border-radius:12px;padding:16px 18px;}
.detail-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:12px;}
.detail-name{font-size:18px;font-weight:800;}
.detail-sector{font-family:var(--mo);font-size:10px;color:var(--mu);margin-top:2px;}
.detail-prices{text-align:right;}
.detail-price{font-family:var(--mo);font-size:22px;font-weight:700;}
.detail-sub{font-family:var(--mo);font-size:10px;color:var(--mu);margin-top:2px;}
.detail-strips{display:flex;gap:10px;flex-wrap:wrap;padding-top:10px;border-top:1px solid var(--bdr);}

.detail-chart-wrap{background:var(--sur);border:1px solid var(--bdr);border-radius:12px;padding:16px 18px;}
.detail-chart-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;}
.detail-chart-title{font-size:13px;font-weight:700;}
.chart-range-btns{display:flex;gap:4px;}
.crb{padding:4px 10px;border-radius:5px;border:1px solid var(--bdr);background:transparent;
  color:var(--mu);font-family:var(--mo);font-size:9px;cursor:pointer;transition:all .15s;}
.crb.act{border-color:var(--B);color:var(--B);background:rgba(41,182,246,.08);}

/* News section */
.news-wrap{background:var(--sur);border:1px solid var(--bdr);border-radius:12px;overflow:hidden;}
.news-header{padding:14px 18px;border-bottom:1px solid var(--bdr);display:flex;align-items:center;justify-content:space-between;}
.news-title{font-size:13px;font-weight:700;}
.news-sub{font-family:var(--mo);font-size:9px;color:var(--mu);}
.news-item{padding:12px 18px;border-bottom:1px solid var(--bdr);transition:background .15s;display:block;text-decoration:none;color:inherit;}
.news-item:last-child{border-bottom:none;}
.news-item:hover{background:var(--s2);}
.news-item-clickable{cursor:pointer;}
.news-item-clickable:hover{background:var(--s2);}
.news-item-top{display:flex;align-items:center;gap:8px;margin-bottom:5px;flex-wrap:wrap;}
.news-sentiment{font-family:var(--mo);font-size:8px;padding:2px 6px;border-radius:3px;letter-spacing:.08em;text-transform:uppercase;}
.ns-pos{color:var(--G);background:rgba(0,232,122,.08);border:1px solid rgba(0,232,122,.18);}
.ns-neg{color:var(--O);background:rgba(255,112,67,.08);border:1px solid rgba(255,112,67,.18);}
.ns-neu{color:var(--mu);background:var(--s2);border:1px solid var(--bdr);}
.news-rel{font-family:var(--mo);font-size:8px;color:var(--dim);letter-spacing:.06em;}
.news-date{font-family:var(--mo);font-size:8px;color:var(--dim);margin-left:auto;}
.news-headline{font-size:12px;font-weight:700;margin-bottom:3px;line-height:1.4;}
.news-summary{font-family:var(--mo);font-size:10px;color:#7a9fbf;line-height:1.6;}
.news-link-hint{font-family:var(--mo);font-size:8px;color:var(--B);margin-top:4px;opacity:.7;}
.news-loading{padding:28px;text-align:center;font-family:var(--mo);font-size:11px;color:var(--mu);}

/* Earnings alert */
.earnings-card{background:var(--sur);border:1px solid var(--bdr);border-radius:12px;
  padding:16px 18px;border-left:3px solid var(--Y);}
.earnings-top{display:flex;align-items:center;gap:10px;margin-bottom:8px;}
.earnings-icon{font-size:20px;}
.earnings-label{font-family:var(--mo);font-size:9px;color:var(--Y);letter-spacing:.12em;text-transform:uppercase;}
.earnings-date{font-size:15px;font-weight:800;margin-top:1px;}
.earnings-meta{font-family:var(--mo);font-size:10px;color:var(--mu);line-height:1.6;}
.earnings-countdown{font-family:var(--mo);font-size:11px;color:var(--Y);margin-top:6px;font-weight:600;}

/* Modal */
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:500;display:flex;align-items:center;justify-content:center;padding:20px;}
.modal{background:var(--sur);border:1px solid var(--bdr);border-radius:16px;width:100%;max-width:480px;max-height:90vh;overflow-y:auto;}
.modal-hdr{padding:18px 20px 14px;border-bottom:1px solid var(--bdr);display:flex;align-items:center;justify-content:space-between;}
.modal-title{font-size:15px;font-weight:800;}
.modal-close{background:none;border:none;color:var(--mu);font-size:18px;cursor:pointer;padding:4px;line-height:1;}
.modal-close:hover{color:var(--tx);}
.modal-body{padding:20px;}
.field{margin-bottom:14px;}
.field label{display:block;font-family:var(--mo);font-size:9px;color:var(--mu);letter-spacing:.12em;text-transform:uppercase;margin-bottom:5px;}
.field input,.field select{width:100%;background:var(--s2);border:1px solid var(--bdr);border-radius:7px;
  padding:9px 12px;color:var(--tx);font-family:var(--mo);font-size:12px;outline:none;transition:border-color .18s;}
.field input:focus,.field select:focus{border-color:var(--G);}
.field select option{background:var(--s2);}
.field-row{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.field-hint{font-family:var(--mo);font-size:9px;color:var(--dim);margin-top:4px;}
.modal-footer{padding:14px 20px;border-top:1px solid var(--bdr);display:flex;gap:8px;justify-content:flex-end;}
.btn-cancel{padding:9px 18px;border-radius:7px;border:1px solid var(--bdr);background:transparent;
  color:var(--mu);font-family:var(--fn);font-size:11px;font-weight:700;cursor:pointer;}
.btn-save{padding:9px 18px;border-radius:7px;border:none;background:var(--G);color:#07090d;
  font-family:var(--fn);font-size:11px;font-weight:800;cursor:pointer;letter-spacing:.06em;}
.btn-save:disabled{opacity:.4;cursor:not-allowed;}

@media(max-width:800px){
  .port-wrap{flex-direction:column;height:auto;}
  .port-right{width:100%;border-right:none;border-top:1px solid var(--bdr);}
  .port-left{border-right:none;}
}

/* SOURCES HUB */
.hub{max-width:1020px;margin:0 auto;padding:32px 22px 80px;animation:fi .4s ease;}
.hub-hero{margin-bottom:28px;}
.hub-hero h2{font-size:26px;font-weight:800;background:linear-gradient(120deg,#dce8f5 0%,#3a5a80 100%);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.hub-hero p{margin-top:5px;font-family:var(--mo);font-size:10px;color:var(--mu);letter-spacing:.07em;}
.hub-filters{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:24px;}
.hf-btn{padding:5px 14px;border-radius:20px;border:1px solid var(--bdr);background:transparent;
  color:var(--mu);font-family:var(--mo);font-size:10px;cursor:pointer;transition:all .15s;letter-spacing:.05em;}
.hf-btn:hover{border-color:var(--B);color:var(--B);}
.hf-btn.hf-act{border-color:var(--B);background:rgba(41,182,246,.08);color:var(--B);}
.hub-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:14px;}
.src-card{background:var(--sur);border:1px solid var(--bdr);border-radius:12px;overflow:hidden;
  transition:border-color .2s,transform .2s;cursor:pointer;}
.src-card:hover{border-color:var(--b2);transform:translateY(-2px);}
.src-card a{text-decoration:none;color:inherit;display:block;}
.src-top{padding:14px 16px 10px;border-bottom:1px solid var(--bdr);}
.src-meta{display:flex;align-items:center;gap:8px;margin-bottom:8px;flex-wrap:wrap;}
.src-cat{font-family:var(--mo);font-size:8px;padding:2px 7px;border-radius:3px;
  letter-spacing:.12em;text-transform:uppercase;font-weight:600;}
.src-tag{font-family:var(--mo);font-size:8px;padding:2px 6px;border-radius:3px;
  background:var(--s2);border:1px solid var(--bdr);color:var(--mu);}
.src-name{font-size:14px;font-weight:800;margin-bottom:3px;display:flex;align-items:center;gap:8px;}
.src-handle{font-family:var(--mo);font-size:10px;color:var(--mu);}
.src-desc{font-family:var(--mo);font-size:10px;color:#7a9fbc;line-height:1.65;padding:10px 16px 12px;}
.src-footer{padding:8px 16px;background:var(--s2);border-top:1px solid var(--bdr);
  display:flex;align-items:center;justify-content:space-between;gap:8px;}
.src-why{font-family:var(--mo);font-size:9px;color:var(--mu);line-height:1.5;flex:1;}
.src-link{font-family:var(--mo);font-size:9px;color:var(--B);white-space:nowrap;letter-spacing:.04em;}

/* ── INTERESTS DASHBOARD ── */
.int-dash{max-width:1400px;margin:0 auto;padding:32px 22px 80px;animation:fi .4s ease;}
.int-hero{margin-bottom:28px;}
.int-hero h2{font-size:24px;font-weight:800;color:var(--tx);margin-bottom:5px;}
.int-hero p{font-family:var(--mo);font-size:10px;color:var(--mu);letter-spacing:.07em;}
.int-strips{display:flex;gap:16px;overflow-x:auto;padding-bottom:16px;}
.int-strips::-webkit-scrollbar{height:4px;}
.int-strips::-webkit-scrollbar-track{background:var(--sur);}
.int-strips::-webkit-scrollbar-thumb{background:var(--bdr);border-radius:2px;}
.int-strip{flex:0 0 290px;background:var(--sur);border:1px solid var(--bdr);border-radius:12px;overflow:hidden;display:flex;flex-direction:column;}
.int-strip-hdr{padding:13px 16px;border-bottom:1px solid var(--bdr);background:var(--s2);display:flex;align-items:center;justify-content:space-between;gap:8px;}
.int-strip-title{font-size:11px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--tx);display:flex;align-items:center;gap:7px;}
.int-strip-emoji{font-size:14px;}
.int-strip-refresh{background:none;border:1px solid var(--bdr);color:var(--mu);cursor:pointer;font-size:12px;padding:2px 7px;border-radius:4px;transition:all .15s;line-height:1;}
.int-strip-refresh:hover{color:var(--tx);border-color:var(--b2);}
.int-strip-refresh.spinning{animation:spin .6s linear infinite;}
@keyframes spin{to{transform:rotate(360deg);}}
.int-strip-body{padding:12px;display:flex;flex-direction:column;gap:8px;flex:1;}
.int-item{padding:10px 12px;background:var(--s3);border:1px solid var(--bdr);border-radius:8px;border-left:3px solid var(--dim);transition:border-color .15s,background .15s;}
.int-item.bullish{border-left-color:var(--G);}
.int-item.bearish{border-left-color:var(--R);}
.int-item.neutral{border-left-color:var(--B);}
.int-item-clickable{display:block;text-decoration:none;cursor:pointer;}
.int-item-clickable:hover{background:var(--s2);border-color:var(--mu);}
.int-item-top{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:5px;}
.int-item-hl{font-size:11px;font-weight:700;color:var(--tx);line-height:1.4;flex:1;}
.int-item-date{font-family:var(--mo);font-size:8px;color:var(--dim);white-space:nowrap;margin-top:1px;flex-shrink:0;}
.int-item-sum{font-family:var(--mo);font-size:9.5px;color:var(--mu);line-height:1.6;margin-bottom:6px;}
.int-item-foot{display:flex;align-items:center;gap:8px;}
.int-item-link-hint{font-family:var(--mo);font-size:8px;color:var(--B);margin-left:auto;opacity:.7;}
.int-tag{font-family:var(--mo);font-size:8px;color:var(--B);letter-spacing:.1em;text-transform:uppercase;background:rgba(41,182,246,.07);padding:2px 6px;border-radius:3px;}
.int-sent{font-family:var(--mo);font-size:9px;letter-spacing:.04em;}
.int-sent.bullish{color:var(--G);}
.int-sent.bearish{color:var(--R);}
.int-sent.neutral{color:var(--mu);}
.int-loading{padding:40px 16px;display:flex;flex-direction:column;align-items:center;gap:10px;color:var(--mu);font-family:var(--mo);font-size:10px;}
.int-spinner{width:20px;height:20px;border:2px solid var(--bdr);border-top-color:var(--B);border-radius:50%;animation:spin .8s linear infinite;}
.int-error{padding:20px 16px;color:var(--R);font-family:var(--mo);font-size:10px;text-align:center;line-height:1.6;}
.int-cached{font-family:var(--mo);font-size:8px;color:var(--dim);padding:8px 12px;border-top:1px solid var(--bdr);text-align:right;letter-spacing:.06em;}

/* ── ASK ROY ── */
.roy-wrap{background:var(--sur);border:1px solid var(--bdr);border-radius:12px;}
.roy-hdr{padding:12px 16px;border-bottom:1px solid var(--bdr);background:var(--s2);display:flex;align-items:center;gap:10px;}
.roy-avatar{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#1a3a5c,#0d6e6e);border:1px solid var(--B);display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0;}
.roy-name{font-size:12px;font-weight:800;color:var(--tx);letter-spacing:.06em;}
.roy-title{font-family:var(--mo);font-size:9px;color:var(--mu);letter-spacing:.05em;}
.roy-body{padding:14px 16px;display:flex;flex-direction:column;gap:12px;}
.roy-input-row{display:flex;gap:8px;align-items:flex-end;}
.roy-input{flex:1;background:var(--s3);border:1px solid var(--bdr);border-radius:8px;padding:10px 14px;color:var(--tx);font-family:var(--fn);font-size:12px;resize:none;min-height:42px;max-height:100px;transition:border-color .15s;line-height:1.5;}
.roy-input:focus{outline:none;border-color:var(--B);}
.roy-input::placeholder{color:var(--dim);}
.roy-send{padding:10px 16px;background:var(--B);color:#000;border:none;border-radius:8px;font-family:var(--fn);font-size:11px;font-weight:800;cursor:pointer;letter-spacing:.06em;transition:opacity .15s;white-space:nowrap;height:42px;}
.roy-send:hover{opacity:.85;}
.roy-send:disabled{opacity:.4;cursor:not-allowed;}
.roy-response{background:var(--s3);border:1px solid var(--bdr);border-left:3px solid var(--B);border-radius:8px;padding:14px 16px;animation:fi .3s ease;}
.roy-response-hdr{font-family:var(--mo);font-size:9px;color:var(--B);letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px;}
.roy-response-q{font-family:var(--mo);font-size:10px;color:var(--mu);margin-bottom:10px;font-style:italic;}
.roy-response-text{font-size:12px;color:var(--tx);line-height:1.75;white-space:pre-wrap;}
.roy-thinking{display:flex;align-items:center;gap:8px;font-family:var(--mo);font-size:10px;color:var(--mu);padding:8px 0;}
.roy-dots span{display:inline-block;width:5px;height:5px;border-radius:50%;background:var(--B);margin:0 2px;animation:bounce .9s infinite;}
.roy-dots span:nth-child(2){animation-delay:.15s;}
.roy-dots span:nth-child(3){animation-delay:.3s;}
@keyframes bounce{0%,80%,100%{transform:translateY(0);}40%{transform:translateY(-6px);}}
.src-link:hover{color:var(--G);}
.src-emoji{font-size:22px;flex-shrink:0;}
.src-url-box{padding:8px 16px 12px;border-top:1px solid var(--bdr);background:var(--s2);}
.src-url-label{display:block;font-family:var(--mo);font-size:8px;color:var(--mu);letter-spacing:.1em;text-transform:uppercase;margin-bottom:4px;}
.src-url-text{display:block;font-family:var(--mo);font-size:10px;color:var(--B);word-break:break-all;line-height:1.5;
  user-select:all;cursor:text;padding:4px 6px;border-radius:4px;border:1px solid var(--bdr);background:var(--bg);}
.src-url-text:hover{border-color:var(--B);}
.hub-section-title{font-family:var(--mo);font-size:9px;color:var(--mu);letter-spacing:.18em;
  text-transform:uppercase;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid var(--bdr);}
@media(max-width:600px){.hub-grid{grid-template-columns:1fr;}}

/* LAYOUT */
.main{max-width:1020px;margin:0 auto;padding:32px 22px 80px;}
.hero{margin-bottom:26px;}
.hero h1{font-size:30px;font-weight:800;line-height:1.1;
  background:linear-gradient(120deg,#dce8f5 0%,#3a5a80 100%);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.hero p{margin-top:5px;font-family:var(--mo);font-size:10px;color:var(--mu);letter-spacing:.07em;}

/* SEARCH PANEL */
.sp{background:var(--sur);border:1px solid var(--bdr);border-radius:14px;padding:20px;margin-bottom:22px;}
.modes{display:flex;gap:8px;margin-bottom:16px;}
.mbtn{flex:1;padding:9px;border-radius:8px;border:1px solid var(--bdr);background:transparent;color:var(--mu);
  font-family:var(--fn);font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;
  cursor:pointer;transition:all .18s;display:flex;align-items:center;justify-content:center;gap:6px;}
.mbtn:hover:not(.act){border-color:var(--b2);color:var(--tx);}
.mbtn.act.lng{border-color:var(--B);background:rgba(41,182,246,.08);color:var(--B);}
.mbtn.act.sht{border-color:var(--O);background:rgba(255,112,67,.08);color:var(--O);}
.irow{display:flex;gap:10px;}
.qi{flex:1;background:var(--s2);border:1px solid var(--bdr);border-radius:8px;padding:11px 14px;
  color:var(--tx);font-family:var(--mo);font-size:13px;outline:none;transition:border-color .18s;}
.qi:focus{border-color:var(--G);}
.qi::placeholder{color:var(--dim);}
.gbtn{padding:11px 22px;background:var(--G);color:#07090d;border:none;border-radius:8px;
  font-family:var(--fn);font-size:11px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;
  cursor:pointer;transition:all .18s;white-space:nowrap;}
.gbtn:hover:not(:disabled){background:#00ff87;transform:translateY(-1px);}
.gbtn:disabled{opacity:.35;cursor:not-allowed;}
.tags{margin-top:11px;display:flex;flex-wrap:wrap;gap:6px;}
.tag{padding:3px 9px;background:var(--s2);border:1px solid var(--bdr);border-radius:20px;
  font-size:10px;color:var(--mu);cursor:pointer;font-family:var(--mo);transition:all .15s;}
.tag:hover{border-color:var(--G);color:var(--G);}

/* ── DAILY TREND PICK ── */
.dt-wrap{margin-bottom:22px;animation:fi .5s ease;}
.dt-card{background:var(--sur);border:1px solid var(--bdr);border-radius:14px;overflow:hidden;
  border-top:2px solid var(--P);}
.dt-header{padding:16px 20px 14px;display:flex;align-items:flex-start;justify-content:space-between;gap:12px;
  border-bottom:1px solid var(--bdr);}
.dt-left{flex:1;min-width:0;}
.dt-meta{display:flex;align-items:center;gap:8px;margin-bottom:8px;flex-wrap:wrap;}
.dt-label{font-family:var(--mo);font-size:9px;letter-spacing:.18em;text-transform:uppercase;
  color:var(--P);background:rgba(206,147,216,.08);border:1px solid rgba(206,147,216,.2);
  padding:2px 8px;border-radius:3px;}
.dt-source{font-family:var(--mo);font-size:9px;color:var(--mu);letter-spacing:.06em;}
.dt-frame{font-family:var(--mo);font-size:9px;color:var(--T);background:rgba(128,203,196,.08);
  border:1px solid rgba(128,203,196,.18);padding:2px 8px;border-radius:3px;}
.dt-headline{font-size:16px;font-weight:800;line-height:1.25;margin-bottom:6px;}
.dt-summary{font-family:var(--mo);font-size:11px;color:#8aabb8;line-height:1.7;}
.dt-signal{margin-top:10px;padding:8px 12px;background:var(--s2);border-left:2px solid var(--P);
  border-radius:4px;font-family:var(--mo);font-size:10px;color:var(--mu);line-height:1.6;}
.dt-signal span{color:var(--P);margin-right:6px;}
.dt-right{display:flex;flex-direction:column;gap:6px;align-items:flex-end;flex-shrink:0;}
.dt-emoji{font-size:36px;line-height:1;}
.refresh-btn{padding:5px 12px;border-radius:6px;border:1px solid var(--bdr);background:transparent;
  color:var(--mu);font-family:var(--mo);font-size:9px;cursor:pointer;letter-spacing:.06em;
  transition:all .15s;white-space:nowrap;}
.refresh-btn:hover:not(:disabled){border-color:var(--P);color:var(--P);}
.refresh-btn:disabled{opacity:.4;cursor:not-allowed;}
.dt-impacts{display:grid;grid-template-columns:1fr 1fr;gap:0;border-top:1px solid var(--bdr);}
.dt-col{padding:16px 20px;}
.dt-col:first-child{border-right:1px solid var(--bdr);}
.dt-col-lbl{font-family:var(--mo);font-size:9px;letter-spacing:.15em;text-transform:uppercase;
  margin-bottom:10px;font-weight:700;}
.dt-col.pos .dt-col-lbl{color:var(--G);}
.dt-col.neg .dt-col-lbl{color:var(--O);}
.dt-impact-item{margin-bottom:10px;padding-bottom:10px;border-bottom:1px solid var(--bdr);}
.dt-impact-item:last-child{margin-bottom:0;padding-bottom:0;border-bottom:none;}
.dt-impact-hdr{display:flex;align-items:center;gap:8px;margin-bottom:4px;}
.dt-iticker{font-family:var(--mo);font-size:11px;font-weight:600;padding:2px 6px;border-radius:4px;}
.pos .dt-iticker{color:var(--G);background:rgba(0,232,122,.08);border:1px solid rgba(0,232,122,.18);}
.neg .dt-iticker{color:var(--O);background:rgba(255,112,67,.08);border:1px solid rgba(255,112,67,.18);}
.dt-isector{font-family:var(--mo);font-size:9px;color:var(--mu);}
.dt-ireason{font-family:var(--mo);font-size:10px;color:#7a9fbf;line-height:1.6;}
.dt-loading{padding:28px 20px;text-align:center;font-family:var(--mo);font-size:11px;color:var(--mu);}
.dt-loading-bar{width:160px;height:2px;background:var(--s2);border-radius:2px;margin:12px auto 0;overflow:hidden;}
.dt-loading-fill{height:100%;background:linear-gradient(90deg,var(--P),var(--B));border-radius:2px;animation:shimmer 1.4s ease-in-out infinite;}
@keyframes shimmer{0%{width:0%;margin-left:0%;}50%{width:60%;margin-left:20%;}100%{width:0%;margin-left:100%;}}

/* LOADING */
.lw{background:var(--sur);border:1px solid var(--bdr);border-radius:12px;padding:34px;text-align:center;}
.lt{font-size:15px;font-weight:700;margin-bottom:6px;}
.ls{font-family:var(--mo);font-size:11px;color:var(--mu);letter-spacing:.05em;}
.pt{width:220px;height:2px;background:var(--s2);border-radius:2px;margin:16px auto 0;overflow:hidden;}
.pf{height:100%;background:linear-gradient(90deg,var(--G),var(--B));border-radius:2px;transition:width .5s ease;}
.phases{display:flex;justify-content:center;gap:18px;margin-top:12px;}
.ps{display:flex;align-items:center;gap:5px;font-family:var(--mo);font-size:10px;color:var(--dim);}
.ps.done{color:var(--G);}
.ps.act{color:var(--tx);}
.pd{width:5px;height:5px;border-radius:50%;background:currentColor;}

/* ERR */
.err{background:rgba(255,112,67,.06);border:1px solid rgba(255,112,67,.25);border-radius:10px;
  padding:16px;color:var(--O);font-family:var(--mo);font-size:12px;line-height:1.6;}

/* RESULTS */
.res{display:flex;flex-direction:column;gap:22px;animation:fi .4s ease;}
@keyframes fi{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
.slbl{font-family:var(--mo);font-size:9px;color:var(--mu);letter-spacing:.18em;text-transform:uppercase;margin-bottom:10px;}

/* OVERVIEW */
.ov{background:var(--sur);border:1px solid var(--bdr);border-radius:14px;padding:20px;border-left:3px solid var(--B);}
.ov-t{font-size:19px;font-weight:800;margin-bottom:4px;display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
.ov-s{font-family:var(--mo);font-size:11px;color:#8aabb8;line-height:1.72;margin-bottom:14px;}
.kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;}
.kpi{background:var(--s2);border:1px solid var(--bdr);border-radius:8px;padding:11px;text-align:center;}
.kv{font-size:14px;font-weight:700;font-family:var(--mo);}
.kl{font-size:9px;color:var(--mu);text-transform:uppercase;letter-spacing:.1em;margin-top:2px;}
.cG{color:var(--G);}.cB{color:var(--B);}.cO{color:var(--O);}.cY{color:var(--Y);}
.ov-ts{font-family:var(--mo);font-size:11px;color:#5d8faa;line-height:1.7;margin-top:10px;padding-top:10px;
  border-top:1px solid var(--bdr);font-style:italic;}

/* CHART */
.cc{background:var(--sur);border:1px solid var(--bdr);border-radius:14px;padding:20px;}
.cc-t{font-size:13px;font-weight:700;margin-bottom:2px;}
.cc-s{font-family:var(--mo);font-size:9px;color:var(--mu);margin-bottom:14px;letter-spacing:.04em;}

/* STOCK CARD */
.sc{background:var(--sur);border:1px solid var(--bdr);border-radius:14px;overflow:hidden;transition:border-color .2s;}
.sc:hover{border-color:var(--b2);}
.sc-top{padding:16px 20px 12px;display:flex;gap:14px;border-bottom:1px solid var(--bdr);}
.sc-l{flex:1;min-width:0;}
.sc-cw{width:190px;flex-shrink:0;}
.sc-h{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:8px;flex-wrap:wrap;gap:8px;}
.tkr{font-family:var(--mo);font-size:13px;font-weight:600;color:var(--G);
  background:rgba(0,232,122,.07);padding:3px 9px;border-radius:6px;border:1px solid rgba(0,232,122,.18);}
.sname{font-size:14px;font-weight:700;}
.ssec{font-family:var(--mo);font-size:10px;color:var(--mu);margin-top:1px;}
.bdgs{display:flex;gap:6px;flex-wrap:wrap;align-items:center;}
.bdg{font-family:var(--mo);font-size:9px;padding:3px 7px;border-radius:4px;letter-spacing:.05em;text-transform:uppercase;}
.bH{background:rgba(0,232,122,.09);color:var(--G);border:1px solid rgba(0,232,122,.2);}
.bM{background:rgba(41,182,246,.09);color:var(--B);border:1px solid rgba(41,182,246,.2);}
.bS{background:rgba(255,112,67,.09);color:var(--O);border:1px solid rgba(255,112,67,.2);}
.bBul{background:rgba(0,232,122,.06);color:#5dde9a;border:1px solid rgba(0,232,122,.14);}
.bNeu{background:rgba(90,122,154,.09);color:var(--mu);border:1px solid var(--bdr);}
.bBer{background:rgba(255,112,67,.06);color:#f09070;border:1px solid rgba(255,112,67,.14);}
.pchip{display:flex;flex-direction:column;align-items:flex-end;gap:1px;flex-shrink:0;}
.pcur{font-family:var(--mo);font-size:17px;font-weight:600;}
.pchg{font-family:var(--mo);font-size:10px;}

/* TECH STRIP */
.tstrip{display:flex;gap:14px;flex-wrap:wrap;margin-top:10px;padding-top:10px;border-top:1px solid var(--bdr);}
.ti{display:flex;flex-direction:column;gap:2px;}
.til{font-size:8px;color:var(--mu);text-transform:uppercase;letter-spacing:.1em;font-family:var(--mo);}
.tiv{font-size:11px;font-weight:600;font-family:var(--mo);}

/* THESIS */
.thr{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:13px 20px;border-bottom:1px solid var(--bdr);}
.thb{border-radius:8px;padding:11px;font-family:var(--mo);font-size:11px;line-height:1.66;}
.bull{background:rgba(0,232,122,.04);border:1px solid rgba(0,232,122,.11);color:#7ac9a0;}
.bear{background:rgba(255,112,67,.04);border:1px solid rgba(255,112,67,.11);color:#d4907a;}
.thlbl{font-size:8px;letter-spacing:.15em;text-transform:uppercase;margin-bottom:5px;opacity:.65;font-weight:700;}

/* TREND COMMENT + ENTRY */
.tc{padding:9px 20px;font-family:var(--mo);font-size:11px;color:#7a9fbf;line-height:1.65;
  border-bottom:1px solid var(--bdr);background:rgba(41,182,246,.025);}
.tc span{color:var(--B);margin-right:6px;}
.en{margin:0 20px 11px;padding:7px 12px;background:var(--s2);border-left:2px solid var(--B);
  border-radius:4px;font-family:var(--mo);font-size:10px;color:#7a9fbf;line-height:1.6;}

/* ── CONTRARIAN CARD ── */
.con-card{background:var(--sur);border:1px solid var(--bdr);border-radius:14px;overflow:hidden;
  border-left:3px solid var(--R);}
.con-header{padding:16px 20px;border-bottom:1px solid var(--bdr);}
.con-title{font-size:15px;font-weight:800;color:var(--R);margin-bottom:6px;display:flex;align-items:center;gap:8px;}
.con-who{font-family:var(--mo);font-size:10px;color:var(--mu);margin-bottom:8px;}
.con-who span{color:var(--tx);}
.con-thesis{font-family:var(--mo);font-size:12px;color:#b0a0a0;line-height:1.72;}
.con-data{margin-top:10px;padding:8px 12px;background:rgba(239,83,80,.05);border:1px solid rgba(239,83,80,.15);
  border-radius:6px;font-family:var(--mo);font-size:10px;color:#c07070;line-height:1.6;}
.con-data span{color:var(--R);margin-right:6px;font-weight:700;}
.con-stocks{display:flex;flex-direction:column;gap:0;}
.con-stock{padding:12px 20px;border-bottom:1px solid var(--bdr);display:flex;gap:12px;align-items:flex-start;}
.con-stock:last-child{border-bottom:none;}
.con-tkr{font-family:var(--mo);font-size:11px;font-weight:600;color:var(--R);
  background:rgba(239,83,80,.07);padding:2px 8px;border-radius:4px;border:1px solid rgba(239,83,80,.18);
  white-space:nowrap;flex-shrink:0;}
.con-body{flex:1;min-width:0;}
.con-view{font-family:var(--mo);font-size:11px;color:#b09090;line-height:1.65;margin-bottom:4px;}
.con-hidden{font-family:var(--mo);font-size:10px;color:#8a6060;line-height:1.6;}
.con-hidden span{color:var(--R);margin-right:4px;}
.ov-badge{font-family:var(--mo);font-size:9px;padding:2px 6px;border-radius:3px;
  background:rgba(239,83,80,.1);color:var(--R);border:1px solid rgba(239,83,80,.2);margin-left:8px;}

/* FOOTER */
.scf{padding:10px 20px;display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
.cl{font-family:var(--mo);font-size:9px;color:var(--mu);letter-spacing:.1em;}
.ct{font-family:var(--mo);font-size:9px;padding:2px 7px;background:var(--s2);
  border:1px solid var(--bdr);border-radius:3px;color:var(--mu);}
.rw{display:flex;align-items:center;gap:7px;margin-left:auto;font-family:var(--mo);font-size:10px;color:var(--mu);}
.rt{width:80px;height:3px;background:var(--s2);border-radius:2px;overflow:hidden;}
.rb{height:100%;border-radius:2px;background:linear-gradient(90deg,var(--G),var(--O));}
.wbtn{padding:5px 12px;border-radius:6px;border:1px solid var(--bdr);background:transparent;
  color:var(--mu);font-family:var(--mo);font-size:10px;cursor:pointer;transition:all .15s;}
.wbtn:hover{border-color:var(--Y);color:var(--Y);}
.wbtn.sv{border-color:var(--Y);color:var(--Y);background:rgba(255,213,79,.05);}

/* TOOLTIP */
.ctt{background:#0d1117;border:1px solid #1c2636;border-radius:6px;padding:8px 12px;
  font-family:'JetBrains Mono',monospace;font-size:10px;color:#dce8f5;}
.ctt-d{color:#5a7a9a;margin-bottom:4px;font-size:9px;}

/* API KEY BANNER */
.api-banner{display:flex;align-items:center;justify-content:space-between;
  padding:10px 28px;background:rgba(255,213,79,.04);border-bottom:1px solid rgba(255,213,79,.15);}
.api-banner-msg{font-family:var(--mo);font-size:10px;color:var(--Y);}
.api-key-btn{padding:5px 14px;border-radius:6px;border:1px solid rgba(255,213,79,.3);background:transparent;
  color:var(--Y);font-family:var(--mo);font-size:9px;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;
  transition:all .15s;}
.api-key-btn:hover{background:rgba(255,213,79,.08);}
.api-key-btn.set{border-color:rgba(0,232,122,.3);color:var(--G);}

/* DISCLAIMER */
.disc{padding:12px 16px;background:rgba(90,122,154,.04);border:1px solid var(--bdr);
  border-radius:8px;font-family:var(--mo);font-size:9px;color:var(--mu);line-height:1.7;}

@media(max-width:700px){
  .kpis{grid-template-columns:repeat(2,1fr);}
  .thr{grid-template-columns:1fr;}
  .sc-top{flex-direction:column;}
  .sc-cw{width:100%;height:110px;}
  .irow{flex-direction:column;}
  .hero h1{font-size:24px;}
  .dt-impacts{grid-template-columns:1fr;}
  .dt-col:first-child{border-right:none;border-bottom:1px solid var(--bdr);}
  .phases{gap:10px;}
}
`;

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const COLORS = ["#00e87a","#29b6f6","#ff7043","#ab47bc","#ffd54f","#26c6da"];
const LONG_TAGS = ["AI Infrastructure","Nuclear energy","European rearmament","Ageing population","Water scarcity","Robotics & automation","Space economy","Rare earths"];
const SHORT_TAGS = ["Rate cut beneficiaries","Earnings plays","Tariff winners","AI capex cycle","Oversold tech","Energy squeeze","Biotech catalysts"];
const PHASES = [{key:"ai1",lbl:"Thesis"},{key:"prices",lbl:"Price data"},{key:"ai2",lbl:"Technicals"},{key:"ai3",lbl:"Contrarian"}];
const PHASE_ORDER = ["ai1","prices","ai2","ai3"];

// Curated source intelligence injected into every AI prompt
const SOURCES_REF = `
CURATED INTELLIGENCE SOURCES — cite these by name when relevant to your analysis:

LEGENDARY INVESTORS (their frameworks & known positions):
- Warren Buffett / Berkshire Hathaway: value, moats, capital allocation, long-only
- Howard Marks / Oaktree: credit cycles, risk management, second-level thinking, "where are we in the cycle"
- Michael Burry / Scion: contrarian deep value, structural risk identification, short-selling
- Stanley Druckenmiller / Duquesne: macro, FX, rates, global capital flows, top-down framework
- Bill Ackman / Pershing Square: activist long/short, concentrated positions, public thesis presentations
- Ray Dalio / Bridgewater: debt supercycles, all-weather framework, geopolitical capital flows

NEWSLETTERS & ANALYSTS (their known coverage areas):
- The Diff (Byrne Hobart): financial history, tech strategy, market structure, second-order effects
- Doomberg: energy markets, natural gas, uranium, power grids, commodity flows — deeply contrarian
- Epsilon Theory (Ben Hunt): narrative economics, game theory, "common knowledge" in markets
- Grant's Interest Rate Observer (Jim Grant): credit quality, interest rates, contrarian value
- Verdad Research (Dan Rasmussen): quant factor investing, leveraged small caps, PE return deconstruction
- Kyla Scanlon: consumer sentiment, macro-economic narratives, "vibecession" framework
- 20VC / Harry Stebbings (20vc.substack.com): AI and frontier tech venture — how top VCs (Sequoia, a16z, Founders Fund) are positioning; early signals on which AI categories are attracting serious capital
- Digital Native / Rex Woodbury (digitalnative.tech): consumer tech and culture — social platforms, marketplaces, Gen Z behaviour, how cultural shifts translate into durable consumer companies

ALT DATA SOURCES (signal types they surface):
- Quiver Quantitative: Congressional trading disclosures, government contracts, lobbying spend
- Unusual Whales: options flow anomalies, dark pool prints, political stock trades
- OpenInsider: insider cluster buying (Form 4 filings) — multiple insiders buying simultaneously
- FRED (Federal Reserve): yield curve, credit spreads, M2, monetary aggregates, regional data
- Finviz: sector heat maps, momentum screening, relative strength

TIER-1 PRESS (broad macro, geopolitics, corporate, policy):
- The Economist: global macro, geopolitics, business strategy, long-form analysis with a distinct point of view — excellent for regime-change context
- Financial Times (FT): corporate finance, M&A, central bank policy, commodities, emerging markets — the paper of record for institutional finance
- Wall Street Journal (WSJ): US corporate earnings, Fed policy, markets, tech industry — essential for US-centric macro and company news
- Reuters: breaking financial and geopolitical news, commodities, FX — the cleanest real-time wire service
- Bloomberg: markets data, corporate bonds, central bank commentary, macro indicators — indispensable for rates and FX context
- New York Times: US political economy, regulatory environment, tech antitrust — useful for regulatory and political risk framing

ACADEMIC / QUANT FRAMEWORKS:
- SSRN Finance: factor anomalies, academic pre-prints on market inefficiencies
- Alpha Architect: momentum, value, quality factor implementation
- Aswath Damodaran: DCF valuation, sector multiples, equity risk premium data
`;


// ─── API KEY ──────────────────────────────────────────────────────────────────

const getApiKey = () => localStorage.getItem('signal-api-key') || '';

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const pct = (v,d=1) => v==null||isNaN(v)?"—":(v>=0?"+":"")+v.toFixed(d)+"%";
const fmtP = v => v==null||isNaN(v)?"—":"$"+v.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
const fmtDate = ts => new Date(ts*1000).toLocaleDateString("en-GB",{day:"2-digit",month:"short"});
const fmtDateS = ts => new Date(ts*1000).toLocaleDateString("en-GB",{month:"short",year:"2-digit"});

function movingAvg(arr, w) {
  return arr.map((_,i) => {
    if (i < w-1) return null;
    return arr.slice(i-w+1,i+1).reduce((a,b)=>a+b,0)/w;
  });
}

// Seeded PRNG — same ticker always produces same chart shape
function seededRng(seed) {
  let s = Math.abs(seed) || 1;
  return () => { s = (s * 1664525 + 1013904223) & 0x7fffffff; return s / 0x7fffffff; };
}
function hashStr(str) {
  return str.split('').reduce((h,c) => ((h<<5)-h+c.charCodeAt(0))|0, 0);
}

// Generate a deterministic synthetic price history from key metrics
// Chart shape is seeded by ticker so it never changes on refresh
function buildSyntheticHistory(ticker, currentPrice, change1Y, high52w, low52w) {
  const rng = seededRng(hashStr(ticker));
  const days = 252;
  const startPrice = currentPrice / (1 + (change1Y||0) / 100);
  const logDrift = Math.log(Math.max(currentPrice, 0.01) / Math.max(startPrice, 0.01)) / days;
  const vol = 0.013;
  const closes = [];
  let p = startPrice;
  for (let i = 0; i < days; i++) {
    const noise = (rng() - 0.5) * 2 * vol;
    p = p * Math.exp(logDrift + noise);
    p = Math.max((low52w || currentPrice*0.7) * 0.97, Math.min((high52w || currentPrice*1.3) * 1.03, p));
    closes.push(+p.toFixed(2));
  }
  // Force last point to match actual current price
  closes[days-1] = currentPrice;
  const ma50arr = movingAvg(closes, 50);
  const now = Math.floor(Date.now()/1000);
  return closes.map((c, i) => {
    const ts = now - (days - 1 - i) * 86400;
    return { date: fmtDate(ts), dateS: fmtDateS(ts), ts, close: c, ma50: ma50arr[i] ? +ma50arr[i].toFixed(2) : null };
  });
}

// ─── FREE STOCK PRICE API (Yahoo Finance via CORS proxy — zero AI credits) ──────

const _priceCache = {};

async function fetchYahooPrice(ticker) {
  // 15-min in-memory cache
  const hit = _priceCache[ticker];
  if (hit && Date.now() - hit.ts < 15 * 60 * 1000) return hit.data;

  const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=1y`;
  // In production use our own server-side proxy; locally use public CORS proxies.
  const priceProxies = IS_LOCAL ? [
    `https://corsproxy.io/?url=${encodeURIComponent(yahooUrl)}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(yahooUrl)}`,
  ] : [
    `/api/rss?url=${encodeURIComponent(yahooUrl)}`,
  ];

  let json;
  for (const proxyUrl of priceProxies) {
    try {
      const r = await fetch(proxyUrl);
      if (!r.ok) continue;
      json = await r.json();
      if (json?.chart?.result?.[0]) break;
    } catch {}
  }

  const result = json?.chart?.result?.[0];
  if (!result) throw new Error(`No price data for ${ticker}`);

  const closes = result.indicators?.quote?.[0]?.close || [];
  const timestamps = result.timestamp || [];
  const valid = closes.map((c,i) => ({c, t: timestamps[i]})).filter(x => x.c != null);
  if (!valid.length) throw new Error(`Empty data for ${ticker}`);

  const cur = valid[valid.length - 1].c;
  const getChange = n => { const i = valid.length-1-n; return i<0?0:((cur-valid[i].c)/valid[i].c)*100; };
  const allC = valid.map(x=>x.c);
  const h52 = Math.max(...allC), l52 = Math.min(...allC);

  const prices = valid.map(x => ({
    date: fmtDate(x.t), dateS: fmtDateS(x.t), ts: x.t, close: +x.c.toFixed(2)
  }));
  const ma50arr = movingAvg(prices.map(p=>p.close), 50);
  prices.forEach((p,i) => { p.ma50 = ma50arr[i] ? +ma50arr[i].toFixed(2) : null; });
  const lma = ma50arr[ma50arr.length-1];

  const data = {
    prices, currentPrice: +cur.toFixed(2),
    change1D: +getChange(1).toFixed(2), change1W: +getChange(5).toFixed(2),
    change1M: +getChange(21).toFixed(2), change3M: +getChange(63).toFixed(2),
    change1Y: +getChange(252).toFixed(2),
    high52w: +h52.toFixed(2), low52w: +l52.toFixed(2),
    distFromHigh: +((cur-h52)/h52*100).toFixed(2),
    ma50: lma ? +lma.toFixed(2) : null, aboveMa50: lma ? cur > lma : null,
  };
  _priceCache[ticker] = { ts: Date.now(), data };
  return data;
}

// Single ticker — used by portfolio tab
async function fetchPriceData(ticker) { return fetchYahooPrice(ticker); }
async function fetchPositionPriceData(ticker) { return fetchYahooPrice(ticker); }

// Batch fetch — parallel, no AI credits
async function fetchPriceDataBatch(tickers) {
  const results = await Promise.allSettled(tickers.map(t => fetchYahooPrice(t)));
  const out = {};
  results.forEach((r,i) => { if (r.status==='fulfilled') out[tickers[i]] = r.value; });
  return out;
}

// GBP/USD via Frankfurter (free, no API key, no CORS issues)
async function fetchGBPUSD() {
  try {
    const r = await fetch('https://api.frankfurter.app/latest?from=GBP&to=USD');
    const d = await r.json();
    return d.rates?.USD || 1.27;
  } catch { return 1.27; }
}



function buildCompData(pMap, tickers) {
  const valid = tickers.filter(t=>pMap[t]);
  if (valid.length < 2) return [];
  const trimmed = {};
  valid.forEach(t=>{trimmed[t]=pMap[t].prices.slice(-126);});
  const minLen = Math.min(...valid.map(t=>trimmed[t].length));
  if (minLen < 5) return [];
  return Array.from({length:minLen},(_,i)=>{
    const pt={date:trimmed[valid[0]][i].dateS};
    valid.forEach(t=>{const b=trimmed[t][0].close; pt[t]=+((trimmed[t][i].close/b)*100).toFixed(2);});
    return pt;
  });
}

// ─── CLAUDE CALLS ─────────────────────────────────────────────────────────────

// Try to recover valid items from truncated/malformed JSON
function robustParseJSON(text) {
  // First attempt: clean parse
  const m = text.match(/\{[\s\S]*\}/);
  if (m) {
    try { return JSON.parse(m[0]); } catch {}
  }
  // Second attempt: extract individual item objects from a partial array
  const itemMatches = [...text.matchAll(/\{[^{}]*"headline"[^{}]*\}/g)];
  if (itemMatches.length) {
    const items = itemMatches.map(im => { try { return JSON.parse(im[0]); } catch { return null; } }).filter(Boolean);
    if (items.length) return { items };
  }
  throw new Error("Could not parse JSON response");
}

// On Vercel (production) → proxy through /api/claude (key lives server-side, never exposed)
// Locally → call Anthropic directly with the key stored in localStorage
const IS_LOCAL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// ─── CACHE VERSION ────────────────────────────────────────────────────────────
// Bump this ONE constant to instantly invalidate ALL localStorage caches.
// Do this whenever: (a) a cached data schema changes, (b) a proxy bug is fixed,
// or (c) users report stale/broken data. Format: 'v4', 'v5', etc.
const CACHE_VERSION = 'v3';

// ─── ADDING NEW EXTERNAL FETCHES — RULES ─────────────────────────────────────
// NEVER call external URLs (Yahoo, Google News, RSS feeds, etc.) directly from
// the browser in production — CORS will block it or the proxy will rate-limit.
// Always follow the IS_LOCAL pattern:
//   IS_LOCAL  → fetch directly (dev convenience, needs local API key)
//   !IS_LOCAL → route through /api/rss?url=... or /api/claude
// If you forget this, things will silently work locally but break on Vercel.

// Session password — persists across refreshes but cleared when browser closes
const getSitePassword = () => sessionStorage.getItem('signal-pw') || '';
const setSitePassword = pw => sessionStorage.setItem('signal-pw', pw);

async function callClaude(system, user, maxTok=2000) {
  const body = JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:maxTok,system,messages:[{role:"user",content:user}]});
  let r;
  if (IS_LOCAL) {
    r = await fetch("https://api.anthropic.com/v1/messages", {
      method:"POST",
      headers:{"Content-Type":"application/json","anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true","x-api-key":getApiKey()},
      body,
    });
  } else {
    r = await fetch("/api/claude", {
      method:"POST",
      headers:{"Content-Type":"application/json","x-site-password":getSitePassword()},
      body,
    });
  }
  const d = await r.json();
  if (d.error) {
    if (d.error.message === 'WRONG_PASSWORD') throw new Error('WRONG_PASSWORD');
    throw new Error(d.error.message);
  }
  const text = d.content?.map(b=>b.type==="text"?b.text:"").filter(Boolean).join("\n");
  if (!text) throw new Error("No response text");
  return robustParseJSON(text);
}

// Fetch live context from multiple feeds for a given query (used by trend analyser + phase1)
async function fetchLiveContext(query, extraFeedKeys = []) {
  const defaultFeeds = ['reuters-biz','reuters-tech','doomberg','the-diff','epsilon-theory','hacker-news','r-investing','r-economics','r-security','bbc-business','cnbc-top','marketwatch'];
  const feedKeys = [...new Set([...defaultFeeds, ...extraFeedKeys])];
  const [pressItems, ...feedResults] = await Promise.all([
    fetchGoogleNewsItems(query),
    ...feedKeys.map(k => fetchSingleFeed(k, 3)),
  ]);
  const seen = new Set();
  return [...pressItems, ...feedResults.flat()]
    .filter(item => {
      const key = item.title.toLowerCase().slice(0, 60);
      if (seen.has(key)) return false;
      seen.add(key); return true;
    })
    .sort((a, b) => (b.dateTs || 0) - (a.dateTs || 0))
    .slice(0, 25);
}

function buildHeadlinesBlock(items) {
  if (!items.length) return '';
  const list = items.map((item, i) =>
    `[${i+1}][${item.label}${item.date ? ' · '+item.date : ''}] ${item.title}${item.url ? '\n    URL: '+item.url : ''}`
  ).join('\n');
  return `\n\nLIVE HEADLINES — sorted newest first — from press, newsletters & community:\n${list}\n`;
}

async function fetchDailyTrend() {
  const liveItems = await fetchLiveContext(
    'niche investment signal commodity patent trade flow central bank',
    ['doomberg','epsilon-theory','the-diff','r-security','r-valueinvesting','r-macro','seeking-alpha']
  );
  const headlinesBlock = buildHeadlinesBlock(liveItems);

  const sys = `You are an elite investment researcher who monitors niche, non-mainstream data sources:
satellite imagery, shipping manifests, patent filings, academic preprints, central bank minutes,
alternative data providers, sovereign wealth fund filings, procurement databases, commodity flows, etc.

${SOURCES_REF}
${headlinesBlock ? 'You have been provided with live recent headlines below — use these as your PRIMARY signal source. Prioritise the most recent ones.' : ''}

Pick ONE genuinely interesting, non-obvious trend or signal that a sophisticated investor would find
valuable right now. It should be something that would NOT appear on Bloomberg's front page or CNBC.
Ground your pick in the live headlines provided where possible — cite the specific source.
Where relevant, reference which of the curated sources above would be most useful to monitor this trend.

Return ONLY valid JSON (no markdown, no backticks):
{
  "headline": "punchy, specific headline (max 12 words)",
  "emoji": "single relevant emoji",
  "summary": "2-3 sentences explaining the trend clearly",
  "whyNow": "1-2 sentences on why this matters RIGHT NOW — reference a specific live headline if relevant",
  "timeframe": "investment timeframe e.g. '2-6 months'",
  "sourceType": "type of niche data source (e.g. 'Patent cluster analysis')",
  "dataSignal": "the specific data signal that tipped you off (be concrete, cite the source headline number if from live feed)",
  "relevantSources": ["Source name 1 from the curated list", "Source name 2"],
  "positiveImpact": [
    {"ticker":"REAL_TICKER","company":"name","sector":"sector","reason":"concrete reason they benefit"}
  ],
  "negativeImpact": [
    {"ticker":"REAL_TICKER","company":"name","sector":"sector","reason":"concrete reason they are hurt"}
  ],
  "keyHeadlines": [
    {"title":"exact headline text from the live feed that most directly informed this pick","source":"source label e.g. Reuters","date":"08 Mar 2026 or null","url":"full URL or null"}
  ]
}
Include 3 positive and 3 negative stocks. Include up to 3 keyHeadlines — the live feed headlines that most directly informed your pick. Copy the exact URL from the live feed. Be genuinely creative. Use real tickers.`;

  return callClaude(sys,
    `Today is ${new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"long",year:"numeric"})}. Give me today's niche investment trend pick.${headlinesBlock}`,
    1900);
}

async function phase1(query, mode) {
  // Fetch live news for this specific query before analysis
  const liveItems = await fetchLiveContext(query, ['20vc','the-diff','doomberg','seeking-alpha','reuters-tech','cnbc-tech']);
  const headlinesBlock = buildHeadlinesBlock(liveItems);

  const sys = `You are a sharp sell-side equity analyst with access to a curated network of intelligence sources.

${SOURCES_REF}
${headlinesBlock ? 'IMPORTANT: You have been provided with live recent headlines below. Use these as your PRIMARY source for what is happening RIGHT NOW in this space. Prioritise them over your training data.' : ''}

Mode: ${mode==="long"?"LONG-TERM secular investing (3-10 year horizon)":"SHORT-TERM momentum/catalyst trading (days to months)"}.

When building your thesis, actively draw on the frameworks and known views of the sources above.
For example: cite Howard Marks if the cycle position is relevant, Doomberg for energy, Druckenmiller for macro regime,
Unusual Whales if options flow supports the thesis, OpenInsider if insider buying is notable, etc.

STOCK SELECTION RIGOUR — for each stock you must:
1. Ask yourself: "Why THIS company and not its closest 2-3 competitors?" Be explicit about who you considered and why you chose this one.
2. Assess trend timing: Is this trend early (0-20% priced in), mid-cycle (20-60% priced in), or late (60%+ priced in)?
3. Self-challenge: What is the single most dangerous assumption in your bull case?
4. Only include a stock if your internal conviction is above 90%. If you cannot reach 90% on a candidate, replace it.

Return ONLY valid JSON:
{
  "trend":"theme name",
  "summary":"2-3 sentences why investable now",
  "conviction":"high|medium|low",
  "timeHorizon":"e.g. '3-7 years'",
  "tailwind":"main macro tailwind (short phrase)",
  "risk":"biggest risk (short phrase)",
  "overallRiskScore":0-100,
  "trendMaturity":"early|mid|late",
  "pricedIn":"e.g. '~30% priced in — markets pricing growth but not full TAM expansion'",
  "themeSourceRefs": [
    {"source":"Source name from curated list","relevance":"1 sentence on why this source is relevant to this theme"}
  ],
  "recentHeadlines": [
    {"title":"exact headline text from the live feed","source":"source label e.g. Reuters","date":"08 Mar 2026 or null","url":"full URL or null"}
  ],
  "stocks":[{
    "ticker":"EXACT ticker e.g. NVDA",
    "name":"company name",
    "sector":"sector/industry",
    "conviction":"high|medium|speculative",
    "convictionScore": 0-100,
    "riskScore":0-100,
    "whyNotCompetitors":"1-2 sentences: who else was considered and why this stock wins",
    "bull":"2-3 sentence bull case",
    "bear":"1-2 sentence bear case",
    "keyAssumption":"the single most critical assumption that must hold for the bull case to be right",
    "catalysts":["catalyst 1","catalyst 2","catalyst 3"],
    "note":"one sharp analyst note",
    "sourceRefs": [
      {"source":"Source name from curated list","insight":"1 sentence on what this source says or implies about this specific stock/sector"}
    ]
  }]
}
Include exactly 5 stocks. Use real currently-listed tickers only. Include 2-3 sourceRefs per stock, 2-4 themeSourceRefs, and up to 5 recentHeadlines — the most relevant live headlines from the feed that informed this analysis. Copy exact URLs from the live feed.
${mode==="short"?"Focus on near-term setups, momentum, event-driven plays.":"Focus on structural compounders with durable moats."}`;
  return callClaude(sys, `Today is ${new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"long",year:"numeric"})}. Analyze investment opportunities in: "${query}"${headlinesBlock}`, 4500);
}

async function phase2Tech(stocks, pMap, mode) {
  const ctx = stocks.map(s => {
    const d = pMap[s.ticker];
    if (!d) return `${s.ticker}: No price data.`;
    return `${s.ticker} (${s.name}):
  Price: ${fmtP(d.currentPrice)} | 1Y: ${pct(d.change1Y)} | 3M: ${pct(d.change3M)} | 1M: ${pct(d.change1M)}
  52w High: ${fmtP(d.high52w)} (dist: ${pct(d.distFromHigh)}) | 52w Low: ${fmtP(d.low52w)}
  50d MA: ${fmtP(d.ma50)} | Above MA: ${d.aboveMa50===null?"unknown":d.aboveMa50?"YES":"NO"}`;
  }).join("\n\n");
  const sys = `You are a technical analyst integrating price action with fundamentals.
Mode: ${mode==="long"?"Long-term investor":"Short-term momentum trader"}.

${SOURCES_REF}

Where the price action corroborates or contradicts a known source's view, cite them.
For example: if insider buying is showing up alongside bullish price action, cite OpenInsider.
If the chart looks like a classic cycle top, cite Howard Marks' cycle framework.
If unusual options flow preceded the move, cite Unusual Whales.

Return ONLY valid JSON:
{
  "technicalSummary":"2-3 sentence overall technical read on this theme",
  "stocks":[{
    "ticker":"string",
    "technicalSignal":"bullish|neutral|bearish",
    "trendComment":"1-2 sentences on price action and what it means for the thesis",
    "entryNote":"practical entry guidance given current level",
    "updatedConviction":"high|medium|speculative",
    "techSourceRefs":[
      {"source":"Source name from curated list","insight":"1 sentence on what signal from this source is relevant to the technical picture"}
    ]
  }]
}`;
  return callClaude(sys, `Real price data:\n\n${ctx}\n\nProvide technical analysis with source citations.`, 1800);
}

async function phase3Contrarian(analysis, pMap) {
  const ctx = analysis.stocks.map(s => {
    const d = pMap[s.ticker];
    const perf = d ? `1Y: ${pct(d.change1Y)}, dist from high: ${pct(d.distFromHigh)}` : "no price data";
    return `${s.ticker} (${s.name}): Bull case: ${s.bull} | ${perf}`;
  }).join("\n");
  const sys = `You are a contrarian hedge fund analyst — a short-seller and skeptic who challenges consensus views.
You have read the bull thesis for a set of stocks and must now produce the strongest possible contrarian counter-arguments.
This is NOT about restating obvious risks. Find structural flaws, historical parallels that ended badly,
hidden competitive threats, regulatory exposure, or macro dynamics that undermine the thesis.

${SOURCES_REF}

Actively cite which of these sources a contrarian would point to — e.g. Grant's for credit concerns,
Michael Burry for structural risk patterns, Howard Marks for cycle positioning, Verdad for valuation anomalies,
FRED data for macro warning signals, Druckenmiller for macro regime shifts, etc.

Return ONLY valid JSON:
{
  "overallContrarian": "2-3 sentences: strongest macro-level contrarian case against this whole theme",
  "whoDisagrees": "which type of sophisticated investor or fund is likely short and why",
  "keyDataSignal": "one specific data point or ratio contrarians would cite as a warning",
  "contrarianSourceRefs": [
    {"source":"Source name from curated list","insight":"1 sentence on what this source says that supports the contrarian view"}
  ],
  "stocks": [{
    "ticker": "string",
    "contrarian": "1-2 sentences: most specific, uncomfortable contrarian view",
    "hiddenRisk": "one non-obvious risk bulls are systematically ignoring",
    "potentiallyOvervalued": true,
    "contrarianSourceRef": {"source":"Source name","insight":"what this source says about this stock specifically"}
  }]
}`;
  return callClaude(sys, `Theme: ${analysis.trend}\nSummary: ${analysis.summary}\n\nStocks and bull cases:\n${ctx}\n\nGive me the strongest contrarian case with source citations.`, 1800);
}

// ─── CHART COMPONENTS ─────────────────────────────────────────────────────────

function MiniChart({data, color}) {
  const id = `g${color.replace("#","")}`;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data.slice(-63)} margin={{top:4,right:0,bottom:0,left:0}}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={.22}/>
            <stop offset="100%" stopColor={color} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <XAxis dataKey="date" hide/>
        <YAxis domain={["auto","auto"]} hide/>
        <Tooltip content={({active,payload})=>{
          if (!active||!payload?.length) return null;
          const p=payload[0].payload;
          return <div className="ctt"><div className="ctt-d">{p.date}</div><div>{fmtP(p.close)}</div>
            {p.ma50&&<div style={{color:"#ffd54f",fontSize:9}}>MA50 {fmtP(p.ma50)}</div>}</div>;
        }}/>
        <Area type="monotone" dataKey="close" stroke={color} strokeWidth={1.6} fill={`url(#${id})`} dot={false} isAnimationActive={false}/>
        <Line type="monotone" dataKey="ma50" stroke="#ffd54f" strokeWidth={1} dot={false} strokeDasharray="3 2" isAnimationActive={false} connectNulls/>
      </ComposedChart>
    </ResponsiveContainer>
  );
}

function CompChart({data, tickers}) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <ComposedChart data={data} margin={{top:6,right:14,bottom:0,left:-24}}>
        <XAxis dataKey="date" tick={{fontFamily:"JetBrains Mono",fontSize:9,fill:"#5a7a9a"}} tickLine={false} axisLine={false} interval={Math.floor(data.length/5)}/>
        <YAxis tick={{fontFamily:"JetBrains Mono",fontSize:9,fill:"#5a7a9a"}} tickLine={false} axisLine={false} tickFormatter={v=>v.toFixed(0)}/>
        <Tooltip content={({active,payload,label})=>{
          if (!active||!payload?.length) return null;
          return <div className="ctt"><div className="ctt-d">{label}</div>
            {payload.map((p,i)=><div key={i} style={{color:p.color}}>{p.dataKey}: {(p.value-100).toFixed(1)}%</div>)}
          </div>;
        }}/>
        <ReferenceLine y={100} stroke="#1c2636" strokeDasharray="4 3"/>
        {tickers.map((t,i)=>(
          <Line key={t} type="monotone" dataKey={t} stroke={COLORS[i%COLORS.length]} strokeWidth={1.8} dot={false} isAnimationActive={false}/>
        ))}
        <Legend iconType="circle" iconSize={6} wrapperStyle={{fontFamily:"JetBrains Mono",fontSize:10,paddingTop:10}}/>
      </ComposedChart>
    </ResponsiveContainer>
  );
}

// ─── BADGE COMPONENTS ─────────────────────────────────────────────────────────

function ConvBadge({level}) {
  const m={high:["bH","High conv."],medium:["bM","Medium"],speculative:["bS","Speculative"]};
  const [c,l]=m[level]||m.medium;
  return <span className={`bdg ${c}`}>{l}</span>;
}
function SigBadge({signal}) {
  const m={bullish:["bBul","▲ Bullish"],neutral:["bNeu","→ Neutral"],bearish:["bBer","▼ Bearish"]};
  const [c,l]=m[signal]||m.bNeu;
  return <span className={`bdg ${c}`}>{l}</span>;
}
function TI({label,value,color}) {
  return <div className="ti"><span className="til">{label}</span><span className="tiv" style={{color:color||"var(--tx)"}}>{value}</span></div>;
}

function SourceRefPills({refs, label="Sources"}) {
  if (!refs?.length) return null;
  return (
    <div className="src-refs">
      <span className="src-refs-lbl">📚 {label}</span>
      {refs.map((r,i) => (
        <div key={i} className="src-ref-pill">
          <span className="src-ref-name">{r.source}</span>
          <span className="src-ref-sep">·</span>
          <span className="src-ref-insight">{r.insight}</span>
        </div>
      ))}
    </div>
  );
}

// ─── DAILY TREND CARD ─────────────────────────────────────────────────────────

function DailyTrendCard({trend, loading, onRefresh, refreshing, error}) {
  if (loading) return (
    <div className="dt-wrap">
      <div className="slbl">// Today's Niche Trend Pick</div>
      <div className="cc">
        <div className="dt-loading">
          <div style={{fontFamily:"var(--mo)",fontSize:11,color:"var(--mu)"}}>Scanning niche data sources...</div>
          <div className="dt-loading-bar"><div className="dt-loading-fill"/></div>
        </div>
      </div>
    </div>
  );
  if (error) return (
    <div className="dt-wrap">
      <div className="slbl">// Today's Niche Trend Pick</div>
      <div className="cc">
        <div style={{textAlign:"center",padding:"24px 20px",display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
          <div style={{fontFamily:"var(--mo)",fontSize:11,color:"var(--mu)"}}>⚠ Could not load today's pick — tap to retry</div>
          <button className="refresh-btn" onClick={onRefresh} disabled={refreshing} style={{margin:0}}>
            {refreshing ? "···" : "↻ Retry"}
          </button>
        </div>
      </div>
    </div>
  );
  if (!trend) return null;
  return (
    <div className="dt-wrap">
      <div className="slbl">// Today's Niche Trend Pick · Updated {new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short"})}</div>
      <div className="dt-card">
        <div className="dt-header">
          <div className="dt-left">
            <div className="dt-meta">
              <span className="dt-label">Signal</span>
              <span className="dt-source">📡 {trend.sourceType}</span>
              <span className="dt-frame">⏱ {trend.timeframe}</span>
            </div>
            <div className="dt-headline">{trend.headline}</div>
            <div className="dt-summary">{trend.summary}</div>
            {trend.whyNow && <div className="dt-summary" style={{marginTop:6,color:"#7ab8c8"}}>{trend.whyNow}</div>}
            {trend.dataSignal && (
              <div className="dt-signal"><span>📌</span>{trend.dataSignal}</div>
            )}
          </div>
          <div className="dt-right">
            <div className="dt-emoji">{trend.emoji}</div>
            <button className="refresh-btn" onClick={onRefresh} disabled={refreshing}>
              {refreshing?"···":"↻ New pick"}
            </button>
          </div>
        </div>
        <div className="dt-impacts">
          <div className="dt-col pos">
            <div className="dt-col-lbl">▲ Benefits these stocks</div>
            {(trend.positiveImpact||[]).map((item,i)=>(
              <div key={i} className="dt-impact-item">
                <div className="dt-impact-hdr">
                  <span className="dt-iticker">{item.ticker}</span>
                  <span className="dt-isector">{item.company} · {item.sector}</span>
                </div>
                <div className="dt-ireason">{item.reason}</div>
              </div>
            ))}
          </div>
          <div className="dt-col neg">
            <div className="dt-col-lbl">▼ Hurts these stocks</div>
            {(trend.negativeImpact||[]).map((item,i)=>(
              <div key={i} className="dt-impact-item">
                <div className="dt-impact-hdr">
                  <span className="dt-iticker">{item.ticker}</span>
                  <span className="dt-isector">{item.company} · {item.sector}</span>
                </div>
                <div className="dt-ireason">{item.reason}</div>
              </div>
            ))}
          </div>
        </div>
        {trend.relevantSources?.length>0&&(
          <div className="dt-src-refs">
            <span className="dt-src-refs-lbl">📚 Monitor via these sources</span>
            {trend.relevantSources.map((src,i)=>(
              <span key={i} className="src-ref-pill"><span className="src-ref-name">{src}</span></span>
            ))}
          </div>
        )}
        {trend.keyHeadlines?.length>0&&(
          <div className="dt-key-headlines">
            <span className="dt-src-refs-lbl">📰 Live signals that informed this pick</span>
            {trend.keyHeadlines.map((h,i)=>{
              const inner = <>
                <div className="dt-hl-meta">
                  <span>{h.source}</span>
                  {h.date&&<span>· {h.date}</span>}
                  {h.url&&<span className="dt-hl-hint">↗ open source</span>}
                </div>
                <div className="dt-hl-title">{h.title}</div>
              </>;
              return h.url ? (
                <a key={i} href={h.url} target="_blank" rel="noopener noreferrer" className="dt-hl-item">{inner}</a>
              ) : (
                <div key={i} className="dt-hl-item">{inner}</div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── CONTRARIAN SECTION ───────────────────────────────────────────────────────

function ContrarianSection({contrarian, stocks}) {
  if (!contrarian) return null;
  return (
    <div>
      <div className="slbl">// Contrarian View · The Bear Case You're Not Hearing</div>
      <div className="con-card">
        <div className="con-header">
          <div className="con-title">⚠ The Other Side of the Trade</div>
          <div className="con-who">Who disagrees: <span>{contrarian.whoDisagrees}</span></div>
          <div className="con-thesis">{contrarian.overallContrarian}</div>
          {contrarian.keyDataSignal && (
            <div className="con-data"><span>◉ Data signal:</span>{contrarian.keyDataSignal}</div>
          )}
          {contrarian.contrarianSourceRefs?.length>0&&(
            <div style={{marginTop:10,display:"flex",flexWrap:"wrap",gap:5}}>
              <span className="src-refs-lbl" style={{width:"100%",marginBottom:3}}>📚 Contrarian sources</span>
              {contrarian.contrarianSourceRefs.map((r,i)=>(
                <div key={i} className="src-ref-pill" style={{borderColor:"rgba(239,83,80,.2)"}}>
                  <span className="src-ref-name" style={{color:"var(--R)"}}>{r.source}</span>
                  <span className="src-ref-sep">·</span>
                  <span className="src-ref-insight">{r.insight}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="con-stocks">
          {(contrarian.stocks||[]).map((cs,i)=>{
            const s = stocks.find(x=>x.ticker===cs.ticker)||{};
            return (
              <div key={i} className="con-stock">
                <span className="con-tkr">{cs.ticker}</span>
                <div className="con-body">
                  <div className="con-view">
                    {cs.potentiallyOvervalued && <span className="ov-badge">Overvalued?</span>}
                    {cs.contrarian}
                  </div>
                  <div className="con-hidden"><span>⚑</span>{cs.hiddenRisk}</div>
                  {cs.contrarianSourceRef?.source&&(
                    <div className="con-src-ref">
                      <span>📚 {cs.contrarianSourceRef.source}:</span>{cs.contrarianSourceRef.insight}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── WATCHLIST ────────────────────────────────────────────────────────────────

function WatchlistPanel() {
  const [tickers, setTickers]   = useState(() => { try { return JSON.parse(localStorage.getItem('signal-watchlist')||'[]'); } catch { return []; }});
  const [prices, setPrices]     = useState({});
  const [loading, setLoading]   = useState(false);

  // Re-read from localStorage whenever we render (picks up changes from research tab)
  useEffect(() => {
    const stored = (() => { try { return JSON.parse(localStorage.getItem('signal-watchlist')||'[]'); } catch { return []; }})();
    setTickers(stored);
    if (stored.length) fetchAll(stored);
  }, []);

  const fetchAll = async (list) => {
    setLoading(true);
    const results = await Promise.all(list.map(t => fetchYahooPrice(t).then(d=>({t,d})).catch(()=>({t,d:null}))));
    const pm = {}; results.forEach(({t,d})=>{ if(d) pm[t]=d; });
    setPrices(pm); setLoading(false);
  };

  const remove = (ticker) => {
    const next = tickers.filter(t=>t!==ticker);
    setTickers(next);
    try { localStorage.setItem('signal-watchlist', JSON.stringify(next)); } catch {}
  };

  if (!tickers.length) return null;

  return (
    <div style={{marginTop:24}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
        <span style={{fontFamily:'var(--mo)',fontSize:10,color:'var(--mu)',letterSpacing:'.12em',textTransform:'uppercase'}}>★ Watchlist</span>
        <button onClick={()=>fetchAll(tickers)} style={{background:'none',border:'1px solid var(--bdr)',color:'var(--mu)',borderRadius:4,padding:'2px 8px',fontFamily:'var(--mo)',fontSize:9,cursor:'pointer',letterSpacing:'.06em'}}>
          {loading?'Refreshing…':'↻ Refresh'}
        </button>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:8}}>
        {tickers.map(ticker => {
          const pd = prices[ticker];
          const up = (pd?.change1D||0) >= 0;
          return (
            <div key={ticker} style={{background:'var(--sur)',border:'1px solid var(--bdr)',borderRadius:10,padding:'12px 14px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,position:'relative'}}>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <span style={{fontFamily:'var(--mo)',fontSize:11,fontWeight:700,color:'var(--B)',background:'rgba(41,182,246,.1)',padding:'3px 8px',borderRadius:5}}>{ticker}</span>
                {pd ? (
                  <span style={{fontFamily:'var(--mo)',fontSize:13,fontWeight:700,color:'var(--tx)'}}>${pd.currentPrice.toFixed(2)}</span>
                ) : <span style={{color:'var(--dim)',fontSize:11}}>{loading?'…':'—'}</span>}
              </div>
              {pd && (
                <div style={{display:'flex',gap:6,flexWrap:'wrap',justifyContent:'flex-end'}}>
                  {[['1D',pd.change1D],['1W',pd.change1W],['1M',pd.change1M],['1Y',pd.change1Y]].map(([lbl,v])=>(
                    <span key={lbl} style={{fontFamily:'var(--mo)',fontSize:9,padding:'2px 6px',borderRadius:4,
                      background:v>=0?'rgba(0,232,122,.07)':'rgba(239,83,80,.07)',
                      color:v>=0?'var(--G)':'var(--R)',border:`1px solid ${v>=0?'rgba(0,232,122,.15)':'rgba(239,83,80,.15)'}`}}>
                      {lbl} {v>=0?'+':''}{v?.toFixed(2)}%
                    </span>
                  ))}
                </div>
              )}
              <button onClick={()=>remove(ticker)} style={{position:'absolute',top:6,right:6,background:'none',border:'none',color:'var(--dim)',fontSize:11,cursor:'pointer',padding:'2px 4px',fontFamily:'var(--mo)'}}>✕</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── ASK ROY ──────────────────────────────────────────────────────────────────

async function askRoy(question, portfolioContext) {
  const sys = `You are Roy — a seasoned investment analyst with 20 years at Bridgewater Associates. You are known for:
- Radical transparency and intellectual honesty
- Analysing every investment from multiple angles: bull case, bear case, macro context, positioning risk
- Never giving vague answers — you are crisp, specific, and direct
- Drawing on macro, fundamental, technical and behavioural perspectives
- Bridgewater's "All Weather" philosophy: understanding how assets perform across economic environments

The user's current portfolio context:
${portfolioContext}

Respond in 3-5 short paragraphs. Be direct. Use plain text — no markdown, no bullet points, no headers.
Write as if you are speaking to a sophisticated investor who values intellectual honesty over comfort.
Start directly with your view — no "Great question" or pleasantries.`;
  const result = await callClaude(sys, question, 1000);
  // callClaude returns parsed JSON — Roy should return plain text, so handle both
  if (typeof result === 'string') return result;
  // If it returned JSON accidentally, extract text
  return result?.response || result?.answer || result?.text || JSON.stringify(result);
}

function AskRoy({ positions, priceMap, gbpusd }) {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState(null);
  const [lastQ, setLastQ] = useState('');
  const [loading, setLoading] = useState(false);

  const portfolioContext = positions.length === 0 ? 'No positions held.' :
    positions.map(p => {
      const pd = priceMap[p.ticker];
      const curUSD = pd?.currentPrice || p.entryPriceUSD;
      const curGBP = (curUSD / gbpusd) * p.shares;
      const pnlPct = pd ? ((curUSD - p.entryPriceUSD) / p.entryPriceUSD * 100).toFixed(1) : '?';
      return `${p.name} (${p.ticker}): ${p.shares.toFixed(2)} shares, entry $${p.entryPriceUSD}, current $${curUSD?.toFixed(2)||'?'}, P&L ${pnlPct}%, GBP invested £${p.gbpInvested}`;
    }).join('\n');

  const submit = async () => {
    if (!question.trim() || loading) return;
    const q = question.trim();
    setLastQ(q);
    setQuestion('');
    setLoading(true);
    setResponse(null);
    try {
      // Fetch live news for Roy's context before calling Claude
      const liveItems = await fetchGoogleNewsItems(q, 6);
      const newsBlock = liveItems.length > 0
        ? '\n\nLIVE NEWS CONTEXT — sorted newest first, use these to answer questions about current events:\n' +
          liveItems.map((item, i) =>
            `[${i+1}][${item.label}${item.date ? ' · ' + item.date : ''}] ${item.title}${item.url ? '\n    URL: ' + item.url : ''}`
          ).join('\n')
        : '';

      // Roy returns plain text — use proxy in production, direct API locally
      const royReqBody = {
          model:"claude-sonnet-4-20250514",
          max_tokens:1500,
          system:`You are Roy — a seasoned investment analyst with 20 years at Bridgewater Associates. You are known for radical transparency, intellectual rigour, and a disciplined process of self-challenging before reaching any conclusion.${liveItems.length ? ' You have been given live news headlines — use these as your PRIMARY source for current events, legislation, market moves, and recent developments. Prioritise them over your training data.' : ''}

User's current portfolio:
${portfolioContext}

YOUR ANALYTICAL PROCESS — follow this internally before writing your response:

1. STOCK SELECTION RIGOUR: If recommending or discussing a specific stock, ask yourself: "Why THIS company and not its closest competitors? What is the specific edge or asymmetry here?" Name the alternatives you considered and briefly explain why you rejected them.

2. TREND TIMING: Assess how new the trend is. Is it early innings, mid-cycle, or late? How much of the thesis is likely already priced in by the market? Be explicit — e.g. "this is roughly 60% priced in based on current valuations vs. the size of the opportunity."

3. SELF-CHALLENGE: After forming your initial view, steelman the opposite case. What would make you completely wrong? What are the top 2 risks that could invalidate the thesis?

4. CONFIDENCE CALIBRATION: Only after completing steps 1-3, assign a conviction score. Only express a view if your internal confidence is above 90%. If it isn't, say so explicitly and explain what information would be needed to get there.

RESPONSE FORMAT — plain text only, no markdown, no bullet points, no headers:
- Start with your direct view, no pleasantries
- Cover your stock selection reasoning (why this one, not others)
- Cover trend newness and how much is priced in
- Cover the key risk that could make you wrong
- End with: "Conviction: X/100 — [one sentence on what drives that score]"`,
          messages:[{role:"user",content:q + newsBlock}]
      };
      let r;
      if (IS_LOCAL) {
        r = await fetch("https://api.anthropic.com/v1/messages", {
          method:"POST",
          headers:{"Content-Type":"application/json","anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true","x-api-key":getApiKey()},
          body:JSON.stringify(royReqBody),
        });
      } else {
        r = await fetch("/api/claude", {
          method:"POST",
          headers:{"Content-Type":"application/json","x-site-password":getSitePassword()},
          body:JSON.stringify(royReqBody),
        });
      }
      const d = await r.json();
      if (d.error) throw new Error(d.error.message);
      setResponse(d.content?.map(b=>b.type==="text"?b.text:"").join("").trim());
    } catch(e) {
      setResponse(`Error: ${e.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="roy-wrap">
      <div className="roy-hdr">
        <div className="roy-avatar">🎯</div>
        <div>
          <div className="roy-name">ASK ROY</div>
          <div className="roy-title">20 years · Bridgewater Associates · Macro & Equity</div>
        </div>
      </div>
      <div className="roy-body">
        <div className="roy-input-row">
          <textarea
            className="roy-input"
            placeholder="Ask Roy anything — what he thinks of a stock, whether to hold or sell, macro risks to your portfolio…"
            value={question}
            onChange={e=>setQuestion(e.target.value)}
            onKeyDown={e=>{ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); submit(); }}}
            rows={2}
          />
          <button className="roy-send" onClick={submit} disabled={!question.trim()||loading}>
            {loading ? '…' : 'Ask →'}
          </button>
        </div>
        {loading && (
          <div className="roy-thinking">
            <span>Roy is thinking</span>
            <div className="roy-dots"><span/><span/><span/></div>
          </div>
        )}
        {response && !loading && (
          <div className="roy-response">
            <div className="roy-response-hdr">ROY'S VIEW</div>
            <div className="roy-response-q">"{lastQ}"</div>
            <div className="roy-response-text">{response}</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PORTFOLIO DATA & HELPERS ─────────────────────────────────────────────────

const INITIAL_POSITIONS = [
  {
    id:"amzn-20250206",
    ticker:"AMZN",
    name:"Amazon",
    shares:3.72296685,
    entryPriceUSD:203.30,
    entryPriceCurrency:"USD",
    entryPriceRaw:203.30,
    dateBought:"2025-02-06",
    gbpInvested:557.00,
    fxRateAtEntry:1.36055999,
    fxFee:0.75,
    notes:"Initial position"
  }
];

async function fetchStockIntelligence(ticker, name) {
  try {
    const raw = localStorage.getItem(`intel-${CACHE_VERSION}-${ticker}`);
    if (raw) {
      const { ts, data } = JSON.parse(raw);
      if (Date.now() - ts < 60 * 60 * 1000) return data;
    }
  } catch {}

  // Fetch live news for this specific ticker/company
  const liveItems = await fetchLiveContext(
    `${ticker} ${name}`,
    ['reuters-biz','reuters-tech','marketwatch','cnbc-top','seeking-alpha','bbc-business']
  );
  const headlinesBlock = buildHeadlinesBlock(liveItems);

  const sys = `You are a financial analyst providing investment intelligence. Today is ${new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"long",year:"numeric"})}.
${liveItems.length ? 'You have been given live recent headlines for this stock — use these as your PRIMARY source. Prioritise the most recent ones over your training data.' : ''}
Return ONLY valid JSON (no markdown):
{
  "news": [
    {
      "headline": "concise headline, based on live sources where possible",
      "summary": "2 sentences on relevance to the stock",
      "relevance": "direct|indirect",
      "sentiment": "positive|negative|neutral",
      "theme": "short theme tag e.g. 'AI demand', 'Macro headwinds'",
      "date": "publication date from the source headline e.g. '09 Mar 2026', or null",
      "url": "URL from the live headline you are referencing, or null"
    }
  ],
  "nextEarnings": {
    "date": "e.g. 'Late April 2025' or 'May 1, 2025 (est)'",
    "quarter": "e.g. 'Q1 2025'",
    "consensus": "brief consensus expectation e.g. 'EPS ~$1.35, Revenue ~$155B'",
    "keyWatchItems": ["item 1", "item 2", "item 3"],
    "daysUntil": "approximate number of days from today"
  }
}
Provide 5-6 news items mixing direct company news and indirect macro/sector factors.`;

  const result = await callClaude(sys,
    `Provide investment intelligence for ${name} (${ticker}). Mix direct company news with indirect sector/macro factors that could affect this stock in the coming weeks.${headlinesBlock}`,
    1600);
  try { localStorage.setItem(`intel-${CACHE_VERSION}-${ticker}`, JSON.stringify({ ts: Date.now(), data: result })); } catch {}
  return result;
}

function daysUntil(dateStr) {
  try {
    const d = new Date(dateStr);
    const now = new Date();
    return Math.ceil((d-now)/(1000*60*60*24));
  } catch { return null; }
}

// ─── PORTFOLIO COMPONENTS ─────────────────────────────────────────────────────

function AddPositionModal({onSave, onClose}) {
  const [form, setForm] = useState({
    ticker:"", name:"", shares:"", entryPrice:"", entryPriceCurrency:"USD",
    dateBought:"", gbpInvested:"", fxFee:"0", notes:""
  });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const valid = form.ticker && form.name && form.shares && form.entryPrice && form.dateBought && form.gbpInvested;

  const handleSave = () => {
    onSave({
      id:`${form.ticker.toLowerCase()}-${Date.now()}`,
      ticker:form.ticker.toUpperCase().trim(),
      name:form.name.trim(),
      shares:parseFloat(form.shares),
      entryPriceUSD:form.entryPriceCurrency==="USD"?parseFloat(form.entryPrice):null,
      entryPriceGBP:form.entryPriceCurrency==="GBP"?parseFloat(form.entryPrice):null,
      entryPriceEUR:form.entryPriceCurrency==="EUR"?parseFloat(form.entryPrice):null,
      entryPriceCurrency:form.entryPriceCurrency,
      entryPriceRaw:parseFloat(form.entryPrice),
      dateBought:form.dateBought,
      gbpInvested:parseFloat(form.gbpInvested),
      fxFee:parseFloat(form.fxFee)||0,
      notes:form.notes,
    });
  };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal-hdr">
          <div className="modal-title">Add Position</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="field-row">
            <div className="field">
              <label>Ticker *</label>
              <input placeholder="e.g. NVDA" value={form.ticker} onChange={e=>set("ticker",e.target.value.toUpperCase())}/>
            </div>
            <div className="field">
              <label>Company Name *</label>
              <input placeholder="e.g. Nvidia" value={form.name} onChange={e=>set("name",e.target.value)}/>
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label>Shares Bought *</label>
              <input type="number" placeholder="e.g. 3.722" value={form.shares} onChange={e=>set("shares",e.target.value)}/>
            </div>
            <div className="field">
              <label>Date Bought *</label>
              <input type="date" value={form.dateBought} onChange={e=>set("dateBought",e.target.value)}/>
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label>Entry Price *</label>
              <input type="number" placeholder="e.g. 203.30" value={form.entryPrice} onChange={e=>set("entryPrice",e.target.value)}/>
            </div>
            <div className="field">
              <label>Price Currency</label>
              <select value={form.entryPriceCurrency} onChange={e=>set("entryPriceCurrency",e.target.value)}>
                <option value="USD">USD $</option>
                <option value="GBP">GBP £</option>
                <option value="EUR">EUR €</option>
              </select>
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label>£ Total Invested *</label>
              <input type="number" placeholder="e.g. 557.00" value={form.gbpInvested} onChange={e=>set("gbpInvested",e.target.value)}/>
              <div className="field-hint">Total GBP paid incl. fees</div>
            </div>
            <div className="field">
              <label>FX Fee (£)</label>
              <input type="number" placeholder="e.g. 0.75" value={form.fxFee} onChange={e=>set("fxFee",e.target.value)}/>
            </div>
          </div>
          <div className="field">
            <label>Notes (optional)</label>
            <input placeholder="e.g. Initial position, added on dip..." value={form.notes} onChange={e=>set("notes",e.target.value)}/>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={handleSave} disabled={!valid}>Save Position</button>
        </div>
      </div>
    </div>
  );
}

function DetailPanel({position, priceData, gbpusd, intelligence, intelLoading}) {
  const [chartRange, setChartRange] = useState("3M");
  if (!position || !priceData) return (
    <div className="port-empty">
      <div className="port-empty-icon">📊</div>
      <div>Select a position to view chart, news and earnings</div>
    </div>
  );

  const pd = priceData;
  const cur = pd.currentPrice;

  // Current GBP value
  const curGBP = position.entryPriceCurrency === "GBP"
    ? position.shares * cur
    : position.shares * cur / gbpusd;
  const pnlGBP = curGBP - position.gbpInvested;
  const pnlPct = (pnlGBP / position.gbpInvested) * 100;

  // Entry price in display currency
  const entryDisplay = position.entryPriceRaw;
  const entryVsCurrent = ((cur - entryDisplay) / entryDisplay) * 100;

  // Chart data sliced by range
  const rangeMap = {"1W":7,"1M":22,"3M":63,"6M":126,"1Y":365};
  const sliceN = rangeMap[chartRange]||63;
  const chartData = pd.prices.slice(-sliceN);

  // Entry price line value (in same currency as chart = USD for AMZN)
  const entryLine = position.entryPriceCurrency === "GBP" ? null : entryDisplay;

  const earnings = intelligence?.nextEarnings;
  const news = intelligence?.news || [];

  return (
    <>
      {/* Header */}
      <div className="detail-header">
        <div className="detail-top">
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span className="tkr">{position.ticker}</span>
              <div>
                <div className="detail-name">{position.name}</div>
              </div>
            </div>
          </div>
          <div className="detail-prices">
            <div className="detail-price" style={{color: pnlGBP>=0?"var(--G)":"var(--O)"}}>
              £{curGBP.toFixed(2)}
            </div>
            <div className="detail-sub">
              {pnlGBP>=0?"▲":"▼"} £{Math.abs(pnlGBP).toFixed(2)} ({pnlGBP>=0?"+":""}{pnlPct.toFixed(2)}%) total P&L
            </div>
          </div>
        </div>
        <div className="detail-strips">
          <TI label="Invested" value={`£${position.gbpInvested.toFixed(2)}`}/>
          <TI label="Shares" value={position.shares.toFixed(4)}/>
          <TI label="Entry" value={`${position.entryPriceCurrency==="USD"?"$":position.entryPriceCurrency==="EUR"?"€":"£"}${entryDisplay.toFixed(2)}`}/>
          <TI label="vs Entry" value={`${entryVsCurrent>=0?"+":""}${entryVsCurrent.toFixed(2)}%`} color={entryVsCurrent>=0?"var(--G)":"var(--O)"}/>
          <TI label="52w High" value={`$${pd.high52w?.toFixed(2)}`}/>
          <TI label="52w Low" value={`$${pd.low52w?.toFixed(2)}`}/>
          <TI label="50d MA" value={pd.aboveMa50?"▲ Above":"▼ Below"} color={pd.aboveMa50?"var(--G)":"var(--O)"}/>
          <TI label="Bought" value={position.dateBought}/>
        </div>
      </div>

      {/* Chart */}
      <div className="detail-chart-wrap">
        <div className="detail-chart-hdr">
          <div className="detail-chart-title">{position.ticker} · Price History</div>
          <div className="chart-range-btns">
            {["1W","1M","3M","6M","1Y"].map(r=>(
              <button key={r} className={`crb ${chartRange===r?"act":""}`} onClick={()=>setChartRange(r)}>{r}</button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart data={chartData} margin={{top:6,right:8,bottom:0,left:-16}}>
            <defs>
              <linearGradient id="detailGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#29b6f6" stopOpacity={.18}/>
                <stop offset="100%" stopColor="#29b6f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tick={{fontFamily:"JetBrains Mono",fontSize:9,fill:"#5a7a9a"}} tickLine={false} axisLine={false} interval={Math.floor(chartData.length/5)}/>
            <YAxis domain={["auto","auto"]} tick={{fontFamily:"JetBrains Mono",fontSize:9,fill:"#5a7a9a"}} tickLine={false} axisLine={false} tickFormatter={v=>`$${v.toFixed(0)}`}/>
            <Tooltip content={({active,payload})=>{
              if(!active||!payload?.length) return null;
              const p=payload[0].payload;
              return <div className="ctt"><div className="ctt-d">{p.date}</div><div>${p.close?.toFixed(2)}</div>{p.ma50&&<div style={{color:"#ffd54f",fontSize:9}}>MA50 ${p.ma50?.toFixed(2)}</div>}</div>;
            }}/>
            {entryLine && <ReferenceLine y={entryLine} stroke="var(--Y)" strokeDasharray="5 3" label={{value:"Entry",fill:"#ffd54f",fontSize:9,fontFamily:"JetBrains Mono"}}/>}
            <Area type="monotone" dataKey="close" stroke="#29b6f6" strokeWidth={2} fill="url(#detailGrad)" dot={false} isAnimationActive={false}/>
            <Line type="monotone" dataKey="ma50" stroke="#ffd54f" strokeWidth={1} dot={false} strokeDasharray="3 2" isAnimationActive={false} connectNulls/>
          </ComposedChart>
        </ResponsiveContainer>
        <div style={{display:"flex",alignItems:"center",gap:14,marginTop:8,fontFamily:"var(--mo)",fontSize:9,color:"var(--mu)"}}>
          <span style={{color:"#29b6f6"}}>── Price (AI-sourced)</span>
          <span style={{color:"#ffd54f"}}>╌ 50d MA</span>
          {entryLine&&<span style={{color:"var(--Y)"}}>╌ Your entry ${entryLine.toFixed(2)}</span>}
          <span style={{marginLeft:"auto",color:"var(--dim)"}}>⚠ Chart trend is indicative</span>
        </div>
      </div>

      {/* Earnings */}
      {intelLoading ? (
        <div className="earnings-card"><div style={{fontFamily:"var(--mo)",fontSize:11,color:"var(--mu)"}}>Loading earnings data...</div></div>
      ) : earnings && (
        <div className="earnings-card">
          <div className="earnings-top">
            <div className="earnings-icon">📅</div>
            <div>
              <div className="earnings-label">Next Earnings</div>
              <div className="earnings-date">{earnings.quarter} · {earnings.date}</div>
            </div>
          </div>
          <div className="earnings-meta">
            {earnings.consensus && <div>Consensus: {earnings.consensus}</div>}
            {earnings.keyWatchItems?.length>0 && (
              <div style={{marginTop:6}}>Watch: {earnings.keyWatchItems.join(" · ")}</div>
            )}
          </div>
          {earnings.daysUntil&&<div className="earnings-countdown">⏱ ~{earnings.daysUntil} days away</div>}
        </div>
      )}

      {/* News */}
      <div className="news-wrap">
        <div className="news-header">
          <div className="news-title">Market Intelligence · {position.name}</div>
          <div className="news-sub">Live feeds + AI analysis · direct + indirect factors · click any item to open source</div>
        </div>
        {intelLoading ? (
          <div className="news-loading">Fetching market intelligence...</div>
        ) : news.map((item,i)=>{
          const inner = (
            <>
              <div className="news-item-top">
                <span className={`news-sentiment ${item.sentiment==="positive"?"ns-pos":item.sentiment==="negative"?"ns-neg":"ns-neu"}`}>
                  {item.sentiment}
                </span>
                <span className="news-rel">{item.relevance==="direct"?"● Direct":"○ Indirect"} · {item.theme}</span>
                {item.date && <span className="news-date">{item.date}</span>}
              </div>
              <div className="news-headline">{item.headline}</div>
              <div className="news-summary">{item.summary}</div>
              {item.url && <div className="news-link-hint">↗ open source</div>}
            </>
          );
          return item.url ? (
            <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" className="news-item news-item-clickable">
              {inner}
            </a>
          ) : (
            <div key={i} className="news-item">{inner}</div>
          );
        })}
      </div>
    </>
  );
}

function PortfolioView() {
  const [positions, setPositions] = useState(INITIAL_POSITIONS);
  const [priceMap, setPriceMap] = useState({});
  const [gbpusd, setGbpusd] = useState(1.27);
  const [selected, setSelected] = useState(null);
  const [intelligence, setIntelligence] = useState({});
  const [intelLoading, setIntelLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load from storage + fetch prices on mount
  useEffect(()=>{
    async function init() {
      // Load saved positions, always ensuring INITIAL_POSITIONS are present
      let loadedPositions = INITIAL_POSITIONS;
      try {
        const raw = localStorage.getItem("portfolio-positions");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Merge: keep saved positions, but always include any INITIAL ones not already present
            const savedIds = new Set(parsed.map(p=>p.id));
            const missing = INITIAL_POSITIONS.filter(p=>!savedIds.has(p.id));
            loadedPositions = [...missing, ...parsed];
          }
        }
      } catch {}
      setPositions(loadedPositions);

      // Fetch GBP/USD
      const rate = await fetchGBPUSD();
      setGbpusd(rate);

      // Fetch prices — pass loadedPositions directly to avoid stale closure
      setLoading(true);
      await refreshPrices(loadedPositions, rate);
      setLoading(false);
    }
    init();
  },[]);

  const refreshPrices = async (pos, rate) => {
    const tickers = [...new Set(pos.map(p=>p.ticker))];
    const results = await Promise.all(tickers.map(t=>
      fetchPositionPriceData(t).then(d=>({t,d})).catch(()=>({t,d:null}))
    ));
    const pm = {};
    results.forEach(({t,d})=>{if(d) pm[t]=d;});
    setPriceMap(pm);
  };

  const savePositions = async (newPos) => {
    setPositions(newPos);
    try { localStorage.setItem("portfolio-positions", JSON.stringify(newPos)); } catch {}
  };

  const handleAddPosition = async (pos) => {
    const newPos = [...positions, pos];
    await savePositions(newPos);
    setShowAdd(false);
    // Fetch price for new position
    try {
      const d = await fetchPositionPriceData(pos.ticker);
      setPriceMap(pm=>({...pm,[pos.ticker]:d}));
    } catch {}
  };

  const handleSelect = async (pos) => {
    if (selected?.id === pos.id) { setSelected(null); return; }
    setSelected(pos);
    if (!intelligence[pos.id]) {
      setIntelLoading(true);
      try {
        const intel = await fetchStockIntelligence(pos.ticker, pos.name);
        setIntelligence(m=>({...m,[pos.id]:intel}));
      } catch {}
      setIntelLoading(false);
    }
  };

  const handleRemove = async (id) => {
    const newPos = positions.filter(p=>p.id!==id);
    await savePositions(newPos);
    if (selected?.id===id) setSelected(null);
  };

  // Portfolio totals
  const totalInvested = positions.reduce((s,p)=>s+p.gbpInvested,0);
  const totalCurrentGBP = positions.reduce((s,p)=>{
    const pd = priceMap[p.ticker];
    if (!pd) return s+p.gbpInvested;
    const cur = pd.currentPrice;
    const valGBP = p.entryPriceCurrency==="GBP" ? p.shares*cur : p.shares*cur/gbpusd;
    return s+valGBP;
  },0);
  const totalPnL = totalCurrentGBP - totalInvested;
  const totalPnLPct = (totalPnL/totalInvested)*100;

  return (
    <div className="port-wrap">
      {showAdd && <AddPositionModal onSave={handleAddPosition} onClose={()=>setShowAdd(false)}/>}

      {/* LEFT: detail panel */}
      <div className="port-left">
        <DetailPanel
          position={selected}
          priceData={selected ? priceMap[selected.ticker] : null}
          gbpusd={gbpusd}
          intelligence={selected ? intelligence[selected.id] : null}
          intelLoading={intelLoading}
        />
      </div>

      {/* RIGHT: portfolio grid */}
      <div className="port-right">
        {/* Ask Roy */}
        <AskRoy positions={positions} priceMap={priceMap} gbpusd={gbpusd}/>

        {/* Summary */}
        <div className="port-summary">
          <div className="port-summary-title">
            My Portfolio
            <span style={{fontFamily:"var(--mo)",fontSize:9,color:"var(--mu)",fontWeight:400}}>
              £1 = ${gbpusd.toFixed(4)}
            </span>
          </div>
          <div className="port-kpis">
            <div className="port-kpi">
              <div className="port-kv">£{totalCurrentGBP.toFixed(0)}</div>
              <div className="port-kl">Value</div>
            </div>
            <div className="port-kpi">
              <div className="port-kv" style={{color:totalPnL>=0?"var(--G)":"var(--O)"}}>
                {totalPnL>=0?"+":""}£{totalPnL.toFixed(0)}
              </div>
              <div className="port-kl">P&amp;L</div>
            </div>
            <div className="port-kpi">
              <div className="port-kv" style={{color:totalPnLPct>=0?"var(--G)":"var(--O)"}}>
                {totalPnLPct>=0?"+":""}{totalPnLPct.toFixed(1)}%
              </div>
              <div className="port-kl">Return</div>
            </div>
          </div>
        </div>

        {/* Position cards */}
        {loading ? (
          <div style={{fontFamily:"var(--mo)",fontSize:11,color:"var(--mu)",textAlign:"center",padding:20}}>
            Loading positions...
          </div>
        ) : positions.map(pos=>{
          const pd = priceMap[pos.ticker];
          const cur = pd?.currentPrice;
          const curGBP = pd ? (pos.entryPriceCurrency==="GBP" ? pos.shares*cur : pos.shares*cur/gbpusd) : pos.gbpInvested;
          const pnlGBP = curGBP - pos.gbpInvested;
          const pnlPct = (pnlGBP/pos.gbpInvested)*100;
          const entryVsCur = pd ? ((cur - pos.entryPriceRaw)/pos.entryPriceRaw)*100 : 0;
          const isUp = pnlGBP >= 0;
          const chgClass = v => v==null?"":v>=0?"up":"dn";

          return (
            <div key={pos.id} className={`pos-card ${selected?.id===pos.id?"selected":""}`}
              onClick={()=>handleSelect(pos)}>
              <div className="pos-card-top">
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:2}}>
                    <span className="pos-tkr">{pos.ticker}</span>
                  </div>
                  <div className="pos-name">{pos.name}</div>
                  <div className="pos-date">Since {pos.dateBought}</div>
                </div>
                <div className="pos-price-block">
                  {cur ? (
                    <>
                      <div className="pos-price" style={{color:"var(--tx)"}}>
                        {pos.entryPriceCurrency==="USD"?"$":pos.entryPriceCurrency==="EUR"?"€":"£"}{cur.toFixed(2)}
                      </div>
                      <div className="pos-1d" style={{color:pd?.change1D>=0?"var(--G)":"var(--O)"}}>
                        {pd?.change1D>=0?"▲":"▼"}{Math.abs(pd?.change1D||0).toFixed(2)}% today
                      </div>
                    </>
                  ) : <div className="pos-price" style={{color:"var(--mu)"}}>—</div>}
                </div>
              </div>

              <div className="pos-pnl-row">
                <div>
                  <div className="pos-pnl" style={{color:isUp?"var(--G)":"var(--O)"}}>
                    {isUp?"+":""}£{pnlGBP.toFixed(2)} ({isUp?"+":""}{pnlPct.toFixed(2)}%)
                  </div>
                  <div style={{fontFamily:"var(--mo)",fontSize:9,color:"var(--mu)",marginTop:2}}>
                    £{curGBP.toFixed(2)} of £{pos.gbpInvested.toFixed(2)} invested
                  </div>
                </div>
                <span className={`pos-entry-chg ${entryVsCur>=0?"up":"dn"}`}>
                  {entryVsCur>=0?"+":""}{entryVsCur.toFixed(2)}% vs entry
                </span>
              </div>

              {pd && (
                <div className="pos-changes" style={{marginTop:8}}>
                  <span className={`pos-chg ${chgClass(pd.change1D)}`}>1D {pd.change1D>=0?"+":""}{pd.change1D?.toFixed(2)}%</span>
                  <span className={`pos-chg ${chgClass(pd.change1W)}`}>1W {pd.change1W>=0?"+":""}{pd.change1W?.toFixed(2)}%</span>
                  <span className={`pos-chg ${chgClass(pd.change1M)}`}>1M {pd.change1M>=0?"+":""}{pd.change1M?.toFixed(2)}%</span>
                  <span className={`pos-chg ${chgClass(pd.change1Y)}`}>1Y {pd.change1Y>=0?"+":""}{pd.change1Y?.toFixed(2)}%</span>
                </div>
              )}

              <button style={{
                position:"absolute",top:8,right:8,background:"none",border:"none",
                color:"var(--dim)",fontSize:12,cursor:"pointer",padding:"2px 5px",
                fontFamily:"var(--mo)",lineHeight:1,
              }} onClick={e=>{e.stopPropagation();handleRemove(pos.id);}}>✕</button>
            </div>
          );
        })}

        <button className="add-pos-btn" onClick={()=>setShowAdd(true)}>
          + Add Position
        </button>

        <WatchlistPanel/>
      </div>
    </div>
  );
}

// ─── INTERESTS DASHBOARD ──────────────────────────────────────────────────────

// Named RSS feeds — newsletters, press, community. Add more freely.
const NEWSLETTER_FEEDS = {
  // ── Newsletters & Analysis ──────────────────────────────────────────────────
  'doomberg':         { url:'https://doomberg.substack.com/feed',                     label:'Doomberg' },
  'epsilon-theory':   { url:'https://www.epsilontheory.com/feed/',                    label:'Epsilon Theory' },
  'kyla-scanlon':     { url:'https://kylascanlon.substack.com/feed',                  label:'Kyla Scanlon' },
  'the-diff':         { url:'https://thediff.co/archive/feed/',                       label:'The Diff' },
  '20vc':             { url:'https://20vc.substack.com/feed',                         label:'20VC' },
  'digital-native':   { url:'https://www.digitalnative.tech/feed',                    label:'Digital Native' },
  'abnormal-returns': { url:'https://abnormalreturns.com/feed/',                      label:'Abnormal Returns' },
  'ritholtz':         { url:'https://ritholtz.com/feed/',                             label:'The Big Picture' },
  'meb-faber':        { url:'https://mebfaber.com/feed/',                             label:'Meb Faber' },
  'verdad':           { url:'https://verdadcap.com/feed/',                            label:'Verdad Research' },
  'noahpinion':       { url:'https://noahpinion.substack.com/feed',                   label:'Noahpinion' },
  'apricitas':        { url:'https://apricitas.substack.com/feed',                    label:'Apricitas Economics' },
  'newcomer':         { url:'https://www.newcomer.co/feed',                           label:'Newcomer' },
  'galaxy-brain':     { url:'https://www.galaxybrain.co/feed',                        label:'Galaxy Brain' },
  'mostly-metrics':   { url:'https://www.mostlymetrics.com/feed',                     label:'Mostly Metrics' },
  // ── Press & Wire ────────────────────────────────────────────────────────────
  'reuters-biz':      { url:'https://feeds.reuters.com/reuters/businessNews',         label:'Reuters' },
  'reuters-tech':     { url:'https://feeds.reuters.com/reuters/technologyNews',       label:'Reuters Tech' },
  'bbc-business':     { url:'https://feeds.bbci.co.uk/news/business/rss.xml',         label:'BBC Business' },
  'marketwatch':      { url:'https://feeds.marketwatch.com/marketwatch/topstories/',  label:'MarketWatch' },
  'cnbc-top':         { url:'https://www.cnbc.com/id/100003114/device/rss/rss.html',  label:'CNBC' },
  'cnbc-tech':        { url:'https://www.cnbc.com/id/19854910/device/rss/rss.html',   label:'CNBC Tech' },
  'ft-markets':       { url:'https://www.ft.com/rss/home',                            label:'FT' },
  'economist-finance':{ url:'https://www.economist.com/finance-and-economics/rss.xml',label:'The Economist' },
  'wsj-markets':      { url:'https://feeds.a.dj.com/rss/RSSMarketsMain.xml',          label:'WSJ Markets' },
  'ap-business':      { url:'https://rsshub.app/apnews/topics/business',              label:'AP Business' },
  'seeking-alpha':    { url:'https://seekingalpha.com/feed.xml',                      label:'Seeking Alpha' },
  // ── Community ───────────────────────────────────────────────────────────────
  'hacker-news':      { url:'https://news.ycombinator.com/rss',                       label:'Hacker News' },
  'r-investing':      { url:'https://www.reddit.com/r/investing/.rss',                label:'r/investing' },
  'r-stocks':         { url:'https://www.reddit.com/r/stocks/.rss',                   label:'r/stocks' },
  'r-economics':      { url:'https://www.reddit.com/r/Economics/.rss',                label:'r/Economics' },
  'r-security':       { url:'https://www.reddit.com/r/SecurityAnalysis/.rss',         label:'r/SecurityAnalysis' },
  'r-valueinvesting': { url:'https://www.reddit.com/r/ValueInvesting/.rss',           label:'r/ValueInvesting' },
  'r-macro':          { url:'https://www.reddit.com/r/MacroEconomics/.rss',           label:'r/MacroEconomics' },
  'r-geopolitics':    { url:'https://www.reddit.com/r/geopolitics/.rss',              label:'r/geopolitics' },
  'r-tech':           { url:'https://www.reddit.com/r/technology/.rss',               label:'r/technology' },
  'r-biotech':        { url:'https://www.reddit.com/r/biotech/.rss',                  label:'r/biotech' },
};

const DEFAULT_INTERESTS = [
  { id:'quantum', label:'Quantum Computing', emoji:'⚛️',
    rssQuery:'quantum computing IBM Google IonQ Rigetti',
    feeds:['hacker-news','cnbc-tech','reuters-tech','r-investing','marketwatch','r-tech'],
    prompt:'quantum computing breakthroughs, leading companies (IBM, Google, IonQ, Rigetti), commercialisation timeline and investment implications' },
  { id:'future-work', label:'Future of Work', emoji:'🏢',
    rssQuery:'AI automation workforce remote work future of work jobs',
    feeds:['kyla-scanlon','the-diff','noahpinion','apricitas','r-economics','r-stocks','bbc-business','cnbc-top'],
    prompt:'remote vs in-office trends, AI automation replacing knowledge workers, workforce transformation, productivity tools, gig economy' },
  { id:'obesity', label:'Obesity & GLP-1', emoji:'💊',
    rssQuery:'GLP-1 Ozempic Wegovy Mounjaro obesity drug Novo Nordisk Eli Lilly',
    feeds:['kyla-scanlon','r-investing','r-biotech','marketwatch','cnbc-top','seeking-alpha'],
    prompt:'GLP-1 drugs (Ozempic, Wegovy, Mounjaro), obesity treatment pipelines, downstream effects on food industry, fitness companies, healthcare and medical devices' },
  { id:'saas', label:'SaaS Apocalypse', emoji:'🔄',
    rssQuery:'SaaS AI agents enterprise software disruption agentic',
    feeds:['the-diff','20vc','hacker-news','mostly-metrics','newcomer','r-security','cnbc-tech'],
    prompt:'systems of record vs systems of action, AI agents replacing SaaS tools, vertical AI disrupting horizontal software, which SaaS companies are most at risk and which could win' },
  { id:'ai-general', label:'AI General', emoji:'🤖',
    rssQuery:'artificial intelligence AI OpenAI Anthropic Google DeepMind foundation model',
    feeds:['20vc','the-diff','digital-native','hacker-news','newcomer','galaxy-brain','cnbc-tech','reuters-tech','r-tech','economist-finance'],
    prompt:'foundation model developments, AI infrastructure investment, frontier model capabilities, regulatory developments, enterprise AI adoption' },
  { id:'geopolitics', label:'Geopolitical Instability', emoji:'🌍',
    rssQuery:'Iran war sanctions military conflict geopolitical trade war tariffs Ukraine Russia',
    feeds:['doomberg','epsilon-theory','reuters-biz','bbc-business','cnbc-top','r-geopolitics','r-macro','r-economics','economist-finance','ap-business'],
    prompt:'geopolitical tensions, trade wars, sanctions, military conflicts and their market implications, supply chain fragmentation, commodity disruptions, safe haven flows, defence spending shifts' },
];

// Parse an RSS XML string → array of {title, url, dateTs, date, label}
function parseRSSItems(text, label, maxItems = 4) {
  try {
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, 'text/xml');
    return [...xml.querySelectorAll('item')].slice(0, maxItems).map(item => {
      const title = (item.querySelector('title')?.textContent || '')
        .replace(/<[^>]+>/g,'').replace(/ - [^-]{3,40}$/,'').trim();
      const link = item.querySelector('link')?.textContent?.trim()
        || item.querySelector('guid')?.textContent?.trim() || null;
      const pubDate = item.querySelector('pubDate')?.textContent || '';
      const dateTs = pubDate ? new Date(pubDate).getTime() : 0;
      const date = dateTs ? new Date(dateTs).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}) : null;
      return title ? { title, url: link, dateTs, date, label } : null;
    }).filter(Boolean);
  } catch { return []; }
}

// Fetch a single named RSS feed → [{title,url,dateTs,date,label}]
async function fetchSingleFeed(feedKey, maxItems = 4) {
  const feed = NEWSLETTER_FEEDS[feedKey];
  if (!feed) return [];
  const bust = Math.floor(Date.now() / (10 * 60 * 1000));
  // In production use our own server-side proxy (no CORS issues, always reliable).
  // Locally fall back to public CORS proxies.
  const proxies = IS_LOCAL ? [
    `https://api.allorigins.win/raw?url=${encodeURIComponent(feed.url)}&_=${bust}`,
    `https://corsproxy.io/?url=${encodeURIComponent(feed.url)}`,
  ] : [
    `/api/rss?url=${encodeURIComponent(feed.url)}&_=${bust}`,
  ];
  for (const proxy of proxies) {
    try {
      const res = await fetch(proxy, { signal: AbortSignal.timeout(10000) });
      if (!res.ok) continue;
      const items = parseRSSItems(await res.text(), feed.label, maxItems);
      if (items.length) return items;
    } catch { continue; }
  }
  return [];
}

// Fetch Google News RSS restricted to last 7 days → [{title,url,dateTs,date,label}]
async function fetchGoogleNewsItems(query, maxItems = 10) {
  const bust = Math.floor(Date.now() / (10 * 60 * 1000));
  const gnUrl7d = `https://news.google.com/rss/search?q=${encodeURIComponent(query + ' when:7d')}&hl=en-US&gl=US&ceid=US:en`;
  const gnUrl30d = `https://news.google.com/rss/search?q=${encodeURIComponent(query + ' when:30d')}&hl=en-US&gl=US&ceid=US:en`;

  // In production use our own server-side proxy; locally use public CORS proxies.
  const makeProxies = (targetUrl) => IS_LOCAL ? [
    `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}&_=${bust}`,
    `https://corsproxy.io/?url=${encodeURIComponent(targetUrl)}`,
  ] : [
    `/api/rss?url=${encodeURIComponent(targetUrl)}&_=${bust}`,
  ];

  for (const proxy of makeProxies(gnUrl7d)) {
    try {
      const res = await fetch(proxy, { signal: AbortSignal.timeout(10000) });
      if (!res.ok) continue;
      const items = parseRSSItems(await res.text(), 'Press', maxItems);
      if (items.length) return items;
    } catch { continue; }
  }
  // Fallback: broaden to 30 days if nothing in past 7
  for (const proxy of makeProxies(gnUrl30d)) {
    try {
      const res = await fetch(proxy, { signal: AbortSignal.timeout(10000) });
      if (!res.ok) continue;
      const items = parseRSSItems(await res.text(), 'Press', maxItems);
      if (items.length) return items;
    } catch { continue; }
  }
  return [];
}


async function fetchInterestNews(interest) {
  try {
    const raw = localStorage.getItem(`interest-${CACHE_VERSION}-${interest.id}`);
    if (raw) {
      const { ts, data } = JSON.parse(raw);
      if (Date.now() - ts < 60 * 60 * 1000) return { ...data, _cached: ts }; // 1h cache
    }
  } catch {}

  // Fetch Google News + all named feeds in parallel
  const [pressItems, ...feedResults] = await Promise.all([
    interest.rssQuery ? fetchGoogleNewsItems(interest.rssQuery) : Promise.resolve([]),
    ...(interest.feeds || []).map(key => fetchSingleFeed(key)),
  ]);

  // Deduplicate by title, sort newest-first, cap at 20 to keep prompt tight
  const seen = new Set();
  const allItems = [...pressItems, ...feedResults.flat()]
    .filter(item => {
      const key = item.title.toLowerCase().slice(0, 60);
      if (seen.has(key)) return false;
      seen.add(key); return true;
    })
    .sort((a, b) => (b.dateTs || 0) - (a.dateTs || 0)) // newest first
    .slice(0, 20);

  // Pass to Claude as numbered list with source, date and URL
  const numberedList = allItems.map((item, i) =>
    `[${i+1}][${item.label}${item.date ? ' · '+item.date : ''}] ${item.title}${item.url ? '\n    URL: '+item.url : ''}`
  ).join('\n');

  const headlinesBlock = allItems.length
    ? `\n\nLIVE HEADLINES — sorted newest first — from press, newsletters & community. Use as PRIMARY source:\n${numberedList}\n`
    : '';

  const sys = `You are an investment intelligence analyst. Today is ${new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"long",year:"numeric"})}.${allItems.length ? ' You have live headlines sorted newest-first — PRIORITISE the most recent ones (top of the list) over older ones and over your training data.' : ''}
Identify the 4 most investment-relevant developments. Prefer the most recent headlines. Be specific — name companies, figures, countries. Focus on what is changing and the investment implication. Attribute the source where relevant (e.g. "per Doomberg", "per FT").
Return ONLY valid JSON (no markdown):
{
  "items": [
    {
      "headline": "concise specific headline, max 10 words",
      "summary": "2 sentences: what happened and the direct investment implication",
      "sentiment": "bullish|bearish|neutral",
      "tag": "short tag e.g. 'Breakthrough', 'Risk', 'Disruption', 'M&A', 'Regulation'",
      "date": "exact date from the source headline e.g. '08 Mar 2026', or null",
      "url": "URL from the numbered headline you are primarily referencing, or null"
    }
  ]
}
Provide exactly 4 items.`;

  const userMsg = `4 most investment-relevant developments in: ${interest.prompt}${headlinesBlock}`;
  const result = await callClaude(sys, userMsg, 2000);
  try { localStorage.setItem(`interest-${CACHE_VERSION}-${interest.id}`, JSON.stringify({ ts: Date.now(), data: result })); } catch {}
  return result;
}

function InterestStrip({ interest }) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [spinning, setSpinning] = useState(false);

  const load = async (force=false) => {
    if (force) { localStorage.removeItem(`interest-${CACHE_VERSION}-${interest.id}`); setSpinning(true); }
    setLoading(true); setError(null);
    try { setData(await fetchInterestNews(interest)); }
    catch(e) { setError(e.message); }
    setLoading(false); setSpinning(false);
  };

  useEffect(() => { load(); }, []);

  const cachedMins = data?._cached ? Math.round((Date.now() - data._cached) / 60000) : null;

  return (
    <div className="int-strip">
      <div className="int-strip-hdr">
        <span className="int-strip-title">
          <span className="int-strip-emoji">{interest.emoji}</span>
          {interest.label}
        </span>
        <button className={`int-strip-refresh ${spinning?'spinning':''}`} onClick={()=>load(true)} title="Refresh">↻</button>
      </div>
      {loading ? (
        <div className="int-loading"><div className="int-spinner"/><span>Fetching intelligence…</span></div>
      ) : error ? (
        <div className="int-error">⚠ {error}<br/><button style={{marginTop:8,background:'none',border:'1px solid var(--bdr)',color:'var(--mu)',padding:'4px 10px',borderRadius:4,cursor:'pointer',fontSize:10}} onClick={()=>load(true)}>Retry</button></div>
      ) : (
        <>
          <div className="int-strip-body">
            {(data?.items||[]).map((item,i)=>{
              const inner = (
                <>
                  <div className="int-item-top">
                    <div className="int-item-hl">{item.headline}</div>
                    {item.date && <span className="int-item-date">{item.date}</span>}
                  </div>
                  <div className="int-item-sum">{item.summary}</div>
                  <div className="int-item-foot">
                    <span className="int-tag">{item.tag}</span>
                    <span className={`int-sent ${item.sentiment}`}>
                      {item.sentiment==='bullish'?'▲ Bullish':item.sentiment==='bearish'?'▼ Bearish':'● Neutral'}
                    </span>
                    {item.url && <span className="int-item-link-hint">↗ open source</span>}
                  </div>
                </>
              );
              return item.url ? (
                <a key={i} href={item.url} target="_blank" rel="noopener noreferrer"
                   className={`int-item ${item.sentiment} int-item-clickable`}>{inner}</a>
              ) : (
                <div key={i} className={`int-item ${item.sentiment}`}>{inner}</div>
              );
            })}
          </div>
          {cachedMins !== null && <div className="int-cached">cached {cachedMins}m ago · click ↻ to refresh</div>}
        </>
      )}
    </div>
  );
}

function InterestsDashboard() {
  return (
    <div className="int-dash">
      <div className="int-hero">
        <h2>Interests Dashboard</h2>
        <p>// Live feeds from press, newsletters &amp; community · cached 1h · click any card to open source · click ↻ to force refresh</p>
      </div>
      <div className="int-strips">
        {DEFAULT_INTERESTS.map(interest => (
          <InterestStrip key={interest.id} interest={interest}/>
        ))}
      </div>
    </div>
  );
}

// ─── SOURCES DATA ─────────────────────────────────────────────────────────────

const SOURCES = [
  // ── LEGENDARY INVESTORS ──
  {
    id:"warren-buffett", cat:"Legendary Investor", catColor:"#ffd54f", catBg:"rgba(255,213,79,.1)",
    emoji:"🏛️", name:"Warren Buffett", handle:"Berkshire Hathaway",
    tags:["Value","Long-only","Annual letters"],
    desc:"Annual shareholder letters are a masterclass in capital allocation, competitive moats, and long-term thinking. Required reading every February.",
    why:"Decades of unfiltered thinking on business quality, intrinsic value, and macro humility.",
    url:"https://www.berkshirehathaway.com/letters/letters.html",
    linkText:"berkshirehathaway.com →"
  },
  {
    id:"howard-marks", cat:"Legendary Investor", catColor:"#ffd54f", catBg:"rgba(255,213,79,.1)",
    emoji:"📜", name:"Howard Marks", handle:"Oaktree Capital Memos",
    tags:["Credit","Macro cycles","Risk"],
    desc:"Oaktree memos on market cycles, risk, and second-level thinking. His concept of 'where are we in the cycle' is essential for any serious investor.",
    why:"Unparalleled clarity on credit markets and investor psychology at cycle extremes.",
    url:"https://www.oaktreecapital.com/insights/howard-marks-memos",
    linkText:"oaktreecapital.com →"
  },
  {
    id:"michael-burry", cat:"Legendary Investor", catColor:"#ffd54f", catBg:"rgba(255,213,79,.1)",
    emoji:"🔭", name:"Michael Burry", handle:"@michaeljburry on X",
    tags:["Contrarian","Short-seller","Deep value"],
    desc:"The Big Short architect. Cryptic but often prescient posts on macro risks, bubbles, and ignored data signals. Read between the lines.",
    why:"Finds structural risks markets systematically underestimate. His 13F filings are widely watched.",
    url:"https://x.com/michaeljburry",
    linkText:"x.com/michaeljburry →"
  },
  {
    id:"stan-druckenmiller", cat:"Legendary Investor", catColor:"#ffd54f", catBg:"rgba(255,213,79,.1)",
    emoji:"🌐", name:"Stanley Druckenmiller", handle:"Duquesne Family Office",
    tags:["Macro","FX","Rates"],
    desc:"Best macro trader alive. Rare interviews are gold — covers rates, currencies, equities with a top-down framework most fund managers can't match.",
    why:"His macro framework for reading Fed policy, currency flows, and global capital movement is unrivalled.",
    url:"https://www.youtube.com/results?search_query=Stanley+Druckenmiller+interview",
    linkText:"Search interviews →"
  },
  {
    id:"bill-ackman", cat:"Legendary Investor", catColor:"#ffd54f", catBg:"rgba(255,213,79,.1)",
    emoji:"📢", name:"Bill Ackman", handle:"@BillAckman on X",
    tags:["Activist","Long/Short","Concentrated"],
    desc:"Pershing Square's activist thesis presentations are deeply researched and public. Often moves markets. His X account has become unusually influential.",
    why:"Long activist pitches published in full — real research you can follow in real time.",
    url:"https://x.com/BillAckman",
    linkText:"x.com/BillAckman →"
  },
  {
    id:"ray-dalio", cat:"Legendary Investor", catColor:"#ffd54f", catBg:"rgba(255,213,79,.1)",
    emoji:"🌊", name:"Ray Dalio", handle:"LinkedIn / Principles",
    tags:["Macro","Debt cycles","All-weather"],
    desc:"Bridgewater founder. 'How the Economic Machine Works' and debt cycle framework are foundational. His LinkedIn posts cover geopolitics and macro with unusual depth.",
    why:"The debt cycle and 'beautiful deleveraging' framework is essential for understanding macro regime changes.",
    url:"https://www.linkedin.com/in/raydalio/",
    linkText:"linkedin.com/in/raydalio →"
  },

  // ── NICHE NEWSLETTERS ──
  {
    id:"the-diff", cat:"Newsletter", catColor:"#00e87a", catBg:"rgba(0,232,122,.1)",
    emoji:"📰", name:"The Diff", handle:"Byrne Hobart · Substack",
    tags:["Finance","Tech","Second-order thinking"],
    desc:"Probably the best finance/tech newsletter alive. Covers financial history, tech strategy, and market structure with genuinely original thinking.",
    why:"Finds non-obvious angles on major trends before they're consensus. Dense, worth every minute.",
    url:"https://www.thediff.co/",
    linkText:"thediff.co →"
  },
  {
    id:"doomberg", cat:"Newsletter", catColor:"#00e87a", catBg:"rgba(0,232,122,.1)",
    emoji:"🐔", name:"Doomberg", handle:"Substack · Anonymous",
    tags:["Energy","Commodities","Contrarian"],
    desc:"Anonymous energy and commodity analyst with a uniquely contrarian and data-driven approach. Covers natural gas, uranium, power markets with real industry depth.",
    why:"The energy market analysis is some of the most rigorous available outside specialist research desks.",
    url:"https://doomberg.substack.com/",
    linkText:"doomberg.substack.com →"
  },
  {
    id:"epsilon-theory", cat:"Newsletter", catColor:"#00e87a", catBg:"rgba(0,232,122,.1)",
    emoji:"🧠", name:"Epsilon Theory", handle:"Ben Hunt",
    tags:["Narrative","Macro","Game theory"],
    desc:"Uses game theory and narrative analysis to understand market behaviour. The 'Common Knowledge' framework for how markets build consensus is genuinely novel.",
    why:"Helps you understand when markets are responding to narrative vs. fundamentals — critical for timing.",
    url:"https://www.epsilontheory.com/",
    linkText:"epsilontheory.com →"
  },
  {
    id:"grants", cat:"Newsletter", catColor:"#00e87a", catBg:"rgba(0,232,122,.1)",
    emoji:"🔍", name:"Grant's Interest Rate Observer", handle:"Jim Grant",
    tags:["Credit","Rates","Contrarian"],
    desc:"The most respected independent financial publication. Contrarian, deeply researched, focuses on credit quality, interest rates, and value opportunities.",
    why:"Often identifies credit cycle turns and mispriced risk years before the market catches on.",
    url:"https://www.grantspub.com/",
    linkText:"grantspub.com →"
  },
  {
    id:"verdad", cat:"Newsletter", catColor:"#00e87a", catBg:"rgba(0,232,122,.1)",
    emoji:"📊", name:"Verdad Research", handle:"Dan Rasmussen",
    tags:["Quant","Value","Private equity"],
    desc:"Academic-grade research on leveraged small caps, private equity returns, and factor investing. Free weekly research notes are exceptional quality.",
    why:"Quantitative deconstruction of PE industry myths and small-cap value anomalies. Data-first approach.",
    url:"https://verdadcap.com/research",
    linkText:"verdadcap.com/research →"
  },
  {
    id:"kyla-scanlon", cat:"Newsletter", catColor:"#00e87a", catBg:"rgba(0,232,122,.1)",
    emoji:"💡", name:"Kyla Scanlon", handle:"Substack · In This Economy",
    tags:["Macro","Economics","Gen Z lens"],
    desc:"Covers macro economics through the lens of how it actually affects people. Coined 'vibecession'. Fresh perspective on consumer sentiment and economic narratives.",
    why:"Bridges the gap between economic data and how people actually experience the economy — useful for consumer stocks.",
    url:"https://kylascanlon.substack.com/",
    linkText:"kylascanlon.substack.com →"
  },

  // ── ALTERNATIVE DATA ──
  {
    id:"quiver-quant", cat:"Alt Data", catColor:"#29b6f6", catBg:"rgba(41,182,246,.1)",
    emoji:"🛰️", name:"Quiver Quantitative", handle:"quiverquant.com",
    tags:["Congress trades","Lobbying","Alt data"],
    desc:"Aggregates Congressional trading disclosures, government contract data, lobbying spend, and satellite data into investable signals.",
    why:"Congress members legally trade on non-public information. Following their disclosures has historically outperformed.",
    url:"https://www.quiverquant.com/",
    linkText:"quiverquant.com →"
  },
  {
    id:"unusual-whales", cat:"Alt Data", catColor:"#29b6f6", catBg:"rgba(41,182,246,.1)",
    emoji:"🐋", name:"Unusual Whales", handle:"unusualwhales.com",
    tags:["Options flow","Dark pools","Political"],
    desc:"Tracks unusual options activity, dark pool prints, and Congressional stock trades. The options flow data surfaces informed money moving before news.",
    why:"Large, unusual options flow often precedes major moves. Dark pool activity shows institutional accumulation/distribution.",
    url:"https://unusualwhales.com/",
    linkText:"unusualwhales.com →"
  },
  {
    id:"open-insider", cat:"Alt Data", catColor:"#29b6f6", catBg:"rgba(41,182,246,.1)",
    emoji:"📋", name:"OpenInsider", handle:"openinsider.com",
    tags:["Insider buying","SEC filings","Signals"],
    desc:"Tracks SEC Form 4 filings — when company insiders buy their own stock. Cluster buys (multiple insiders buying simultaneously) are historically highly predictive.",
    why:"Insiders buying their own stock is one of the clearest positive signals in markets. Free and easy to screen.",
    url:"https://openinsider.com/",
    linkText:"openinsider.com →"
  },
  {
    id:"fred", cat:"Alt Data", catColor:"#29b6f6", catBg:"rgba(41,182,246,.1)",
    emoji:"🏦", name:"FRED Economic Data", handle:"Federal Reserve St. Louis",
    tags:["Macro","Series","Free API"],
    desc:"The Federal Reserve's free database of 800,000+ economic time series. Everything from M2 money supply to yield spreads to regional employment. Essential.",
    why:"Primary source for macro data. Yield curve inversions, credit spreads, and monetary aggregates all live here.",
    url:"https://fred.stlouisfed.org/",
    linkText:"fred.stlouisfed.org →"
  },
  {
    id:"sec-edgar", cat:"Alt Data", catColor:"#29b6f6", catBg:"rgba(41,182,246,.1)",
    emoji:"📑", name:"SEC EDGAR Full-Text Search", handle:"efts.sec.gov",
    tags:["13F","Filings","Institutional"],
    desc:"Full-text search of all SEC filings. Track 13F holdings of any hedge fund, read 8-K filings the moment they drop, or search for specific disclosures across all companies.",
    why:"Most investors rely on third-party summaries. Reading primary filings directly gives you an edge over processed data.",
    url:"https://efts.sec.gov/LATEST/search-index?q=%22%22&dateRange=custom&startdt=2024-01-01&forms=13F-HR",
    linkText:"sec.gov EDGAR →"
  },
  {
    id:"finviz", cat:"Alt Data", catColor:"#29b6f6", catBg:"rgba(41,182,246,.1)",
    emoji:"🗺️", name:"Finviz", handle:"finviz.com",
    tags:["Screener","Heatmap","Technical"],
    desc:"Best free stock screener and heat map. Filter by valuation, momentum, sector, geography. The heatmap is the fastest way to see which sectors are moving.",
    why:"Essential daily tool for scanning market breadth, sector rotation, and finding momentum candidates.",
    url:"https://finviz.com/map.ashx",
    linkText:"finviz.com →"
  },

  // ── REDDIT / COMMUNITIES ──
  {
    id:"wsb", cat:"Community", catColor:"#ff7043", catBg:"rgba(255,112,67,.1)",
    emoji:"🚀", name:"r/WallStreetBets", handle:"reddit.com/r/wallstreetbets",
    tags:["Options","Meme stocks","Sentiment"],
    desc:"High-noise, high-signal when used correctly. Watch for gamma squeeze setups, unusual retail conviction, and sentiment extremes that can move mid-cap stocks.",
    why:"Retail crowding on specific names can be traded against or alongside. Sentiment peaks are useful contrarian signals.",
    url:"https://www.reddit.com/r/wallstreetbets/",
    linkText:"reddit.com/r/wallstreetbets →"
  },
  {
    id:"security-analysis", cat:"Community", catColor:"#ff7043", catBg:"rgba(255,112,67,.1)",
    emoji:"🔬", name:"r/SecurityAnalysis", handle:"reddit.com/r/SecurityAnalysis",
    tags:["Deep value","Research","Long-form"],
    desc:"The serious finance subreddit. Long-form investment theses, links to research papers, academic work on factor investing. Very low noise, high signal.",
    why:"One of the few places online where genuine deep fundamental research gets shared and debated.",
    url:"https://www.reddit.com/r/SecurityAnalysis/",
    linkText:"reddit.com/r/SecurityAnalysis →"
  },
  {
    id:"investing-reddit", cat:"Community", catColor:"#ff7043", catBg:"rgba(255,112,67,.1)",
    emoji:"💼", name:"r/investing", handle:"reddit.com/r/investing",
    tags:["General","ETF","Portfolio"],
    desc:"Broad investing community. More beginner-oriented but useful for gauging retail sentiment, ETF flows, and which narratives are reaching mainstream investors.",
    why:"The size and activity level make it useful as a sentiment gauge — what retail is thinking and buying.",
    url:"https://www.reddit.com/r/investing/",
    linkText:"reddit.com/r/investing →"
  },
  {
    id:"bogleheads", cat:"Community", catColor:"#ff7043", catBg:"rgba(255,112,67,.1)",
    emoji:"📈", name:"Bogleheads Forum", handle:"bogleheads.org/forum",
    tags:["Index funds","Long-term","Tax"],
    desc:"The home of passive index investing philosophy. The wiki and forum cover asset allocation, tax-efficiency, and long-term portfolio construction better than almost any professional resource.",
    why:"Excellent for the Core Fund strategy — portfolio construction, tax-loss harvesting, and ETF selection.",
    url:"https://www.bogleheads.org/forum/index.php",
    linkText:"bogleheads.org →"
  },
  {
    id:"dataisbeautiful", cat:"Community", catColor:"#ff7043", catBg:"rgba(255,112,67,.1)",
    emoji:"📉", name:"r/econmonitor", handle:"reddit.com/r/econmonitor",
    tags:["Macro data","Charts","Economic"],
    desc:"Real-time aggregation of macro data releases, central bank statements, and economic charts. Faster than Bloomberg for seeing data drops in context.",
    why:"Quick visual interpretation of data surprises — great for understanding which way rates/growth prints moved vs. expectations.",
    url:"https://www.reddit.com/r/econmonitor/",
    linkText:"reddit.com/r/econmonitor →"
  },

  // ── PODCASTS / VIDEO ──
  {
    id:"acquired", cat:"Podcast", catColor:"#ce93d8", catBg:"rgba(206,147,216,.1)",
    emoji:"🎙️", name:"Acquired", handle:"acquired.fm",
    tags:["Business history","Deep dives","Strategy"],
    desc:"Multi-hour deep dives into the history of NVIDIA, Berkshire, TSMC, Microsoft. The best way to understand competitive moats and business model evolution.",
    why:"Understanding the history of how dominant businesses were built is essential for spotting the next ones.",
    url:"https://www.acquired.fm/",
    linkText:"acquired.fm →"
  },
  {
    id:"invest-like-best", cat:"Podcast", catColor:"#ce93d8", catBg:"rgba(206,147,216,.1)",
    emoji:"🎧", name:"Invest Like the Best", handle:"Patrick O'Shaughnessy",
    tags:["Interviews","Frameworks","Emerging managers"],
    desc:"Patrick interviews the best investors and operators in the world. Consistently surfaces emerging fund managers with edge before they're mainstream.",
    why:"First-mover access to investment frameworks and operators before they're crowded. Essential for idea generation.",
    url:"https://www.joincolossus.com/episodes",
    linkText:"joincolossus.com →"
  },
  {
    id:"we-study-billionaires", cat:"Podcast", catColor:"#ce93d8", catBg:"rgba(206,147,216,.1)",
    emoji:"🎓", name:"We Study Billionaires", handle:"The Investors Podcast",
    tags:["Value","Macro","Books"],
    desc:"Deep dives into the investment philosophies of legendary investors. Good for building mental models and understanding valuation frameworks across different styles.",
    why:"Systematic coverage of how great investors think — useful when you need to stress-test your own thesis.",
    url:"https://www.theinvestorspodcast.com/",
    linkText:"theinvestorspodcast.com →"
  },
  {
    id:"odd-lots", cat:"Podcast", catColor:"#ce93d8", catBg:"rgba(206,147,216,.1)",
    emoji:"🔊", name:"Odd Lots", handle:"Bloomberg · Joe Weisenthal & Tracy Alloway",
    tags:["Macro","Niche markets","Rates"],
    desc:"Bloomberg podcast covering niche and esoteric corners of financial markets. Covered repo markets, LME nickel squeeze, commodity supercycles before they were mainstream.",
    why:"Consistently surfaces the under-covered mechanics of financial plumbing that drive markets.",
    url:"https://www.bloomberg.com/podcasts/odd-lots",
    linkText:"bloomberg.com/podcasts/odd-lots →"
  },
  {
    id:"macro-voices", cat:"Podcast", catColor:"#ce93d8", catBg:"rgba(206,147,216,.1)",
    emoji:"🌍", name:"MacroVoices", handle:"macrovoices.com",
    tags:["Macro","Commodities","Rates"],
    desc:"Weekly macro podcast covering global macro, oil, metals, FX and rates with practitioners. Erik Townsend interviews hedge fund managers and commodity traders.",
    why:"The commodity and energy market colour here is often 2-3 months ahead of mainstream media coverage.",
    url:"https://www.macrovoices.com/",
    linkText:"macrovoices.com →"
  },

  // ── QUANT / ACADEMIC ──
  {
    id:"ssrn", cat:"Academic", catColor:"#80cbc4", catBg:"rgba(128,203,196,.1)",
    emoji:"🔭", name:"SSRN Finance Papers", handle:"ssrn.com",
    tags:["Academic","Factors","Anomalies"],
    desc:"The pre-print server for finance and economics research. New factor discoveries, market anomaly documentation, and academic empirical research land here first.",
    why:"Factors like momentum, quality, and low-volatility were documented here before they became ETFs. Read the source.",
    url:"https://www.ssrn.com/index.cfm/en/finance/",
    linkText:"ssrn.com →"
  },
  {
    id:"alpha-architect", cat:"Academic", catColor:"#80cbc4", catBg:"rgba(128,203,196,.1)",
    emoji:"🧮", name:"Alpha Architect", handle:"alphaarchitect.com",
    tags:["Quant","Factor","Deep value"],
    desc:"Translates academic factor research into practical investment frameworks. The most accessible bridge between finance academia and real portfolio construction.",
    why:"If you want to understand why momentum, value, or quality factors work — this is where to start.",
    url:"https://alphaarchitect.com/blog/",
    linkText:"alphaarchitect.com →"
  },
  {
    id:"aswath", cat:"Academic", catColor:"#80cbc4", catBg:"rgba(128,203,196,.1)",
    emoji:"📐", name:"Aswath Damodaran", handle:"NYU Stern · 'Dean of Valuation'",
    tags:["Valuation","DCF","Equity"],
    desc:"NYU professor who puts all his valuation models, data, and course materials online for free. The definitive resource for understanding intrinsic value and DCF.",
    why:"His annual data updates on sector multiples, cost of capital, and equity risk premiums are widely cited.",
    url:"https://pages.stern.nyu.edu/~adamodar/",
    linkText:"stern.nyu.edu/~adamodar →"
  },
  {
    id:"predicting-alpha", cat:"Academic", catColor:"#80cbc4", catBg:"rgba(128,203,196,.1)",
    emoji:"⚡", name:"Predicting Alpha", handle:"predictingalpha.com",
    tags:["Quant signals","Screening","Backtests"],
    desc:"Institutional-grade quantitative screening tools and factor backtests available to retail investors. Tests strategies on survivorship-bias-free datasets.",
    why:"One of the few places retail investors can access properly backtested quant strategies without paying hedge fund fees.",
    url:"https://predictingalpha.com/",
    linkText:"predictingalpha.com →"
  },
  {
    id:"20vc", cat:"Podcast", catColor:"#ce93d8", catBg:"rgba(206,147,216,.1)",
    emoji:"🎙️", name:"20VC / The 20 Minute VC", handle:"20vc.substack.com",
    tags:["AI","Venture Capital","Founder interviews","Tech trends"],
    desc:"Harry Stebbings interviews the world's best venture capitalists and founders. The substack distils key themes from 20VC conversations — heavy focus on AI, frontier tech, and where smart money is moving.",
    why:"Direct access to how top-tier VCs (Sequoia, a16z, Founders Fund) are thinking about AI bets and emerging categories before they become consensus.",
    url:"https://20vc.substack.com/",
    linkText:"20vc.substack.com →"
  },
  {
    id:"digital-native", cat:"Newsletter", catColor:"#ffcc80", catBg:"rgba(255,204,128,.1)",
    emoji:"📱", name:"Digital Native", handle:"digitalnative.tech",
    tags:["Consumer tech","Trends","Social","Marketplaces","Gen Z"],
    desc:"Rex Woodbury writes about the intersection of consumer technology and culture — how apps, social platforms, and marketplaces are reshaping behaviour, identity, and commerce.",
    why:"One of the sharpest lenses on consumer-facing product trends and how cultural shifts translate into durable tech companies.",
    url:"https://www.digitalnative.tech/",
    linkText:"digitalnative.tech →"
  },
  {
    id:"economist", cat:"Press", catColor:"#ef9a9a", catBg:"rgba(239,154,154,.1)",
    emoji:"🌐", name:"The Economist", handle:"economist.com",
    tags:["Macro","Geopolitics","Business","Policy","Long-form"],
    desc:"Weekly global affairs publication with a strong editorial point of view on economics, politics, and business. Renowned for taking contrarian positions backed by rigorous analysis.",
    why:"Unmatched for contextualising regime-change events — trade wars, central bank pivots, political risk — with clear implications for capital allocation.",
    url:"https://www.economist.com/finance-and-economics",
    linkText:"economist.com →"
  },
  {
    id:"ft", cat:"Press", catColor:"#ef9a9a", catBg:"rgba(239,154,154,.1)",
    emoji:"🗞️", name:"Financial Times", handle:"ft.com",
    tags:["Corporate finance","M&A","Central banks","Commodities","EM"],
    desc:"The paper of record for institutional finance. Covers M&A, central bank policy, commodities, and emerging markets with unrivalled depth and access to corporate sources.",
    why:"If it's moving markets globally — a Fed shift, an oil supply deal, a major acquisition — the FT will have the best sourced analysis.",
    url:"https://www.ft.com/markets",
    linkText:"ft.com/markets →"
  },
  {
    id:"wsj", cat:"Press", catColor:"#ef9a9a", catBg:"rgba(239,154,154,.1)",
    emoji:"📰", name:"Wall Street Journal", handle:"wsj.com",
    tags:["US markets","Earnings","Fed policy","Tech","Corporate"],
    desc:"The essential daily read for US-centric investing. Breaks corporate earnings stories, Fed guidance leaks, tech industry news, and regulatory developments before anyone else.",
    why:"WSJ reporters have unparalleled access to the Fed, major banks, and Fortune 500 boardrooms — critical for US macro and corporate event-driven investing.",
    url:"https://www.wsj.com/news/markets",
    linkText:"wsj.com/markets →"
  },
  {
    id:"reuters", cat:"Press", catColor:"#ef9a9a", catBg:"rgba(239,154,154,.1)",
    emoji:"📡", name:"Reuters", handle:"reuters.com",
    tags:["Breaking news","Commodities","FX","Geopolitics","Wire"],
    desc:"The world's largest news wire service. Fastest breaking coverage of geopolitical events, commodity price moves, central bank decisions, and corporate news.",
    why:"The cleanest real-time signal for event-driven investing — when something breaks (war, sanctions, rate surprise), Reuters has it first with minimal spin.",
    url:"https://www.reuters.com/business/finance/",
    linkText:"reuters.com →"
  },
  {
    id:"bloomberg", cat:"Press", catColor:"#ef9a9a", catBg:"rgba(239,154,154,.1)",
    emoji:"📊", name:"Bloomberg", handle:"bloomberg.com",
    tags:["Markets data","Rates","FX","Corporate bonds","Macro"],
    desc:"The dominant financial data and news platform. Essential for rates, credit markets, FX, and corporate bond coverage. Bloomberg scoops on Fed policy and central bank moves are market-moving.",
    why:"Indispensable for understanding the institutional view — what the bond market, the dollar, and credit spreads are pricing in relative to equities.",
    url:"https://www.bloomberg.com/markets",
    linkText:"bloomberg.com/markets →"
  },
];

const SOURCE_CATS = ["All", "Press", "Legendary Investor", "Newsletter", "Alt Data", "Community", "Podcast", "Academic"];

function SourcesHub() {
  const [activeCat, setActiveCat] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = SOURCES.filter(s => {
    const matchCat = activeCat === "All" || s.cat === activeCat;
    const q = search.toLowerCase();
    const matchSearch = !q || s.name.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q) || s.tags.some(t=>t.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  const grouped = SOURCE_CATS.filter(c=>c!=="All").map(cat => ({
    cat, items: filtered.filter(s=>s.cat===cat)
  })).filter(g=>g.items.length>0);

  const display = activeCat === "All" ? grouped : [{cat:activeCat, items:filtered}];

  return (
    <div className="hub">
      <div className="hub-hero">
        <h2>Intelligence Sources</h2>
        <p>// Select and copy any URL below, then paste into your browser</p>
      </div>

      <input className="qi" style={{marginBottom:14,width:"100%",maxWidth:400}}
        placeholder="Search sources..." value={search} onChange={e=>setSearch(e.target.value)}/>

      <div className="hub-filters">
        {SOURCE_CATS.map(cat=>(
          <button key={cat} className={`hf-btn ${activeCat===cat?"hf-act":""}`} onClick={()=>setActiveCat(cat)}>{cat}</button>
        ))}
      </div>

      {display.map(({cat, items})=>(
        <div key={cat} className="hub-section">
          <div className="hub-section-title">// {cat} — {items.length} source{items.length!==1?"s":""}</div>
          <div className="hub-grid">
            {items.map(s=>(
              <div key={s.id} className="src-card">
                <div className="src-top">
                  <div className="src-meta">
                    <span className="src-cat" style={{color:s.catColor,background:s.catBg,border:`1px solid ${s.catColor}33`}}>{s.cat}</span>
                    {s.tags.slice(0,2).map(t=><span key={t} className="src-tag">{t}</span>)}
                  </div>
                  <div className="src-name"><span>{s.emoji}</span><span>{s.name}</span></div>
                  <div className="src-handle">{s.handle}</div>
                </div>
                <div className="src-desc">{s.desc}</div>
                <div className="src-footer">
                  <div className="src-why">💡 {s.why}</div>
                </div>
                <div className="src-url-box">
                  <span className="src-url-label">🔗 URL — select &amp; copy:</span>
                  <span className="src-url-text" onClick={e=>e.stopPropagation()}>{s.url}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

function PasswordGate({ onUnlock }) {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState(false);
  const [checking, setChecking] = useState(false);

  const attempt = async () => {
    if (!pw.trim()) return;
    setChecking(true); setErr(false);
    try {
      // Test the password by making a minimal Claude call
      const r = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-site-password': pw },
        body: JSON.stringify({ model:'claude-sonnet-4-20250514', max_tokens:10, system:'Reply OK', messages:[{role:'user',content:'ping'}] }),
      });
      const d = await r.json();
      if (d.error?.message === 'WRONG_PASSWORD') { setErr(true); }
      else { setSitePassword(pw); onUnlock(); }
    } catch { setErr(true); }
    setChecking(false);
  };

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--bg)'}}>
      <div style={{background:'var(--sur)',border:'1px solid var(--bdr)',borderRadius:16,padding:'40px 48px',width:360,textAlign:'center'}}>
        <div style={{fontSize:28,marginBottom:8}}>📡</div>
        <div style={{fontFamily:'var(--hd)',fontSize:22,fontWeight:800,letterSpacing:'.06em',marginBottom:4}}>SIGNAL</div>
        <div style={{fontFamily:'var(--mo)',fontSize:10,color:'var(--mu)',marginBottom:32,letterSpacing:'.1em'}}>INVESTMENT RESEARCH AGENT</div>
        <input
          type="password"
          placeholder="Enter access password"
          value={pw}
          onChange={e=>{setPw(e.target.value);setErr(false);}}
          onKeyDown={e=>e.key==='Enter'&&attempt()}
          style={{width:'100%',background:'var(--s2)',border:`1px solid ${err?'var(--R)':'var(--bdr)'}`,borderRadius:8,padding:'10px 14px',color:'var(--tx)',fontFamily:'var(--mo)',fontSize:12,marginBottom:12,boxSizing:'border-box',outline:'none'}}
          autoFocus
        />
        {err && <div style={{fontFamily:'var(--mo)',fontSize:10,color:'var(--R)',marginBottom:10}}>Incorrect password</div>}
        <button
          onClick={attempt}
          disabled={checking || !pw.trim()}
          style={{width:'100%',background:'var(--B)',border:'none',borderRadius:8,padding:'10px',color:'#000',fontFamily:'var(--hd)',fontWeight:700,fontSize:12,letterSpacing:'.08em',cursor:'pointer',opacity:checking?0.6:1}}
        >
          {checking ? 'Checking...' : 'Access →'}
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [unlocked, setUnlocked] = useState(() => IS_LOCAL || !!getSitePassword());
  const [tab, setTab] = useState("research");
  const [mode, setMode] = useState("long");
  const [query, setQuery] = useState("");
  const [phase, setPhase] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [pMap, setPMap] = useState({});
  const [enhanced, setEnhanced] = useState(null);
  const [contrarian, setContrarian] = useState(null);
  const [compData, setCompData] = useState([]);
  const [failed, setFailed] = useState(new Set());
  const [error, setError] = useState(null);
  const [watchlist, setWatchlist] = useState(() => {
    try { const s = localStorage.getItem('signal-watchlist'); return s ? new Set(JSON.parse(s)) : new Set(); } catch { return new Set(); }
  });

  const [dailyTrend, setDailyTrend] = useState(null);
  const [dailyLoading, setDailyLoading] = useState(true);
  const [dailyRefreshing, setDailyRefreshing] = useState(false);
  const [dailyError, setDailyError] = useState(false);

  const [showApiModal, setShowApiModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [apiKeySet, setApiKeySet] = useState(!!localStorage.getItem('signal-api-key'));

  const saveApiKey = () => {
    const k = apiKeyInput.trim();
    if (!k) return;
    localStorage.setItem('signal-api-key', k);
    setApiKeySet(true);
    setShowApiModal(false);
    setApiKeyInput('');
    // Clear cache so next mount fetches fresh with new key
    localStorage.removeItem(`daily-trend-${CACHE_VERSION}`);
  };

  // Load daily trend once authenticated — dependency on `unlocked` ensures this
  // fires after the password gate is passed, not before (which would fail auth).
  useEffect(() => {
    if (!unlocked) return; // wait until authenticated
    try {
      const raw = localStorage.getItem(`daily-trend-${CACHE_VERSION}`);
      if (raw) {
        const { ts, data } = JSON.parse(raw);
        if (Date.now() - ts < 24 * 60 * 60 * 1000) {
          setDailyTrend(data); setDailyLoading(false); return;
        }
      }
    } catch {}
    loadDailyTrend(false);
  }, [unlocked]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadDailyTrend = async (isRefresh=false) => {
    if (isRefresh) setDailyRefreshing(true);
    else setDailyLoading(true);
    setDailyError(false);
    try {
      const t = await fetchDailyTrend();
      setDailyTrend(t);
      try { localStorage.setItem(`daily-trend-${CACHE_VERSION}`, JSON.stringify({ ts: Date.now(), data: t })); } catch {}
    } catch(e) {
      console.error("Daily trend failed:", e);
      setDailyError(true);
    } finally {
      setDailyLoading(false);
      setDailyRefreshing(false);
    }
  };

  const phasePct = {ai1:18,prices:42,ai2:68,ai3:88,done:100}[phase]||0;

  const run = async (q=query) => {
    if (!q.trim()) return;
    setPhase("ai1"); setAnalysis(null); setPMap({}); setEnhanced(null);
    setContrarian(null); setCompData([]); setFailed(new Set()); setError(null);
    try {
      const a = await phase1(q, mode);
      setAnalysis(a);

      setPhase("prices");
      const tickers = (a.stocks||[]).map(s=>s.ticker);
      const fail = new Set();
      let pm = {};
      try {
        // Batch fetch all tickers in a single AI call
        pm = await fetchPriceDataBatch(tickers);
        // Mark any that didn't come back
        tickers.forEach(t => { if (!pm[t]) fail.add(t); });
      } catch {
        // Fallback: try individual fetches
        const res = await Promise.all(tickers.map(t =>
          fetchPriceData(t).then(d=>({t,d})).catch(()=>{fail.add(t);return {t,d:null};})
        ));
        res.forEach(({t,d})=>{if(d) pm[t]=d;});
      }
      setPMap(pm); setFailed(fail);
      setCompData(buildCompData(pm, tickers));

      setPhase("ai2");
      const tech = await phase2Tech(a.stocks, pm, mode);
      setEnhanced(tech);

      setPhase("ai3");
      const con = await phase3Contrarian(a, pm);
      setContrarian(con);

      setPhase("done");
    } catch(e) {
      setError(e.message||"Analysis failed. Please retry.");
      setPhase(null);
    }
  };

  const handleTag = t => { setQuery(t); run(t); };
  const toggleWL = t => setWatchlist(prev=>{
    const n=new Set(prev); n.has(t)?n.delete(t):n.add(t);
    try { localStorage.setItem('signal-watchlist', JSON.stringify([...n])); } catch {}
    return n;
  });

  const isLoading = phase && phase !== "done";
  const isDone = phase === "done";

  const stocks = (analysis?.stocks||[]).map(s=>{
    const tech = enhanced?.stocks?.find(x=>x.ticker===s.ticker);
    return {...s,...(tech||{})};
  });

  const phaseIdx = PHASE_ORDER.indexOf(phase);

  if (!unlocked) return <PasswordGate onUnlock={()=>setUnlocked(true)} />;

  return (
    <div className="app">
      <style>{css}</style>

      <div className="hdr">
        <div className="logo">
          <div className="pulse"/>
          <div><div className="logo-name">Signal</div><div className="logo-tag">Investment Research Agent · v3</div></div>
        </div>
        <div className="hdr-nav">
          <button className={`nav-btn ${tab==="research"?"nav-act":""}`} onClick={()=>setTab("research")}>Research</button>
          <button className={`nav-btn ${tab==="interests"?"nav-act":""}`} onClick={()=>setTab("interests")}>Interests</button>
          <button className={`nav-btn ${tab==="portfolio"?"nav-act":""}`} onClick={()=>setTab("portfolio")}>Portfolio</button>
          <button className={`nav-btn ${tab==="sources"?"nav-act":""}`} onClick={()=>setTab("sources")}>Sources</button>
        </div>
        <div className="hdr-r">
          <span>● LIVE</span>
          <span style={{color:"var(--dim)"}}>|</span>
          <span>{new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})}</span>
          {watchlist.size>0&&<span style={{color:"var(--Y)"}}>★ {watchlist.size} watching</span>}
        </div>
      </div>

      {/* API key banner — only shown locally, Vercel uses server-side env var */}
      {IS_LOCAL && (
        <div className="api-banner">
          <span className="api-banner-msg">
            {apiKeySet ? "✓ Anthropic API key configured" : "⚠ No API key set — all AI features are disabled"}
          </span>
          <button className={`api-key-btn ${apiKeySet?"set":""}`} onClick={()=>setShowApiModal(true)}>
            {apiKeySet ? "Change Key" : "Set API Key"}
          </button>
        </div>
      )}

      {/* API key modal */}
      {showApiModal && (
        <div className="modal-bg" onClick={()=>setShowApiModal(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-hdr">
              <span className="modal-title">Anthropic API Key</span>
              <button className="modal-close" onClick={()=>setShowApiModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="field">
                <label>API Key</label>
                <input
                  type="password"
                  placeholder="sk-ant-..."
                  value={apiKeyInput}
                  onChange={e=>setApiKeyInput(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&saveApiKey()}
                  autoFocus
                />
                <div className="field-hint">Get your key at <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer" style={{color:"var(--B)"}}>console.anthropic.com</a> — stored in localStorage only</div>
              </div>
              {apiKeySet && <div className="field-hint" style={{color:"var(--G)"}}>✓ A key is already saved. Enter a new one to replace it.</div>}
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={()=>setShowApiModal(false)}>Cancel</button>
              <button className="btn-save" onClick={saveApiKey} disabled={!apiKeyInput.trim()}>Save Key</button>
            </div>
          </div>
        </div>
      )}

      {tab==="sources" && <SourcesHub/>}
      {tab==="interests" && <InterestsDashboard/>}
      {tab==="portfolio" && <PortfolioView/>}
      {tab==="research" && <div className="main">
        <div className="hero">
          <h1>Find your edge.</h1>
          <p>// Niche trend picks · four-phase AI · real price data · contrarian intelligence</p>
        </div>

        {/* DAILY TREND */}
        <DailyTrendCard
          trend={dailyTrend}
          loading={dailyLoading}
          onRefresh={()=>loadDailyTrend(true)}
          refreshing={dailyRefreshing}
          error={dailyError}
        />

        {/* SEARCH */}
        <div className="sp">
          <div className="modes">
            <button className={`mbtn lng ${mode==="long"?"act":""}`} onClick={()=>setMode("long")}>◈ Long-term secular</button>
            <button className={`mbtn sht ${mode==="short"?"act":""}`} onClick={()=>setMode("short")}>⚡ Short-term momentum</button>
          </div>
          <div className="irow">
            <input className="qi"
              placeholder={mode==="long"?"e.g. AI infrastructure, nuclear energy, robotics...":"e.g. rate cut plays, tariff winners, earnings catalyst..."}
              value={query} onChange={e=>setQuery(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&!isLoading&&run()}/>
            <button className="gbtn" onClick={()=>run()} disabled={isLoading||!query.trim()}>
              {isLoading?"Running...":"Analyse →"}
            </button>
          </div>
          <div className="tags">
            {(mode==="long"?LONG_TAGS:SHORT_TAGS).map(t=>(
              <button key={t} className="tag" onClick={()=>!isLoading&&handleTag(t)}>{t}</button>
            ))}
          </div>
        </div>

        {/* LOADING */}
        {isLoading&&(
          <div className="lw">
            <div className="lt">Researching markets</div>
            <div className="ls">
              {phase==="ai1"&&"Building thesis and selecting stocks..."}
              {phase==="prices"&&"Fetching real price history for all stocks..."}
              {phase==="ai2"&&"Reading price action and technical signals..."}
              {phase==="ai3"&&"Constructing the contrarian case..."}
            </div>
            <div className="pt"><div className="pf" style={{width:`${phasePct}%`}}/></div>
            <div className="phases">
              {PHASES.map(({key,lbl})=>{
                const me=PHASE_ORDER.indexOf(key);
                const cls=me<phaseIdx?"done":me===phaseIdx?"act":"";
                return <div key={key} className={`ps ${cls}`}><div className="pd"/>{lbl}</div>;
              })}
            </div>
          </div>
        )}

        {error&&<div className="err">⚠ {error}</div>}

        {isDone&&analysis&&(
          <div className="res">

            {/* OVERVIEW */}
            <div>
              <div className="slbl">// Trend Overview</div>
              <div className="ov">
                <div className="ov-t">
                  {analysis.trend}
                  <span className="bdg" style={{
                    background:mode==="long"?"rgba(41,182,246,.09)":"rgba(255,112,67,.09)",
                    color:mode==="long"?"var(--B)":"var(--O)",
                    border:`1px solid ${mode==="long"?"rgba(41,182,246,.22)":"rgba(255,112,67,.22)"}`,
                  }}>{analysis.timeHorizon}</span>
                </div>
                <div className="ov-s">{analysis.summary}</div>
                <div className="kpis">
                  <div className="kpi"><div className="kv cG">{analysis.conviction?.toUpperCase()}</div><div className="kl">AI Conviction</div></div>
                  <div className="kpi"><div className="kv cB" style={{fontSize:11}}>{analysis.tailwind}</div><div className="kl">Key Tailwind</div></div>
                  <div className="kpi"><div className="kv cO" style={{fontSize:11}}>{analysis.risk}</div><div className="kl">Key Risk</div></div>
                  <div className="kpi">
                    <div className="kv" style={{color:analysis.overallRiskScore>60?"var(--O)":"var(--G)"}}>{analysis.overallRiskScore}/100</div>
                    <div className="kl">Risk Score</div>
                  </div>
                </div>
                {(analysis.trendMaturity||analysis.pricedIn)&&(
                  <div style={{display:'flex',gap:8,marginTop:10,flexWrap:'wrap'}}>
                    {analysis.trendMaturity&&<span style={{fontFamily:'var(--mo)',fontSize:9,padding:'3px 9px',borderRadius:4,background:'rgba(41,182,246,.08)',border:'1px solid rgba(41,182,246,.2)',color:'var(--B)',letterSpacing:'.08em',textTransform:'uppercase'}}>
                      {analysis.trendMaturity==='early'?'🌱':analysis.trendMaturity==='mid'?'📈':'⚠️'} {analysis.trendMaturity}-cycle
                    </span>}
                    {analysis.pricedIn&&<span style={{fontFamily:'var(--mo)',fontSize:9,padding:'3px 9px',borderRadius:4,background:'rgba(255,213,79,.06)',border:'1px solid rgba(255,213,79,.2)',color:'var(--Y)',maxWidth:420}}>
                      💰 {analysis.pricedIn}
                    </span>}
                  </div>
                )}
                {enhanced?.technicalSummary&&(
                  <div className="ov-ts">📈 Technical picture: {enhanced.technicalSummary}</div>
                )}
                {analysis.themeSourceRefs?.length>0&&(
                  <div className="theme-refs">
                    <div className="theme-refs-lbl">📚 Key sources for this theme</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                      {analysis.themeSourceRefs.map((r,i)=>(
                        <div key={i} className="src-ref-pill">
                          <span className="src-ref-name">{r.source}</span>
                          <span className="src-ref-sep">·</span>
                          <span className="src-ref-insight">{r.relevance}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {analysis.recentHeadlines?.length>0&&(
                  <div className="live-hl-section">
                    <div className="live-hl-lbl">📰 Live headlines used in this analysis</div>
                    {analysis.recentHeadlines.map((h,i)=>{
                      const inner = <>
                        <div className="live-hl-meta">
                          <span>{h.source}</span>
                          {h.date&&<span>· {h.date}</span>}
                          {h.url&&<span className="live-hl-hint">↗ open source</span>}
                        </div>
                        <div className="live-hl-title">{h.title}</div>
                      </>;
                      return h.url ? (
                        <a key={i} href={h.url} target="_blank" rel="noopener noreferrer" className="live-hl-item">{inner}</a>
                      ) : (
                        <div key={i} className="live-hl-item">{inner}</div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* RELATIVE PERF CHART */}
            {compData.length>1&&(
              <div>
                <div className="slbl">// 6-Month Relative Performance (Normalised to 100)</div>
                <div className="cc">
                  <div className="cc-t">Theme stocks performance comparison</div>
                  <div className="cc-s">All stocks normalised to 100 at period start · hover for values · yellow dashed = 50d MA on individual charts</div>
                  <CompChart data={compData} tickers={stocks.filter(s=>pMap[s.ticker]).map(s=>s.ticker)}/>
                </div>
              </div>
            )}

            {/* STOCK CARDS */}
            <div>
              <div className="slbl">// Stock Briefings — {stocks.length} ideas · live price data + technical read</div>
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                {stocks.map((s,i)=>{
                  const pd=pMap[s.ticker], col=COLORS[i%COLORS.length], isSaved=watchlist.has(s.ticker);
                  return (
                    <div key={s.ticker} className="sc">
                      <div className="sc-top">
                        <div className="sc-l">
                          <div className="sc-h">
                            <div style={{display:"flex",alignItems:"center",gap:10}}>
                              <span className="tkr">{s.ticker}</span>
                              <div><div className="sname">{s.name}</div><div className="ssec">{s.sector}</div></div>
                            </div>
                            <div className="bdgs">
                              <ConvBadge level={s.updatedConviction||s.conviction}/>
                              {s.technicalSignal&&<SigBadge signal={s.technicalSignal}/>}
                              {pd&&(
                                <div className="pchip">
                                  <span className="pcur" style={{color:col}}>{fmtP(pd.currentPrice)}</span>
                                  <span className="pchg" style={{color:pd.change1M>=0?"var(--G)":"var(--O)"}}>{pct(pd.change1M)} 1M</span>
                                </div>
                              )}
                            </div>
                          </div>
                          {pd&&(
                            <div className="tstrip">
                              <TI label="1Y Return" value={pct(pd.change1Y)} color={pd.change1Y>=0?"var(--G)":"var(--O)"}/>
                              <TI label="3M Return" value={pct(pd.change3M)} color={pd.change3M>=0?"var(--G)":"var(--O)"}/>
                              <TI label="1M Return" value={pct(pd.change1M)} color={pd.change1M>=0?"var(--G)":"var(--O)"}/>
                              <TI label="Dist 52w High" value={pct(pd.distFromHigh)} color={pd.distFromHigh>-10?"var(--G)":pd.distFromHigh>-25?"var(--Y)":"var(--O)"}/>
                              <TI label="52w High" value={fmtP(pd.high52w)}/>
                              <TI label="52w Low" value={fmtP(pd.low52w)}/>
                              <TI label="50d MA" value={pd.aboveMa50===null?"—":pd.aboveMa50?"▲ Above":"▼ Below"} color={pd.aboveMa50?"var(--G)":"var(--O)"}/>
                            </div>
                          )}
                          {failed.has(s.ticker)&&(
                            <div style={{fontFamily:"var(--mo)",fontSize:10,color:"var(--dim)",marginTop:8}}>⚠ Price data unavailable</div>
                          )}
                        </div>
                        {pd&&(
                          <div className="sc-cw" style={{height:125}}>
                            <MiniChart data={pd.prices} color={col}/>
                          </div>
                        )}
                      </div>
                      <div className="thr">
                        <div className="thb bull"><div className="thlbl">▲ Bull case</div>{s.bull}</div>
                        <div className="thb bear"><div className="thlbl">▼ Bear case</div>{s.bear}</div>
                        {s.whyNotCompetitors&&<div className="thb" style={{borderColor:'var(--P)',background:'rgba(206,147,216,.04)'}}><div className="thlbl" style={{color:'var(--P)'}}>🔍 Why not competitors</div>{s.whyNotCompetitors}</div>}
                        {s.keyAssumption&&<div className="thb" style={{borderColor:'var(--Y)',background:'rgba(255,213,79,.04)'}}><div className="thlbl" style={{color:'var(--Y)'}}>⚡ Key assumption</div>{s.keyAssumption}</div>}
                      </div>
                      {s.trendComment&&<div className="tc"><span>📊</span>{s.trendComment}</div>}
                      {s.entryNote&&<div className="en">→ Entry: {s.entryNote}</div>}
                      {/* Fundamental source refs */}
                      <SourceRefPills refs={s.sourceRefs} label="Fundamental sources"/>
                      {/* Technical source refs */}
                      <SourceRefPills refs={s.techSourceRefs} label="Technical sources"/>
                      <div className="scf">
                        {s.catalysts?.length>0&&(
                          <><span className="cl">Catalysts</span>{s.catalysts.map((c,j)=><span key={j} className="ct">{c}</span>)}</>
                        )}
                        <div className="rw">
                          <span>Risk</span>
                          <div className="rt"><div className="rb" style={{width:`${s.riskScore}%`}}/></div>
                          <span>{s.riskScore}</span>
                        </div>
                        {s.convictionScore&&<div className="rw">
                          <span>Conviction</span>
                          <div className="rt"><div className="rb" style={{width:`${s.convictionScore}%`,background:'var(--G)'}}/></div>
                          <span style={{color:'var(--G)'}}>{s.convictionScore}</span>
                        </div>}
                        <button className={`wbtn ${isSaved?"sv":""}`} onClick={()=>toggleWL(s.ticker)}>
                          {isSaved?"★ Watching":"☆ Watch"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CONTRARIAN */}
            <ContrarianSection contrarian={contrarian} stocks={stocks}/>

            <div className="disc">
              ⚠ AI-generated research for informational purposes only. Not financial advice. Always do your own due diligence. Price data from Yahoo Finance and may be delayed. Contrarian views are speculative analysis only. Past performance is not indicative of future results.
            </div>
          </div>
        )}
      </div>
      }
    </div>
  );
}
