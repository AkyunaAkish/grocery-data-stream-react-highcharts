import React, { Component } from 'react'
import ReactHighcharts from 'react-highcharts'
import nio from 'niojs'

const formatShoppingItems = (items) => {
  return items.map((item) => {
    return `Item: ${item.name}, Quantity: ${item.quantity}, Type: ${item.type}`
  }).join('<br/>')
}

const randomColor = function() {
    var x=Math.round(0xffffff * Math.random()).toString(16);
    var y=(6-x.length);
    var z="000000";
    var z1 = z.substring(0,y);
    var color = "#" + z1 + x;
    return color;
  }

class Chart extends Component {
  constructor(props) {
    super(props)

    this.state = {
      highChartsConfig:  {
        chart: {
          type: 'scatter',
          zoomType: 'xy'
        },
        title: {
          text: 'Colorado Grocery Store Purchase Real-Time Data Stream'
        },
        xAxis: {
          title: {
            enabled: true,
            text: 'Price (USD)'
          },
          startOnTick: true,
          endOnTick: true,
          showLastLabel: true
        },
        yAxis: {
          title: {
            text: 'Amount of item types purchased'
          }
        },
        legend: {
          layout: 'vertical',
          align: 'left',
          verticalAlign: 'top',
          x: 100,
          y: 70,
          floating: true,
          backgroundColor: (ReactHighcharts.theme && ReactHighcharts.theme.legendBackgroundColor) || '#FFFFFF',
          borderWidth: 1
        },
        plotOptions: {
          scatter: {
            marker: {
              radius: 5,
              states: {
                hover: {
                  enabled: true,
                  lineColor: 'rgb(100,100,100)'
                }
              }
            },
            states: {
              hover: {
                marker: {
                  enabled: false
                }
              }
            },
            tooltip: {
              headerFormat: '<b>{series.name}</b><br>',
              pointFormat: 'Shopper\'s Name: {point.shopper_name}<br> Shopper\'s Gender: {point.gender}<br> Items Bought:<br/> {point.items}'
            }
          }
        },
        series: [{
          name: 'Grocery Store Purchase',
          color: 'rgba(189,60,59, .5)',
          data: []
        }]
      }
    }
  }

  componentDidMount() {
    let chart = this.refs.chart.getChart()
    nio.source.socketio('//brand.nioinstances.com', ['groceries'])
    .pipe(nio.pass((props) => {
      const formattedPurchaseData = {
        x: props.amount,
        y: props.cart.length,
        gender: props.shopper.gender,
        shopper_name: props.shopper.name,
        items: formatShoppingItems(props.cart)
      }

      chart.series[0].addPoint(formattedPurchaseData)
    }))
  }

  render() {
    return (
      <div>
        <ReactHighcharts config={this.state.highChartsConfig} ref='chart'/>
      </div>
    )
  }
}

export default Chart
