---
title: Overview
theme: air
toc: false
---

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Exo+2:wght@400;500;600;700;800&family=Inter:wght@400;450;500;600;700&display=swap">

```js
import * as topojson from "npm:topojson-client";
```

```js
const heroData = await FileAttachment("./aijobs/dc_jobs_combined.csv").csv({typed: true});
const heroJobs = d3.format(",")(d3.sum(heroData, d => d.current_jobs));
const heroNew = d3.format(",")(d3.sum(heroData, d => d.projected_new_jobs));
```

<section class="jd-hero">
  <span class="kicker">A scrollytelling read</span>
  <h1>AI&rsquo;s Impact on Jobs</h1>
  <p>A state-by-state look at AI and data-center jobs in the United States.</p>
  <p class="jd-teaser">${heroJobs} jobs today, and ${heroNew} more projected by 2027.</p>
  <div class="flourish"></div>
  <span class="down">Scroll to begin ↓</span>
</section>

```js
display(await (async () => {
  // ================================================================ DATA
  const dc = await FileAttachment("./aijobs/dc_jobs_combined.csv").csv({typed: true});
  const us = await d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json");

  // The CSV `state` column is unreliable (16 rows hold the abbreviation) — key on state_abbr.
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
  // population (thousands) for per-100k modes
  const POP = {AK:733,AL:5040,AR:3012,AZ:7280,CA:39029,CO:5840,CT:3616,DE:1018,FL:22610,GA:10912,
    HI:1440,IA:3200,ID:1940,IL:12582,IN:6790,KS:2938,KY:4526,LA:4624,MA:6982,MD:6165,ME:1385,
    MI:10034,MN:5717,MO:6178,MS:2961,MT:1123,NC:10699,ND:779,NE:1961,NH:1395,NJ:9261,NM:2114,
    NV:3178,NY:19336,OH:11756,OK:3960,OR:4240,PA:13002,RI:1094,SC:5283,SD:909,TN:7051,TX:30030,
    UT:3380,VA:8683,VT:647,WA:7740,WI:5896,WV:1775,WY:581};
  const nm = d => NAME[d.state_abbr] ?? d.state;

  const statesFC = topojson.feature(us, us.objects.states);
  const features = statesFC.features;
  const byFeat = new Map(dc.map(d => [nm(d), d]));

  const maxJobs = d3.max(dc, d => d.current_jobs);
  const maxFac  = d3.max(dc, d => d.total_facilities);
  const maxRep  = d3.max(dc, d => d.total_with_reports);

  function corr(field) {
    const xs = dc.map(d => d[field]), ys = dc.map(d => d.current_jobs), n = xs.length;
    let sx=0, sy=0, sxy=0, sxx=0, syy=0;
    for (let i=0;i<n;i++){ sx+=xs[i]; sy+=ys[i]; sxy+=xs[i]*ys[i]; sxx+=xs[i]*xs[i]; syy+=ys[i]*ys[i]; }
    return (n*sxy - sx*sy) / Math.sqrt((n*sxx - sx*sx) * (n*syy - sy*sy));
  }
  const rFacAll = corr("total_facilities"), rRepAll = corr("total_with_reports");

  // ============================================================== CANVAS
  const W = 960, H = 640;
  const ix0 = 80, ix1 = 900, iy0 = 548, iy1 = 92;
  const Lx0 = 80, Lx1 = 448, Rx0 = 512, Rx1 = 900;

  const y        = d3.scaleLinear().domain([0, maxJobs]).nice().range([iy0, iy1]);
  const xFacFull = d3.scaleLinear().domain([0, maxFac]).nice().range([ix0, ix1]);
  const xFacL    = d3.scaleLinear().domain([0, maxFac]).nice().range([Lx0, Lx1]);
  const xRepR    = d3.scaleLinear().domain([0, maxRep]).nice().range([Rx0, Rx1]);

  const GREEN="#1c6b46", BLUE="#2456c9", RED="#c0392b", GOLD="#b07a1e", PURPLE="#8b4fc8", INK="#48443e", BARCUR="#378ADD", BARNEW="#1D9E75";
  const FACCOL = {op:"#3d52a0", con:"#1a6b8a", prop:"#d94f2b", all:BLUE};
  const FACLAB = {op:"Existing", con:"Under construction", prop:"Proposed"};
  const kfmt = d => d >= 1000 ? (d/1000)+"k" : d;
  const cfmt = d3.format(","), f1 = d3.format(".1f"), f2 = d3.format(".2f");
  const EASE = d3.easeCubicInOut;
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const D = ms => RM ? 0 : ms;

  function linreg(field) {
    const pts = dc.map(d => ({x:d[field], y:d.current_jobs}));
    const n=pts.length; let sx=0,sy=0,sxy=0,sxx=0;
    for (const p of pts){ sx+=p.x; sy+=p.y; sxy+=p.x*p.y; sxx+=p.x*p.x; }
    const slope=(n*sxy-sx*sy)/(n*sxx-sx*sx);
    return {slope, intercept:(sy-slope*sx)/n, ex:d3.extent(pts,p=>p.x)};
  }
  // 95% confidence band for the regression (matches Plot.linearRegressionY), as an area path
  function regBandPath(field, xscale) {
    const xs=dc.map(d=>d[field]), ys=dc.map(d=>d.current_jobs), n=xs.length;
    const xbar=d3.mean(xs), ybar=d3.mean(ys);
    let Sxx=0, Sxy=0; for(let i=0;i<n;i++){ Sxx+=(xs[i]-xbar)**2; Sxy+=(xs[i]-xbar)*(ys[i]-ybar); }
    const slope=Sxy/Sxx, intercept=ybar-slope*xbar;
    let SSE=0; for(let i=0;i<n;i++){ const e=ys[i]-(slope*xs[i]+intercept); SSE+=e*e; }
    const s=Math.sqrt(SSE/(n-2)), tval=2.01, ex=d3.extent(xs);
    const pts=d3.range(0,41).map(i=>{ const x=ex[0]+(ex[1]-ex[0])*i/40, yhat=slope*x+intercept,
      se=s*Math.sqrt(1/n+(x-xbar)**2/Sxx), m=tval*se; return {x, lo:Math.max(0,yhat-m), hi:yhat+m}; });
    return d3.area().x(p=>xscale(p.x)).y0(p=>y(p.lo)).y1(p=>y(p.hi))(pts);
  }

  // ============================================================== DOM SHELL
  const svg = d3.create("svg")
    .attr("viewBox", [0,0,W,H]).attr("preserveAspectRatio","xMidYMid meet")
    .attr("role","img").attr("aria-label","Scrollytelling chart")
    .style("width","100%").style("height","100%").style("font-family","Inter, system-ui, sans-serif");

  const root = d3.create("div").attr("class","scrolly");
  const progress = root.append("div").attr("class","scroll-progress");
  const graphic = root.append("div").attr("class","scrolly-graphic");
  const sticky = graphic.append("div").attr("class","gsticky");
  const gcard = sticky.append("div").attr("class","gcard");
  const gcontrols = gcard.append("div").attr("class","gcontrols");
  gcard.node().appendChild(svg.node());
  const tip = gcard.append("div").attr("class","gtip");
  sticky.append("div").attr("class","scroll-hint").html("scroll&nbsp;↓");

  const defs = svg.append("defs");
  defs.append("filter").attr("id","soft").attr("x","-40%").attr("y","-40%").attr("width","180%").attr("height","180%")
    .append("feDropShadow").attr("dx",0).attr("dy",3).attr("stdDeviation",4).attr("flood-color","#161512").attr("flood-opacity",0.18);

  function showTip(event, d) {
    if (!d) return;
    const [mx,my] = d3.pointer(event, gcard.node());
    tip.style("left",mx+"px").style("top",(my-14)+"px").style("opacity",1)
      .html(`<b>${nm(d)}</b><br><span style="color:${GREEN}">Jobs ${cfmt(d.current_jobs)}</span>
        &nbsp;·&nbsp; <span style="color:${BLUE}">Facilities ${d.total_facilities}</span>
        &nbsp;·&nbsp; <span style="color:${PURPLE}">Reports ${cfmt(d.community_reports)}</span>`);
  }
  const hideTip = () => tip.style("opacity",0);

  // ============================================================== SCATTER ARC
  // shared y gridlines + labels
  const yTicks = y.ticks(5).filter(t => t>0);
  const gGrid = svg.append("g");
  gGrid.selectAll("line").data(yTicks).join("line")
    .attr("x1",ix0).attr("x2",ix1).attr("y1",y).attr("y2",y).attr("stroke","#161512").attr("stroke-opacity",0.07);
  gGrid.selectAll("text").data(yTicks).join("text")
    .attr("x",ix0-12).attr("y",y).attr("dy","0.32em").attr("text-anchor","end").attr("font-size",11).attr("fill","#8d867c").text(kfmt);
  gGrid.append("text").attr("transform",`translate(${ix0-50},${(iy0+iy1)/2}) rotate(-90)`)
    .attr("text-anchor","middle").attr("font-size",12).attr("font-weight",600).attr("fill",INK).text("AI / data-center jobs →");

  const titleG = svg.append("g");
  const tNum = titleG.append("text").attr("x",ix0-2).attr("y",34).attr("font-size",12).attr("font-weight",700).attr("letter-spacing",".18em").attr("fill",GREEN);
  const tTxt = titleG.append("text").attr("x",ix0+30).attr("y",34).attr("font-size",20).attr("font-weight",600).attr("fill","#161512").style("font-family","Exo 2, system-ui, sans-serif");
  function setTitle(num, txt, color) {
    titleG.interrupt().transition().duration(D(220)).style("opacity",0)
      .on("end",()=>{ tNum.text(num).attr("fill",color); tTxt.text(txt); })
      .transition().duration(D(420)).style("opacity",1);
  }

  // single-plot axis (proof + correlate)
  const gAxis = svg.append("g");
  gAxis.append("line").attr("x1",ix0).attr("x2",ix1).attr("y1",iy0).attr("y2",iy0).attr("stroke","#161512").attr("stroke-opacity",0.25);
  xFacFull.ticks(6).forEach(t => gAxis.append("text").attr("x",xFacFull(t)).attr("y",iy0+18).attr("text-anchor","middle").attr("font-size",10).attr("fill","#8d867c").text(t));
  gAxis.append("text").attr("x",(ix0+ix1)/2).attr("y",iy0+44).attr("text-anchor","middle").attr("font-size",12).attr("font-weight",600).attr("fill",INK).text("Data centers per state →");
  const singleR = gAxis.append("text").attr("x",ix1-8).attr("y",iy1+8).attr("text-anchor","end").attr("font-size",13).attr("font-weight",600).attr("fill",BLUE).style("opacity",0);

  // split-plot axes + panel titles + regressions
  const gSplit = svg.append("g").style("opacity",0);
  function panel(x0,x1,xscale,color,label) {
    const cx=(x0+x1)/2, g=gSplit.append("g");
    g.append("circle").attr("cx",cx-92).attr("cy",70).attr("r",5).attr("fill",color);
    g.append("text").attr("x",cx-80).attr("y",70).attr("dy","0.32em").attr("font-size",14).attr("font-weight",600).attr("fill","#161512").style("font-family","Exo 2, system-ui, sans-serif").text(label);
    g.append("line").attr("x1",x0).attr("x2",x1).attr("y1",iy0).attr("y2",iy0).attr("stroke","#161512").attr("stroke-opacity",0.25);
    xscale.ticks(4).forEach(t => g.append("text").attr("x",xscale(t)).attr("y",iy0+17).attr("text-anchor","middle").attr("font-size",9).attr("fill","#8d867c").text(t));
  }
  gSplit.append("line").attr("x1",(Lx1+Rx0)/2).attr("x2",(Lx1+Rx0)/2).attr("y1",iy1-4).attr("y2",iy0).attr("stroke","#161512").attr("stroke-opacity",0.08);
  panel(Lx0,Lx1,xFacL,BLUE,"Data centers");
  panel(Rx0,Rx1,xRepR,RED,"+ Reports");
  gSplit.append("text").attr("x",(Lx0+Lx1)/2).attr("y",iy0+38).attr("text-anchor","middle").attr("font-size",11).attr("fill",INK).text(`data centers →   (correlation ${rFacAll.toFixed(2)})`);
  const rLabR = gSplit.append("text").attr("x",(Rx0+Rx1)/2).attr("y",iy0+38).attr("text-anchor","middle").attr("font-size",11).attr("fill",INK).style("opacity",0).text(`+ reports →   (correlation ${rRepAll.toFixed(2)})`);
  const bandL = gSplit.append("path").attr("d",regBandPath("total_facilities",xFacL)).attr("fill",BLUE).attr("fill-opacity",0.13).attr("stroke","none").style("opacity",0);
  const bandR = gSplit.append("path").attr("d",regBandPath("total_with_reports",xRepR)).attr("fill",RED).attr("fill-opacity",0.13).attr("stroke","none").style("opacity",0);
  const regL = gSplit.append("line").attr("stroke",BLUE).attr("stroke-width",3).attr("stroke-linecap","round").attr("opacity",0);
  const regR = gSplit.append("line").attr("stroke",RED).attr("stroke-width",3).attr("stroke-linecap","round").attr("opacity",0);

  const gReg = svg.append("g");
  const bandSingle = gReg.append("path").attr("d",regBandPath("total_facilities",xFacFull)).attr("fill",BLUE).attr("fill-opacity",0.13).attr("stroke","none").style("opacity",0);
  const regProof = gReg.append("line").attr("stroke",GREEN).attr("stroke-width",3).attr("stroke-linecap","round").attr("opacity",0.92);
  function drawLine(sel, field, xscale, color) {
    const {slope,intercept,ex} = linreg(field);
    sel.transition().duration(D(950)).ease(EASE)
      .attr("x1",xscale(ex[0])).attr("y1",y(slope*ex[0]+intercept))
      .attr("x2",xscale(ex[1])).attr("y2",y(slope*ex[1]+intercept)).attr("stroke",color).attr("opacity",0.92);
  }

  const gScatter = svg.append("g");
  const dots = gScatter.selectAll("circle").data(dc).join("circle")
    .attr("cx",d=>xFacFull(d.total_facilities)).attr("cy",d=>y(d.current_jobs)).attr("r",0)
    .attr("fill",GREEN).attr("fill-opacity",0.62).attr("stroke","#faf7f1").attr("stroke-width",0.8).style("cursor","crosshair")
    .on("mousemove",(e,d)=>showTip(e,d)).on("mouseleave",hideTip);
  const gScatterR = svg.append("g").style("opacity",0);
  const dotsR = gScatterR.selectAll("circle").data(dc).join("circle")
    .attr("cx",d=>xRepR(d.total_with_reports)).attr("cy",d=>y(d.current_jobs)).attr("r",0)
    .attr("fill",RED).attr("fill-opacity",0.6).attr("stroke","#faf7f1").attr("stroke-width",0.8).style("cursor","crosshair")
    .on("mousemove",(e,d)=>showTip(e,d)).on("mouseleave",hideTip);

  // labels for the states worth calling out (the leaders + the big low-facility outlier)
  const labStates = dc.filter(d => d.total_facilities >= 6 || d.state_abbr === "CA");
  const gScatLab = svg.append("g").style("opacity",0).attr("pointer-events","none");
  gScatLab.selectAll("text").data(labStates).join("text")
    .attr("x",d=>xFacFull(d.total_facilities)).attr("y",d=>y(d.current_jobs)-11).attr("text-anchor","middle")
    .attr("font-size",10).attr("font-weight",600).attr("fill",INK)
    .attr("stroke","#fffdf9").attr("stroke-width",2.5).attr("paint-order","stroke").attr("stroke-linejoin","round")
    .text(d=>d.state_abbr);

  // ============================================================== BARS (interactive)
  const gBars = svg.append("g").style("opacity",0);
  const bx0=120, bx1=890, by0=H-64, by1=84;
  let barMode = "stacked";
  function renderBars(mode) {
    barMode = mode;
    gBars.selectAll("*").remove();

    if (mode === "stacked") {
      const top = [...dc].sort((a,b)=>(b.current_jobs+b.projected_new_jobs)-(a.current_jobs+a.projected_new_jobs)).slice(0,12);
      const xb = d3.scaleLinear().domain([0, d3.max(top,d=>d.current_jobs+d.projected_new_jobs)]).range([bx0, bx1-60]);
      const rowH=(by0-by1)/top.length, barH=rowH*0.6;
      gBars.append("rect").attr("x",bx0).attr("y",by1-34).attr("width",12).attr("height",12).attr("rx",2).attr("fill",BARCUR);
      gBars.append("text").attr("x",bx0+18).attr("y",by1-24).attr("font-size",11).attr("fill",INK).text("Current jobs");
      gBars.append("rect").attr("x",bx0+118).attr("y",by1-34).attr("width",12).attr("height",12).attr("rx",2).attr("fill",BARNEW).attr("fill-opacity",0.9);
      gBars.append("text").attr("x",bx0+136).attr("y",by1-24).attr("font-size",11).attr("fill",INK).text("Projected new by 2027");
      top.forEach((d,i)=>{
        const yy=by1+i*rowH;
        gBars.append("text").attr("x",bx0-10).attr("y",yy+barH/2).attr("dy","0.32em").attr("text-anchor","end").attr("font-size",11).attr("font-weight",600).attr("fill",INK).text(d.state_abbr);
        gBars.append("rect").attr("y",yy).attr("x",bx0).attr("height",barH).attr("rx",3).attr("fill",BARCUR).attr("width",0)
          .transition().duration(D(800)).ease(EASE).delay(D(i*45)).attr("width",xb(d.current_jobs)-bx0);
        gBars.append("rect").attr("y",yy).attr("x",xb(d.current_jobs)).attr("height",barH).attr("rx",3).attr("fill",BARNEW).attr("fill-opacity",0.9).attr("width",0)
          .transition().duration(D(800)).ease(EASE).delay(D(i*45+200)).attr("width",xb(d.current_jobs+d.projected_new_jobs)-xb(d.current_jobs));
        gBars.append("text").attr("x",xb(d.current_jobs+d.projected_new_jobs)+8).attr("y",yy+barH/2).attr("dy","0.32em").attr("font-size",10).attr("fill","#8d867c").attr("opacity",0).text(cfmt(d.current_jobs+d.projected_new_jobs))
          .transition().duration(D(400)).delay(D(i*45+650)).attr("opacity",1);
      });
    }

    else if (mode === "scatter") {
      const data = dc.filter(d=>d.total_facilities>0);
      const xs = d3.scaleLinear().domain([0,maxFac]).nice().range([bx0,bx1]);
      const ys = d3.scaleLinear().domain([0,maxJobs]).nice().range([by0,by1]);
      const rs = d3.scaleSqrt().domain([0,d3.max(dc,d=>d.projected_new_jobs)]).range([4,26]);
      ys.ticks(5).filter(t=>t>0).forEach(t=>{
        gBars.append("line").attr("x1",bx0).attr("x2",bx1).attr("y1",ys(t)).attr("y2",ys(t)).attr("stroke","#161512").attr("stroke-opacity",0.07);
        gBars.append("text").attr("x",bx0-10).attr("y",ys(t)).attr("dy","0.32em").attr("text-anchor","end").attr("font-size",10).attr("fill","#8d867c").text(kfmt(t));
      });
      gBars.append("text").attr("x",(bx0+bx1)/2).attr("y",by0+40).attr("text-anchor","middle").attr("font-size",12).attr("font-weight",600).attr("fill",INK).text("Data centers →");
      gBars.append("text").attr("x",bx1).attr("y",by1-18).attr("text-anchor","end").attr("font-size",10).attr("fill","#8d867c").text("bubble size = projected new jobs");
      gBars.selectAll("circle.sc").data(data).join("circle").attr("class","sc")
        .attr("cx",d=>xs(d.total_facilities)).attr("cy",d=>ys(d.current_jobs)).attr("r",0)
        .attr("fill",BARCUR).attr("fill-opacity",0.5).attr("stroke","#185FA5").attr("stroke-width",1).style("cursor","crosshair")
        .on("mousemove",(e,d)=>showTip(e,d)).on("mouseleave",hideTip)
        .transition().duration(D(800)).ease(d3.easeBackOut.overshoot(1.2)).delay((d,i)=>D(i*20)).attr("r",d=>rs(d.projected_new_jobs));
      gBars.selectAll("text.lbl").data(data.filter(d=>d.total_facilities>=4||d.current_jobs>20000)).join("text").attr("class","lbl")
        .attr("x",d=>xs(d.total_facilities)).attr("y",d=>ys(d.current_jobs)-rs(d.projected_new_jobs)-3).attr("text-anchor","middle")
        .attr("font-size",9).attr("font-weight",600).attr("fill",INK).attr("opacity",0).text(d=>d.state_abbr)
        .transition().duration(D(400)).delay(D(500)).attr("opacity",1);
    }

    else if (mode === "growth") {
      const g = dc.filter(d=>d.projected_new_jobs>0&&d.current_jobs>0)
        .map(d=>({...d, pct:Math.round(d.projected_new_jobs/d.current_jobs*100)}))
        .sort((a,b)=>b.pct-a.pct).slice(0,15);
      const xg = d3.scaleLinear().domain([0,d3.max(g,d=>d.pct)]).range([bx0,bx1-50]);
      const rowH=(by0-by1)/g.length, barH=rowH*0.62;
      gBars.append("text").attr("x",bx0).attr("y",by1-22).attr("font-size",11).attr("fill",INK).text("Projected new jobs as % of current base →");
      g.forEach((d,i)=>{
        const yy=by1+i*rowH;
        gBars.append("text").attr("x",bx0-10).attr("y",yy+barH/2).attr("dy","0.32em").attr("text-anchor","end").attr("font-size",11).attr("font-weight",600).attr("fill",INK).text(d.state_abbr);
        gBars.append("rect").attr("x",bx0).attr("y",yy).attr("height",barH).attr("rx",3).attr("fill","#534AB7").attr("fill-opacity",0.85).attr("width",0).style("cursor","crosshair")
          .on("mousemove",(e)=>showTip(e,d)).on("mouseleave",hideTip)
          .transition().duration(D(800)).ease(EASE).delay(D(i*40)).attr("width",xg(d.pct)-bx0);
        gBars.append("text").attr("x",xg(d.pct)+8).attr("y",yy+barH/2).attr("dy","0.32em").attr("font-size",10).attr("fill","#8d867c").attr("opacity",0).text(d.pct+"%")
          .transition().duration(D(400)).delay(D(i*40+500)).attr("opacity",1);
      });
    }
  }

  // ============================================================== MAP (interactive)
  const projFull = d3.geoAlbersUsa().fitExtent([[28,96],[W-28,H-92]], statesFC);
  const pathFull = d3.geoPath(projFull);
  const RAMP = ["#1a4a2e","#2d7a3a","#52b044","#a8d64a","#f5ec1a","#f5a623","#d94f2b"];
  const rFull = d3.scaleSqrt().domain([0,maxFac]).range([0,30]);

  // derived per-state map data
  const md = new Map();
  dc.forEach(d => {
    const popK = POP[d.state_abbr] || 1;
    md.set(nm(d), {
      row:d, jobs:d.current_jobs, reports:d.community_reports,
      op:d.facilities_operational, con:d.facilities_construction, prop:d.facilities_proposed,
      facTotal:d.total_facilities,
      jobsPer100k:+(d.current_jobs/popK*100).toFixed(1),
      reportsPer100k:+(d.community_reports/popK*100).toFixed(2)
    });
  });

  let heatMode="jobs", bubMode="facilities";
  const facSet = new Set(["op","con","prop"]);
  const heatVal = m => heatMode==="jobs" ? m.jobs : m.jobsPer100k;
  const bubVal = m => {
    if (bubMode==="reports") return m.reports;
    if (bubMode==="reportsPer100k") return m.reportsPer100k;
    let s=0; if(facSet.has("op"))s+=m.op; if(facSet.has("con"))s+=m.con; if(facSet.has("prop"))s+=m.prop; return s;
  };
  const bubColor = () => {
    if (bubMode!=="facilities") return PURPLE;
    const ks=[...facSet]; return ks.length===1 ? FACCOL[ks[0]] : FACCOL.all;
  };

  const gFull = svg.append("g").style("opacity",0);
  const fullPaths = gFull.append("g").selectAll("path").data(features).join("path")
    .attr("d",pathFull).attr("stroke","#fff").attr("stroke-width",0.6).attr("fill","#eceae4").style("cursor","crosshair")
    .on("mousemove",(e,f)=>showTip(e,(md.get(f.properties.name)||{}).row)).on("mouseleave",hideTip)
    .on("mouseover",function(e,f){ if(md.get(f.properties.name)) d3.select(this).raise().attr("stroke","#161512").attr("stroke-width",1.6); })
    .on("mouseout",function(){ d3.select(this).attr("stroke","#fff").attr("stroke-width",0.6); });
  const cents = features.map(f=>({c:pathFull.centroid(f), name:f.properties.name, m:md.get(f.properties.name)})).filter(o=>o.m&&o.c[0]);
  const fullBubbles = gFull.append("g").attr("pointer-events","none").selectAll("circle").data(cents).join("circle")
    .attr("cx",o=>o.c[0]).attr("cy",o=>o.c[1]).attr("r",0).attr("stroke","#fff").attr("stroke-width",1.1);

  const OFF = {"New Jersey":[22,2],"Delaware":[28,11],"Maryland":[38,22],"Connecticut":[26,-4],"Rhode Island":[32,7],"Massachusetts":[40,-11],"New Hampshire":[14,-18],"Vermont":[-6,-22]};
  const gLabels = gFull.append("g").attr("pointer-events","none");
  gLabels.selectAll("text").data(cents).join("text")
    .attr("x",o=>o.c[0]+(OFF[o.name]?OFF[o.name][0]:0)).attr("y",o=>o.c[1]+(OFF[o.name]?OFF[o.name][1]:0))
    .attr("text-anchor","middle").attr("dy","0.32em").attr("font-size",8.5).attr("font-weight",600)
    .attr("fill","#161512").attr("stroke","#fff").attr("stroke-width",2).attr("paint-order","stroke").attr("stroke-linejoin","round")
    .text(o=>o.m.row.state_abbr);

  const legHeat = gFull.append("g").attr("transform",`translate(${ix0},${H-26})`);
  const legBub  = gFull.append("g").attr("transform",`translate(${ix1-170},${H-30})`);
  function renderHeat() {
    const vals = cents.map(o=>heatVal(o.m)), lo=0, hi=d3.max(vals);
    const color = d3.scaleSequentialSqrt(d3.interpolateRgbBasis(RAMP)).domain([lo,hi]);
    fullPaths.transition("fill").duration(D(500)).attr("fill",f=>{const m=md.get(f.properties.name); return m?color(heatVal(m)):"#eceae4";});
    legHeat.selectAll("*").remove();
    legHeat.append("text").attr("x",0).attr("y",-8).attr("font-size",9.5).attr("letter-spacing",".1em").attr("fill","#8d867c").text(heatMode==="jobs"?"AI / DC JOBS":"JOBS PER 100K");
    d3.range(40).forEach(i=>legHeat.append("rect").attr("x",i*4).attr("y",0).attr("width",4).attr("height",9).attr("fill",color(lo+(hi-lo)*i/39)));
    legHeat.append("text").attr("x",0).attr("y",22).attr("font-size",9).attr("fill","#8d867c").text(heatMode==="jobs"?"0":f1(lo));
    legHeat.append("text").attr("x",160).attr("y",22).attr("text-anchor","end").attr("font-size",9).attr("fill","#8d867c").text(heatMode==="jobs"?kfmt(Math.round(hi/1000)*1000):f1(hi));
    return color;
  }
  function renderBub() {
    const maxV = d3.max(cents,o=>bubVal(o.m))||1;
    const r = d3.scaleSqrt().domain([0,maxV]).range([0,34]);
    const col = bubColor();
    fullBubbles.attr("fill",col).attr("fill-opacity",0.58).transition("r").duration(D(450)).attr("r",o=>r(bubVal(o.m)));
    legBub.selectAll("*").remove();
    let lab = bubMode==="reports" ? "COMMUNITY REPORTS" : bubMode==="reportsPer100k" ? "REPORTS / 100K"
      : facSet.size===3 ? "FACILITIES (all)" : [...facSet].map(k=>FACLAB[k].toUpperCase()).join(" + ");
    legBub.append("text").attr("x",90).attr("y",-12).attr("text-anchor","middle").attr("font-size",9.5).attr("letter-spacing",".08em").attr("fill","#8d867c").text(lab);
    const dec = bubMode==="reportsPer100k";
    let samples = dec ? [maxV/3,maxV*2/3,maxV].map(v=>+v.toFixed(1)) : maxV<=4 ? [1,maxV] : maxV<=12 ? [1,Math.round(maxV/2),Math.round(maxV)] : [Math.round(maxV/4),Math.round(maxV/2),Math.round(maxV)];
    let bx=0;
    samples.filter((v,i,a)=>v>0&&a.indexOf(v)===i).forEach(v=>{
      const rad=r(v);
      legBub.append("circle").attr("cx",bx+rad).attr("cy",24-rad).attr("r",rad).attr("fill",col).attr("fill-opacity",0.58).attr("stroke","#fff");
      legBub.append("text").attr("x",bx+rad).attr("y",38).attr("text-anchor","middle").attr("font-size",9).attr("fill","#8d867c").text(v);
      bx+=rad*2+20;
    });
  }
  function renderMap(){ renderHeat(); renderBub(); }

  // single state (bubble → shape)
  const topData = [...dc].sort((a,b)=>b.total_facilities-a.total_facilities)[0];
  const topFeat = features.find(f=>f.properties.name===nm(topData));
  const projOne = d3.geoAlbersUsa().fitExtent([[340,150],[620,470]], topFeat);
  const pathOne = d3.geoPath(projOne);
  const oneC = pathOne.centroid(topFeat);
  const jobColorStatic = d3.scaleSequentialSqrt(d3.interpolateRgbBasis(RAMP)).domain([0,maxJobs]);
  const gSingle = svg.append("g").style("opacity",0);
  const onePath = gSingle.append("path").attr("d",pathOne(topFeat)).attr("fill",jobColorStatic(topData.current_jobs)).attr("stroke","#fff").attr("stroke-width",1.4).style("opacity",0);
  const oneBubble = gSingle.append("circle").attr("cx",oneC[0]).attr("cy",oneC[1]).attr("r",0).attr("fill",BLUE).attr("fill-opacity",0.58).attr("stroke","#fff").attr("stroke-width",1.8).attr("filter","url(#soft)");
  const oneLabel = gSingle.append("text").attr("x",oneC[0]).attr("y",oneC[1]).attr("dy","0.32em").attr("text-anchor","middle").attr("font-size",24).attr("font-weight",800).attr("fill","#fff").style("opacity",0).text(topData.state_abbr);
  const oneCap = gSingle.append("text").attr("x",oneC[0]).attr("y",oneC[1]).attr("text-anchor","middle").attr("font-size",15).attr("font-weight",600).attr("fill",INK).style("opacity",0);

  // ============================================================== CONTROLS
  function clearControls(){ gcontrols.classed("on",false).html(""); }
  function mkRow(label){ const r=gcontrols.append("div").attr("class","gbtn-row"); r.append("span").attr("class","lbl").text(label); return r; }
  function mkBtn(row,label){ return row.append("button").attr("class","gbtn").text(label); }

  function barsControls(){
    gcontrols.html("").classed("on",true);
    const row = mkRow("VIEW");
    const opts = [["stacked","Most jobs"],["scatter","Data centers vs jobs"],["growth","Fastest growth"]];
    const btns = opts.map(([m,l])=>mkBtn(row,l).on("click",()=>{ renderBars(m); paint(); }));
    function paint(){ btns.forEach((b,i)=>b.classed("active",barMode===opts[i][0]).attr("aria-pressed",barMode===opts[i][0])); }
    paint();
  }
  function mapControls(){
    gcontrols.html("").classed("on",true);
    const r1 = mkRow("HEATMAP");
    const bJobs = mkBtn(r1,"Total jobs"), bJpc = mkBtn(r1,"Jobs / 100k");
    const r2 = mkRow("BUBBLES");
    const bFac = mkBtn(r2,"Data centers"), bRep = mkBtn(r2,"Reports"), bRpc = mkBtn(r2,"Reports / 100k");
    const r3 = mkRow("BY TYPE");
    const bOp = mkBtn(r3,"Existing"), bCon = mkBtn(r3,"Building"), bProp = mkBtn(r3,"Proposed");
    const setA=(b,on,c)=>b.classed("active",false).attr("aria-pressed",on).style("background",on?c:"#fff").style("border-color",on?c:"rgba(22,21,18,.12)").style("color",on?"#fff":"#5a6776");
    function paint(){
      setA(bJobs,heatMode==="jobs",GREEN); setA(bJpc,heatMode==="jobsPer100k",GREEN);
      setA(bFac,bubMode==="facilities",BLUE); setA(bRep,bubMode==="reports",PURPLE); setA(bRpc,bubMode==="reportsPer100k",PURPLE);
      [[bOp,"op"],[bCon,"con"],[bProp,"prop"]].forEach(([b,k])=>{ b.style("opacity",bubMode==="facilities"?1:0.45); setA(b,bubMode==="facilities"&&facSet.has(k),FACCOL[k]); });
    }
    bJobs.on("click",()=>{heatMode="jobs"; renderHeat(); paint();});
    bJpc.on("click",()=>{heatMode="jobsPer100k"; renderHeat(); paint();});
    bFac.on("click",()=>{bubMode="facilities"; if(facSet.size===0)["op","con","prop"].forEach(k=>facSet.add(k)); renderBub(); paint();});
    bRep.on("click",()=>{bubMode="reports"; renderBub(); paint();});
    bRpc.on("click",()=>{bubMode="reportsPer100k"; renderBub(); paint();});
    [[bOp,"op"],[bCon,"con"],[bProp,"prop"]].forEach(([b,k])=>b.on("click",()=>{ bubMode="facilities"; facSet.has(k)?facSet.delete(k):facSet.add(k); renderBub(); paint(); }));
    paint();
  }

  // ============================================================== SCENES
  const groups = {grid:gGrid, axis:gAxis, reg:gReg, scatter:gScatter, scatterR:gScatterR, scatLab:gScatLab, split:gSplit, bars:gBars, single:gSingle, full:gFull};
  function only(keys){
    const set=new Set(keys);
    for(const k in groups){ groups[k].transition("vis").duration(D(650)).ease(EASE).style("opacity",set.has(k)?1:0); groups[k].style("pointer-events",set.has(k)?null:"none"); }
  }

  let current=null;
  function render(scene){
    if(scene===current) return;
    const prev=current; current=scene;
    if(scene!=="bars" && scene!=="mapUS") clearControls();

    switch(scene){
      case "proof":
        only(["grid","axis","reg","scatter","scatLab"]); titleG.transition().duration(D(300)).style("opacity",1);
        setTitle("01","The hunch",GREEN); singleR.transition().duration(D(300)).style("opacity",0);
        bandSingle.interrupt().transition("band").duration(D(400)).style("opacity",0);
        dots.interrupt().transition().duration(D(950)).ease(EASE).delay((d,i)=>D(i*16))
          .attr("cx",d=>xFacFull(d.total_facilities)).attr("cy",d=>y(d.current_jobs)).attr("r",6).attr("fill",GREEN).attr("fill-opacity",0.62);
        drawLine(regProof,"total_facilities",xFacFull,GREEN);
        break;
      case "correlate":
        // dots fade back and the regression BAND grows in — this is the actual correlation graph
        only(["grid","axis","reg","scatter","scatLab"]); titleG.transition().duration(D(300)).style("opacity",1);
        setTitle("02","A weak link",BLUE);
        dots.interrupt().transition().duration(D(700)).ease(EASE)
          .attr("cx",d=>xFacFull(d.total_facilities)).attr("cy",d=>y(d.current_jobs)).attr("r",6).attr("fill",BLUE).attr("fill-opacity",0.26);
        drawLine(regProof,"total_facilities",xFacFull,BLUE);
        bandSingle.attr("fill",BLUE).interrupt().transition("band").duration(D(850)).delay(D(150)).style("opacity",1);
        singleR.text(`correlation ${rFacAll.toFixed(2)}`).transition().duration(D(500)).delay(D(500)).style("opacity",1);
        break;
      case "split":
        only(["grid","split","scatter","scatterR"]); titleG.transition().duration(D(250)).style("opacity",0);
        dots.interrupt().transition().duration(D(1000)).ease(EASE).delay((d,i)=>D(i*10))
          .attr("cx",d=>xFacL(d.total_facilities)).attr("cy",d=>y(d.current_jobs)).attr("r",5).attr("fill",BLUE).attr("fill-opacity",0.22);
        bandL.interrupt().transition("band").duration(D(850)).delay(D(300)).style("opacity",1);
        drawLine(regL,"total_facilities",xFacL,BLUE);
        dotsR.interrupt().attr("r",0).transition().duration(D(850)).ease(d3.easeBackOut.overshoot(1.3)).delay((d,i)=>D(300+i*14))
          .attr("cx",d=>xRepR(d.total_with_reports)).attr("cy",d=>y(d.current_jobs)).attr("r",5).attr("fill-opacity",0.22);
        bandR.interrupt().transition("band").duration(D(850)).delay(D(550)).style("opacity",1);
        rLabR.transition().duration(D(500)).delay(D(550)).style("opacity",1);
        drawLine(regR,"total_with_reports",xRepR,RED);
        break;
      case "bars":
        only(["bars"]); titleG.transition().duration(D(300)).style("opacity",1);
        setTitle("04","The leaders",GREEN);
        if(prev!=="bars") renderBars("stacked");
        barsControls();
        break;
      case "mapBubble":
        only(["single"]); titleG.transition().duration(D(300)).style("opacity",1);
        setTitle("05","One state",BLUE);
        onePath.interrupt().transition().duration(D(450)).style("opacity",0);
        oneBubble.interrupt().attr("cx",oneC[0]).attr("cy",oneC[1]).transition().duration(D(850)).ease(d3.easeBackOut.overshoot(1.4)).attr("r",92);
        oneLabel.interrupt().attr("x",oneC[0]).attr("y",oneC[1]).attr("font-size",46).text(topData.total_facilities)
          .transition().duration(D(600)).delay(D(250)).style("opacity",1);
        oneCap.interrupt().attr("y",oneC[1]+92+30).text(`data centers in ${nm(topData)}`)
          .transition().duration(D(500)).delay(D(450)).style("opacity",1);
        break;
      case "mapState": {
        only(["single"]); setTitle("06",nm(topData),BLUE);
        const rState = rFull(topData.total_facilities)*2.4+16;
        onePath.interrupt().transition().duration(D(800)).ease(EASE).style("opacity",1);
        oneBubble.interrupt().transition().duration(D(800)).ease(EASE).attr("r",rState);
        oneLabel.interrupt().attr("x",oneC[0]).attr("y",oneC[1]).attr("font-size",22).text(topData.state_abbr)
          .transition().duration(D(600)).delay(D(300)).style("opacity",1);
        oneCap.interrupt().attr("y",oneC[1]+rState+26).text(`${cfmt(topData.current_jobs)} jobs · ${topData.total_facilities} data centers`)
          .transition().duration(D(500)).delay(D(400)).style("opacity",1);
        break;
      }
      case "mapUS":
        only(["full"]); setTitle("07","All fifty states",GREEN);
        // paths stay at opacity 1; the whole gFull group fades in via only() — robust to re-fires
        fullPaths.interrupt().style("opacity",1);
        gLabels.interrupt().style("opacity",0).transition("fade").duration(D(600)).delay(D(550)).style("opacity",1);
        renderHeat();
        const maxV=d3.max(cents,o=>bubVal(o.m))||1, rr=d3.scaleSqrt().domain([0,maxV]).range([0,34]), col=bubColor();
        fullBubbles.attr("fill",col).attr("fill-opacity",0.58).interrupt().attr("r",0).transition("r").duration(D(750)).ease(d3.easeBackOut.overshoot(1.3)).delay((d,i)=>D(350+i*18)).attr("r",o=>rr(bubVal(o.m)));
        legBub.selectAll("*").remove();
        setTimeout(()=>{ if(current==="mapUS"){ renderBub(); mapControls(); } }, D(900));
        break;
    }
  }

  // ============================================================== STEPS
  const steps = [
    {scene:"proof", k:"01", h:"Start with a hunch", p:"Each dot is a state. Data centers run along the bottom, AI jobs up the side. The line points up, so more data centers usually means more jobs. It&rsquo;s messy, though: a few big states like California sit near the top with almost no data centers on record."},
    {scene:"correlate", k:"02", h:"It&rsquo;s a weak link", p:`Color the same dots and draw the trend. The link is real but loose &mdash; the correlation is only ${rFacAll.toFixed(2)}. Counting buildings by itself doesn&rsquo;t explain where the jobs are.`},
    {scene:"split", k:"03", h:"Add a second measure", p:`So split the chart in two. The left still counts data centers we have on record. The right adds the places people reported activity. The right side lines up much tighter, and the correlation climbs to ${rRepAll.toFixed(2)}.`},
    {scene:"bars", k:"04", h:"Who&rsquo;s ahead", p:"A pattern isn&rsquo;t a ranking. These are the states with the most AI jobs today, plus what they&rsquo;ve been promised by 2027. Use the buttons to re-sort by jobs, by data centers, or by growth."},
    {scene:"mapBubble", k:"05", h:"Down to one state", p:`This circle is one state&rsquo;s data centers. ${nm(topData)} has the most, at ${topData.total_facilities}. On its own, the number is hard to picture.`},
    {scene:"mapState", k:"06", h:"Put it on the map", p:`Here&rsquo;s ${nm(topData)}. Color shows its jobs, size shows its data centers.`},
    {scene:"mapUS", k:"07", h:"The whole country", p:"All fifty states. Green is jobs, blue circles are data centers. Switch the map to jobs per person, resize the circles by community reports or by type, or hover a state to read its numbers."}
  ];

  const stepsCol = root.append("div").attr("class","scrolly-steps");
  steps.forEach(s=>{ const d=stepsCol.append("div").attr("class","step").attr("data-scene",s.scene); const c=d.append("div").attr("class","step-card"); c.append("span").attr("class","step-k").text("Chapter "+s.k); c.append("h3").html(s.h); c.append("p").html(s.p); });

  const stepNodes = stepsCol.selectAll(".step").nodes();
  const strip = h => h.replace(/&rsquo;/g,"’").replace(/&mdash;/g,"—").replace(/&[a-z]+;/g,"");

  // Chapter rail — clickable dots, one per scene, so readers can place themselves and jump.
  const rail = root.append("div").attr("class","chapter-rail").attr("aria-label","Chapters");
  const railDots = steps.map((s,i)=> rail.append("button").attr("class","rail-dot").attr("type","button")
    .attr("aria-label",`Chapter ${s.k}: ${strip(s.h)}`)
    .on("click",()=>{ const st=stepNodes[i]; const top=st.getBoundingClientRect().top+scrollY-(innerHeight-st.offsetHeight)/2;
      scrollTo({top, behavior: RM?"auto":"smooth"}); }));

  render("proof");
  if(stepNodes[0]) stepNodes[0].classList.add("is-active");

  // Single source of truth: whichever step is nearest the reading line wins.
  // (On mobile the graphic is pinned up top, so the reading line sits lower.)
  let ticking=false;
  function update(){
    ticking=false;
    const max=document.documentElement.scrollHeight-innerHeight;
    progress.style("width",(max>0?(scrollY/max)*100:0)+"%");
    const ref = innerHeight*(innerWidth<=860 ? 0.72 : 0.5);
    let best=null, bi=0, bd=Infinity;
    stepNodes.forEach((n,i)=>{ const r=n.getBoundingClientRect(); const c=r.top+r.height/2; const d=Math.abs(c-ref); if(d<bd){ bd=d; best=n; bi=i; } });
    if(best){ stepNodes.forEach(n=>n.classList.toggle("is-active",n===best)); railDots.forEach((dot,i)=>dot.classed("active",i===bi));
      svg.attr("aria-label", strip(steps[bi].h)+". "+strip(steps[bi].p)); render(best.dataset.scene); }
  }
  addEventListener("scroll", ()=>{ if(!ticking){ ticking=true; requestAnimationFrame(update); } }, {passive:true});
  update();

  return root.node();
})());
```

