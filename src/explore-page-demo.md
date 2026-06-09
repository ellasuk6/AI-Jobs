---
title: Explore Page Demo
theme: air
toc: false
---

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Exo+2:wght@400;500;600;700;800&family=Inter:wght@400;450;500;600;700&display=swap">

```js
import * as topojson from "npm:topojson-client";
const dc = FileAttachment("./aijobs/dc_jobs_combined.csv").csv({typed: true});
```

<header class="jd-masthead">
  <span class="kicker">Interactive</span>
  <h1>Explore</h1>
  <p class="sub">One map, every state. Heatmap by jobs, then drop bubbles for community pushback or the data centers themselves.</p>
  <div class="flourish"></div>
</header>

<section class="jd-sec">
  <div class="jd-sec-head"><span class="idx">MAP</span><h2>Jobs, reports &amp; facilities by state</h2><span class="line"></span></div>
</section>

<div class="jd-mapwrap">

```js
display(await (async () => {
  const width = 960, height = 560;

  const fmt = d3.format(","), fmt1 = d3.format(".1f"), fmt2 = d3.format(".2f");

  const raw = await FileAttachment("./aijobs/dc_jobs_combined.csv").csv({ typed: true });

  const pop = {
    AK:733, AL:5040, AR:3012, AZ:7280, CA:39029, CO:5840, CT:3616, DE:1018,
    FL:22610, GA:10912, HI:1440, IA:3200, ID:1940, IL:12582, IN:6790, KS:2938,
    KY:4526, LA:4624, MA:6982, MD:6165, ME:1385, MI:10034, MN:5717, MO:6178,
    MS:2961, MT:1123, NC:10699, ND:779, NE:1961, NH:1395, NJ:9261, NM:2114,
    NV:3178, NY:19336, OH:11756, OK:3960, OR:4240, PA:13002, RI:1094, SC:5283,
    SD:909, TN:7051, TX:30030, UT:3380, VA:8683, VT:647, WA:7740, WI:5896,
    WV:1775, WY:581
  };
  const NAME = {
    AK:"Alaska", AL:"Alabama", AR:"Arkansas", AZ:"Arizona", CA:"California",
    CO:"Colorado", CT:"Connecticut", DE:"Delaware", FL:"Florida", GA:"Georgia",
    HI:"Hawaii", IA:"Iowa", ID:"Idaho", IL:"Illinois", IN:"Indiana", KS:"Kansas",
    KY:"Kentucky", LA:"Louisiana", MA:"Massachusetts", MD:"Maryland", ME:"Maine",
    MI:"Michigan", MN:"Minnesota", MO:"Missouri", MS:"Mississippi", MT:"Montana",
    NC:"North Carolina", ND:"North Dakota", NE:"Nebraska", NH:"New Hampshire",
    NJ:"New Jersey", NM:"New Mexico", NV:"Nevada", NY:"New York", OH:"Ohio",
    OK:"Oklahoma", OR:"Oregon", PA:"Pennsylvania", RI:"Rhode Island",
    SC:"South Carolina", SD:"South Dakota", TN:"Tennessee", TX:"Texas",
    UT:"Utah", VA:"Virginia", VT:"Vermont", WA:"Washington", WI:"Wisconsin",
    WV:"West Virginia", WY:"Wyoming"
  };
 
  const data = raw.filter(d => pop[d.state_abbr]).map(d => {
    const popK = pop[d.state_abbr];
    const jobs = d.current_jobs, reports = d.community_reports ?? 0;
    const op   = d.facilities_operational  ?? 0,
          con  = d.facilities_construction ?? 0,
          prop = d.facilities_proposed     ?? 0;
    return {
      abbr: d.state_abbr,
      state: NAME[d.state_abbr] ?? d.state,
      jobs, reports,
      op, con, prop,
      facTotal: op + con + prop,           // real buildings only (no unit-mixing)
      jobsPer100k:    +(jobs    / popK * 100).toFixed(1),
      reportsPer100k: +(reports / popK * 100).toFixed(2)
    };
  });
 
  const us = await d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json");
  const states = topojson.feature(us, us.objects.states).features;
  const projection = d3.geoAlbersUsa().fitSize([width, height], topojson.feature(us, us.objects.states));
  const path = d3.geoPath(projection);
  const byName = new Map(data.map(d => [d.state, d]));
 
  const RAMP = ["#1a4a2e","#2d7a3a","#52b044","#a8d64a","#f5ec1a","#f5a623","#d94f2b"];
 
  // bubble palettes (Ella's color coding): purple = community reports; per-type for facilities
  // strokes darkened so bubbles read on a light background
  const COMMUNITY = { fill: "#8b4fc8", stroke: "rgba(255,255,255,0.5)" };
  const FAC = {
    op:   { label: "Existing",           fill: "#3d52a0", stroke: "rgba(255,255,255,0.5)" },
    con:  { label: "Under construction", fill: "#1a6b8a", stroke: "rgba(255,255,255,0.5)" },
    prop: { label: "Proposed",           fill: "#d94f2b", stroke: "rgba(255,255,255,0.5)" }
  };
 
  let heatMode = "jobsPer100k";   // "jobsPer100k" | "jobs"
  let bubMode  = "reports";       // "reports" | "reportsPer100k" | "facilities"
  const facSet = new Set();       // subset of op/con/prop, used when bubMode==="facilities"
  const heatVal = d => d[heatMode];
  const bubVal  = d => {
    if (bubMode === "reports")        return d.reports;
    if (bubMode === "reportsPer100k") return d.reportsPer100k;
    let s = 0;                                       // facilities: sum selected types
    if (facSet.has("op"))   s += d.op;
    if (facSet.has("con"))  s += d.con;
    if (facSet.has("prop")) s += d.prop;
    return s;
  };
  const bubColor = () => {
    if (bubMode !== "facilities") return COMMUNITY;
    const ks = [...facSet];
    return ks.length === 1 ? FAC[ks[0]] : { fill: "#4a5568", stroke: "rgba(255,255,255,0.5)" };
  };
 
  const LEGEND_H = 160, totalH = height + LEGEND_H;
 
  const container = d3.create("div")
    .style("font-family", "ui-monospace, SFMono-Regular, Menlo, monospace")
    .style("color", "#2a3441").style("background", "#f5f7fa")
    .style("padding", "16px").style("border-radius", "14px").style("position", "relative")
    .style("border", "1px solid #e2e8f0");
 
  // header: fixed title + a caption that REORDERS when you flip the heatmap
  const head = container.append("div").style("margin-bottom", "12px");
  head.append("div").text("Where AI lands — and who pushes back")
    .style("font-size", "18px").style("font-weight", "700").style("color", "#1a2733")
    .style("letter-spacing", ".01em");
  const sub = head.append("div")
    .style("font-size", "12px").style("color", "#5a6776").style("margin-top", "3px")
    .style("min-height", "16px");
 
  const mkBtn = (parent, label) => parent.append("button").text(label)
    .style("font-family", "inherit").style("font-size", "11px").style("cursor", "pointer")
    .style("border", "1px solid #d4dae1").style("border-radius", "999px")
    .style("padding", "5px 13px").style("background", "#ffffff").style("color", "#5a6776")
    .style("transition", "background .18s, color .18s");
 
  // Row 1 — heatmap toggle
  const row1 = container.append("div").style("margin-bottom", "7px")
    .style("display", "flex").style("gap", "8px").style("align-items", "center");
  row1.append("span").text("HEATMAP")
    .style("font-size", "10px").style("letter-spacing", ".2em").style("color", "#6b7787").style("min-width", "78px");
  const btnJobsPC = mkBtn(row1, "Jobs per 100k");
  const btnJobsTot = mkBtn(row1, "Total jobs");
 
  // dot helper — colored dot in front of a button label
  const dotBtn = (btn, hex) => {
    const t = btn.node().textContent;
    btn.node().innerHTML = `<span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:${hex};margin-right:5px;vertical-align:middle"></span>${t}`;
  };
 
  // Row 2 — bubbles: community reports (the complete, trustworthy signal)
  const row2 = container.append("div").style("margin-bottom", "7px")
    .style("display", "flex").style("gap", "8px").style("align-items", "center").style("flex-wrap", "wrap");
  row2.append("span").text("REPORTS")
    .style("font-size", "10px").style("letter-spacing", ".2em").style("color", "#6b7787").style("min-width", "78px");
  const btnRepRaw = mkBtn(row2, "Community reports");
  const btnRepPC  = mkBtn(row2, "Reports per 100k");
  [btnRepRaw, btnRepPC].forEach(b => dotBtn(b, COMMUNITY.fill));
 
  // Row 3 — bubbles: facility breakdown (multi-select).
  const row3 = container.append("div").style("margin-bottom", "11px")
    .style("display", "flex").style("gap", "8px").style("align-items", "center").style("flex-wrap", "wrap");
  row3.append("span").text("FACILITIES")
    .style("font-size", "10px").style("letter-spacing", ".2em").style("color", "#6b7787").style("min-width", "78px");
  const btnFacAll = mkBtn(row3, "All");
  const btnOp     = mkBtn(row3, "Existing");
  const btnCon    = mkBtn(row3, "Under construction");
  const btnProp   = mkBtn(row3, "Proposed");
  dotBtn(btnOp,   FAC.op.fill);
  dotBtn(btnCon,  FAC.con.fill);
  dotBtn(btnProp, FAC.prop.fill);
 
  const svg = container.append("svg")
    .attr("viewBox", [0, 0, width, totalH])
    .style("width", "100%").style("height", "auto")
    .style("background", "#ffffff").style("border-radius", "10px");
 
  const tip = container.append("div")
    .style("position", "absolute").style("pointer-events", "none").style("opacity", 0)
    .style("transform", "translate(-50%,-115%)").style("background", "#ffffff")
    .style("border", "1px solid #d4dae1").style("border-radius", "10px").style("padding", "9px 12px")
    .style("font-size", "12px").style("color", "#1a2733").style("white-space", "nowrap")
    .style("box-shadow", "0 14px 36px rgba(15,23,42,.18)").style("z-index", "10");
 
  // const hoverLabel = svg.append("text")
  // .attr("text-anchor", "middle").attr("dominant-baseline", "middle")
  // .attr("font-size", 11).attr("font-weight", 700)
  // .attr("fill", "#1a2733").attr("stroke", "#ffffff")
  // .attr("stroke-width", 3).attr("paint-order", "stroke")
  // .style("pointer-events", "none").style("opacity", 0);

