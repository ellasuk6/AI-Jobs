---
toc: false
theme: dashboard
title: AI's Impact on Jobs
---

<div class="hero">
  <h1>AI&#x27;s Impact on Jobs</h1>
  <h2>How Data Centers and AI are Changing Jobs As We Know It.</h2>
  <a href="https://observablehq.com/framework/getting-started">Get started<span style="display: inline-block; margin-left: 0.25rem;">↗︎</span></a>
</div>
<div class = "card">

```js
const dcJobs = await FileAttachment("dcJobs.csv").csv({typed: true});
```

```js 
const selectedView = view(Inputs.radio(
  ["Facilities vs jobs", "Top states — stacked", "Growth leaders"],
  {value: "Facilities vs jobs", label: "Chart view"}
))
```

```js
{
  const sorted = [...dcJobs].sort((a, b) =>
    (b.jobs + b.newJobs) - (a.jobs + a.newJobs)
  );
  const top20 = sorted.slice(0, 20);

  if (selectedView === "Facilities vs jobs") {
    display(Plot.plot({
      title: "Data center facilities vs current AI jobs by state",
      width,
      height: 420,
      marginLeft: 60,
      marginBottom: 40,
      x: { label: "Total data center facilities →", grid: true },
      y: {
        label: "↑ Current AI/DC jobs (BLS 2025)", grid: true,
        tickFormat: d => d >= 1000 ? (d/1000) + "k" : d
      },
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
    }));
  } else if (selectedView === "Top states — stacked") {
    display(Plot.plot({
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
          { name: d.name, type: "Current jobs",  value: d.jobs    },
          { name: d.name, type: "Projected new", value: d.newJobs }
        ]), {
          x: "value",
          y: "name",
          fill: "type",
          sort: { y: "-x" },
          tip: true
        })
      ]
    }));
  } else {
    const growthStates = dcJobs
      .filter(d => d.newJobs > 0 && d.jobs > 0)
      .map(d => ({ ...d, growthPct: Math.round(d.newJobs / d.jobs * 100) }))
      .sort((a, b) => b.growthPct - a.growthPct)
      .slice(0, 15);

    display(Plot.plot({
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
    }));
  }
}
```
</div>
  
</div>

---

## Our Goal

There has been a lot of discussion around AI stealing jobs or how AI will negatively impact employment. This project is to show how data centers and AI can have a positive impact on employment and the economy surrounding the environment.

<div class="grid grid-cols-4">
  <div class="card">
    Chart your own data using <a href="https://observablehq.com/framework/lib/plot"><code>Plot</code></a> and <a href="https://observablehq.com/framework/files"><code>FileAttachment</code></a>. Make it responsive using <a href="https://observablehq.com/framework/javascript#resize(render)"><code>resize</code></a>.
  </div>
  <div class="card">
    Create a <a href="https://observablehq.com/framework/project-structure">new page</a> by adding a Markdown file (<code>whatever.md</code>) to the <code>src</code> folder.
  </div>
  <div class="card">
    Add a drop-down menu using <a href="https://observablehq.com/framework/inputs/select"><code>Inputs.select</code></a> and use it to filter the data shown in a chart.
  </div>
  <div class="card">
    Write a <a href="https://observablehq.com/framework/loaders">data loader</a> that queries a local database or API, generating a data snapshot on build.
  </div>
  <div class="card">
    Import a <a href="https://observablehq.com/framework/imports">recommended library</a> from npm, such as <a href="https://observablehq.com/framework/lib/leaflet">Leaflet</a>, <a href="https://observablehq.com/framework/lib/dot">GraphViz</a>, <a href="https://observablehq.com/framework/lib/tex">TeX</a>, or <a href="https://observablehq.com/framework/lib/duckdb">DuckDB</a>.
  </div>
  <div class="card">
    Ask for help, or share your work or ideas, on our <a href="https://github.com/observablehq/framework/discussions">GitHub discussions</a>.
  </div>
  <div class="card">
    Visit <a href="https://github.com/observablehq/framework">Framework on GitHub</a> and give us a star. Or file an issue if you’ve found a bug!
  </div>
</div>

<style>

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: var(--sans-serif);
  margin: 4rem 0 8rem;
  text-wrap: balance;
  text-align: center;
}

.hero h1 {
  margin: 1rem 0;
  padding: 1rem 0;
  max-width: none;
  font-size: 14vw;
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(30deg, var(--theme-foreground-focus), currentColor);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero h2 {
  margin: 0;
  max-width: 34em;
  font-size: 20px;
  font-style: initial;
  font-weight: 500;
  line-height: 1.5;
  color: var(--theme-foreground-muted);
}

@media (min-width: 640px) {
  .hero h1 {
    font-size: 90px;
  }
}

</style>
