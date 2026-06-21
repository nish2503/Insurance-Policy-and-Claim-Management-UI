import React from 'react'

const DataTable = ({ data }) => {

    if (data.length === 0) {
        return <h3>No Data Found</h3>
    }

    const columns = Object.keys(data[0])
    return (
        <table>
            <thead>
                <tr>
                    {
                        columns.map(col => (
                            <th key={col}>{col}</th>
                        ))
                    }
                </tr>
            </thead>

            <tbody>
                {
                    data.map((item, index) => (
                        <tr key={index}>
                            {
                                columns.map(col => (
                                    <td key={col}>{String(item[col])}</td>
                                ))
                            }
                        </tr>
                    ))
                }
            </tbody>
        </table>
    )
}

export default DataTable