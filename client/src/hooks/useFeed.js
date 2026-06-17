// src/hooks/useFeed.js
import { useState, useEffect } from "react";
import api from "../api/axios";
import useAuthStore from "../store/authStore";

export default function useFeed(filters = {}) {
  const { token } = useAuthStore();
  const { myUniversity } = filters;

  const [usuarios,      setUsuarios]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState("");
  const [connectingIds, setConnectingIds] = useState([]);
  const [connectedIds,  setConnectedIds]  = useState([]);
  const [savingIds,     setSavingIds]     = useState([]);
  const [savedIds,      setSavedIds]      = useState([]);

  useEffect(() => {
    if (!token) return;
    const cargar = async () => {
      try {
        setLoading(true);
        setError("");
        const params = {};
        if (myUniversity) params.filter = "myUniversity";
        const res = await api.get("/users/feed", { params });
        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.data || res.data?.usuarios || res.data?.users || [];
        setUsuarios(data);
        const saved = data
          .filter((item) => item?.guardado)
          .map((item) => item.usuario?._id || item._id);
        setSavedIds(saved);
      } catch (err) {
        setError(err.response?.data?.message || "Error al cargar el feed");
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [token, myUniversity]);

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
      await api.post("/savedprofiles", { savedUser: id });
      setSavedIds(p => [...p, id]);
    } catch (err) {
      alert(err.response?.data?.message || "No se pudo guardar el perfil");
    } finally {
      setSavingIds(p => p.filter(x => x !== id));
    }
  };

  const handleDesguardar = async (id) => {
    setSavingIds(p => [...p, id]);
    try {
      await api.delete(`/savedprofiles/${id}`);
      setSavedIds(p => p.filter(x => x !== id));
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
