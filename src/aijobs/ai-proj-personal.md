# Analytics

Below shows the correlation between the numbers of data centers in each state compared against the number of AI and data center jobs in the state. 
 
```js
const dc_jobs_combined = await FileAttachment("dc_jobs_combined.csv").csv({typed: true});
```
 
```js
const regressionView = view(Inputs.radio(
  ["Community Reports", "Documented Facilities"],
  {value: "Community Reports", label: "Regression view"}
))
```
## Linear Regression Models

```js
{
  if (regressionView === "Community Reports") {
    display(Plot.plot({
      title: "Linear Regression with Community Reports",
      marginBottom: 40,
      x: { label: "Total Facilities with Community Reports" },
      y: { label: "Number of AI Related Jobs" },
      marks: [
        Plot.linearRegressionY(dc_jobs_combined, {x: "total_with_reports", y: "current_jobs", stroke: "red"})
      ]
    }));
  } else {
    display(Plot.plot({
      title: "Linear Regression: Documented Facilities vs Jobs",
      marginBottom: 40,
      x: { label: "Total Documented Facilities" },
      y: { label: "Number of AI Related Jobs" },
      marks: [
        Plot.linearRegressionY(dc_jobs_combined, {x: "total_facilities", y: "current_jobs", stroke: "blue"})
      ]
    }));
  }
}
```


```js
//const aiByState = await FileAttachment("AI_By_State.csv").csv({typed: true});
```

```js 
//Inputs.table(aiByState)
```

## AI jobs & data centers — interactive map

