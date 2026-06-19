import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard, Users, TrendingUp, Building2,
  ChevronLeft, Search, ToggleLeft, Trash2, RefreshCw,
  MessageCircle, Bookmark, Activity, AlertCircle,
} from "lucide-react";
import useAuthStore from "../store/authStore";
import api from "../api/axios";
import Logo from "../components/ui/Logo";

// ─── Paleta ────────────────────────────────────────────────────────────────
const C = {
  sidebar:     "#0f0d14",
  sidebarHov:  "rgba(255,255,255,0.06)",
  sidebarAct:  "rgba(255,61,158,0.15)",
  sidebarTxt:  "#9490a8",
  sidebarActT: "#FF3D9E",
  bg:          "#f4f3f8",
  card:        "#ffffff",
  border:      "rgba(0,0,0,0.07)",
  dark:        "#1a1625",
  muted:       "#786b7d",
  pink:        "#FF3D9E",
  pinkL:       "rgba(255,61,158,0.10)",
  lav:         "#d8b4fe",
  lavL:        "rgba(216,180,254,0.12)",
  green:       "#10b981",
  greenL:      "rgba(16,185,129,0.10)",
  amber:       "#f59e0b",
  amberL:      "rgba(245,158,11,0.10)",
  red:         "#ef4444",
  redL:        "rgba(239,68,68,0.10)",
};

// ─── Gráficos SVG puros (sin librería) ────────────────────────────────────

function SparkLine({ data = [], color = C.pink, h = 40 }) {
  if (data.length < 2) return <div style={{ height: h }} />;
  const vals = data.map(d => d.count);
  const max = Math.max(...vals, 1);
  const min = Math.min(...vals, 0);
  const range = max - min || 1;
  const W = 200;
  const pts = vals
    .map((v, i) => `${(i / (vals.length - 1)) * W},${h - ((v - min) / range) * (h - 4) - 2}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${h}`} preserveAspectRatio="none" style={{ width: "100%", height: h }}>
      <polygon points={`0,${h} ${pts} ${W},${h}`} fill={color} opacity={0.10} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LineChart({ data = [], color = C.pink, h = 160 }) {
  if (data.length < 2) return (
    <div style={{ height: h, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted, fontSize: 13 }}>
      Sin datos en los últimos 30 días
    </div>
  );
  const vals = data.map(d => d.count);
  const max = Math.max(...vals, 1);
  const W = 1000;
  const inner = h - 28;
  const pts = vals.map((v, i) => ({
    x: 8 + (i / (vals.length - 1)) * (W - 16),
    y: inner - (v / max) * (inner - 8) - 4,
    v, d: data[i]._id,
  }));
  const line  = pts.map((p, i) => `${i ? "L" : "M"}${p.x},${p.y}`).join(" ");
  const area  = `M${pts[0].x},${inner} ${pts.map(p => `L${p.x},${p.y}`).join(" ")} L${pts.at(-1).x},${inner}Z`;
  const id    = `g${color.replace("#", "")}`;
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${inner + 4}`} preserveAspectRatio="none" style={{ width: "100%", height: inner }}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity=".18" />
            <stop offset="100%" stopColor={color} stopOpacity=".02" />
          </linearGradient>
        </defs>
        {[.25, .5, .75].map(t => (
          <line key={t} x1={8} x2={W - 8}
            y1={inner - t * (inner - 8) - 4}
            y2={inner - t * (inner - 8) - 4}
            stroke="rgba(0,0,0,0.05)" strokeWidth={1} />
        ))}
        <path d={area} fill={`url(#${id})`} />
        <path d={line} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={2.5} fill={color} />)}
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
        {(() => {
          const n = data.length;
          const cnt = Math.min(n, 5);
          const idxs = cnt <= 1 ? [0] : Array.from({ length: cnt }, (_, i) => Math.round((i / (cnt - 1)) * (n - 1)));
          return idxs.map((idx, i) => (
            <span key={i} style={{ fontSize: 10, color: C.muted }}>{data[idx]?._id?.slice(5)}</span>
          ));
        })()}
      </div>
    </div>
  );
}

