import { useState } from "react";
import { createCustomerProfile } from "../../api/customerApi";
import { useNavigate } from "react-router-dom";
import { validateAge } from "../../utils/validators";

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

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({
      ...form,

      [e.target.name]: e.target.value,
    });

    setErrors((prev) => {
      if (!prev[e.target.name]) return prev;
      const next = { ...prev };
      delete next[e.target.name];
      return next;
    });
  };

  const submit = async (e) => {
    e.preventDefault();

    const dobError = validateAge(form.dateOfBirth, "Date of birth");
    if (dobError) {
      setErrors({ dateOfBirth: dobError });
      return;
    }

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
        <div className="mb-3">
          <label className="form-label text-capitalize">Date of Birth</label>
          <input
            type="date"
            className={`form-control ${errors.dateOfBirth ? "is-invalid" : ""}`}
            name="dateOfBirth"
            value={form.dateOfBirth}
            onChange={handleChange}
          />
          {errors.dateOfBirth && (
            <div className="invalid-feedback">{errors.dateOfBirth}</div>
          )}
        </div>

        {Object.keys(form)
          .filter((key) => key !== "dateOfBirth")
          .map((key) => (
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