```js
{
  const width = 960, height = 560;
  const fmt = d3.format(","), fmt1 = d3.format(".1f");

  const raw = await FileAttachment("dc_jobs_combined.csv").csv({ typed: true });

  const pop = {"AK":733,"AL":5040,"AR":3012,"AZ":7280,"CA":39029,"CO":5840,"CT":3616,"DE":1018,"FL":22610,"GA":10912,"HI":1440,"IA":3200,"ID":1940,"IL":12582,"IN":6790,"KS":2938,"KY":4526,"LA":4624,"MA":6982,"MD":6165,"ME":1385,"MI":10034,"MN":5717,"MO":6178,"MS":2961,"MT":1123,"NC":10699,"ND":779,"NE":1961,"NH":1395,"NJ":9261,"NM":2114,"NV":3178,"NY":19336,"OH":11756,"OK":3960,"OR":4240,"PA":13002,"RI":1094,"SC":5283,"SD":909,"TN":7051,"TX":30030,"UT":3380,"VA":8683,"VT":647,"WA":7740,"WI":5896,"WV":1775,"WY":581};
  const abbrToName = {"AK":"Alaska","AL":"Alabama","AR":"Arkansas","AZ":"Arizona","CA":"California","CO":"Colorado","CT":"Connecticut","DE":"Delaware","FL":"Florida","GA":"Georgia","HI":"Hawaii","IA":"Iowa","ID":"Idaho","IL":"Illinois","IN":"Indiana","KS":"Kansas","KY":"Kentucky","LA":"Louisiana","MA":"Massachusetts","MD":"Maryland","ME":"Maine","MI":"Michigan","MN":"Minnesota","MO":"Missouri","MS":"Mississippi","MT":"Montana","NC":"North Carolina","ND":"North Dakota","NE":"Nebraska","NH":"New Hampshire","NJ":"New Jersey","NM":"New Mexico","NV":"Nevada","NY":"New York","OH":"Ohio","OK":"Oklahoma","OR":"Oregon","PA":"Pennsylvania","RI":"Rhode Island","SC":"South Carolina","SD":"South Dakota","TN":"Tennessee","TX":"Texas","UT":"Utah","VA":"Virginia","VT":"Vermont","WA":"Washington","WI":"Wisconsin","WV":"West Virginia","WY":"Wyoming"};

  const data = raw.map(d => {
    const abbr = d.state_abbr;
    const jobs = d.current_jobs;
    const popK = pop[abbr] ?? null;
    return {
      state: abbrToName[abbr] ?? abbr,
      abbr,
      reports: d.community_reports ?? 0,
      jobs,
      perCapita: (popK && jobs != null) ? +(jobs / popK * 100).toFixed(1) : null,
      facilities_operational: d.facilities_operational ?? 0,
      facilities_construction: d.facilities_construction ?? 0,
      facilities_proposed: d.facilities_proposed ?? 0,
      facilities_community: d.community_reports ?? 0,
      total_facilities: d.total_facilities + d.community_reports ?? 0
    };
  });

  const us = await d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json");
  const states = topojson.feature(us, us.objects.states).features;
  const projection = d3.geoAlbersUsa().fitSize([width, height], topojson.feature(us, us.objects.states));
  const path = d3.geoPath(projection);
  const byName = new Map(data.map(d => [d.state, d]));

  // ── HEATMAP RAMP ────────────────────────────────────────────────────────────
  // Purple → Orange: high contrast on dark bg, colorblind-safe, great on projectors
  const RAMP = ["#1a4a2e", "#2d7a3a", "#52b044", "#a8d64a", "#f5ec1a", "#f5a623", "#d94f2b"];

  // Other options — swap any of these in for RAMP above:
  // Blue → Cyan (clean, professional):
  // const RAMP = ["#020d1a", "#063a6e", "#0f6dba", "#0a9fd4", "#18cfe0", "#6df0f5", "#c8fffe"];
  // Blue → Pink (dramatic, vivid):
  // const RAMP = ["#0d0221", "#2d1b69", "#5b2d8e", "#a0289f", "#d63fa0", "#f472b6", "#fecdd3"];
  // Gold → Red (warm, high energy):
  // const RAMP = ["#1a0a00", "#5c1f00", "#a63400", "#d95f02", "#f59a0c", "#fdd663", "#fff4b8"];
  // ───────────────────────────────────────────────────────────────────────────

  let dcMode = "total";
  let multiSet = new Set();
  let heatMode = "perCapita";
  const val = d => d[heatMode];

  function getBubbleVal(d) {
    if (dcMode === "total") return d.total_facilities;
    let sum = 0;
    if (multiSet.has("operational"))  sum += d.facilities_operational;
    if (multiSet.has("construction")) sum += d.facilities_construction;
    if (multiSet.has("proposed"))     sum += d.facilities_proposed;
    if (multiSet.has("community"))    sum += d.facilities_community;
    return sum;
  }

  const bubbleColors = {
    total:        { fill: "#3d52a0", stroke: "rgba(255,255,255,0.5)" },
    operational:  { fill: "#3d52a0", stroke: "rgba(255,255,255,0.5)" },
    construction: { fill: "#1a6b8a", stroke: "rgba(255,255,255,0.5)" },
    proposed:     { fill: "#d94f2b", stroke: "rgba(255,255,255,0.5)" },
    community:    { fill: "#8b4fc8", stroke: "rgba(255,255,255,0.5)" },
  };

  function getBubbleColor() {
    if (dcMode === "total") return bubbleColors.total;
    const keys = [...multiSet];
    if (keys.length === 1) return bubbleColors[keys[0]];
    return { fill: "#4a5568", stroke: "rgba(255,255,255,0.5)" };
  }

  const LEGEND_H = 120;
  const totalH = height + LEGEND_H;

  const container = d3.create("div")
    .style("font-family", "ui-monospace, SFMono-Regular, Menlo, monospace")
    .style("color", "#1a2230").style("background", "#f4f6f9")
    .style("padding", "16px").style("border-radius", "14px")
    .style("position", "relative");

  const mkBtn = (parent, label) => parent.append("button").text(label)
    .style("font-family", "inherit").style("font-size", "11px").style("cursor", "pointer")
    .style("border", "1px solid #1f2a36").style("border-radius", "999px")
    .style("padding", "5px 13px").style("background", "#ffffff").style("color", "#5a6472")
    .style("transition", "background 0.18s, color 0.18s");

  const row1 = container.append("div").style("margin-bottom", "7px")
    .style("display", "flex").style("gap", "8px").style("align-items", "center");
  row1.append("span").text("HEATMAP")
    .style("font-size", "10px").style("letter-spacing", ".2em").style("color", "#5a6472").style("min-width","68px");
  const btnPer = mkBtn(row1, "Jobs per 100k");
  const btnTot = mkBtn(row1, "Total jobs");

  const row2 = container.append("div").style("margin-bottom", "10px")
    .style("display", "flex").style("gap", "8px").style("align-items", "center").style("flex-wrap","wrap");
  row2.append("span").text("BUBBLES")
    .style("font-size", "10px").style("letter-spacing", ".2em").style("color", "#5a6472").style("min-width","68px");

  const btnDcTotal = mkBtn(row2, "Total");
  const btnOp      = mkBtn(row2, "Existing");
  const btnCon     = mkBtn(row2, "Under construction");
  const btnProp    = mkBtn(row2, "Proposed");
  const btnComm    = mkBtn(row2, "Community reported");

  const dotStyle = (btn, hex) => {
    const txt = btn.node().textContent;
    btn.node().innerHTML = `<span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:${hex};margin-right:5px;vertical-align:middle"></span>${txt}`;
  };
  dotStyle(btnDcTotal, bubbleColors.total.fill);
  dotStyle(btnOp,      bubbleColors.operational.fill);
  dotStyle(btnCon,     bubbleColors.construction.fill);
  dotStyle(btnProp,    bubbleColors.proposed.fill);
  dotStyle(btnComm,    bubbleColors.community.fill);

  const svg = container.append("svg")
    .attr("viewBox", [0, 0, width, totalH])
    .style("width", "100%").style("height", "auto")
    .style("background", "#eef0f4").style("border-radius", "10px");

  const tip = container.append("div")
    .style("position", "absolute").style("pointer-events", "none").style("opacity", 0)
    .style("transform", "translate(-50%,-115%)").style("background", "#ffffff")
    .style("border", "1px solid #1f2a36").style("border-radius", "10px").style("padding", "9px 12px")
    .style("font-size", "12px").style("color", "#1a2230").style("white-space", "nowrap")
    .style("box-shadow", "0 14px 36px rgba(0,0,0,.55)").style("z-index","10");

  const show = (event, name) => {
    const d = byName.get(name); if (!d) return;
    const [mx, my] = d3.pointer(event, container.node());
    tip.style("left", mx + "px").style("top", my + "px").style("opacity", 1)
      .html(`<b style="font-size:13px">${name}</b><br>
        Current jobs: ${d.jobs != null ? fmt(d.jobs) : "&mdash;"}<br>
        Per 100k: ${d.perCapita != null ? fmt1(d.perCapita) : "&mdash;"}<br>
        <span style="color:#3d52a0">Existing: ${d.facilities_operational}</span> &nbsp;
        <span style="color:#1a6b8a">Building: ${d.facilities_construction}</span> &nbsp;
        <span style="color:#d94f2b">Proposed: ${d.facilities_proposed}</span><br>
        <span style="color:#8b4fc8">Community reports: ${d.reports}</span><br>
        Total facilities: ${d.total_facilities}`);
  };
  const hide = () => tip.style("opacity", 0);

  const statePaths = svg.append("g").selectAll("path").data(states).join("path")
    .attr("d", path).attr("stroke", "#eef0f4").attr("stroke-width", 0.6)
    .on("mousemove", (e, f) => show(e, f.properties.name)).on("mouseleave", hide);

  const bubbleG = svg.append("g");

  const legY = height + 16;
  const bubbleLegG = svg.append("g").attr("transform", `translate(40,${legY})`);
  const rampG = svg.append("g").attr("transform", `translate(${width - 220},${legY})`);

  function updateButtonStyles() {
    [[btnPer, "perCapita"], [btnTot, "jobs"]].forEach(([b, m]) => {
      b.style("background", heatMode === m ? "#1f6e6a" : "#ffffff")
       .style("color",      heatMode === m ? "#eafff8" : "#5a6472")
       .style("border",     heatMode === m ? "1px solid #3fb6a055" : "1px solid #1f2a36");
    });

    btnDcTotal.style("background", dcMode === "total" ? "#ff7a3d22" : "#ffffff")
              .style("color",      dcMode === "total" ? "#ff9060"   : "#5a6472")
              .style("border",     dcMode === "total" ? "1px solid #ff7a3d55" : "1px solid #1f2a36");

    [
      [btnOp,   "operational",  "#3d52a0"],
      [btnCon,  "construction", "#1a6b8a"],
      [btnProp, "proposed",     "#d94f2b"],
      [btnComm, "community",    "#8b4fc8"],
    ].forEach(([b, key, col]) => {
      const active = dcMode !== "total" && multiSet.has(key);
      b.style("background", active ? `${col}22` : "#ffffff")
       .style("color",      active ? col         : "#5a6472")
       .style("border",     active ? `1px solid ${col}55` : "1px solid #1f2a36");
    });
  }

  function renderBubbles() {
    const maxVal = d3.max(data, d => getBubbleVal(d)) || 1;
    const r = d3.scaleSqrt().domain([0, maxVal]).range([0, 38]);
    const { fill, stroke } = getBubbleColor();

    const cents = states
      .map(f => ({ name: f.properties.name, c: path.centroid(f), d: byName.get(f.properties.name) }))
      .filter(o => o.d && o.c[0]);

    bubbleG.selectAll("circle").remove();
    bubbleG.selectAll("circle").data(cents).join("circle")
      .attr("cx", o => o.c[0]).attr("cy", o => o.c[1])
      .attr("r", o => r(getBubbleVal(o.d)))
      .attr("fill", fill).attr("fill-opacity", 0.82)
      .attr("stroke", stroke).attr("stroke-width", 1.8).style("cursor", "pointer")
      .on("mousemove", (e, o) => show(e, o.name)).on("mouseleave", hide);

    bubbleLegG.selectAll("*").remove();

    let legendLabel;
    if (dcMode === "total") {
      legendLabel = "TOTAL DATA CENTERS";
    } else if (multiSet.size === 0) {
      legendLabel = "DATA CENTERS (none selected)";
    } else {
      const nameMap = { operational:"EXISTING", construction:"UNDER CONSTRUCTION", proposed:"PROPOSED", community:"COMMUNITY REPORTED" };
      legendLabel = [...multiSet].map(k => nameMap[k]).join(" + ");
    }

    bubbleLegG.append("text").attr("x", 0).attr("y", 0)
      .attr("fill", "#5a6472").attr("font-size", 10).attr("letter-spacing", ".1em")
      .text(legendLabel);

    const maxR = 38;
    const samples = maxVal <= 3
      ? [1, maxVal].filter((v,i,a) => a.indexOf(v)===i)
      : maxVal <= 10
        ? [1, Math.round(maxVal/2), maxVal].filter((v,i,a) => a.indexOf(v)===i)
        : [1, Math.round(maxVal/2), maxVal];

    const circleBaseY = 18 + maxR;
    let bx = 0;
    samples.forEach(v => {
      const rad = r(v);
      bubbleLegG.append("circle")
        .attr("cx", bx + rad)
        .attr("cy", circleBaseY + (maxR - rad))
        .attr("r", rad)
        .attr("fill", fill).attr("fill-opacity", 0.82).attr("stroke", stroke);
      bubbleLegG.append("text")
        .attr("x", bx + rad)
        .attr("y", circleBaseY + maxR + 13)
        .attr("text-anchor", "middle")
        .attr("fill", "#5a6472").attr("font-size", 9).text(v);
      bx += rad * 2 + 14;
    });
  }

  function renderHeatmap() {
    const vals = data.filter(d => val(d) != null).map(val);
    const lo = d3.min(vals), hi = d3.max(vals);
    const color = d3.scaleSequentialSqrt(d3.interpolateRgbBasis(RAMP)).domain([lo, hi]);

    statePaths.transition().duration(420).attr("fill", f => {
      const d = byName.get(f.properties.name);
      return (d && val(d) != null) ? color(val(d)) : "#d8dde3";
    });

    rampG.selectAll("*").remove();
    rampG.append("text").attr("x", 0).attr("y", 0)
      .attr("fill", "#5a6472").attr("font-size", 10).attr("letter-spacing", ".1em")
      .text(heatMode === "perCapita" ? "JOBS PER 100K" : "CURRENT JOBS");
    d3.range(50).forEach(i => {
      const t = i / 49;
      rampG.append("rect").attr("x", i * 4).attr("y", 14).attr("width", 4).attr("height", 12)
        .attr("fill", color(lo + t * (hi - lo)));
    });
    rampG.append("text").attr("x", 0).attr("y", 40)
      .attr("fill", "#5a6472").attr("font-size", 9)
      .text(heatMode === "perCapita" ? fmt1(lo) : fmt(lo));
    rampG.append("text").attr("x", 200).attr("y", 40).attr("text-anchor", "end")
      .attr("fill", "#5a6472").attr("font-size", 9)
      .text(heatMode === "perCapita" ? fmt1(hi) : fmt(hi));
  }

  function renderAll() {
    updateButtonStyles();
    renderHeatmap();
    renderBubbles();
  }

  btnPer.on("click", () => { heatMode = "perCapita"; renderAll(); });
  btnTot.on("click", () => { heatMode = "jobs"; renderAll(); });
  btnDcTotal.on("click", () => { dcMode = "total"; multiSet.clear(); renderAll(); });

  [
    [btnOp,   "operational"],
    [btnCon,  "construction"],
    [btnProp, "proposed"],
    [btnComm, "community"],
  ].forEach(([btn, key]) => {
    btn.on("click", () => {
      dcMode = "multi";
      multiSet.has(key) ? multiSet.delete(key) : multiSet.add(key);
      renderAll();
    });
  });

  renderAll();
  display(container.node());
}
```