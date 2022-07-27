const template = document.createElement('template');

template.innerHTML = `
<style>
.container {
   position: absolute;
   left: 0;
   top: 0;
   right: 0;
   height: 100%;
   background-color: rgb(255, 255, 255, 0.6);
}

</style>
<div class="container"></div>
`;

customElements.define('ph-graph', class GraphElement extends HTMLElement {

   #data = null;

   $(selector) {
      return this.shadowRoot && this.shadowRoot.querySelector(selector)
   }

   $$(selector) {
      return this.shadowRoot && this.shadowRoot.querySelectorAll(selector)
   }

   constructor() {
      // Do something with the arguments
      super();
      // Normally you are adding the template
      const root = this.attachShadow({ mode: 'open' })
      root.appendChild(template.content.cloneNode(true));
   }

   connectedCallback() {
      //this.shadowRoot.addEventListener('jobexpand', (e) => console.log(e));
   }

   set data(value) {
      // It's a GeoJSON payload so convert it to an array.
      let min = "9999-00-00";
      let max = "0000-00-00";

      let data = value.features.reduce((acc, feature) => {

         let date = feature.properties.time_point.split("T")[0];
         min = min < date ? min : date;
         max = max > date ? max : date;

         if (!acc[date]) {
            acc[date] = 0;
         }
         acc[date]++;
         return acc;
      }, {});

      let result = [];
      let it = dater(min, max);
      let entry = it.next();
      while (!entry.done) {
         let realData = data[entry.value];
         result.push({ date: entry.value, value: realData ? realData : 0 });
         entry = it.next();
      }

      this.#data = result;

      let container = this.$(".container");

      if (!value) {
         container.setAttribute("hidden", "hidden");
      } else {
         container.removeAttribute("hidden");
         this.render();
      }
   }

   render() {
      let dateRange = this.dateRange = {};

      let endZoom = ev => {
         const xz = ev.transform.rescaleX(x);
         dateRange.start = reverseGregorian(xz.domain()[0]);
         dateRange.end = reverseGregorian(xz.domain()[1]);
         this.dispatchEvent(new CustomEvent('changedates', { detail: dateRange}));
      }

      const div = this.$(".container");
      const data = this.#data;
      const height = div.clientHeight;
      const width = div.clientWidth;
      const margin = { top: 20, right: 10, bottom: 30, left: 30 };

      const zoom = d3.zoom()
         .scaleExtent([1, 54])
         .extent([[margin.left, 0], [width - margin.right, height]])
         .translateExtent([[margin.left, -Infinity], [width - margin.right, Infinity]])
         .on("zoom", zoomed).on("end", endZoom);

      const svg = d3.select(div).append("svg")
         .attr("viewBox", [0, 0, width, height]);


      const clip = uid("clip");

      svg.append("clipPath")
         .attr("id", clip.id)
         .append("rect")
         .attr("x", margin.left)
         .attr("y", margin.top)
         .attr("width", width - margin.left - margin.right)
         .attr("height", height - margin.top - margin.bottom);

      let x = d3.scaleUtc()
         .domain(d3.extent(data, d => new Date(d.date)))
         .range([margin.left, width - margin.right]);

      let y = d3.scaleSqrt()
         .domain([0, d3.max(data, d => d.value)]).nice()
         .range([height - margin.bottom, margin.top]);


      let area = (data, x) => d3.area()
         .curve(d3.curveStepAfter)
         .x(d => x(new Date(d.date)))
         .y0(y(0))
         .y1(d => y(d.value))(data);


      let xAxis = (g, x) => g
         .attr("transform", `translate(0,${height - margin.bottom})`)
         .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

      let yAxis = g => g
         .attr("transform", `translate(${margin.left},0)`)
         .call(d3.axisLeft(y))
         .call(g => g.select(".domain").remove())
         .call(g => g.select(".tick:last-of-type text").clone()
            .attr("x", 3)
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text(data.y));

      const path = svg.append("path")
         .attr("clip-path", clip)
         .attr("fill", "steelblue")
         .attr("d", area(data, x));

      const gx = svg.append("g")
         .call(xAxis, x);

      dateRange.start = x.domain()[0];
      dateRange.end = x.domain()[1];

      svg.append("g")
         .call(yAxis);

      svg.call(zoom)
         .transition()
         .duration(750);


      function zoomed(event) {
         const xz = event.transform.rescaleX(x);
         path.attr("d", area(data, xz));
         let r = gx.call(xAxis, xz);
         
      }

      return svg.node();
   }
});


function reverseGregorian(date) {
   return date.getFullYear() + "-" +
      String(date.getMonth() + 1).padStart(2, 0) + "-" +
      String(date.getDate()).padStart(2, 0);
}

function* dater(start, end) {

   let startDate = new Date(start);
   let endStr = end.substr(0, 10);

   let current = reverseGregorian(startDate);

   while (current <= endStr) {
      yield current;
      startDate.setDate(startDate.getDate() + 1);
      current = reverseGregorian(startDate);
   }
}

let ID = 0;
function uid(param) {
   ID++;
   return param + ID;
}
