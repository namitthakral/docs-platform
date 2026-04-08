'use client'

import { tableSkeletonStyles } from './table-skeleton.styles'
import { TableSkeletonProps } from './table-skeleton.props'

export default function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
  return (
    <div className={tableSkeletonStyles.container}>
      <table className={tableSkeletonStyles.table}>
        <thead className={tableSkeletonStyles.thead}>
          <tr>
            {Array.from({ length: columns }).map((_, index) => (
              <th key={index} className={tableSkeletonStyles.th}>
                <div className={tableSkeletonStyles.headerSkeleton} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={tableSkeletonStyles.tbody}>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex} className={tableSkeletonStyles.tr}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className={tableSkeletonStyles.td}>
                  <div 
                    className={`${tableSkeletonStyles.cellSkeleton} ${
                      colIndex === 0 ? tableSkeletonStyles.firstColumnSkeleton : 
                      colIndex === columns - 1 ? tableSkeletonStyles.lastColumnSkeleton :
                      tableSkeletonStyles.middleColumnSkeleton
                    }`} 
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}