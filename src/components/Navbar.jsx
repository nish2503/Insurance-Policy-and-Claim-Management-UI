import { useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();


  const logout = () => {

    localStorage.clear();

    navigate("/");

  };


  return (

    <nav className="navbar navbar-dark bg-primary">

      <div className="container-fluid">


        <span className="navbar-brand">
          Insurance System
        </span>



        <button

          className="btn btn-danger"

          onClick={logout}

        >

          Logout

        </button>


      </div>


    </nav>

  );

}

export default Navbar;