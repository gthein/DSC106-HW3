'use strict';

const JSONFileName = 'https://raw.githubusercontent.com/gthein/DSC106-HW3/master/assets/springfield.json';

//holder for the current datetime
var currdate;
var entrydate;

//formulate how we want to make our pie chart
var pieChart = {
    chart: {
        renderTo: 'toggleGrid',
        className: 'toggleGrid',
        type: 'pie',
        backgroundColor: 'transparent',
        animation: false
    },
    plotOptions: {
        pie: {
            innerSize: '50%',
            size: '75%',
            dataLabels: {
                enabled: false
            }
        },
        series: {
            animation: false
        }
    },
    title: {
        align: 'center',
        verticalAlign: 'middle',
        text: '',
        style: {
            fontSize: '13px'
        }
    },
    xAxis: {
        visible: false,
    },
    yAxis: {
        visible: false,
    },
    credits: {
        enabled: false,
    },
    series: [{
        name: 'Energy',
        colorByPoint: true,
        data: []
    }]
};

var pieChart = {
    chart: {
        renderTo: document.getElementById('toggleGrid'),
        className: 'toggleGrid',
        type: 'pie',
        backgroundColor: 'transparent',
        animation: false
    },
    plotOptions: {
        pie: {
            innerSize: '50%',
            size: '75%',
            dataLabels: {
                enabled: false
            }
        },
        series: {
            animation: false
        }
    },
    title: {
        align: 'center',
        verticalAlign: 'middle',
        text: '',
        style: {
            fontSize: '13px'
        }
    },
    credits: {
        enabled: false,
    },
    series: [{
        name: 'Energy',
        colorByPoint: true,
        data: []
    }]
};

var colors = {
    'black_coal': '#000000', 
    'distillate': '#DC143C', 
    'gas_ccgt': '#FF7F50',
    'hydro': '#00BFFF',
    'wind': '#8FBC8F',
    'exports': '#9370DB',
    'pumps': '#0000CD'
};

//holders for toggle grid and sum of pie/bar data
var toggleGrid;
var sumpie;
var sum=0;

function fillPie(idx, data) {
    var piefill = data['name'].map( function (elt, fillIdx) {
        if (data.name !== "exports" & data.name !== "pumps") {
            return {
                name: elt.split('.')[elt.split('.').length - 1],
                y: Energy['data'][fillIdx][idx],
                color: colors[elt.split('.')[elt.split('.').length - 1]]
            }
        }  
    });

    sumpie=0;
    pieChart.series[0].data = piefill;
    for (var i = 0; i < pieChart.series[0].data.length; i++) {
        sumpie += pieChart.series[0].data[i].y
    }
    pieChart.title.text = Math.round(sumpie) + ' MW';
    toggleGrid = Highcharts.chart(pieChart);
    
}
//holder for current price and temp
var currPrice;
var currTemp;
//function to get the total load energy data
function getLegendInfo(idx) {
    sum = 0
    for (var i = 0; i < 2; i++) {
        sum += nonpower['data'][i][idx];
    }
    currPrice = nonpower['data'][2][idx];
    currTemp = nonpower['data'][4][idx]

}

