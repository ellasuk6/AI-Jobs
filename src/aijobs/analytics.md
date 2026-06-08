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

## Growth Tables

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

