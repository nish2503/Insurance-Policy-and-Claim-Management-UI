import { useEffect, useState } from "react";


import DashboardLayout 
from "../../components/layout/DashboardLayout";


import DataTable 
from "../../components/common/DataTable";


import Button 
from "../../components/common/Button";


import StatusBadge 
from "../../components/common/StatusBadge";


import Loader 
from "../../components/common/Loader";


import EmptyState 
from "../../components/common/EmptyState";


import Card 
from "../../components/common/Card";


import {
    getAgentClaims,
    reviewClaim
} from "../../api/agentApi";




function ReviewClaims(){


    const [claims,setClaims] = useState([]);

    const [loading,setLoading] = useState(true);



    useEffect(()=>{

        loadClaims();

    },[]);





    async function loadClaims(){


        try{


            const res = await getAgentClaims();


            setClaims(

                res.data.records || []

            );


        }
        catch(error){


            console.log(error);


        }
        finally{


            setLoading(false);


        }

    }





    async function approveClaim(claimId){


        const data = {


            recommendedStatus:
                "RECOMMENDED_APPROVAL",


            remarks:
                "Documents verified"

        };



        try{


            await reviewClaim(

                claimId,

                data

            );


            loadClaims();


        }
        catch(error){


            console.log(error);


        }


    }







    async function rejectClaim(claimId){


        const data = {


            recommendedStatus:
                "RECOMMENDED_REJECTION",


            remarks:
                "Documents not verified"

        };



        try{


            await reviewClaim(

                claimId,

                data

            );


            loadClaims();


        }
        catch(error){


            console.log(error);


        }


    }








    if(loading){


        return(

            <DashboardLayout>

                <Loader/>

            </DashboardLayout>

        )

    }






    // Agent receives SUBMITTED claims

    const pendingClaims = claims.filter(

        c => c.claimStatus === "SUBMITTED"

    );








    return(


        <DashboardLayout>


            <Card title="Review Claims">



            {

                pendingClaims.length ?



                <DataTable



                    columns={[



                        {

                            key:"claimNumber",

                            label:"Claim ID"

                        },



                        {

                            key:"customerName",

                            label:"Customer"

                        },



                        {

                            key:"policyNumber",

                            label:"Policy"

                        },



                        {

                            key:"claimAmount",

                            label:"Amount"

                        },



                        {

                            key:"claimStatus",

                            label:"Status",

                            render:(row)=>(


                                <StatusBadge

                                    status={
                                        row.claimStatus
                                    }

                                />


                            )

                        },



                        {

                            key:"action",

                            label:"Action",

                            render:(row)=>(


                                <div className="d-flex gap-2">


                                    <Button


                                        onClick={

                                            ()=>approveClaim(

                                                row.claimId

                                            )

                                        }

                                    >

                                        Approve


                                    </Button>





                                    <Button


                                        className="btn btn-danger"


                                        onClick={

                                            ()=>rejectClaim(

                                                row.claimId

                                            )

                                        }

                                    >

                                        Reject


                                    </Button>




                                </div>


                            )


                        }




                    ]}





                    data={pendingClaims}




                />





                :



                <EmptyState

                    message="No Pending Claims"

                />



            }



            </Card>


        </DashboardLayout>


    );


}



export default ReviewClaims;