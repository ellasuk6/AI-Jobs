---
title: The Overview
theme: air
toc: false
---

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Exo+2:wght@400;500;600;700;800&family=Inter:wght@400;450;500;600;700&display=swap">

```js
const dc = FileAttachment("./aijobs/dc_jobs_combined.csv").csv({typed: true});

// import * as d3 from "npm:d3";
// const dc = FileAttachment("./aijobs/dc_jobs_combined.csv").csv({typed: true});
```

<header class="jd-masthead">
  <span class="kicker">AI&rsquo;s Impact on Jobs</span>
  <h1>The Overview</h1>
  <p class="sub">How the data-center building boom is quietly redrawing the American job map — one state at a time, in the numbers.</p>
  <div class="flourish"></div>
</header>

<section class="jd-sec">
  <div class="jd-sec-head"><span class="idx">01</span><h2>Goal of Site</h2><span class="line"></span></div>
</section>

<div class="jd-panel">
  <p class="jd-prose lead">Tens of billions of dollars are pouring into AI data centers across the United States, and every groundbreaking comes wrapped in the same promise: <strong>jobs</strong>. This site exists to check that promise against the record. We gather facility counts, community filings, and Bureau of Labor Statistics employment figures for all fifty states and put them side by side, so the question answers itself — <strong>where the infrastructure lands, do the jobs really follow?</strong> No press releases, no spin. Just the data, laid out plainly enough to argue with.</p>
</div>

<section class="jd-sec">
  <div class="jd-sec-head"><span class="idx">02</span><h2>Proof of Concept</h2><span class="line"></span></div>
</section>


<div class="jd-panel">
  ${resize((width) => Plot.plot({
    width,
    height: 420,
    marginLeft: 64,
    marginBottom: 50,
    marginRight: 20,
    style: {fontFamily: "Inter, system-ui, sans-serif", fontSize: "13px", background: "transparent", color: "#48443e"},
    x: {label: "Total documented facilities →", grid: true},
    y: {label: "↑ AI / data-center jobs", grid: true, tickFormat: d => d >= 1000 ? d/1000 + "k" : d},
    marks: [
      Plot.linearRegressionY(dc, {x: "total_facilities", y: "current_jobs", stroke: "#1c6b46", fillOpacity: 0.12}),
      Plot.dot(dc, {
        x: "total_facilities",
        y: "current_jobs",
        r: 7,
        fill: "#114a30",
        fillOpacity: 0.65,
        stroke: "#faf7f1",
        strokeWidth: 1.2,
        tip: true,
        title: d => `${d.state}\nJobs: ${d.current_jobs.toLocaleString()}\nFacilities: ${d.total_facilities}`
      }),
      Plot.text(dc.filter(d => d.total_facilities >= 4 || d.current_jobs > 15000), {
        x: "total_facilities",
        y: "current_jobs",
        text: "state_abbr",
        dy: -12,
        fontSize: 10,
        fontWeight: 600,
        fill: "#114a30",
        stroke: "#faf7f1",
        strokeWidth: 3,
        paintOrder: "stroke"
      })
    ]
  }))}
</div>

<p class="jd-cap"><strong>Read it like this:</strong> each dot is a state; the band is the trend. It slopes up and to the right — more data-center facilities consistently coincides with more AI-related employment. The full, dual-variable version of this argument lives on the <a href="./analytics-page-demo">Analytics</a> page.</p>

<section class="jd-sec">
  <div class="jd-sec-head"><span class="idx">03</span><h2>What You Can Do Here</h2><span class="line"></span></div>
</section>

<div class="jd-grid3">
  <a class="jd-tile" href="./analytics-page-demo">
    <span class="num">Read</span>
    <span class="t">Analytics</span>
    <span class="d">The charts that prove the data-center&nbsp;→&nbsp;jobs correlation, plus where the next wave of growth is headed.</span>
    <span class="go">Open Analytics →</span>
  </a>
  <a class="jd-tile" href="./explore-page-demo">
    <span class="num">Map</span>
    <span class="t">Explore</span>
    <span class="d">A live U.S. map — heatmap the states by jobs, then drop bubbles for community reports and facilities.</span>
    <span class="go">Open Explore →</span>
  </a>
  <a class="jd-tile" href="./analytics-page-demo#the-raw-numbers">
    <span class="num">Verify</span>
    <span class="t">Dig In</span>
    <span class="d">Every figure traces to a public source. Sort and filter the raw, per-state table for yourself.</span>
    <span class="go">See the data →</span>
  </a>
</div>

<footer class="jd-footer">
  <div class="brand">AI&nbsp;Jobs<small>A demo build</small></div>
  <div class="col">
    <h4>Pages</h4>
    <a href="./">Home</a>
    <a href="./analytics-page-demo">Analytics</a>
    <a href="./explore-page-demo">Explore</a>
  </div>
  <div class="col">
    <h4>Project</h4>
    <a href="./aijobs/ai-proj-personal">Team</a>
    <a href="https://github.com/avalentino717/AI-Jobs">GitHub</a>
    <a href="https://observablehq.com/@dis-2026-summer/ai-project">Observable</a>
  </div>
</footer>

