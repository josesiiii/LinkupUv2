// src/hooks/useFeed.js
import { useState, useEffect } from "react";
import api from "../api/axios";
import useAuthStore from "../store/authStore";
import useSavedProfilesStore from "../store/savedProfilesStore";

export default function useFeed(filters = {}) {
  const { token, usuario } = useAuthStore();
  const { myUniversity } = filters;

  const savedIds = useSavedProfilesStore((s) => s.savedIds);
  const fetchSaved = useSavedProfilesStore((s) => s.fetchSaved);
  const saveProfile = useSavedProfilesStore((s) => s.save);
  const unsaveProfile = useSavedProfilesStore((s) => s.unsave);

  const [usuarios,      setUsuarios]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState("");
  const [connectingIds, setConnectingIds] = useState([]);
  const [connectedIds,  setConnectedIds]  = useState([]);
  const [savingIds,     setSavingIds]     = useState([]);

  useEffect(() => {
    if (!token) return;
    const cargar = async () => {
      try {
        setLoading(true);
        setError("");
        const params = {};
        params.filter = myUniversity ? "myUniversity" : "all";
        const res = await api.get("/users/feed", { params });
        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.data || res.data?.usuarios || res.data?.users || [];
        setUsuarios(data);
      } catch (err) {
        setError(err.response?.data?.message || "Error al cargar el feed");
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [token, myUniversity]);

  // La fuente de verdad de "guardado" vive en savedProfilesStore, no en el feed —
  // se rehidrata desde el backend una vez por usuario autenticado.
  useEffect(() => {
    if (usuario?._id) fetchSaved(usuario._id);
  }, [usuario?._id, fetchSaved]);

  const handleConectar = async (id) => {
    setConnectingIds(p => [...p, id]);
    try {
      await api.post("/connections", { to: id });
      setConnectedIds(p => [...p, id]);
    } catch (err) {
      alert(err.response?.data?.message || "No se pudo enviar la solicitud");
    } finally {
      setConnectingIds(p => p.filter(x => x !== id));
    }
  };

  const handleGuardar = async (id) => {
    setSavingIds(p => [...p, id]);
    try {
      await saveProfile(id);
    } catch (err) {
      alert(err.response?.data?.message || "No se pudo guardar el perfil");
    } finally {
      setSavingIds(p => p.filter(x => x !== id));
    }
  };

  const handleDesguardar = async (id) => {
    setSavingIds(p => [...p, id]);
    try {
      await unsaveProfile(id);
    } catch (err) {
      alert(err.response?.data?.message || "No se pudo quitar el guardado");
    } finally {
      setSavingIds(p => p.filter(x => x !== id));
    }
  };

  return {
    usuarios, loading, error,
    connectingIds, connectedIds,
    savingIds, savedIds,
    handleConectar, handleGuardar, handleDesguardar,
  };
}
