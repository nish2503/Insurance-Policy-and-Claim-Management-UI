import React, { useEffect, useState } from 'react'
import DashboardCard from '../components/DashboardCard'
import DataTable from '../components/DataTable'
import { getProducts } from '../services/ProductService'
import { getCustomers } from '../services/CustomerService'
import { getPolicies } from '../services/PolicyService'

const AdminDashboard = () => {

    const [counts, setCounts] = useState({
        products: 0,
        customers: 0,
        policies: 0
    })

    const [tableData, setTableData] = useState([])
    const [heading, setHeading] = useState("")

    useEffect(() => {
        loadCounts()
    }, [])

    const loadCounts = async () => {

        const productResponse = await getProducts()
        const customerResponse = await getCustomers()
        const policyResponse = await getPolicies()

        setCounts({
            products: productResponse.data.totalRecords,
            customers: customerResponse.data.totalRecords,
            policies: policyResponse.data.totalRecords
        })

    }

    const showProducts = async () => {

        const response = await getProducts()
        setTableData(response.data.records)
        setHeading("Products")
    }

    const showCustomers = async () => {

        const response = await getCustomers()
        setTableData(response.data.records)
        setHeading("Customers")

    }
    const showPolicies = async () => {

        const response = await getPolicies()
        setTableData(response.data.records)
        setHeading("Policies")

    }
    return (
        <div className="dashboard">
            <h1>Admin Dashboard</h1>
            <div className="cards">

                <DashboardCard
                    title="Products"
                    count={counts.products}
                    onClick={showProducts}
                />
                <DashboardCard
                    title="Customers"
                    count={counts.customers}
                    onClick={showCustomers}
                />
                <DashboardCard
                    title="Policies"
                    count={counts.policies}
                    onClick={showPolicies}
                />
            </div>
            <h2>{heading}</h2>
            <DataTable data={tableData} />
        </div>
    )
}

export default AdminDashboard