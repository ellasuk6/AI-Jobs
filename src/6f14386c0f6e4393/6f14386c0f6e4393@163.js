function _1(md){return(
md`# AI Proj Personal`
)}

function _dc_jobs_combined(__query,FileAttachment,invalidation){return(
__query(FileAttachment("dc_jobs_combined.csv"),{from:{table:"dc_jobs_combined"},sort:[],slice:{to:null,from:null},derive:[{name: "total_with_reports", value: (row) => (
row["total_facilities"] + row["community_reports"]
)}],filter:[],select:{columns:null}},invalidation)
)}

function _3(md){return(
md`Linear regression plotting documented facilities vs jobs per state`
)}

function _4(Plot,dc_jobs_combined){return(
Plot.plot({
  x: { label: "Total Documented Facilities" },
  y: { label: "Number of AI Related Jobs" },
  marks: [
    Plot.linearRegressionY(dc_jobs_combined, {x: "total_facilities", y: "current_jobs", stroke: "blue"})
  ]
})
)}

function _5(md){return(
md`Linear Regression with Community Reports`
)}

function _6(Plot,dc_jobs_combined){return(
Plot.plot({
  x: { label: "Total Facilities with Community Reports" },
  y: { label: "Number of AI Related Jobs" },
  marks: [
    Plot.linearRegressionY(dc_jobs_combined, {x: "total_with_reports", y: "current_jobs", stroke: "red"})
  ]
})
)}

function _7(md){return(
md`One part of data from brockovich (https://brockovichdatacenter.com/index.html)`
)}

function _8(__query,FileAttachment,invalidation){return(
__query(FileAttachment("AI By State.csv"),{from:{table:"AI By State"},sort:[],slice:{to:null,from:null},filter:[],select:{columns:null}},invalidation)
)}

function _9(md){return(
md`Data from https://www.visualcapitalist.com/ranked-states-by-ai-data-center-jobs/`
)}

function _data(__query,FileAttachment,invalidation){return(
__query(FileAttachment("datacenter_community_reports_by_state.csv"),{from:{table:"datacenter_community_reports_by_state"},sort:[],slice:{to:null,from:null},filter:[],select:{columns:null}},invalidation)
)}

function _11(md){return(
md`## Data centers & job growth by state

Where AI infrastructure is being built — and the jobs it creates. Data from [brockovichdatacenter.com](https://brockovichdatacenter.com) (May 2026) combined with BLS employment figures.`
)}

