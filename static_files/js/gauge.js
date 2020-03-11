var opts = {
angle: 0, // The span of the gauge arc
lineWidth: 0.2, // The line thickness
radiusScale: 0.89, // Relative radius
pointer: {
length: 0.54, // // Relative to gauge radius
strokeWidth: 0.053, // The thickness
color: '#000000' // Fill color
},
limitMax: false,     // If false, max value increases automatically if value > maxValue
limitMin: false,     // If true, the min value of the gauge will be fixed
colorStart: '#6FADCF',   // Colors
colorStop: '#8FC0DA',    // just experiment with them
strokeColor: '#E0E0E0',  // to see which ones work best for you
generateGradient: true,
highDpiSupport: true,     // High resolution support
staticZones: [
{strokeStyle: "#00FF00", min: 0, max: 60}, // Red from 100 to 60
{strokeStyle: "#0000FF", min: 60, max: 150}, // Yellow
{strokeStyle: "#00FFFF", min: 150, max: 220}, // Green
{strokeStyle: "#FFDD00", min: 220, max: 260}, // Yellow
{strokeStyle: "#FF0000", min: 260, max: 300}  // Red
],
};
var target = document.getElementById('foo'); // your canvas element
var gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
gauge.maxValue = 300; // set max gauge value
gauge.setMinValue(0);  // Prefer setter over gauge.minValue = 0
gauge.animationSpeed = 50; // set animation speed (32 is default value)
gauge.set(90); // set actual value
var pvalue = document.getElementById('data').innerHTML
document.getElementById('data2').innerHTML = pvalue
gval = parseInt(pvalue)
gauge.set(gval); // set actual value
