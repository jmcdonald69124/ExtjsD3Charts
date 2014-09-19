ExtjsD3Charts
=============

If you are into data visualization and developing in JavaScript then you have probably heard of d3js which can be found at d3js.org, you may not have heard about NVD3 which is a nice open source group of reusable charts based on d3js created by developers for the financial industry. You can find NVD3 here http://nvd3.org/ . What these two chart packages do is allow you, the developer, to control every last pixel on the screen. You are also left with code that can be moved away from Extjs if that day comes. Just take a look at the examples page to realize how many possibilities there are when it comes to charting: https://github.com/mbostock/d3/wiki/Gallery. I needed to get that type of flexibility in my application and I liked the crisp sharp lines so I went ahead and threw together some NVD3 / D3 based widgets that you can use in your applications by simply adding them and referencing the xtype. I am assuming that you will be using extjs 5 so the instructions here are for installation in an extjs5 application – that said they should work with extjs4 as well.

<h2>Getting Started:</h2>
<h3>Add d3 and nv.d3 to your build.</h3>
<ul>
<li>First download d3.min.js and nv.d3.min.js.</li>
<li>Create a folder named js under your resources folder</li>
<li>Place the files in the new js folder</li>
<li>Change the lines in your app.json file below to include the new js files into your build</li>
</ul>

<pre>
    "js": [
        {
            "path": "app.js",
            "bundle": true
        },{
            "path": "resources/js/d3.min.js",
            "bundle": false
        },{
            "path": "resources/js/nv.d3.min.js",
            "bundle": false
        }
    ],
</pre>

<h3>Add nv.d3.min.css to your application</h3>
<ul>
<li>Download the nvd3 css file</li>
<li>Create a folder named css under your resources folder</li>
<li>Place the file in the new css folder</li>
<li>Change the lines in your app.json file below to include the new css files into your build</li>
</ul>

<pre>
    "css": [
        {
            "path": "bootstrap.css",
            "bootstrap": true
        },{
            "path": "resources/css/nv.d3.css",
            "bootstrap": false
        }
    ],
</pre>

<h3>Create a widget folder at the same level as the app folder. </h3>

<h4>D3Donutpanel</h4>

<strong>Config options</strong>
<ul>
    <li>dataUrl		: (string) - url of json data for the chart, json should be in the following format, label and value are required, any attached data points will get passed to the click event i.e. primary keys etc ..
        <pre>{'results': 1, 'data':[{'some_value': 'not required', 'label': 'Required', 'value': 17}]}</pre></li>
    <li>chartTitle	: (string) - chart title displayed above the chart</li>
    <li>tooltipAppend	: (string) - text to append to the tooltip value</li>
    <li>showTotal	: (boolean) - show total in the center of the chart</li>
    <li>totalType	: ‘sum’ or ‘avg’ calculate the total values as the sum of all values that are shown or the average of all shown values.</li>
</ul>