import React from 'react'

const DashboardCard = ({title, count, onClick}) => {
  return (
    <div className='dashboard-card' onClick={onClick}>
      <h2>{title}</h2>
      <h3>Total - {count}</h3>
    </div>
  )
}

export default DashboardCard
