---
title: Analytics Page Demo
theme: air
toc: false
---

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,900&family=Inter:wght@400;450;500;600;700&display=swap">

```js
const dc = FileAttachment("./aijobs/dc_jobs_combined.csv").csv({typed: true});
const dcJobs = FileAttachment("./aijobs/dcJobs.csv").csv({typed: true});
// Alias so the original chart code can use its variable name unchanged.
const dc_jobs_combined = dc;
const plotStyle = {fontFamily: "Inter, system-ui, sans-serif", fontSize: "13px", background: "transparent", color: "#48443e"};
```

<header class="jd-masthead">
  <span class="kicker">The Evidence</span>
  <h1>Analytics</h1>
  <p class="sub">Proof that data centers correlate with jobs — and a clear read on where the next wave of growth is headed.</p>
  <div class="flourish"></div>
</header>

<section class="jd-sec">
  <div class="jd-sec-head"><span class="idx">01</span><h2>Proof that data centers correlate with jobs</h2><span class="line"></span></div>
</section>

<div class="jd-panel">
  <div class="jd-grid2">
    <figure class="jd-chart">
      <figcaption><span class="swatch" style="background:#2456c9"></span>Documented facilities &nbsp;vs.&nbsp; AI jobs</figcaption>
      ${resize((width) => Plot.plot({
        width, height: 340, marginLeft: 56, marginBottom: 42, style: plotStyle,
        x: {label: "Total Documented Facilities", grid: true},
        y: {label: "Number of AI Related Jobs", grid: true, tickFormat: d => d >= 1000 ? d/1000 + "k" : d},
        marks: [
          Plot.linearRegressionY(dc_jobs_combined, {x: "total_facilities", y: "current_jobs", stroke: "#2456c9", fillOpacity: 0.12})
        ]
      }))}
    </figure>
    <figure class="jd-chart">
      <figcaption><span class="swatch" style="background:#c0392b"></span>Facilities with community reports &nbsp;vs.&nbsp; AI jobs</figcaption>
      ${resize((width) => Plot.plot({
        width, height: 340, marginLeft: 56, marginBottom: 42, style: plotStyle,
        x: {label: "Total Facilities with Community Reports", grid: true},
        y: {label: "Number of AI Related Jobs", grid: true, tickFormat: d => d >= 1000 ? d/1000 + "k" : d},
        marks: [
          Plot.linearRegressionY(dc_jobs_combined, {x: "total_with_reports", y: "current_jobs", stroke: "#c0392b", fillOpacity: 0.12})
        ]
      }))}
    </figure>
  </div>
</div>

<p class="jd-cap"><strong>Why this matters:</strong> two different measures of data-center presence — physical facilities and community-filed reports — both bend upward against jobs. When two independent signals point the same way, the correlation is hard to wave off as coincidence.</p>

<section class="jd-sec">
  <div class="jd-sec-head"><span class="idx">02</span><h2>Data showing growth</h2><span class="line"></span></div>
</section>

<div class="jd-panel">
  ${resize((width) => {
    const top = [...dc]
      .filter(d => d.projected_new_jobs > 0)
      .sort((a, b) => b.projected_new_jobs - a.projected_new_jobs)
      .slice(0, 15);
    return Plot.plot({
      width, height: 460, marginLeft: 104, marginBottom: 42, style: plotStyle,
      x: {label: "Projected new jobs by 2027 →", grid: true, tickFormat: d => d >= 1000 ? d/1000 + "k" : d},
      y: {label: null},
      marks: [
        Plot.barX(top, {x: "projected_new_jobs", y: "state", sort: {y: "-x"}, fill: "#1c6b46", fillOpacity: 0.9, rx: 2, tip: true, channels: {"New jobs": d => "+" + d.projected_new_jobs.toLocaleString()}}),
        Plot.ruleX([0], {stroke: "#161512", strokeOpacity: 0.25})
      ]
    });
  })}
</div>

<p class="jd-cap"><strong>What to do with this data:</strong> treat it as a scoreboard. These are the job numbers states have been promised from announced buildout — keep them, and hold each state to its figure as the concrete actually gets poured.</p>

<section class="jd-sec">
  <div class="jd-sec-head"><span class="idx">03</span><h2>Why this matters</h2><span class="line"></span></div>
</section>

<div class="jd-why">
  <p class="jd-prose lead">Data centers are the factories of the AI era, and like factories they reshape the towns around them — tax bases, power grids, water tables, and paychecks. If the jobs are real, this buildout is one of the largest regional employment shifts in a generation. If they aren&rsquo;t, communities are trading very tangible costs for a number on a press release. <strong>The point of measuring is to know which.</strong></p>
  <aside class="jd-panel jd-stats">
    <div class="jd-stat">
      <span class="n">${dc.reduce((s, d) => s + d.current_jobs, 0).toLocaleString()}</span>
      <span class="l">Current AI / data-center jobs tracked</span>
    </div>
    <div class="jd-stat">
      <span class="n"><span class="plus">+</span>${dc.reduce((s, d) => s + d.projected_new_jobs, 0).toLocaleString()}</span>
      <span class="l">Projected new jobs by 2027</span>
    </div>
    <div class="jd-stat">
      <span class="n">${dc.reduce((s, d) => s + d.total_facilities, 0).toLocaleString()}</span>
      <span class="l">Facilities documented nationwide</span>
    </div>
  </aside>
</div>

<h3 class="jd-subhead" id="the-raw-numbers">The raw numbers</h3>

