import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import DashboardCard from "../components/DashboardCard";

import {
  getMyClaims,
  getMyPolicies,
  getProducts,
  getPlans,
  getMyPremiumPayments
} from "../api/customerApi";


function CustomerDashboard() {


  const [claims,setClaims] = useState([]);
  const [policies,setPolicies] = useState([]);
  const [products,setProducts] = useState([]);
  const [plans,setPlans] = useState([]);
  const [payments,setPayments] = useState([]);

  const [selected,setSelected] = useState("");



  useEffect(()=>{

    loadData();

  },[]);




  async function loadData(){

    try{


      const claimRes =
        await getMyClaims();


      const policyRes =
        await getMyPolicies();


      const productRes =
        await getProducts();


      const planRes =
        await getPlans();


      const paymentRes =
        await getMyPremiumPayments();




      setClaims(
        claimRes.data.records || []
      );


      setPolicies(
        policyRes.data.records || []
      );


      setProducts(
        productRes.data.records || []
      );


      setPlans(
        planRes.data.records || []
      );


      setPayments(
        paymentRes.data || []
      );



    }
    catch(error){

      console.log(error);

    }

  }






  return (

    <>

    <Navbar/>


    <div className="container-fluid bg-light min-vh-100 p-4">


      <h2>
        Customer Dashboard
      </h2>



      <div className="row">



        <DashboardCard

          title="My Claims"

          count={claims.length}

          onClick={()=>setSelected("claims")}

        />



        <DashboardCard

          title="My Policies"

          count={policies.length}

          onClick={()=>setSelected("policies")}

        />



        <DashboardCard

          title="Premium Payments"

          count={payments.length}

          onClick={()=>setSelected("payments")}

        />



        <DashboardCard

          title="Products"

          count={products.length}

          onClick={()=>setSelected("products")}

        />



        <DashboardCard

          title="Plans"

          count={plans.length}

          onClick={()=>setSelected("plans")}

        />


      </div>






      {/* CLAIMS */}

      {
      selected==="claims" &&

      <ul className="list-group mt-4">

      {

      claims.map(c=>(

        <li

        key={c.claimId}

        className="list-group-item"

        >

        Claim :
        {c.claimNumber || c.claimId}

        {" - "}

        Status :
        {c.status}


        </li>


      ))

      }


      </ul>

      }







      {/* POLICIES */}


      {
      selected==="policies" &&

      <ul className="list-group mt-4">


      {

      policies.map(p=>(


        <li

        key={p.id || p.policyId}

        className="list-group-item"

        >


        Policy Number :

        {p.policyNumber || p.policyId}



        </li>


      ))

      }


      </ul>

      }








      {/* PREMIUM PAYMENTS */}


      {
      selected==="payments" &&


      <ul className="list-group mt-4">


      {


      payments.map(p=>(


        <li

        key={p.paymentId}

        className="list-group-item"

        >


        Amount :
        {p.amount}


        {" - "}


        Status :
        {p.paymentStatus}



        </li>


      ))


      }


      </ul>


      }









      {/* PRODUCTS */}


      {
      selected==="products" &&


      <ul className="list-group mt-4">


      {


      products.map(p=>(


        <li

        key={p.id || p.productId}

        className="list-group-item"

        >


        

        {p.productName || p.name || "Unknown Product"}



        </li>


      ))


      }


      </ul>


      }









      {/* PLANS */}



      {
      selected==="plans" &&


      <ul className="list-group mt-4">


      {


      plans.map(p=>(


        <li

        key={p.id || p.planId}

        className="list-group-item"

        >


        

        {p.planName || p.name || "Unknown Plan"}



        </li>


      ))


      }


      </ul>


      }





    </div>


    </>


  );


}


export default CustomerDashboard;