function _dcJobs(){return(
[
  {st:"TX",name:"Texas",jobs:48029,newJobs:42000,op:2,con:6,prop:4,fac:12},
  {st:"VA",name:"Virginia",jobs:18900,newJobs:18000,op:3,con:2,prop:1,fac:6},
  {st:"PA",name:"Pennsylvania",jobs:12600,newJobs:16000,op:0,con:4,prop:2,fac:6},
  {st:"IN",name:"Indiana",jobs:6200,newJobs:14000,op:0,con:4,prop:0,fac:4},
  {st:"OH",name:"Ohio",jobs:13200,newJobs:11000,op:2,con:2,prop:1,fac:5},
  {st:"LA",name:"Louisiana",jobs:2900,newJobs:10000,op:0,con:2,prop:0,fac:2},
  {st:"GA",name:"Georgia",jobs:19200,newJobs:7500,op:3,con:1,prop:0,fac:4},
  {st:"NC",name:"N. Carolina",jobs:14800,newJobs:6500,op:3,con:1,prop:0,fac:4},
  {st:"WI",name:"Wisconsin",jobs:6800,newJobs:5500,op:1,con:1,prop:1,fac:3},
  {st:"IL",name:"Illinois",jobs:15300,newJobs:5000,op:0,con:1,prop:0,fac:1},
  {st:"SC",name:"S. Carolina",jobs:4200,newJobs:4800,op:0,con:2,prop:0,fac:2},
  {st:"MO",name:"Missouri",jobs:5900,newJobs:4500,op:0,con:1,prop:2,fac:3},
  {st:"CA",name:"California",jobs:81577,newJobs:4000,op:0,con:0,prop:0,fac:0},
  {st:"NY",name:"New York",jobs:27849,newJobs:3500,op:0,con:0,prop:1,fac:1},
  {st:"ND",name:"N. Dakota",jobs:1200,newJobs:3200,op:1,con:1,prop:0,fac:2},
  {st:"NM",name:"New Mexico",jobs:1400,newJobs:3000,op:1,con:1,prop:0,fac:2},
  {st:"MI",name:"Michigan",jobs:7600,newJobs:2800,op:0,con:1,prop:0,fac:1},
  {st:"WA",name:"Washington",jobs:22100,newJobs:2500,op:1,con:0,prop:0,fac:1},
  {st:"OK",name:"Oklahoma",jobs:3400,newJobs:2000,op:1,con:1,prop:0,fac:2},
  {st:"AZ",name:"Arizona",jobs:9900,newJobs:2200,op:1,con:1,prop:0,fac:2},
  {st:"OR",name:"Oregon",jobs:5600,newJobs:1800,op:4,con:0,prop:0,fac:4},
  {st:"NV",name:"Nevada",jobs:5100,newJobs:1600,op:2,con:1,prop:0,fac:3},
  {st:"MD",name:"Maryland",jobs:7200,newJobs:1500,op:0,con:0,prop:1,fac:1},
  {st:"TN",name:"Tennessee",jobs:8400,newJobs:1200,op:1,con:1,prop:0,fac:2},
  {st:"IA",name:"Iowa",jobs:3600,newJobs:1100,op:3,con:0,prop:1,fac:4},
  {st:"MS",name:"Mississippi",jobs:1600,newJobs:8000,op:0,con:2,prop:1,fac:3},
  {st:"ID",name:"Idaho",jobs:1900,newJobs:1400,op:0,con:1,prop:1,fac:2},
  {st:"KY",name:"Kentucky",jobs:3800,newJobs:900,op:0,con:1,prop:0,fac:1},
  {st:"UT",name:"Utah",jobs:4800,newJobs:1000,op:1,con:0,prop:1,fac:2},
  {st:"NE",name:"Nebraska",jobs:2400,newJobs:800,op:1,con:0,prop:0,fac:1},
  {st:"AL",name:"Alabama",jobs:3100,newJobs:600,op:1,con:0,prop:0,fac:1},
  {st:"WY",name:"Wyoming",jobs:900,newJobs:0,op:1,con:0,prop:0,fac:1},
  {st:"FL",name:"Florida",jobs:28682,newJobs:0,op:0,con:0,prop:1,fac:1},
  {st:"AK",name:"Alaska",jobs:800,newJobs:400,op:0,con:0,prop:4,fac:4}
]
)}

function _selectedView(Inputs){return(
Inputs.radio(
  ["Facilities vs jobs", "Top states — stacked", "Growth leaders"],
  {value: "Facilities vs jobs", label: "Chart view"}
)
)}

