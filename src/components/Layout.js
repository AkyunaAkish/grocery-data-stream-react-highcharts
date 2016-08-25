import React, { Component } from 'react'
import Chart from './Chart'

class Layout extends Component {
  render() {
    return (
      <div>
        <h1 className='layoutHeader'>n.io Grocery Stream</h1>
        <Chart/>
      </div>
    )
  }
}

export default Layout
