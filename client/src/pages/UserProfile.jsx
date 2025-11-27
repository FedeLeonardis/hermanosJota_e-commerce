import React, { useEffect, useState } from "react";
import API_CONFIG from "../config/api";
// import "../css/perfil.css";

function UserProfile() {
  const [profile, setProfile] = useState(null);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(API_CONFIG.ENDPOINTS.PROFILE, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) throw new Error("No se pudo acceder al perfil");

      const profileData = await response.json();
      setProfile(profileData);
    } catch (error) {
      console.error("Error al obtener perfil:", error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (!profile) return <p>Cargando perfil...</p>;

  return (
    <div className="container-global">
      <div className="container">
        <div className="group">
          <h1>Perfil de usuario</h1>

          <h2>{profile.message}</h2>
          <label>Usuario: {profile.usuario.username}</label>
          <label>ID: {profile.usuario.id}</label>
          <label htmlFor="">Rol: {profile.usuario.rol}</label>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