function _14(dcJobs,selectedView,Plot,width)
{
  const sorted = [...dcJobs].sort((a, b) =>
    (b.jobs + b.newJobs) - (a.jobs + a.newJobs)
  )
  const top20 = sorted.slice(0, 20)

  if (selectedView === "Facilities vs jobs") {
    return Plot.plot({
      title: "Data center facilities vs current AI jobs by state",
      width,
      height: 420,
      marginLeft: 60,
      x: { label: "Total data center facilities →", grid: true },
      y: { label: "↑ Current AI/DC jobs (BLS 2025)", grid: true,
           tickFormat: d => d >= 1000 ? (d/1000) + "k" : d },
      marks: [
        Plot.dot(dcJobs.filter(d => d.fac > 0), {
          x: "fac",
          y: "jobs",
          r: d => 4 + d.newJobs / 8000,
          fill: "#378ADD",
          fillOpacity: 0.7,
          stroke: "#185FA5",
          strokeWidth: 1,
          tip: true,
          channels: {
            State: "name",
            "Current jobs": d => d.jobs.toLocaleString(),
            "Projected new": d => "+" + d.newJobs.toLocaleString(),
            Facilities: "fac"
          }
        }),
        Plot.text(dcJobs.filter(d => d.fac >= 4 || d.jobs > 15000), {
          x: "fac",
          y: "jobs",
          text: "st",
          dy: -10,
          fontSize: 10,
          fill: "#444"
        })
      ]
    })
  }

  if (selectedView === "Top states — stacked") {
    return Plot.plot({
      title: "Current + projected AI/DC jobs — top 20 states",
      width,
      height: 520,
      marginLeft: 100,
      x: { label: "Jobs →", grid: true,
           tickFormat: d => d >= 1000 ? (d/1000) + "k" : d },
      y: { label: null },
      color: { legend: true, domain: ["Current jobs", "Projected new"],
               range: ["#378ADD", "#1D9E75"] },
      marks: [
        Plot.barX(top20.flatMap(d => [
          { name: d.name, type: "Current jobs",    value: d.jobs    },
          { name: d.name, type: "Projected new",   value: d.newJobs }
        ]), {
          x: "value",
          y: "name",
          fill: "type",
          sort: { y: "-x" },
          tip: true
        })
      ]
    })
  }

  if (selectedView === "Growth leaders") {
    const growthStates = dcJobs
      .filter(d => d.newJobs > 0 && d.jobs > 0)
      .map(d => ({ ...d, growthPct: Math.round(d.newJobs / d.jobs * 100) }))
      .sort((a, b) => b.growthPct - a.growthPct)
      .slice(0, 15)

    return Plot.plot({
      title: "States with highest projected job growth % from data center buildout",
      width,
      height: 480,
      marginLeft: 110,
      x: { label: "Projected growth vs current base →", tickFormat: d => d + "%" },
      y: { label: null },
      marks: [
        Plot.barX(growthStates, {
          x: "growthPct",
          y: "name",
          fill: "#534AB7",
          fillOpacity: 0.8,
          sort: { y: "-x" },
          tip: true,
          channels: {
            State: "name",
            "Current jobs": d => d.jobs.toLocaleString(),
            "Projected new": d => "+" + d.newJobs.toLocaleString(),
            "Growth %": d => d.growthPct + "%"
          }
        }),
        Plot.ruleX([0])
      ]
    })
  }
}


function _d3(require){return(
require("d3@7")
)}

function _topojson(require){return(
require("topojson-client@3")
)}

function _us(){return(
fetch("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json")
      .then(r => r.json())
)}

