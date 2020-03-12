var opts = {
lines: 0.6,
  angle: -0.2,
  lineWidth: 0.4,
  pointer: {
    length: 0.15,
    strokeWidth: 0.07,
    color: '#909090  '
  },

  limitMax: 'true', 
  percentColors: [[0.0, "#FF4B57" ], [0.40, "#EBEB3A"], [0.48, "#5ACF40"], [0.481, '#FFF'], [0.52, "#EBEB3A"], [0.60, "#FF4B57"]],
  strokeColor: '#E0E0E0',
  generateGradient: true,
highDpiSupport: true,     // High resolution support

};
var target = document.getElementById('foo'); // your canvas element
var gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
var count = 0
gauge.maxValue = 300; // set max gauge value
gauge.setMinValue(0);  // Prefer setter over gauge.minValue = 0
gauge.animationSpeed = 50; // set animation speed (32 is default value)
gauge.set(200); // set actual value