<style>
:root {
  --jd-ink:#161512; --jd-ink-soft:#48443e; --jd-muted:#8d867c;
  --jd-paper:#faf7f1; --jd-card:#fffdf9; --jd-line:rgba(22,21,18,.10);
  --jd-accent:#1c6b46;
  --jd-display:"Exo 2",system-ui,-apple-system,sans-serif;
  --jd-sans:"Inter",system-ui,-apple-system,sans-serif;
}
html, body { background: var(--jd-paper); }
body { font-family: var(--jd-sans); color: var(--jd-ink); -webkit-font-smoothing:antialiased; }
#observablehq-main { max-width: none; }

.scroll-progress { position:fixed; top:0; left:0; height:3px; width:0; background:var(--jd-accent); z-index:50; transition:width .1s linear; }

.jd-hero { text-align:center; margin:4rem auto 2rem; max-width:42em; }
.jd-hero .kicker { font:600 12px/1 var(--jd-sans); letter-spacing:.3em; text-transform:uppercase; color:var(--jd-accent); }
.jd-hero h1 { font-family:var(--jd-display); font-weight:900; font-size:clamp(2.6rem,7vw,4.8rem); line-height:.98; letter-spacing:-.025em; margin:.35em 0 .35em; color:var(--jd-ink); max-width:none; background:none; -webkit-text-fill-color:currentColor; }
.jd-hero p { font:400 1.18rem/1.6 var(--jd-sans); color:var(--jd-ink-soft); margin:0 auto; max-width:34em; }
.jd-hero .flourish { width:46px; height:3px; background:var(--jd-accent); margin:1.7rem auto 1.4rem; border-radius:2px; }
.jd-hero .down { font:600 11px var(--jd-sans); letter-spacing:.25em; text-transform:uppercase; color:var(--jd-muted); animation:bob 1.8s ease-in-out infinite; display:inline-block; }
@keyframes bob { 0%,100%{transform:translateY(0);} 50%{transform:translateY(5px);} }