async function _18(d3,FileAttachment,topojson)
{
  const width = 960, height = 560;
  const fmt = d3.format(","), fmt1 = d3.format(".1f");

  const raw = await FileAttachment("dc_jobs_combined.csv").csv({ typed: true });

  const pop = {"AK":733,"AL":5040,"AR":3012,"AZ":7280,"CA":39029,"CO":5840,"CT":3616,"DE":1018,"FL":22610,"GA":10912,"HI":1440,"IA":3200,"ID":1940,"IL":12582,"IN":6790,"KS":2938,"KY":4526,"LA":4624,"MA":6982,"MD":6165,"ME":1385,"MI":10034,"MN":5717,"MO":6178,"MS":2961,"MT":1123,"NC":10699,"ND":779,"NE":1961,"NH":1395,"NJ":9261,"NM":2114,"NV":3178,"NY":19336,"OH":11756,"OK":3960,"OR":4240,"PA":13002,"RI":1094,"SC":5283,"SD":909,"TN":7051,"TX":30030,"UT":3380,"VA":8683,"VT":647,"WA":7740,"WI":5896,"WV":1775,"WY":581};
  const abbrToName = {"AK":"Alaska","AL":"Alabama","AR":"Arkansas","AZ":"Arizona","CA":"California","CO":"Colorado","CT":"Connecticut","DE":"Delaware","FL":"Florida","GA":"Georgia","HI":"Hawaii","IA":"Iowa","ID":"Idaho","IL":"Illinois","IN":"Indiana","KS":"Kansas","KY":"Kentucky","LA":"Louisiana","MA":"Massachusetts","MD":"Maryland","ME":"Maine","MI":"Michigan","MN":"Minnesota","MO":"Missouri","MS":"Mississippi","MT":"Montana","NC":"North Carolina","ND":"North Dakota","NE":"Nebraska","NH":"New Hampshire","NJ":"New Jersey","NM":"New Mexico","NV":"Nevada","NY":"New York","OH":"Ohio","OK":"Oklahoma","OR":"Oregon","PA":"Pennsylvania","RI":"Rhode Island","SC":"South Carolina","SD":"South Dakota","TN":"Tennessee","TX":"Texas","UT":"Utah","VA":"Virginia","VT":"Vermont","WA":"Washington","WI":"Wisconsin","WV":"West Virginia","WY":"Wyoming"};

  const data = raw.map(d => {
    const abbr = d.state_abbr;
    const jobs = d.current_jobs; // current jobs only
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
      facilities_community: d.community_reports ?? 0, // treat reports count as "community" bubble
      total_facilities: d.total_facilities + d.community_reports ?? 0
    };
  });

  const us = await d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json");
  const states = topojson.feature(us, us.objects.states).features;
  const projection = d3.geoAlbersUsa().fitSize([width, height], topojson.feature(us, us.objects.states));
  const path = d3.geoPath(projection);
  const byName = new Map(data.map(d => [d.state, d]));

  const RAMP = ["#0d2b2e","#15514c","#1f6e6a","#2f927f","#3fb6a0","#69d3b4","#9ff0cf"];

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
    total:        { fill: "#ff7a3d", stroke: "#ff7a3d" },
    operational:  { fill: "#0047AB", stroke: "#0047AB" },
    construction: { fill: "#ffb37e", stroke: "#ffb37e" },
    proposed:     { fill: "#a78bfa", stroke: "#a78bfa" },
    community:    { fill: "#f472b6", stroke: "#f472b6" },
  };

  function getBubbleColor() {
    if (dcMode === "total") return bubbleColors.total;
    const keys = [...multiSet];
    if (keys.length === 1) return bubbleColors[keys[0]];
    return { fill: "#e2e8f0", stroke: "#cbd5e1" };
  }

  // Taller legend strip so nothing clips
  const LEGEND_H = 120;
  const totalH = height + LEGEND_H;

  const container = d3.create("div")
    .style("font-family", "ui-monospace, SFMono-Regular, Menlo, monospace")
    .style("color", "#cdd6e0").style("background", "#0c1116")
    .style("padding", "16px").style("border-radius", "14px")
    .style("position", "relative");

  const mkBtn = (parent, label) => parent.append("button").text(label)
    .style("font-family", "inherit").style("font-size", "11px").style("cursor", "pointer")
    .style("border", "1px solid #1f2a36").style("border-radius", "999px")
    .style("padding", "5px 13px").style("background", "#121922").style("color", "#7d8a99")
    .style("transition", "background 0.18s, color 0.18s");

  // Row 1: heatmap
  const row1 = container.append("div").style("margin-bottom", "7px")
    .style("display", "flex").style("gap", "8px").style("align-items", "center");
  row1.append("span").text("HEATMAP")
    .style("font-size", "10px").style("letter-spacing", ".2em").style("color", "#7d8a99").style("min-width","68px");
  const btnPer = mkBtn(row1, "Jobs per 100k");
  const btnTot = mkBtn(row1, "Total jobs");

  // Row 2: bubble controls
  const row2 = container.append("div").style("margin-bottom", "10px")
    .style("display", "flex").style("gap", "8px").style("align-items", "center").style("flex-wrap","wrap");
  row2.append("span").text("BUBBLES")
    .style("font-size", "10px").style("letter-spacing", ".2em").style("color", "#7d8a99").style("min-width","68px");

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
    .style("background", "#0b1015").style("border-radius", "10px");

  const tip = container.append("div")
    .style("position", "absolute").style("pointer-events", "none").style("opacity", 0)
    .style("transform", "translate(-50%,-115%)").style("background", "#0a0e13")
    .style("border", "1px solid #1f2a36").style("border-radius", "10px").style("padding", "9px 12px")
    .style("font-size", "12px").style("color", "#e8edf2").style("white-space", "nowrap")
    .style("box-shadow", "0 14px 36px rgba(0,0,0,.55)").style("z-index","10");

  const show = (event, name) => {
    const d = byName.get(name); if (!d) return;
    const [mx, my] = d3.pointer(event, container.node());
    tip.style("left", mx + "px").style("top", my + "px").style("opacity", 1)
      .html(`<b style="font-size:13px">${name}</b><br>
        Current jobs: ${d.jobs != null ? fmt(d.jobs) : "&mdash;"}<br>
        Per 100k: ${d.perCapita != null ? fmt1(d.perCapita) : "&mdash;"}<br>
        <span style="color:#3fb6a0">Existing: ${d.facilities_operational}</span> &nbsp;
        <span style="color:#ffb37e">Building: ${d.facilities_construction}</span> &nbsp;
        <span style="color:#a78bfa">Proposed: ${d.facilities_proposed}</span><br>
        <span style="color:#f472b6">Community reports: ${d.reports}</span><br>
        Total facilities: ${d.total_facilities}`);
  };
  const hide = () => tip.style("opacity", 0);

  const statePaths = svg.append("g").selectAll("path").data(states).join("path")
    .attr("d", path).attr("stroke", "#0b1015").attr("stroke-width", 0.6)
    .on("mousemove", (e, f) => show(e, f.properties.name)).on("mouseleave", hide);

  const bubbleG = svg.append("g");

  // Legend groups
  const legY = height + 16;
  const bubbleLegG = svg.append("g").attr("transform", `translate(40,${legY})`);
  const rampG = svg.append("g").attr("transform", `translate(${width - 220},${legY})`);

  // ---- RENDER ----

  function updateButtonStyles() {
    [[btnPer, "perCapita"], [btnTot, "jobs"]].forEach(([b, m]) => {
      b.style("background", heatMode === m ? "#1f6e6a" : "#121922")
       .style("color",      heatMode === m ? "#eafff8" : "#7d8a99")
       .style("border",     heatMode === m ? "1px solid #3fb6a055" : "1px solid #1f2a36");
    });

    btnDcTotal.style("background", dcMode === "total" ? "#ff7a3d22" : "#121922")
              .style("color",      dcMode === "total" ? "#ff9060"   : "#7d8a99")
              .style("border",     dcMode === "total" ? "1px solid #ff7a3d55" : "1px solid #1f2a36");

    [
      [btnOp,   "operational",  "#3fb6a0"],
      [btnCon,  "construction", "#ffb37e"],
      [btnProp, "proposed",     "#a78bfa"],
      [btnComm, "community",    "#f472b6"],
    ].forEach(([b, key, col]) => {
      const active = dcMode !== "total" && multiSet.has(key);
      b.style("background", active ? `${col}22` : "#121922")
       .style("color",      active ? col         : "#7d8a99")
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
      .attr("fill", fill).attr("fill-opacity", 0.34)
      .attr("stroke", stroke).attr("stroke-width", 1.1).style("cursor", "pointer")
      .on("mousemove", (e, o) => show(e, o.name)).on("mouseleave", hide);

    // Bubble legend
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
      .attr("fill", "#7d8a99").attr("font-size", 10).attr("letter-spacing", ".1em")
      .text(legendLabel);

    const maxR = 38;
    const samples = maxVal <= 3
      ? [1, maxVal].filter((v,i,a) => a.indexOf(v)===i)
      : maxVal <= 10
        ? [1, Math.round(maxVal/2), maxVal].filter((v,i,a) => a.indexOf(v)===i)
        : [1, Math.round(maxVal/2), maxVal];

    const circleBaseY = 18 + maxR; // label height + max bubble radius = baseline for bottom-aligned circles
    let bx = 0;
    samples.forEach(v => {
      const rad = r(v);
      bubbleLegG.append("circle")
        .attr("cx", bx + rad)
        .attr("cy", circleBaseY + (maxR - rad)) // bottom-align all circles
        .attr("r", rad)
        .attr("fill", fill).attr("fill-opacity", 0.34).attr("stroke", stroke);
      bubbleLegG.append("text")
        .attr("x", bx + rad)
        .attr("y", circleBaseY + maxR + 13) // just below the largest possible circle
        .attr("text-anchor", "middle")
        .attr("fill", "#7d8a99").attr("font-size", 9).text(v);
      bx += rad * 2 + 14;
    });
  }

  function renderHeatmap() {
    const vals = data.filter(d => val(d) != null).map(val);
    const lo = d3.min(vals), hi = d3.max(vals);
    const color = d3.scaleSequentialSqrt(d3.interpolateRgbBasis(RAMP)).domain([lo, hi]);

    statePaths.transition().duration(420).attr("fill", f => {
      const d = byName.get(f.properties.name);
      return (d && val(d) != null) ? color(val(d)) : "#1a2530";
    });

    rampG.selectAll("*").remove();
    rampG.append("text").attr("x", 0).attr("y", 0)
      .attr("fill", "#7d8a99").attr("font-size", 10).attr("letter-spacing", ".1em")
      .text(heatMode === "perCapita" ? "JOBS PER 100K" : "CURRENT JOBS");
    d3.range(50).forEach(i => {
      const t = i / 49;
      rampG.append("rect").attr("x", i * 4).attr("y", 14).attr("width", 4).attr("height", 12)
        .attr("fill", color(lo + t * (hi - lo)));
    });
    rampG.append("text").attr("x", 0).attr("y", 40)
      .attr("fill", "#7d8a99").attr("font-size", 9)
      .text(heatMode === "perCapita" ? fmt1(lo) : fmt(lo));
    rampG.append("text").attr("x", 200).attr("y", 40).attr("text-anchor", "end")
      .attr("fill", "#7d8a99").attr("font-size", 9)
      .text(heatMode === "perCapita" ? fmt1(hi) : fmt(hi));
  }

  function renderAll() {
    updateButtonStyles();
    renderHeatmap();
    renderBubbles();
  }

  // ---- EVENTS ----
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
  return container.node();
}


export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["dc_jobs_combined.csv", {url: new URL("./files/0f73a9bc8a64e39e518a653d62daaec4b74512dd3ea3de772117a166fa58f100ed458847bf059756037089cc1a9b00f1a4683da7e40f3afd6a0e58624db36bbc.csv", import.meta.url), mimeType: "text/csv", toString}],
    ["AI By State.csv", {url: new URL("./files/fdef51a6efaee28ff09c441289009b7559824e9eca0955ce0da406eca381fba20e36d60ac32456e8966e97b1b0c16084ad7c3b4c22f5d8a6a6e844643fb31d99.csv", import.meta.url), mimeType: "text/csv", toString}],
    ["datacenter_community_reports_by_state.csv", {url: new URL("./files/8db0543d0c254b8d1f35be203fd6ae030384adfcf41b14c6f28fd1c4a110dd7452be9b90a65364f537c402c1a5ba310fead5c06280d3bc1d3e82ee612a45e5bc.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("dc_jobs_combined")).define("dc_jobs_combined", ["__query","FileAttachment","invalidation"], _dc_jobs_combined);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer()).define(["Plot","dc_jobs_combined"], _4);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer()).define(["Plot","dc_jobs_combined"], _6);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer()).define(["__query","FileAttachment","invalidation"], _8);
  main.variable(observer()).define(["md"], _9);
  main.variable(observer("data")).define("data", ["__query","FileAttachment","invalidation"], _data);
  main.variable(observer()).define(["md"], _11);
  main.variable(observer("dcJobs")).define("dcJobs", _dcJobs);
  main.variable(observer("viewof selectedView")).define("viewof selectedView", ["Inputs"], _selectedView);
  main.variable(observer("selectedView")).define("selectedView", ["Generators", "viewof selectedView"], (G, _) => G.input(_));
  main.variable(observer()).define(["dcJobs","selectedView","Plot","width"], _14);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer("topojson")).define("topojson", ["require"], _topojson);
  main.variable(observer("us")).define("us", _us);
  main.variable(observer()).define(["d3","FileAttachment","topojson"], _18);
  return main;
}
