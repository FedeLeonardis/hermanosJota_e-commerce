import React, { useEffect, useState, useContext, useCallback } from "react";
import { AuthContext } from "../../auth/AuthContext";
import API_CONFIG from "../config/api";
// import "../css/perfil.css";

function UserProfile() {
  const { token } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  const fetchUserProfile = useCallback(async () => {
    if (!token) return;

    try {
      const response = await fetch(API_CONFIG.ENDPOINTS.PROFILE, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Enviamos el JWT en el header
        },
      });

      if (!response.ok) throw new Error("No se pudo acceder al perfil");

      const profileData = await response.json();
      console.log("Datos recibidos:", profileData); // Para debug
      setProfile(profileData);
    } catch (error) {
      console.error("Error al obtener perfil:", error);
      setError(error.message);
    }
  }, [token]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  if (error) {
    return (
      <div className="container" style={{ padding: "20px", color: "red" }}>
        Error: {error}
      </div>
    );
  }

  if (!profile)
    return (
      <div className="container" style={{ padding: "20px" }}>
        Cargando perfil...
      </div>
    );

  return (
    <div className="container-global">
      <div className="container">
        <div className="group">
          <h1>Perfil de usuario</h1>

          {/* Eliminamos profile.message porque el endpoint suele devolver solo el usuario */}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginTop: "20px",
            }}
          >
            <label>
              <strong>Usuario:</strong> {profile.username}
            </label>

            <label>
              <strong>Email:</strong> {profile.email}
            </label>

            <label>
              <strong>ID:</strong> {profile._id}
            </label>

            <label>
              <strong>Rol:</strong>{" "}
              {Array.isArray(profile.roles)
                ? profile.roles.join(", ")
                : profile.roles}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