function DailyBars({ data = [], color = C.pink, h = 80 }) {
  if (!data.length) return (
    <div style={{ height: h, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted, fontSize: 12 }}>
      Sin actividad reciente
    </div>
  );
  const max = Math.max(...data.map(d => d.count), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: h }}>
      {data.map((d, i) => (
        <div
          key={i}
          title={`${d._id}: ${d.count}`}
          style={{
            flex: 1,
            height: `${Math.max(3, (d.count / max) * (h - 16))}px`,
            background: i === data.length - 1 ? color : `${color}88`,
            borderRadius: "3px 3px 0 0",
            transition: "height .3s ease",
          }}
        />
      ))}
    </div>
  );
}

function HorizBar({ data = [], maxItems = 8, color = C.pink }) {
  if (!data.length) return (
    <p style={{ color: C.muted, fontSize: 13, textAlign: "center", padding: "16px 0" }}>Sin datos</p>
  );
  const items = data.slice(0, maxItems);
  const max = Math.max(...items.map(d => d.count), 1);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {items.map((d, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 150, fontSize: 11, color: C.muted, textAlign: "right", flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {d._id || "Sin nombre"}
          </div>
          <div style={{ flex: 1, height: 6, background: "rgba(0,0,0,0.05)", borderRadius: 999, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(d.count / max) * 100}%`, background: color, borderRadius: 999, opacity: 1 - i * 0.07 }} />
          </div>
          <div style={{ width: 28, fontSize: 11, fontWeight: 700, color: C.dark, textAlign: "right", flexShrink: 0 }}>{d.count}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Componentes UI ────────────────────────────────────────────────────────

function Card({ children, style }) {
  return (
    <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", ...style }}>
      {children}
    </div>
  );
}

function CardHeader({ title, sub, action }) {
  return (
    <div style={{ padding: "18px 22px 0", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.dark }}>{title}</div>
        {sub && <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{sub}</div>}
      </div>
      {action}
    </div>
  );
}

function MetricCard({ title, value, sub, subColor, sparkData, sparkColor, Icon, accent = C.pink }) {
  return (
    <Card style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".06em" }}>{title}</span>
        {Icon && (
          <div style={{ width: 30, height: 30, borderRadius: 9, background: `${accent}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon size={14} color={accent} />
          </div>
        )}
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, color: C.dark, letterSpacing: "-.02em", lineHeight: 1.1 }}>
        {typeof value === "number" ? value.toLocaleString("es-CO") : (value ?? "—")}
      </div>
      {sub && <div style={{ fontSize: 12, color: subColor || C.muted, fontWeight: 500 }}>{sub}</div>}
      {sparkData?.length > 1 && <SparkLine data={sparkData} color={sparkColor || accent} h={36} />}
    </Card>
  );
}

function StatusBadge({ active }) {
  return (
    <span style={{
      padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600,
      background: active ? C.greenL : C.redL,
      color: active ? C.green : C.red,
    }}>
      {active ? "Activo" : "Inactivo"}
    </span>
  );
}

function SmallStat({ label, value, color = C.dark }) {
  return (
    <Card style={{ padding: "14px 18px" }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 800, color }}>{typeof value === "number" ? value.toLocaleString("es-CO") : (value ?? "—")}</div>
    </Card>
  );
}

// ─── Vistas ────────────────────────────────────────────────────────────────

