import { useState } from "react";
import { createCustomerProfile } from "../../api/customerApi";
import { useNavigate } from "react-router-dom";

function CreateProfile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    dateOfBirth: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    nomineeName: "",
    nomineeRelation: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,

      [e.target.name]: e.target.value,
    });
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      await createCustomerProfile(form);

      alert("Profile created");

      navigate("/customer");
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Profile creation failed");
    }
  };

  return (
    <div className="container mt-5">
      <h3>Create Customer Profile</h3>

      <form onSubmit={submit}>
        {Object.keys(form).map((key) => (
          <input
            key={key}
            className="form-control mb-3"
            name={key}
            placeholder={key}
            value={form[key]}
            onChange={handleChange}
          />
        ))}

        <button className="btn btn-primary">Create Profile</button>
      </form>
    </div>
  );
}

export default CreateProfile;