var totalPower; 
function updateLegend(idx) {
    getLegendInfo(idx);
    totalPower = sumpie + sum;
    document.getElementById("sourcet").innerHTML = sumpie.toFixed(2);
    document.getElementById('avgprice').innerHTML = "$"+ currPrice.toFixed(2);
    document.getElementById("windpwr").innerHTML = Energy.data[0][idx].toFixed(2)
    document.getElementById("windcnt").innerHTML = ((Energy.data[0][idx] / totalPower) * 100).toFixed(2) + "%"
    document.getElementById("hydpwr").innerHTML = Energy.data[1][idx].toFixed(2)
    document.getElementById("hydcnt").innerHTML = ((Energy.data[1][idx] / totalPower) * 100).toFixed(2) + "%"
    document.getElementById("gaspwr").innerHTML = Energy.data[2][idx].toFixed(2)
    document.getElementById("gascnt").innerHTML = ((Energy.data[2][idx] / totalPower) * 100).toFixed(2) + "%"
    document.getElementById("distpwr").innerHTML = Energy.data[3][idx].toFixed(2)
    document.getElementById("distcnt").innerHTML = ((Energy.data[3][idx] / totalPower) * 100).toFixed(2) + "%"
    document.getElementById("coalpwr").innerHTML = Energy.data[4][idx].toFixed(2)
    document.getElementById("coalcnt").innerHTML = ((Energy.data[4][idx] / totalPower) * 100).toFixed(2) + "%"
    document.getElementById("loadpwr").innerHTML = sum.toFixed(2);
    document.getElementById("exppwr").innerHTML = nonpower.data[1][idx].toFixed(2)
    document.getElementById("expcnt").innerHTML = ((nonpower.data[1][idx] / totalPower) * 100).toFixed(2) + "%"
    document.getElementById("pmpwr").innerHTML = nonpower.data[0][idx].toFixed(2)
    document.getElementById("pmcnt").innerHTML = ((nonpower.data[0][idx] / totalPower) * 100).toFixed(2) + "%"
    document.getElementById("netpwr").innerHTML = totalPower.toFixed(2)
    var renewables = (((Energy.data[0][idx] / totalPower) + (Energy.data[1][idx] / totalPower)) * 100)
    document.getElementById("rencnt").innerHTML = renewables.toFixed(2) + "%"
}


function getcurrdate(idx) {
    var start = (1571579700+ 5 * 60)*1000
    currdate= start + (idx*5 * 60000)
    entrydate = Highcharts.dateFormat('%d %a %I:%M %p', currdate)
}

['mouseleave'].forEach(function (eventType) {
document.getElementById('sharedGrid').addEventListener(
    eventType,
    function (e) {
        var chart,
            point,
            i,
            event;
        
            for (i = 0; i < Highcharts.charts.length; i = i + 1) {
                chart = Highcharts.charts[i];
                event = chart.pointer.normalize(e);
                point = chart.series[0].searchPoint(event, true);
                
                if (point) {
                    point.onMouseOut(); 
                    chart.tooltip.hide(point);
                    chart.xAxis[0].hideCrosshair(); 
                }
            }
        }
    )
});

['mousemove', 'touchmove', 'touchstart'].forEach(function (eventType) {
document.getElementById('sharedGrid').addEventListener(
    eventType,
    function (e) {
        var chart,
            point,
            i,
            event,
            idx;

        for (i = 0; i < Highcharts.charts.length; i = i + 1) {
            chart = Highcharts.charts[i];
            // Find coordinates within the chart
            event = chart.pointer.normalize(e);
            // Get the hovered point
            point = chart.series[0].searchPoint(event, true);
            idx = chart.series[0].data.indexOf( point );

            if (point) {
                point.highlight(e);
                fillPie(idx, Energy);
                updateLegend(idx);
                getcurrdate(idx);
            }
        }
    }
);
});

/**
* Highlight a point by showing tooltip, setting hover state and draw crosshair
*/
Highcharts.Point.prototype.highlight = function (event) {
    event = this.series.chart.pointer.normalize(event);
    this.onMouseOver(); // Show the hover marker
    this.series.chart.tooltip.refresh(this); // Show the tooltip
    this.series.chart.xAxis[0].drawCrosshair(event, this); // Show the crosshair
    this.series.chart.yAxis[0].drawCrosshair(event, this);
};


/**
* Synchronize zooming through the setExtremes event handler.
*/
function syncExtremes(e) {
var thisChart = this.chart;

if (e.trigger !== 'syncExtremes') { // Prevent feedback loop
    Highcharts.each(Highcharts.charts, function (chart) {
        if (chart !== thisChart) {
            if (chart.xAxis[0].setExtremes) { // It is null while updating
                chart.xAxis[0].setExtremes(
                    e.min,
                    e.max,
                    undefined,
                    false,
                    { trigger: 'syncExtremes' }
                );
            }
        }
    });
    }
}