<style>
:root {
  --jd-ink:#161512; --jd-ink-soft:#48443e; --jd-muted:#8d867c;
  --jd-paper:#faf7f1; --jd-card:#fffdf9; --jd-line:rgba(22,21,18,.10); --jd-line-strong:rgba(22,21,18,.22);
  --jd-accent:#1c6b46; --jd-accent-deep:#114a30; --jd-gold:#a8762a;
  --jd-display:"Exo 2",system-ui,sans-serif;
  --jd-sans:"Inter",system-ui,-apple-system,sans-serif;
}
html, body { background: var(--jd-paper); }
body { font-family: var(--jd-sans); color: var(--jd-ink); -webkit-font-smoothing:antialiased; }

.jd-masthead { text-align:center; margin:3.5rem 0 3rem; }
.jd-masthead .kicker { font:600 12px/1 var(--jd-sans); letter-spacing:.3em; text-transform:uppercase; color:var(--jd-accent); }
.jd-masthead h1 { font-family:var(--jd-display); font-weight:900; font-size:clamp(3.25rem,10vw,7rem); line-height:.92; letter-spacing:-.025em; margin:.32em 0 .28em; color:var(--jd-ink); max-width:none; background:none; -webkit-text-fill-color:currentColor; }
.jd-masthead .sub { font:400 1.15rem/1.55 var(--jd-sans); color:var(--jd-ink-soft); max-width:33em; margin:0 auto; }
.jd-masthead .flourish { width:46px; height:3px; background:var(--jd-accent); margin:1.5rem auto 0; border-radius:2px; }

.jd-sec { margin:3.25rem 0 1.1rem; }
.jd-sec-head { display:flex; align-items:center; gap:.95rem; }
.jd-sec-head .idx { font:600 12px/1 var(--jd-sans); letter-spacing:.14em; color:var(--jd-accent); }
.jd-sec-head h2 { font-family:var(--jd-display); font-weight:600; font-size:clamp(1.5rem,3.4vw,2.05rem); letter-spacing:-.012em; margin:0; color:var(--jd-ink); white-space:nowrap; }
.jd-sec-head .line { flex:1; height:1px; background:var(--jd-line); }

.jd-panel { background:var(--jd-card); border:1px solid var(--jd-line); border-radius:16px; padding:1.6rem 1.8rem;
  box-shadow:0 1px 2px rgba(22,21,18,.04), 0 24px 48px -34px rgba(22,21,18,.45); }

.jd-cap { font:400 .96rem/1.65 var(--jd-sans); color:var(--jd-muted); max-width:48em; margin:1rem 2px 0; }
.jd-cap strong { color:var(--jd-ink-soft); font-weight:600; }
.jd-cap a, .jd-prose a { color:var(--jd-accent); text-underline-offset:2px; }

.jd-prose { font:400 1.08rem/1.72 var(--jd-sans); color:var(--jd-ink-soft); max-width:42em; margin:0; }
.jd-prose.lead::first-letter { font-family:var(--jd-display); font-weight:900; float:left; font-size:3.5em; line-height:.7; margin:.05em .14em 0 0; color:var(--jd-accent); }
.jd-prose strong { color:var(--jd-ink); font-weight:600; }

.jd-grid3 { display:grid; grid-template-columns:repeat(3,1fr); gap:1rem; }
@media (max-width:760px){ .jd-grid3{grid-template-columns:1fr;} }
.jd-tile { display:flex; flex-direction:column; gap:.5rem; min-height:188px; background:var(--jd-card); border:1px solid var(--jd-line);
  border-radius:14px; padding:1.35rem 1.4rem; text-decoration:none; color:inherit; transition:transform .18s ease, box-shadow .18s ease, border-color .18s; }
.jd-tile:hover { transform:translateY(-3px); border-color:var(--jd-line-strong); box-shadow:0 20px 36px -24px rgba(22,21,18,.55); }
.jd-tile .num { font:600 11px var(--jd-sans); letter-spacing:.18em; color:var(--jd-gold); text-transform:uppercase; }
.jd-tile .t { font-family:var(--jd-display); font-weight:600; font-size:1.3rem; color:var(--jd-ink); }
.jd-tile .d { font:400 .92rem/1.55 var(--jd-sans); color:var(--jd-muted); }
.jd-tile .go { margin-top:auto; font:600 .85rem var(--jd-sans); color:var(--jd-accent); }

.jd-footer { margin:4.5rem 0 2rem; border-top:2px solid var(--jd-ink); padding-top:1.4rem;
  display:flex; gap:4.5rem; flex-wrap:wrap; align-items:flex-start; }
.jd-footer .brand { font-family:var(--jd-display); font-weight:600; font-size:1.25rem; margin-right:auto; line-height:1.1; }
.jd-footer .brand small { display:block; font:400 .8rem var(--jd-sans); color:var(--jd-muted); margin-top:.3rem; }
.jd-footer .col h4 { font:600 11px var(--jd-sans); letter-spacing:.16em; text-transform:uppercase; color:var(--jd-muted); margin:0 0 .7rem; }
.jd-footer .col a { display:block; padding:3px 0; color:var(--jd-ink-soft); text-decoration:none; font:450 .95rem var(--jd-sans); transition:color .15s; }
.jd-footer .col a:hover { color:var(--jd-accent); }
</style>