const show = (event, name) => {
  const d = byName.get(name); if (!d) return;
  const [mx, my] = d3.pointer(event, container.node());
  tip.style("left", mx + "px").style("top", my + "px").style("opacity", 1)
    .html(`<b style="font-size:13px">${name}</b><br>
      Jobs: ${fmt(d.jobs)} &nbsp;·&nbsp; ${fmt1(d.jobsPer100k)} / 100k<br>
      <span style="color:#7b3fb0">Reports: ${fmt(d.reports)} &nbsp;·&nbsp; ${fmt2(d.reportsPer100k)} / 100k</span><br>
      <span style="color:${FAC.op.fill}">Existing ${d.op}</span> &nbsp;
      <span style="color:${FAC.con.fill}">Building ${d.con}</span> &nbsp;
      <span style="color:${FAC.prop.fill}">Proposed ${d.prop}</span>`);
  // find the centroid for this state and show the abbreviation label
  const match = states.find(f => f.properties.name === name);
  if (match) {
    const [cx, cy] = path.centroid(match);
    hoverLabel.attr("x", cx).attr("y", cy).text(d.abbr).style("opacity", 1);
  }
};
const hide = () => {
  tip.style("opacity", 0);
  hoverLabel.style("opacity", 0);
};
 
  const statePaths = svg.append("g").selectAll("path").data(states).join("path")
    .attr("d", path).attr("stroke", "#ffffff").attr("stroke-width", 0.6)
    .style("cursor", "pointer")
    .on("mousemove", (e, f) => show(e, f.properties.name))
    .on("mouseover", function (e, f) {
      if (byName.get(f.properties.name))
        d3.select(this).raise().attr("stroke", "#1a2733").attr("stroke-width", 1.8);
    })
    .on("mouseleave", function () {
      d3.select(this).attr("stroke", "#ffffff").attr("stroke-width", 0.6);
      hide();
    });
 
  const bubbleG = svg.append("g");

  const hoverLabel = svg.append("text")
  .attr("text-anchor", "middle").attr("dominant-baseline", "middle")
  .attr("font-size", 11).attr("font-weight", 700)
  .attr("fill", "#1a2733").attr("stroke", "#ffffff")
  .attr("stroke-width", 3).attr("paint-order", "stroke")
  .style("pointer-events", "none").style("opacity", 0);
 
  // // ---- state labels (drawn above bubbles; leader lines for tiny NE states) --
  // const labelG = svg.append("g").attr("pointer-events", "none");
  // const OFF = {            // [dx, dy] nudge so crowded NE labels don't collide
  //   "New Jersey":[24,2], "Delaware":[30,12], "Maryland":[40,24],
  //   "Connecticut":[28,-4], "Rhode Island":[34,8], "Massachusetts":[42,-12],
  //   "New Hampshire":[16,-20], "Vermont":[-6,-24]
  // };
  // const labelData = states
  //   .map(f => ({ name: f.properties.name, c: path.centroid(f), d: byName.get(f.properties.name) }))
  //   .filter(o => o.d && o.c[0]);
  // labelG.selectAll("line").data(labelData.filter(o => OFF[o.name])).join("line")
  //   .attr("x1", o => o.c[0]).attr("y1", o => o.c[1])
  //   .attr("x2", o => o.c[0] + OFF[o.name][0]).attr("y2", o => o.c[1] + OFF[o.name][1])
  //   .attr("stroke", "#9aa5b1").attr("stroke-width", 0.6);
  // labelG.selectAll("text").data(labelData).join("text")
  //   .attr("x", o => o.c[0] + (OFF[o.name] ? OFF[o.name][0] : 0))
  //   .attr("y", o => o.c[1] + (OFF[o.name] ? OFF[o.name][1] : 0))
  //   .attr("text-anchor", "middle").attr("dy", "0.32em")
  //   .attr("font-size", 9).attr("font-weight", 600)
  //   .attr("fill", "#1a2733").attr("stroke", "#ffffff").attr("stroke-width", 1.2)
  //   .attr("paint-order", "stroke").attr("stroke-linejoin", "round")
  //   .text(o => o.d.abbr);
 
  const legY = height + 16;
  const bubbleLegG = svg.append("g").attr("transform", `translate(40,${legY})`);
  const rampG = svg.append("g").attr("transform", `translate(${width - 220},${legY})`);
 
  function updateButtons() {
    [[btnJobsPC, "jobsPer100k"], [btnJobsTot, "jobs"]].forEach(([b, m]) => {
      b.style("background", heatMode === m ? "#2d7a3a" : "#ffffff")
       .style("color",      heatMode === m ? "#ffffff" : "#5a6776")
       .style("border",     heatMode === m ? "1px solid #2d7a3a" : "1px solid #d4dae1");
    });
    [[btnRepRaw, "reports"], [btnRepPC, "reportsPer100k"]].forEach(([b, m]) => {
      b.style("background", bubMode === m ? "#8b4fc822" : "#ffffff")
       .style("color",      bubMode === m ? "#7b3fb0" : "#5a6776")
       .style("border",     bubMode === m ? "1px solid #8b4fc855" : "1px solid #d4dae1");
    });
    // facility buttons: highlight whichever types are selected
    [[btnOp, "op"], [btnCon, "con"], [btnProp, "prop"]].forEach(([b, k]) => {
      const on = bubMode === "facilities" && facSet.has(k);
      b.style("background", on ? FAC[k].fill + "22" : "#ffffff")
       .style("color",      on ? FAC[k].fill : "#5a6776")
       .style("border",     on ? "1px solid " + FAC[k].fill + "66" : "1px solid #d4dae1");
    });
    const allOn = bubMode === "facilities" && facSet.size === 3;
    btnFacAll.style("background", allOn ? "#e2e8f0" : "#ffffff")
      .style("color",  allOn ? "#475569" : "#5a6776")
      .style("border", allOn ? "1px solid #cbd5e1" : "1px solid #d4dae1");
  }
 
  function renderBubbles() {
    const maxVal = d3.max(data, bubVal) || 1;
    const r = d3.scaleSqrt().domain([0, maxVal]).range([0, 38]);
    const { fill, stroke } = bubColor();
    const decimal = bubMode === "reportsPer100k";
    const cents = states
      .map(f => ({ name: f.properties.name, c: path.centroid(f), d: byName.get(f.properties.name) }))
      .filter(o => o.d && o.c[0]);
 
    bubbleG.selectAll("circle").data(cents).join("circle")
      .attr("cx", o => o.c[0]).attr("cy", o => o.c[1])
      .attr("fill", fill).attr("fill-opacity", 0.82)
      .attr("stroke", stroke).attr("stroke-width", 1.8).style("cursor", "pointer")
      .on("mousemove", (e, o) => show(e, o.name)).on("mouseleave", hide)
      .transition().duration(420)
      .attr("r", o => r(bubVal(o.d)));
 
    // bubble size legend
    bubbleLegG.selectAll("*").remove();
    let legendLabel;
    if (bubMode === "reports")             legendLabel = "COMMUNITY REPORTS";
    else if (bubMode === "reportsPer100k") legendLabel = "REPORTS PER 100K";
    else if (facSet.size === 0)            legendLabel = "FACILITIES (none selected)";
    else legendLabel = [...facSet].map(k => FAC[k].label.toUpperCase()).join(" + ") + " (incomplete)";
    bubbleLegG.append("text").attr("x", 0).attr("y", 0)
      .attr("fill", "#5a6776").attr("font-size", 10).attr("letter-spacing", ".1em")
      .text(legendLabel);
 
    const maxR = 38;
    let samples;
    if (decimal) {
      samples = [maxVal / 3, maxVal * 2 / 3, maxVal].map(v => +v.toFixed(1));
    } else if (maxVal <= 4) {
      samples = [1, maxVal];
    } else if (maxVal <= 12) {
      samples = [1, Math.round(maxVal / 2), Math.round(maxVal)];
    } else {
      samples = [Math.round(maxVal / 4), Math.round(maxVal / 2), Math.round(maxVal)];
    }
    const baseY = 18 + maxR;
    let bx = 0;
    samples.filter((v, i, a) => v > 0 && a.indexOf(v) === i).forEach(v => {
      const rad = r(v);
      bubbleLegG.append("circle")
        .attr("cx", bx + rad).attr("cy", baseY + (maxR - rad)).attr("r", rad)
        .attr("fill", fill).attr("fill-opacity", 0.82).attr("stroke", stroke);
      bubbleLegG.append("text")
        .attr("x", bx + rad).attr("y", baseY + maxR + 13).attr("text-anchor", "middle")
        .attr("fill", "#5a6776").attr("font-size", 9).text(v);
      bx += rad * 2 + 16;
    });
  }
 
  function renderHeatmap() {
    const vals = data.map(heatVal).filter(v => v != null);
    const lo = d3.min(vals), hi = d3.max(vals);
    const color = d3.scaleSequentialSqrt(d3.interpolateRgbBasis(RAMP)).domain([lo, hi]);
    statePaths.transition().duration(420).attr("fill", f => {
      const d = byName.get(f.properties.name);
      return (d && heatVal(d) != null) ? color(heatVal(d)) : "#e6e9ee";
    });
    rampG.selectAll("*").remove();
    rampG.append("text").attr("x", 0).attr("y", 0)
      .attr("fill", "#5a6776").attr("font-size", 10).attr("letter-spacing", ".1em")
      .text(heatMode === "jobsPer100k" ? "JOBS PER 100K" : "TOTAL JOBS");
    d3.range(50).forEach(i => {
      const t = i / 49;
      rampG.append("rect").attr("x", i * 4).attr("y", 14).attr("width", 4).attr("height", 12)
        .attr("fill", color(lo + t * (hi - lo)));
    });
    rampG.append("text").attr("x", 0).attr("y", 40)
      .attr("fill", "#5a6776").attr("font-size", 9)
      .text(heatMode === "jobsPer100k" ? fmt1(lo) : fmt(lo));
    rampG.append("text").attr("x", 200).attr("y", 40).attr("text-anchor", "end")
      .attr("fill", "#5a6776").attr("font-size", 9)
      .text(heatMode === "jobsPer100k" ? fmt1(hi) : fmt(hi));
 
    // // live caption — the leaders REORDER when you flip Total ↔ Per-100k
    // const top = data.filter(d => heatVal(d) != null)
    //   .sort((a, b) => heatVal(b) - heatVal(a)).slice(0, 5);
    // const lbl = heatMode === "jobsPer100k" ? "Jobs per 100k people" : "Total AI / data-center jobs";
    // const fm  = heatMode === "jobsPer100k" ? fmt1 : fmt;
    // sub.html(`Color = <b style="color:#2d7a3a">${lbl}</b> &nbsp;·&nbsp; leaders: ` +
    //   top.map(d => `<b>${d.abbr}</b> ${fm(heatVal(d))}`).join(" &nbsp;›&nbsp; "));
  }
 
  function renderAll() { updateButtons(); renderHeatmap(); renderBubbles(); }
 
  btnJobsPC.on("click", () => { heatMode = "jobsPer100k"; renderAll(); });
  btnJobsTot.on("click", () => { heatMode = "jobs"; renderAll(); });
  btnRepRaw.on("click", () => { bubMode = "reports";        facSet.clear(); renderAll(); });
  btnRepPC.on("click",  () => { bubMode = "reportsPer100k"; facSet.clear(); renderAll(); });
  btnFacAll.on("click", () => { bubMode = "facilities"; facSet.clear(); ["op","con","prop"].forEach(k => facSet.add(k)); renderAll(); });
  [[btnOp, "op"], [btnCon, "con"], [btnProp, "prop"]].forEach(([b, k]) => {
    b.on("click", () => {
      bubMode = "facilities";
      facSet.has(k) ? facSet.delete(k) : facSet.add(k);
      renderAll();
    });
  });
 
  renderAll();
  return container.node();
})());
```

</div>

<p class="jd-cap"><strong>What to do with this map:</strong> the green heatmap is jobs — toggle <em>total</em> vs. <em>per&nbsp;100k</em> and the leaders reorder live. Purple bubbles are community pushback reports; switch to <em>facilities</em> to size them by existing, under-construction, or proposed data centers. Hover any state for the full breakdown.</p>

<section class="jd-sec">
  <div class="jd-sec-head"><span class="idx">TOP 5</span><h2>Leaders right now</h2><span class="line"></span></div>
</section>

<div class="jd-panel jd-tablewrap">
  ${Inputs.table(
    [...dc].sort((a, b) => b.current_jobs - a.current_jobs).slice(0, 5),
    {
      columns: ["state", "current_jobs", "projected_new_jobs", "total_facilities"],
      header: {state: "State", current_jobs: "Current jobs", projected_new_jobs: "Projected new", total_facilities: "Facilities"},
      rows: 5, select: false
    }
  )}
</div>

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
.jd-masthead h1 { font-family:var(--jd-display); font-weight:900; font-size:clamp(3rem,9vw,6rem); line-height:.92; letter-spacing:-.025em; margin:.32em 0 .28em; color:var(--jd-ink); max-width:none; background:none; -webkit-text-fill-color:currentColor; }
.jd-masthead .sub { font:400 1.12rem/1.55 var(--jd-sans); color:var(--jd-ink-soft); max-width:35em; margin:0 auto; }
.jd-masthead .flourish { width:46px; height:3px; background:var(--jd-accent); margin:1.5rem auto 0; border-radius:2px; }

.jd-sec { margin:3rem 0 1.1rem; }
.jd-sec-head { display:flex; align-items:center; gap:.95rem; }
.jd-sec-head .idx { font:600 11px/1 var(--jd-sans); letter-spacing:.16em; color:var(--jd-accent); flex:none; }
.jd-sec-head h2 { font-family:var(--jd-display); font-weight:600; font-size:clamp(1.3rem,3vw,1.9rem); letter-spacing:-.012em; margin:0; color:var(--jd-ink); }
.jd-sec-head .line { flex:1; height:1px; background:var(--jd-line); min-width:1.5rem; }

.jd-mapwrap { border-radius:18px; box-shadow:0 30px 60px -38px rgba(22,21,18,.6); }

.jd-panel { background:var(--jd-card); border:1px solid var(--jd-line); border-radius:16px; padding:1.6rem 1.8rem;
  box-shadow:0 1px 2px rgba(22,21,18,.04), 0 24px 48px -34px rgba(22,21,18,.45); }
.jd-tablewrap { padding:.6rem 1rem; }
.jd-tablewrap table { font-family:var(--jd-sans); }
.jd-tablewrap th:first-child:empty, .jd-tablewrap td:first-child:empty { display:none; }

.jd-cap { font:400 .96rem/1.65 var(--jd-sans); color:var(--jd-muted); max-width:54em; margin:1.1rem 2px 0; }
.jd-cap strong { color:var(--jd-ink-soft); font-weight:600; }
.jd-cap em { font-style:normal; color:var(--jd-accent); font-weight:600; }
</style>