var Energy = {
    name: [],
    data: []
};

var nonpower = {
    name: [],
    data:[]
}
var fullData;

/* Add this to the xAxis attribute of each chart. */
events: {
        setExtremes: syncExtremes
}

// Get the data
Highcharts.ajax({
    url: JSONFileName,
    dataType: 'text',
    success: function (activity) {

        //read in the data
        activity = JSON.parse(activity);
        fullData = activity;

        for (var i = 0; i < 6; i++) {
            if (i == 4) {
                continue;
            }
            var temp_data = activity[i];
            var to_sample = new Array();
            for (var j = 1; j < 2016; j = j + 6) {
                to_sample.push(temp_data.history.data[j]);
            }
            Energy.name.push(temp_data.fuel_tech);
            Energy.data.push(to_sample);
        }
        Energy.name = Energy.name.reverse();
        Energy.data = Energy.data.reverse();
        for (var i = 4; i < 11; i = i + 1) {
            var temp_data = activity[i];
            var to_sample = new Array();
            
            if (i == 5 || i == 7) {
                continue;
            }
            if (temp_data.history.data.length== 2016) {
                for (var j = 0; j < 2016; j = j + 6) {
                    to_sample.push(temp_data.history.data[j]);
                }
                if (i == 9) {
                    nonpower.name.push(temp_data.type);
                }
                else {
                    nonpower.name.push(temp_data.fuel_tech);
                }
                nonpower.data.push(to_sample);
            }
            else {
                for (var j = 0; j < temp_data.history.data.length; j++) {
                    to_sample.push(temp_data.history.data[j]);
                }
                nonpower.name.push(temp_data.type);
                nonpower.data.push(to_sample);
            }
        }

        var energydiv = document.createElement('div');
        energydiv.className = 'energychart';
        document.getElementById('energy').appendChild(energydiv);

        //make energy chart
        Highcharts.chart(energydiv, {
            chart:{
                type: 'area',
                backgroundColor: 'transparent'
            },

            title:{
                text: 'Generation MW'   
            },
            legend: {
                enabled: false
            },
            xAxis: {
                type: 'datetime',
                tickInterval: 24 * 3600 * 1000
            },
            yAxis: {
                title: {
                    enabled: false
                },
                labels: {
                    formatter: function () {
                        return this.value;
                    },
                    align: 'left',
                    reserveSpace: false,
                    y: -3,
                    x: 5,
                },
            },
            tooltip: {
                crosshairs: [{
                  width: 2,
                  color: 'red',
                  zIndex: 3
                }],
                positioner : function () {
                    return {x : this.chart.chartWidth - this.label.width-20 , y : 10}
                },
                formatter: function () {
                    return '<b>' + entrydate + '</b> Total : <b>' + totalPower.toFixed(0) +" MW </b>" 
                },
                borderColor: "black",
                shape:'rect',
                snap:50,
                enabled: true
              },
            plotOptions: {
                area: {
                    stacking: 'normal',
                    lineColor: '#666666',
                    lineWidth: 0,
                    
                    marker: {
                        lineWidth: 1,
                        lineColor: '#666666'
                    }
                },
                series: {
                    states: {
                      inactive: {
                        opacity: 1
                      }
                    }
                  }

            },
            credits: {
                enabled: false
            },
            series: [
                {
                    name: "Wind",
                    pointStart: (activity[4].history.start + 5 * 60)*1000,
                    pointInterval: 1000 * 60 * 30,
                    data: Energy.data[0],
                    color: '#8FBC8F'
                
                },
                {
                    name: "Hydro",
                    pointStart: (activity[3].history.start + 5 * 60)*1000,
                    pointInterval: 1000 * 60 * 30,
                    data: Energy.data[1],
                    color: '#00BFFF'
                }, 
                {
                    name: "Gas (CCGT)",
                    pointStart: (activity[2].history.start + 5 * 60)*1000,
                    pointInterval: 1000 * 60 * 30,
                    data: Energy.data[2],
                    color: '#FF7F50'
                },
                {
                    name: 'Distillate',
                    pointStart: (activity[1].history.start + 5 * 60)*1000,
                    pointInterval: 1000 * 60 * 30,
                    data: Energy.data[3],
                    color: '#DC143C'
                }, 
                {
                    name: "Black Coal",
                    pointStart: (activity[0].history.start + 5 * 60)*1000,
                    pointInterval: 1000 * 60 * 30,
                    data: Energy.data[4],
                    color: '#000000'
                }
            ]
        });

        var pricediv = document.createElement('div');
        pricediv.className = 'pricechart';
        document.getElementById('price').appendChild(pricediv);

        //make price chart
        Highcharts.chart(pricediv, {
            chart:{
                type: 'line',
                backgroundColor: 'transparent'
            },
        
            title:{
                text: 'Price'   
            },
            legend: {
                enabled: false
            },
            xAxis: {
                type: 'datetime',
                tickInterval: 24 * 3600 * 1000,
            },

            yAxis: {
                title: {
                    enabled: false
                },
                labels: {
                    formatter: function () {
                        return this.value;
                    },
                    align: 'left',
                    reserveSpace: false,
                    y: -3,
                    x: 5,
                },
            },

            line: {
                lineWidth: "1"
            },

            tooltip: {
                crosshairs: [{
                    width: 2,
                    color: 'red',
                    zIndex: 3
                  }],
                  positioner : function () {
                      return {x : this.chart.chartWidth - this.label.width-20 , y : 10}
                  },
                  formatter: function () {
                      return '<b>' + entrydate + '</b> Total : <b> $' + currPrice +" </b>" 
                  },
                  borderColor: "black",
                  shape:'rect',
                  snap:50,
                  enabled: true
              },

            credits: {
                enabled: false
            },
        
            series: [
            {
                name: "Price",
                pointStart: (activity[8].history.start + 5 * 60)*1000,
                    pointInterval: 1000 * 60 * 30,
                step: 'left',
                data: activity[8].history.data,
                color: 'Red'
            }
            ],
        });

        var tempdiv = document.createElement('div');
        tempdiv.className = 'tempchart';
        document.getElementById('temp').appendChild(tempdiv);
        
        //make temp chart
        Highcharts.chart(tempdiv, {
            chart:{
                type: 'line',
                backgroundColor: 'transparent'
            },
            title:{
                text: 'Temperature'   
            },
            legend: {
                enabled: false
            },
            xAxis: {
                type: 'datetime',
                tickInterval: 24 * 3600 * 1000
            },
            yAxis: {
                title: {
                    enabled: false
                },
                labels: {
                    formatter: function () {
                        return this.value;
                    },
                    align: 'left',
                    reserveSpace: false,
                    y: -3,
                    x: 5,
                },
            },
            line: {
                lineWidth: "1"
            },
            credits: {
                enabled: false
            },
            tooltip: {
                crosshairs: [{
                    width: 2,
                    color: 'red',
                    zIndex: 3
                  }],
                  positioner : function () {
                      return {x : this.chart.chartWidth - this.label.width-20 , y : 10}
                  },
                  formatter: function () {
                      return '<b>' + entrydate + '</b> Total : <b>' + currTemp +" ºF </b>" 
                  },
                  borderColor: "black",
                  shape:'rect',
                  snap:50,
                  enabled: true
              },
        
            series: [
            {
                name: "Temperature",
                pointStart: (activity[10].history.start + 5 * 60)*1000,
                    pointInterval: 1000 * 60 * 30,
                data: activity[10].history.data,
                color: 'Red'
            }
            ],
        });

        //initialize functions to load in initial data on success
        fillPie(0,Energy);
        updateLegend(0);

    }
});