.scrolly { display:grid; grid-template-columns:1.35fr 1fr; gap:2rem; position:relative; }
.scrolly-graphic { position:relative; }
.gsticky { position:sticky; top:0; height:100vh; display:flex; align-items:center; justify-content:center; }
.gcard { position:relative; width:100%; background:var(--jd-card); border:1px solid var(--jd-line); border-radius:20px;
  padding:0.9rem; box-shadow:0 1px 2px rgba(22,21,18,.05), 0 40px 80px -50px rgba(22,21,18,.6); max-height:90vh; display:flex; flex-direction:column; }
.gcard svg { flex:1; min-height:0; max-height:80vh; }
.gtip { position:absolute; pointer-events:none; opacity:0; transform:translate(-50%,-100%); background:#fff; border:1px solid var(--jd-line);
  border-radius:10px; padding:7px 11px; font:500 12px/1.4 var(--jd-sans); color:var(--jd-ink); white-space:nowrap; box-shadow:0 14px 36px rgba(22,21,18,.18); transition:opacity .12s; z-index:5; }
.gtip b { font-family:var(--jd-display); font-weight:600; font-size:13px; }
.scroll-hint { position:absolute; bottom:4.5vh; left:50%; transform:translateX(-50%); font:600 10px var(--jd-sans); letter-spacing:.25em; text-transform:uppercase; color:var(--jd-muted); animation:bob 1.8s ease-in-out infinite; }