<div class="jd-panel jd-tablewrap">
  ${Inputs.table(dc, {
    columns: ["state", "current_jobs", "projected_new_jobs", "total_facilities", "community_reports"],
    header: {state: "State", current_jobs: "Current jobs", projected_new_jobs: "Projected new", total_facilities: "Facilities", community_reports: "Community reports"},
    sort: "current_jobs", reverse: true, rows: 14, select: false
  })}
</div>

<p class="jd-cap">Sources: U.S. Bureau of Labor Statistics (2025), Visual Capitalist, and community facility reports.</p>

<style>
:root {
  --jd-ink:#161512; --jd-ink-soft:#48443e; --jd-muted:#8d867c;
  --jd-paper:#faf7f1; --jd-card:#fffdf9; --jd-line:rgba(22,21,18,.10); --jd-line-strong:rgba(22,21,18,.22);
  --jd-accent:#1c6b46; --jd-accent-deep:#114a30; --jd-gold:#a8762a;
  --jd-display:"Fraunces",Georgia,"Times New Roman",serif;
  --jd-sans:"Inter",system-ui,-apple-system,sans-serif;
}
html, body { background: var(--jd-paper); }
body { font-family: var(--jd-sans); color: var(--jd-ink); -webkit-font-smoothing:antialiased; }

.jd-masthead { text-align:center; margin:3.5rem 0 3rem; }
.jd-masthead .kicker { font:600 12px/1 var(--jd-sans); letter-spacing:.3em; text-transform:uppercase; color:var(--jd-accent); }
.jd-masthead h1 { font-family:var(--jd-display); font-weight:900; font-size:clamp(3rem,9vw,6rem); line-height:.92; letter-spacing:-.025em; margin:.32em 0 .28em; color:var(--jd-ink); max-width:none; background:none; -webkit-text-fill-color:currentColor; }
.jd-masthead .sub { font:400 1.12rem/1.55 var(--jd-sans); color:var(--jd-ink-soft); max-width:35em; margin:0 auto; }
.jd-masthead .flourish { width:46px; height:3px; background:var(--jd-accent); margin:1.5rem auto 0; border-radius:2px; }

.jd-sec { margin:3.25rem 0 1.1rem; }
.jd-sec-head { display:flex; align-items:center; gap:.95rem; }
.jd-sec-head .idx { font:600 12px/1 var(--jd-sans); letter-spacing:.14em; color:var(--jd-accent); flex:none; }
.jd-sec-head h2 { font-family:var(--jd-display); font-weight:600; font-size:clamp(1.35rem,3vw,1.95rem); letter-spacing:-.012em; margin:0; color:var(--jd-ink); }
.jd-sec-head .line { flex:1; height:1px; background:var(--jd-line); min-width:1.5rem; }

.jd-panel { background:var(--jd-card); border:1px solid var(--jd-line); border-radius:16px; padding:1.6rem 1.8rem;
  box-shadow:0 1px 2px rgba(22,21,18,.04), 0 24px 48px -34px rgba(22,21,18,.45); }

.jd-grid2 { display:grid; grid-template-columns:1fr 1fr; gap:1.6rem; }
@media (max-width:820px){ .jd-grid2{grid-template-columns:1fr;} }
.jd-chart { margin:0; }
.jd-chart figcaption { font:600 .82rem var(--jd-sans); letter-spacing:.02em; color:var(--jd-ink-soft); display:flex; align-items:center; gap:.5rem; margin-bottom:.3rem; }
.jd-chart .swatch { width:10px; height:10px; border-radius:50%; display:inline-block; }

.jd-cap { font:400 .96rem/1.65 var(--jd-sans); color:var(--jd-muted); max-width:52em; margin:1rem 2px 0; }
.jd-cap strong { color:var(--jd-ink-soft); font-weight:600; }

.jd-why { display:grid; grid-template-columns:1.3fr 1fr; gap:2rem; align-items:start; }
@media (max-width:820px){ .jd-why{grid-template-columns:1fr;} }
.jd-prose { font:400 1.08rem/1.72 var(--jd-sans); color:var(--jd-ink-soft); max-width:42em; margin:.2rem 0 0; }
.jd-prose.lead::first-letter { font-family:var(--jd-display); font-weight:900; float:left; font-size:3.5em; line-height:.7; margin:.05em .14em 0 0; color:var(--jd-accent); }
.jd-prose strong { color:var(--jd-ink); font-weight:600; }

.jd-stats { padding:.4rem 1.5rem; }
.jd-stat { display:flex; flex-direction:column; gap:.2rem; padding:1.05rem 0; border-bottom:1px solid var(--jd-line); }
.jd-stat:last-child { border-bottom:0; }
.jd-stat .n { font-family:var(--jd-display); font-weight:600; font-size:2.45rem; line-height:1; color:var(--jd-ink); font-variant-numeric:tabular-nums; }
.jd-stat .n .plus { color:var(--jd-accent); }
.jd-stat .l { font:500 .76rem var(--jd-sans); letter-spacing:.04em; text-transform:uppercase; color:var(--jd-muted); }

.jd-subhead { font-family:var(--jd-display); font-weight:600; font-size:1.3rem; color:var(--jd-ink); margin:2.75rem 0 .9rem; letter-spacing:-.01em; }
.jd-tablewrap { padding:.6rem 1rem; }
.jd-tablewrap table { font-family:var(--jd-sans); }
.jd-tablewrap th:first-child:empty, .jd-tablewrap td:first-child:empty { display:none; }
</style>