function DashboardView({ stats, usersPreview, goToUsers, mobile }) {
  if (!stats) return <Loading />;
  const { overview: o, timeSeries: ts, breakdowns: bd } = stats;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* KPIs principales */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 14 }}>
        <MetricCard title="Usuarios totales"  value={o.totalUsuarios}    sub={`+${o.usuariosNuevosHoy} hoy · +${o.usuariosNuevosSemana} semana`} sparkData={ts.crecimientoUsuarios} Icon={Users}         accent={C.pink} />
        <MetricCard title="Usuarios activos"  value={o.usuariosActivos}  sub={`${o.usuariosInactivos} inactivos`}  subColor={o.usuariosInactivos > 0 ? C.amber : C.muted} Icon={Activity}      accent={C.green} />
        <MetricCard title="Conexiones"        value={o.totalConexiones}  sub={`${o.tasaAceptacion}% aceptación`}   sparkData={ts.actividadConexiones} sparkColor={C.lav} Icon={Users}         accent={C.lav} />
        <MetricCard title="Mensajes enviados" value={o.totalMensajes}    sub={`${o.totalConversaciones} conversaciones`} sparkData={ts.actividadMensajes} sparkColor="#f1adc2" Icon={MessageCircle} accent="#f1adc2" />
      </div>

      {/* Gráficos */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "3fr 2fr", gap: 14 }}>
        <Card>
          <CardHeader title="Crecimiento de usuarios" sub="Últimos 30 días" />
          <div style={{ padding: "16px 22px 18px" }}>
            <LineChart data={ts.crecimientoUsuarios} color={C.pink} h={160} />
          </div>
        </Card>
        <Card>
          <CardHeader title="Por institución" sub="Top 6 en usuarios" />
          <div style={{ padding: "16px 22px 18px" }}>
            <HorizBar data={bd.usuariosPorInstitucion} maxItems={6} color={C.pink} />
          </div>
        </Card>
      </div>

      {/* Stats secundarios */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: 12 }}>
        <SmallStat label="Historias activas"      value={o.totalHistorias}      color={C.amber} />
        <SmallStat label="Perfiles guardados"      value={o.totalGuardados}      color="#6366f1" />
        <SmallStat label="Solicitudes pendientes"  value={o.conexionesPendientes} color={C.pink} />
        <SmallStat label="Conversaciones totales"  value={o.totalConversaciones}  color={C.lav} />
      </div>

      {/* Usuarios recientes */}
      {usersPreview.length > 0 && (
        <Card>
          <CardHeader
            title="Usuarios recientes"
            action={
              <button onClick={goToUsers} style={{ fontSize: 12, color: C.pink, fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>
                Ver todos →
              </button>
            }
          />
          <div style={{ overflowX: "auto" }}>
            <UserTable users={usersPreview.slice(0, 5)} compact onToggle={() => {}} onDelete={() => {}} actionLoading={null} />
          </div>
        </Card>
      )}
    </div>
  );
}

