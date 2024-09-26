import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";

const SignUp = ({ csrfToken }) => {
  const [userName, setUserName] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [profilePic, setProfilePic] = useState(""); // Nytt state för avatar-URL
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();
    const userData = {
      username: userName,
      password: userPassword,
      email: userEmail,
      avatar: profilePic, // Lägg till avatar i payload
      csrfToken,
    };

    fetch("https://chatify-api.up.railway.app/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || "Användarnamn eller e-postadress finns redan");
        }
        // Spara användaruppgifter och redirecta till login
        localStorage.setItem("username", userName);
        localStorage.setItem("email", userEmail);
        navigate("/login", { state: { message: "Registrering lyckades" } });
      })
      .catch((error) => setFormError(error.message));
  };

  return (
    <div className="bg-cover bg-center min-h-screen flex items-center justify-center">
      <div className="bg-white bg-opacity-60 backdrop-blur-lg p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-light text-center mb-8 text-white tracking-wide">
          SKAPA KONTO
        </h1>
        {formError && <p className="text-red-500 text-center mb-4">{formError}</p>}
        <p className="text-green-500 text-center mb-4">
          Redan medlem?{" "}
          <NavLink to="/login" className="text-blue-500 underline">
            Logga in
          </NavLink>
        </p>
        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="flex flex-col">
            <input
              type="text"
              placeholder="Användarnamn"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col">
            <input
              type="password"
              placeholder="Lösenord"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col">
            <input
              type="email"
              placeholder="E-post"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
          >
            Registrera
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