.gcontrols { display:flex; flex-direction:column; gap:5px; padding:4px 4px 9px; opacity:0; max-height:0; overflow:hidden; transition:opacity .35s ease; }
.gcontrols.on { opacity:1; max-height:160px; }
.gbtn-row { display:flex; gap:6px; align-items:center; flex-wrap:wrap; }
.gbtn-row .lbl { font:600 10px var(--jd-sans); letter-spacing:.16em; color:var(--jd-muted); min-width:70px; }
.gbtn { font:500 11px var(--jd-sans); cursor:pointer; border:1px solid var(--jd-line); border-radius:999px; padding:4px 12px; background:#fff; color:#5a6776; transition:background .15s, color .15s, border-color .15s; }
.gbtn:hover { border-color:rgba(22,21,18,.28); }
.gbtn.active { background:var(--jd-accent); border-color:var(--jd-accent); color:#fff; }
.gbtn:focus-visible { outline:2px solid var(--jd-accent); outline-offset:2px; }

.jd-teaser { font:500 1rem/1.55 var(--jd-sans); color:var(--jd-ink-soft); margin:1.1rem auto 0; max-width:30em; }

.chapter-rail { position:fixed; right:20px; top:50%; transform:translateY(-50%); display:flex; flex-direction:column; gap:11px; z-index:40; }
.rail-dot { width:10px; height:10px; border-radius:50%; border:1.6px solid rgba(22,21,18,.3); background:transparent; padding:0; cursor:pointer;
  transition:transform .25s ease, background .25s ease, border-color .25s ease; }
.rail-dot:hover { border-color:var(--jd-accent); transform:scale(1.3); }
.rail-dot.active { background:var(--jd-accent); border-color:var(--jd-accent); transform:scale(1.35); }
.rail-dot:focus-visible { outline:2px solid var(--jd-accent); outline-offset:3px; }

.scrolly-steps { padding:30vh 0 36vh; }
.step { min-height:92vh; display:flex; align-items:center; }
.step-card { background:var(--jd-card); border:1px solid var(--jd-line); border-left:3px solid transparent; border-radius:16px; padding:1.8rem 2rem; max-width:31em;
  box-shadow:0 1px 2px rgba(22,21,18,.04), 0 24px 48px -34px rgba(22,21,18,.45);
  opacity:.34; transform:translateY(14px) scale(.985); filter:saturate(.7); transition:opacity .55s ease, transform .55s ease, border-color .55s ease, filter .55s ease; }
.step.is-active .step-card { opacity:1; transform:none; filter:none; border-left-color:var(--jd-accent); }
.step-k { font:600 11px var(--jd-sans); letter-spacing:.2em; text-transform:uppercase; color:var(--jd-accent); }
.step-card h3 { font-family:var(--jd-display); font-weight:600; font-size:clamp(1.6rem,2.6vw,2.15rem); letter-spacing:-.012em; margin:.5rem 0 .75rem; color:var(--jd-ink); }
.step-card p { font:400 1.08rem/1.72 var(--jd-sans); color:var(--jd-ink-soft); margin:0; }
.step-card p em { font-style:normal; color:var(--jd-accent); font-weight:600; }

.jd-outro { text-align:center; margin:3rem auto 6rem; max-width:40em; }
.jd-outro h2 { font-family:var(--jd-display); font-weight:600; font-size:clamp(1.7rem,3vw,2.3rem); color:var(--jd-ink); }
.jd-outro p { font:400 1.1rem/1.7 var(--jd-sans); color:var(--jd-ink-soft); }
.jd-outro a { color:var(--jd-accent); font-weight:600; text-underline-offset:2px; }

@media (max-width:860px) {
  .scrolly { display:block; }
  /* display:contents removes the wrapper box so the sticky graphic's containing
     block becomes the tall .scrolly — otherwise it only sticks for its own height. */
  .scrolly-graphic { display:contents; }
  .gsticky { height:48vh; top:0; background:var(--jd-paper); z-index:2; }
  .gcard { max-height:46vh; }
  .gcard svg { max-height:38vh; }
  .gcontrols.on { max-height:128px; }
  .gbtn { padding:3px 9px; font-size:10px; }
  .gbtn-row { gap:4px; }
  .gbtn-row .lbl { min-width:54px; font-size:9px; }
  .scrolly-steps { padding:0 0 30vh; position:relative; z-index:1; }
  .step { min-height:84vh; }
  .step-card { margin:0 auto; }
  .chapter-rail { display:none; }
}
@media (prefers-reduced-motion: reduce) { .jd-hero .down, .scroll-hint { animation:none; } }
</style>

<section class="jd-outro">
  <div class="flourish" style="margin:0 auto 1.6rem;width:46px;height:3px;background:var(--jd-accent);border-radius:2px;"></div>
  <h2>So: where data centers land, jobs mostly follow.</h2>
  <p>The link is clear once you measure it right. Dig deeper on the <a href="./explore-page-demo">map</a>, the full <a href="./analytics-page-demo">analytics</a>, or the <a href="./analytics-page-demo#the-raw-numbers">raw numbers</a>. Sources: U.S. Bureau of Labor Statistics (2025), Visual Capitalist, and community reports.</p>
</section>