function UsersView({ users, total, pages, page, search, onSearch, statusFilter, onStatus, onToggle, onDelete, actionLoading, loadingUsers, onPage }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Toolbar */}
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
          <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.muted }} />
          <input
            value={search}
            onChange={e => onSearch(e.target.value)}
            placeholder="Buscar por nombre o email..."
            style={{
              width: "100%", padding: "9px 12px 9px 34px",
              border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 13,
              background: C.card, color: C.dark, outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>
        {["all", "active", "inactive"].map(s => (
          <button
            key={s}
            onClick={() => onStatus(s)}
            style={{
              padding: "8px 16px", borderRadius: 9, fontSize: 12, fontWeight: 600,
              border: `1px solid ${statusFilter === s ? C.pink : C.border}`,
              background: statusFilter === s ? C.pinkL : C.card,
              color: statusFilter === s ? C.pink : C.muted,
              cursor: "pointer",
            }}
          >
            {{ all: "Todos", active: "Activos", inactive: "Inactivos" }[s]}
          </button>
        ))}
        <span style={{ fontSize: 12, color: C.muted, marginLeft: 4 }}>{total?.toLocaleString("es-CO")} usuarios</span>
      </div>

      <Card>
        {loadingUsers ? (
          <div style={{ padding: 40, textAlign: "center", color: C.muted }}>
            <div style={{ width: 24, height: 24, border: `2px solid ${C.pinkL}`, borderTopColor: C.pink, borderRadius: "50%", animation: "admin-spin .7s linear infinite", margin: "0 auto 8px" }} />
            Cargando...
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <UserTable users={users} compact={false} onToggle={onToggle} onDelete={onDelete} actionLoading={actionLoading} />
          </div>
        )}

        {/* Paginación */}
        {pages > 1 && (
          <div style={{ padding: "12px 22px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 8, alignItems: "center", justifyContent: "flex-end" }}>
            <button onClick={() => onPage(page - 1)} disabled={page <= 1} style={paginBtn(page <= 1)}>‹</button>
            <span style={{ fontSize: 12, color: C.muted }}>Página {page} de {pages}</span>
            <button onClick={() => onPage(page + 1)} disabled={page >= pages} style={paginBtn(page >= pages)}>›</button>
          </div>
        )}
      </Card>
    </div>
  );
}

function paginBtn(disabled) {
  return {
    width: 30, height: 30, borderRadius: 8, border: `1px solid ${C.border}`,
    background: C.card, color: disabled ? C.muted : C.dark,
    cursor: disabled ? "default" : "pointer", fontSize: 16,
    display: "flex", alignItems: "center", justifyContent: "center",
    opacity: disabled ? .4 : 1,
  };
}

function UserTable({ users, compact, onToggle, onDelete, actionLoading }) {
  const cols = compact
    ? ["Usuario", "Institución", "Fecha", "Estado"]
    : ["Usuario", "Institución", "Carrera", "Semestre", "Fecha", "Estado", "Acciones"];

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ background: "#f9f8fc" }}>
          {cols.map(h => (
            <th key={h} style={{ padding: "9px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".06em", whiteSpace: "nowrap" }}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {users.length === 0 ? (
          <tr>
            <td colSpan={cols.length} style={{ padding: 32, textAlign: "center", color: C.muted, fontSize: 13 }}>
              No se encontraron usuarios
            </td>
          </tr>
        ) : users.map((u, i) => (
          <tr key={u._id} style={{ borderTop: i > 0 ? `1px solid ${C.border}` : "none" }}>
            {/* Avatar + nombre */}
            <td style={{ padding: "11px 16px", minWidth: 180 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {u.profilePicture
                  ? <img src={u.profilePicture} style={{ width: 32, height: 32, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} alt="" />
                  : <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg,#f1adc2,#d8b4fe)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#3c2f41", flexShrink: 0 }}>
                      {(u.fullName || "?").slice(0, 2).toUpperCase()}
                    </div>
                }
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.dark, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 160 }}>{u.fullName}</div>
                  <div style={{ fontSize: 10, color: C.muted, overflow: "hidden", textOverflow: "ellipsis", maxWidth: 160 }}>{u.email}</div>
                </div>
              </div>
            </td>
            <td style={{ padding: "11px 16px", fontSize: 12, color: C.muted, maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.institution || "—"}</td>
            {!compact && <td style={{ padding: "11px 16px", fontSize: 12, color: C.muted, maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.career || "—"}</td>}
            {!compact && <td style={{ padding: "11px 16px", fontSize: 12, color: C.muted, textAlign: "center" }}>{u.semester || "—"}</td>}
            <td style={{ padding: "11px 16px", fontSize: 11, color: C.muted, whiteSpace: "nowrap" }}>
              {new Date(u.createdAt).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" })}
            </td>
            <td style={{ padding: "11px 16px" }}><StatusBadge active={u.isActive} /></td>
            {!compact && (
              <td style={{ padding: "11px 16px" }}>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => onToggle(u._id)}
                    disabled={actionLoading === u._id}
                    title={u.isActive ? "Desactivar" : "Activar"}
                    style={{ width: 28, height: 28, borderRadius: 8, border: `1px solid ${C.border}`, background: C.card, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: actionLoading === u._id ? .5 : 1 }}
                  >
                    <ToggleLeft size={13} color={u.isActive ? C.green : C.muted} />
                  </button>
                  <button
                    onClick={() => onDelete(u._id, u.fullName)}
                    disabled={actionLoading === u._id}
                    title="Eliminar usuario"
                    style={{ width: 28, height: 28, borderRadius: 8, border: `1px solid ${C.border}`, background: C.card, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: actionLoading === u._id ? .5 : 1 }}
                  >
                    <Trash2 size={13} color={C.red} />
                  </button>
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function AnalyticsView({ stats, mobile, dateRange, setDateRange }) {
  if (!stats) return <Loading />;
  const { timeSeries: ts, breakdowns: bd, overview: o } = stats;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Selector de período */}
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>Período:</span>
        {[7, 30, 90].map(d => (
          <button
            key={d}
            onClick={() => setDateRange(d)}
            style={{
              padding: "6px 14px", borderRadius: 20, border: `1px solid ${dateRange === d ? C.pink : C.border}`,
              background: dateRange === d ? C.pinkL : C.card,
              color: dateRange === d ? C.pink : C.muted,
              fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all .15s",
            }}
          >
            {d === 7 ? "7 días" : d === 30 ? "30 días" : "90 días"}
          </button>
        ))}
      </div>

      {/* Series temporales principales */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 14 }}>
        <Card>
          <CardHeader title="Crecimiento de usuarios" sub={`Registros por día · últimos ${dateRange} días`} />
          <div style={{ padding: "16px 22px 18px" }}>
            <LineChart data={ts.crecimientoUsuarios} color={C.pink} h={160} />
          </div>
        </Card>
        <Card>
          <CardHeader title="Actividad de conexiones" sub={`Solicitudes enviadas por día · últimos ${dateRange} días`} />
          <div style={{ padding: "16px 22px 18px" }}>
            <LineChart data={ts.actividadConexiones} color={C.lav} h={160} />
          </div>
        </Card>
      </div>

      {/* Métricas rápidas de calidad */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: 12 }}>
        <SmallStat label="Tasa de lectura"       value={`${o.tasaLectura}%`}       color={C.green} />
        <SmallStat label="Adopción foto perfil"   value={`${o.adoptionFoto}%`}      color={C.lav} />
        <SmallStat label="Completitud perfil"     value={`${o.completitudPerfil}%`}  color={C.amber} />
        <SmallStat label="Conexiones rechazadas"  value={o.conexionesRechazadas}     color={C.red} />
      </div>

      {/* Actividad de mensajería */}
      <Card>
        <CardHeader title="Actividad de mensajería" sub={`Mensajes enviados por día · últimos ${dateRange} días`} />
        <div style={{ padding: "16px 22px 18px" }}>
          <DailyBars data={ts.actividadMensajes} color="#f1adc2" h={90} />
        </div>
      </Card>

      {/* Actividad de guardados */}
      <Card>
        <CardHeader title="Perfiles guardados" sub={`Guardados por día · últimos ${dateRange} días`} />
        <div style={{ padding: "16px 22px 18px" }}>
          <DailyBars data={ts.actividadGuardados} color={C.lav} h={90} />
        </div>
      </Card>

      {/* Breakdowns demográficos */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 14 }}>
        <Card>
          <CardHeader title="Usuarios por institución" sub="Distribución por universidad registrada" />
          <div style={{ padding: "16px 22px 18px" }}>
            <HorizBar data={bd.usuariosPorInstitucion} maxItems={8} color={C.pink} />
          </div>
        </Card>
        <Card>
          <CardHeader title="Intereses más populares" sub="Tags más frecuentes en perfiles" />
          <div style={{ padding: "16px 22px 18px" }}>
            <HorizBar data={bd.distribucionIntereses} maxItems={10} color={C.lav} />
          </div>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 14 }}>
        <Card>
          <CardHeader title="Usuarios por facultad" sub="Top 8 carreras / programas" />
          <div style={{ padding: "16px 22px 18px" }}>
            <HorizBar data={bd.usuariosPorFacultad} maxItems={8} color="#f59e0b" />
          </div>
        </Card>
        <Card>
          <CardHeader title="Distribución por semestre" sub="Semestres activos en la plataforma" />
          <div style={{ padding: "16px 22px 18px" }}>
            {bd.usuariosPorSemestre.length ? (
              <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 90 }}>
                {bd.usuariosPorSemestre.map((d, i) => {
                  const max = Math.max(...bd.usuariosPorSemestre.map(x => x.count), 1);
                  return (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, height: "100%", justifyContent: "flex-end" }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: C.dark }}>{d.count}</div>
                      <div style={{ width: "100%", height: `${(d.count / max) * 68}px`, background: "#10b981", borderRadius: "4px 4px 0 0", minHeight: 3 }} />
                      <div style={{ fontSize: 10, color: C.muted }}>{d._id}°</div>
                    </div>
                  );
                })}
              </div>
            ) : <p style={{ color: C.muted, fontSize: 13, textAlign: "center" }}>Sin datos</p>}
          </div>
        </Card>
      </div>

      {/* Estado de conexiones + Historias por tipo */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 14 }}>
        <Card>
          <CardHeader title="Estado de conexiones" sub="Distribución global de solicitudes" />
          <div style={{ padding: "18px 22px", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
            {[
              { label: "Aceptadas",        value: o.conexionesAceptadas,   color: C.green },
              { label: "Pendientes",        value: o.conexionesPendientes,  color: C.amber },
              { label: "Rechazadas",        value: o.conexionesRechazadas,  color: C.red },
              { label: "Tasa aceptación",   value: `${o.tasaAceptacion}%`, color: C.pink },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color }}>{typeof value === "number" ? value.toLocaleString("es-CO") : value}</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>{label}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Historias por tipo" sub="Imagen vs video publicados" />
          <div style={{ padding: "18px 22px" }}>
            {bd.historiasPorTipo.length ? (() => {
              const total = bd.historiasPorTipo.reduce((s, d) => s + d.count, 0);
              const tipos = { image: 0, video: 0 };
              bd.historiasPorTipo.forEach(d => { if (d._id in tipos) tipos[d._id] = d.count; });
              return (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {[
                    { label: "Imágenes", count: tipos.image, color: C.pink },
                    { label: "Videos",   count: tipos.video, color: C.lav },
                  ].map(({ label, count, color }) => (
                    <div key={label}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>{label}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: C.dark }}>
                          {count} ({total > 0 ? Math.round((count / total) * 100) : 0}%)
                        </span>
                      </div>
                      <div style={{ height: 8, background: "rgba(0,0,0,0.05)", borderRadius: 999 }}>
                        <div style={{ height: "100%", width: `${total > 0 ? (count / total) * 100 : 0}%`, background: color, borderRadius: 999 }} />
                      </div>
                    </div>
                  ))}
                  <div style={{ textAlign: "center", fontSize: 11, color: C.muted }}>
                    {total} historias publicadas en total
                  </div>
                </div>
              );
            })() : <p style={{ color: C.muted, fontSize: 13, textAlign: "center", padding: "20px 0" }}>Sin historias publicadas</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}

function UniversitiesView({ stats }) {
  if (!stats) return <Loading />;
  const { breakdowns: bd, overview: o } = stats;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14 }}>
        <MetricCard title="Instituciones" value={bd.usuariosPorInstitucion.length} sub="Con usuarios registrados" Icon={Building2} accent={C.pink} />
        <MetricCard title="Usuarios totales" value={o.totalUsuarios} sub="En todas las instituciones" Icon={Users} accent={C.lav} />
        <MetricCard title="Promedio por inst." value={bd.usuariosPorInstitucion.length ? Math.round(o.totalUsuarios / bd.usuariosPorInstitucion.length) : 0} sub="Usuarios por universidad" Icon={TrendingUp} accent={C.green} />
      </div>

      <Card>
        <CardHeader title="Ranking de instituciones" sub="Por número de usuarios registrados" />
        <div style={{ padding: "16px 22px 22px" }}>
          <HorizBar data={bd.usuariosPorInstitucion} maxItems={10} color={C.pink} />
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
        {bd.usuariosPorInstitucion.map((inst, i) => {
          const pct = o.totalUsuarios ? Math.round((inst.count / o.totalUsuarios) * 100) : 0;
          return (
            <Card key={i} style={{ padding: "18px 22px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.dark, lineHeight: 1.3 }}>{inst._id}</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{inst.count} usuarios · {pct}% del total</div>
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: C.pink, flexShrink: 0 }}>{inst.count}</div>
              </div>
              <div style={{ height: 4, background: "rgba(0,0,0,0.05)", borderRadius: 999, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: C.pink, borderRadius: 999 }} />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function Loading() {
  return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 300 }}>
      <div style={{ width: 28, height: 28, border: `3px solid ${C.pinkL}`, borderTopColor: C.pink, borderRadius: "50%", animation: "admin-spin .7s linear infinite" }} />
    </div>
  );
}

// ─── Sidebar de admin ──────────────────────────────────────────────────────

const VIEWS = [
  { id: "dashboard",     label: "Dashboard",      Icon: LayoutDashboard },
  { id: "users",         label: "Usuarios",        Icon: Users },
  { id: "analytics",     label: "Analítica",       Icon: TrendingUp },
  { id: "universities",  label: "Universidades",   Icon: Building2 },
];

function AdminSidebar({ view, setView, usuario, mobile }) {
  if (mobile) {
    return (
      <div style={{ background: C.sidebar, borderBottom: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px" }}>
          <Logo size={22} showText textColor="#fff" textSize=".85rem" />
          <Link to="/feed" style={{ fontSize: 11, color: C.sidebarTxt, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
            <ChevronLeft size={12} /> App
          </Link>
        </div>
        <div style={{ display: "flex", overflowX: "auto", padding: "0 8px 10px", gap: 4, scrollbarWidth: "none" }}>
          {VIEWS.map(({ id, label, Icon }) => {
            const active = view === id;
            return (
              <button
                key={id}
                onClick={() => setView(id)}
                style={{
                  display: "flex", alignItems: "center", gap: 6, flexShrink: 0,
                  padding: "7px 12px", borderRadius: 20, border: "none",
                  background: active ? C.sidebarAct : "rgba(255,255,255,0.06)",
                  color: active ? C.sidebarActT : C.sidebarTxt,
                  fontWeight: active ? 600 : 500, fontSize: 12, cursor: "pointer",
                }}
              >
                <Icon size={13} />
                {label}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <aside style={{
      width: 220, flexShrink: 0, height: "100vh", position: "sticky", top: 0,
      background: C.sidebar, display: "flex", flexDirection: "column", overflow: "hidden",
    }}>
      {/* Logo */}
      <div style={{ padding: "20px 18px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <Logo size={28} showText textColor="#fff" textSize=".95rem" />
        <div style={{ marginTop: 6, fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: ".1em" }}>Panel admin</div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
        {VIEWS.map(({ id, label, Icon }) => {
          const active = view === id;
          return (
            <button
              key={id}
              onClick={() => setView(id)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "9px 12px", borderRadius: 10, border: "none",
                background: active ? C.sidebarAct : "transparent",
                color: active ? C.sidebarActT : C.sidebarTxt,
                fontWeight: active ? 600 : 500, fontSize: 13,
                cursor: "pointer", width: "100%", textAlign: "left",
                transition: "all .15s ease",
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = C.sidebarHov; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
            >
              <Icon size={15} />
              {label}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: "12px 10px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", marginBottom: 6 }}>
          {usuario?.profilePicture
            ? <img src={usuario.profilePicture} style={{ width: 28, height: 28, borderRadius: 8, objectFit: "cover" }} alt="" />
            : <div style={{ width: 28, height: 28, borderRadius: 8, background: C.sidebarAct, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: C.pink }}>
                {(usuario?.fullName || "A")[0].toUpperCase()}
              </div>
          }
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#e0dded", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{usuario?.fullName}</div>
            <div style={{ fontSize: 10, color: C.sidebarTxt }}>Administrador</div>
          </div>
        </div>
        <Link
          to="/feed"
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 9, color: C.sidebarTxt, textDecoration: "none", fontSize: 12, fontWeight: 500, transition: "color .15s ease" }}
          onMouseEnter={e => e.currentTarget.style.color = "#fff"}
          onMouseLeave={e => e.currentTarget.style.color = C.sidebarTxt}
        >
          <ChevronLeft size={13} />
          Volver a la app
        </Link>
      </div>
    </aside>
  );
}

// ─── Componente principal ──────────────────────────────────────────────────

export default function AdminPage() {
  const usuario = useAuthStore(s => s.usuario);

  const [mobile, setMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const [view, setView]                   = useState("dashboard");
  const [dateRange, setDateRange]         = useState(30);
  const [stats, setStats]                 = useState(null);
  const [loadingStats, setLoadingStats]   = useState(true);
  const [users, setUsers]                 = useState([]);
  const [usersTotal, setUsersTotal]       = useState(0);
  const [usersPages, setUsersPages]       = useState(1);
  const [usersPage, setUsersPage]         = useState(1);
  const [loadingUsers, setLoadingUsers]   = useState(true);
  const [search, setSearch]               = useState("");
  const [statusFilter, setStatusFilter]   = useState("all");
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError]                 = useState(null);

  // Fetch estadísticas — se refetch al cambiar el rango de fechas
  useEffect(() => {
    setStats(null);
    setLoadingStats(true);
    api.get(`/admin/stats?days=${dateRange}`)
      .then(r => setStats(r.data))
      .catch(() => setError("No se pudieron cargar las estadísticas."))
      .finally(() => setLoadingStats(false));
  }, [dateRange]);

  // Fetch usuarios con búsqueda/filtros
  const fetchUsers = useCallback(() => {
    setLoadingUsers(true);
    const params = new URLSearchParams({ page: usersPage, limit: 30 });
    if (search)                        params.set("q",      search);
    if (statusFilter !== "all")        params.set("status", statusFilter);

    api.get(`/admin/users?${params}`)
      .then(r => {
        setUsers(r.data.usuarios || []);
        setUsersTotal(r.data.total || 0);
        setUsersPages(r.data.pages || 1);
      })
      .catch(() => {})
      .finally(() => setLoadingUsers(false));
  }, [search, statusFilter, usersPage]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // Debounce para búsqueda
  useEffect(() => {
    setUsersPage(1);
  }, [search, statusFilter]);

  const handleToggle = async (id) => {
    setActionLoading(id);
    try {
      const r = await api.patch(`/admin/users/${id}/toggle`);
      setUsers(prev => prev.map(u => u._id === id ? { ...u, isActive: r.data.isActive } : u));
    } catch {
      /* silencioso */
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`¿Eliminar permanentemente a ${name}? Esta acción no se puede deshacer.`)) return;
    setActionLoading(id);
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(prev => prev.filter(u => u._id !== id));
      setUsersTotal(prev => prev - 1);
    } catch {
      /* silencioso */
    } finally {
      setActionLoading(null);
    }
  };

  // Título de la vista actual
  const viewLabel = VIEWS.find(v => v.id === view)?.label || "";

  return (
    <div style={{ display: "flex", flexDirection: mobile ? "column" : "row", minHeight: "100vh", background: C.bg, fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <AdminSidebar view={view} setView={setView} usuario={usuario} mobile={mobile} />

      {/* Contenido */}
      <main style={{ flex: 1, overflow: "auto" }}>
        {/* Topbar */}
        <div style={{ padding: mobile ? "16px 16px 0" : "20px 28px 0", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 800, color: C.dark, margin: 0, letterSpacing: "-.02em" }}>{viewLabel}</h1>
            <p style={{ fontSize: 12, color: C.muted, margin: "2px 0 0" }}>
              {new Date().toLocaleDateString("es-CO", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <button
            onClick={() => { setStats(null); setLoadingStats(true); api.get(`/admin/stats?days=${dateRange}`).then(r => setStats(r.data)).finally(() => setLoadingStats(false)); }}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 9, border: `1px solid ${C.border}`, background: C.card, color: C.muted, fontSize: 12, fontWeight: 600, cursor: "pointer" }}
          >
            <RefreshCw size={12} />
            Actualizar
          </button>
        </div>

        <div style={{ padding: mobile ? "0 16px 32px" : "0 28px 32px" }}>
          {error && (
            <div style={{ padding: "12px 16px", background: C.redL, border: `1px solid ${C.red}30`, borderRadius: 10, color: C.red, fontSize: 13, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          {loadingStats && !stats
            ? <Loading />
            : (
              <>
                {view === "dashboard"    && <DashboardView    stats={stats} usersPreview={users} goToUsers={() => setView("users")} mobile={mobile} />}
                {view === "users"        && <UsersView        users={users} total={usersTotal} pages={usersPages} page={usersPage} search={search} onSearch={setSearch} statusFilter={statusFilter} onStatus={setStatusFilter} onToggle={handleToggle} onDelete={handleDelete} actionLoading={actionLoading} loadingUsers={loadingUsers} onPage={setUsersPage} />}
                {view === "analytics"    && <AnalyticsView    stats={stats} mobile={mobile} dateRange={dateRange} setDateRange={setDateRange} />}
                {view === "universities" && <UniversitiesView stats={stats} />}
              </>
            )
          }
        </div>
      </main>

      <style>{`@keyframes admin-spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }`}</style>
    </div>
  );
}
