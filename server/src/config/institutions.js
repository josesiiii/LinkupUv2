// src/config/institutions.js

export const INSTITUTIONS = {

  // ── SENA ──────────────────────────────────────────────────────────
  "soy.sena.edu.co": {
    name: "Servicio Nacional de Aprendizaje (SENA)",
    campuses: [
      { id: "sena-medellin-centro",     label: "Centro de Servicios y Gestión Empresarial",        city: "Medellín",     department: "Antioquia" },
      { id: "sena-medellin-industrial", label: "Centro Industrial del Diseño y la Manufactura",     city: "Medellín",     department: "Antioquia" },
      { id: "sena-bello",               label: "Centro Tecnológico del Mobiliario",                 city: "Bello",        department: "Antioquia" },
      { id: "sena-bogota-industrial",   label: "Centro de Gestión Industrial",                      city: "Bogotá",       department: "Cundinamarca" },
      { id: "sena-cali-industrial",     label: "Centro Industrial y Desarrollo Empresarial",        city: "Cali",         department: "Valle del Cauca" },
      { id: "sena-barranquilla",        label: "Centro para el Desarrollo Agroempresarial",         city: "Barranquilla", department: "Atlántico" },
    ],
    faculties: [
      {
        name: "Centro de Servicios y Gestión Empresarial",
        careers: ["Gestión Empresarial", "Marketing Digital", "Contabilidad y Finanzas", "Gestión de Talento Humano", "Servicio al Cliente"]
      },
      {
        name: "Centro Industrial del Diseño y la Manufactura",
        careers: ["Automatización Industrial", "Diseño Industrial", "Mecatrónica", "Producción Industrial", "Diseño de Producto"]
      },
      {
        name: "Centro Tecnológico del Mobiliario",
        careers: ["Diseño y Producción de Mobiliario", "Tapizado y Decoración", "Carpintería y Ebanistería"]
      },
      {
        name: "Centro de Gestión Industrial",
        careers: ["Tecnología en Electrónica", "Automatización Industrial", "Mecatrónica Industrial", "Electricidad Industrial"]
      },
      {
        name: "Centro Industrial y Desarrollo Empresarial",
        careers: ["Análisis y Desarrollo de Software", "Gestión de Redes de Datos", "Soporte Técnico", "Producción Multimedia", "Desarrollo Multimedia"]
      },
      {
        name: "Centro para el Desarrollo Agroempresarial",
        careers: ["Producción Agropecuaria", "Gestión de Empresas Agropecuarias", "Agronomía", "Acuicultura"]
      },
    ]
  },

  // ── ITM ───────────────────────────────────────────────────────────
  "itm.edu.co": {
    name: "Instituto Tecnológico Metropolitano",
    campuses: [
      { id: "itm-robledo",     label: "Campus Robledo",     city: "Medellín", department: "Antioquia" },
      { id: "itm-fraternidad", label: "Campus Fraternidad", city: "Medellín", department: "Antioquia" },
      { id: "itm-campo-amor", label: "Campus Campo Amor",  city: "Medellín", department: "Antioquia" },
    ],
    faculties: [
      {
        name: "Facultad de Artes y Humanidades",
        careers: ["Tecnología en Comunicación Gráfica", "Artes Plásticas y Visuales", "Tecnología en Gestión Cultural"]
      },
      {
        name: "Facultad de Ciencias Económicas y Administrativas",
        careers: ["Administración de Empresas", "Contaduría Pública", "Ingeniería Financiera", "Tecnología en Gestión Administrativa", "Tecnología en Gestión Financiera"]
      },
      {
        name: "Facultad de Ciencias Exactas y Aplicadas",
        careers: ["Física Aplicada", "Matemáticas Aplicadas", "Biología Aplicada", "Química Aplicada"]
      },
      {
        name: "Facultad de Ingenierías",
        careers: ["Ingeniería de Sistemas", "Ingeniería Electrónica", "Ingeniería Mecatrónica", "Ingeniería Industrial", "Ingeniería Civil", "Ingeniería Biomédica", "Tecnología en Desarrollo de Software", "Tecnología en Electrónica"]
      },
    ]
  },

  // ── UdeA ──────────────────────────────────────────────────────────
  "udea.edu.co": {
    name: "Universidad de Antioquia",
    campuses: [
      { id: "udea-ciudadela", label: "Ciudad Universitaria",  city: "Medellín",             department: "Antioquia" },
      { id: "udea-oriente",   label: "Seccional Oriente",     city: "El Carmen de Viboral", department: "Antioquia" },
      { id: "udea-uraba",     label: "Seccional Urabá",       city: "Apartadó",             department: "Antioquia" },
      { id: "udea-suroeste",  label: "Seccional Suroeste",    city: "Andes",                department: "Antioquia" },
    ],
    faculties: [
      {
        name: "Escuela de Microbiología",
        careers: ["Bacteriología y Laboratorio Clínico", "Microbiología y Bioanálisis"]
      },
      {
        name: "Escuela de Nutrición y Dietética",
        careers: ["Nutrición y Dietética"]
      },
      {
        name: "Escuela Interamericana de Bibliotecología",
        careers: ["Bibliotecología", "Ciencias de la Información"]
      },
      {
        name: "Facultad de Artes",
        careers: ["Artes Plásticas", "Artes Visuales", "Música", "Teatro", "Educación Artística"]
      },
      {
        name: "Facultad de Ciencias Agrarias",
        careers: ["Zootecnia", "Ingeniería Agropecuaria", "Ingeniería Agroindustrial", "Ingeniería Forestal"]
      },
      {
        name: "Facultad de Ciencias Económicas",
        careers: ["Economía", "Administración de Empresas", "Contaduría Pública", "Negocios Internacionales"]
      },
      {
        name: "Facultad de Ciencias Exactas y Naturales",
        careers: ["Biología", "Física", "Matemáticas", "Química", "Estadística"]
      },
      {
        name: "Facultad de Ciencias Farmacéuticas y Alimentarias",
        careers: ["Farmacia", "Tecnología en Regencia de Farmacia", "Ingeniería de Alimentos"]
      },
      {
        name: "Facultad de Ciencias Sociales y Humanas",
        careers: ["Psicología", "Trabajo Social", "Sociología", "Historia", "Antropología", "Filosofía"]
      },
      {
        name: "Facultad de Comunicaciones y Filología",
        careers: ["Comunicación Social", "Lingüística", "Literatura", "Periodismo", "Publicidad"]
      },
      {
        name: "Facultad de Derecho y Ciencias Políticas",
        careers: ["Derecho", "Ciencia Política"]
      },
      {
        name: "Facultad de Educación",
        careers: ["Educación", "Licenciatura en Matemáticas", "Licenciatura en Ciencias Naturales", "Licenciatura en Humanidades y Lengua Castellana"]
      },
      {
        name: "Facultad de Enfermería",
        careers: ["Enfermería", "Administración en Salud"]
      },
      {
        name: "Facultad de Ingeniería",
        careers: ["Ingeniería de Sistemas", "Ingeniería Civil", "Ingeniería Eléctrica", "Ingeniería Industrial", "Ingeniería Electrónica", "Ingeniería Química", "Ingeniería Sanitaria", "Ingeniería Ambiental"]
      },
      {
        name: "Facultad de Medicina",
        careers: ["Medicina", "Instrumentación Quirúrgica"]
      },
      {
        name: "Facultad de Odontología",
        careers: ["Odontología"]
      },
      {
        name: "Facultad de Salud Pública",
        careers: ["Salud Pública", "Gerencia en Salud", "Regencia de Farmacia"]
      },
      {
        name: "Instituto de Filosofía",
        careers: ["Filosofía", "Humanidades"]
      },
    ]
  },

  // ── Pascual Bravo ─────────────────────────────────────────────────
  "pascualbravo.edu.co": {
    name: "Institución Universitaria Pascual Bravo",
    campuses: [
      { id: "pascual-robledo", label: "Campus Robledo", city: "Medellín", department: "Antioquia" },
    ],
    faculties: [
      {
        name: "Facultad de Artes y Diseño",
        careers: ["Diseño Gráfico", "Diseño de Modas", "Tecnología en Diseño Textil"]
      },
      {
        name: "Facultad de Ingeniería",
        careers: ["Ingeniería Electrónica", "Ingeniería Mecánica", "Tecnología en Mecatrónica", "Tecnología en Electrónica", "Tecnología en Sistemas Informáticos"]
      },
      {
        name: "Facultad de Tecnologías",
        careers: ["Tecnología en Mecánica Industrial", "Tecnología en Producción", "Tecnología en Automatización Industrial"]
      },
    ]
  },

  // ── UNAL ──────────────────────────────────────────────────────────
  "unal.edu.co": {
    name: "Universidad Nacional de Colombia",
    campuses: [
      { id: "unal-medellin",  label: "Sede Medellín",  city: "Medellín",  department: "Antioquia" },
      { id: "unal-bogota",    label: "Sede Bogotá",    city: "Bogotá",    department: "Cundinamarca" },
      { id: "unal-manizales", label: "Sede Manizales", city: "Manizales", department: "Caldas" },
      { id: "unal-palmira",   label: "Sede Palmira",   city: "Palmira",   department: "Valle del Cauca" },
    ],
    faculties: [
      {
        name: "Facultad de Arquitectura",
        careers: ["Arquitectura", "Diseño Gráfico", "Diseño Industrial", "Diseño de la Comunicación Gráfica"]
      },
      {
        name: "Facultad de Ciencias",
        careers: ["Biología", "Física", "Geología", "Matemáticas", "Química", "Estadística", "Ciencias de la Computación"]
      },
      {
        name: "Facultad de Ciencias Agrarias",
        careers: ["Agronomía", "Zootecnia", "Ingeniería Agronómica", "Ingeniería Agrícola", "Ingeniería Forestal"]
      },
      {
        name: "Facultad de Ciencias Económicas",
        careers: ["Economía", "Administración de Empresas", "Contaduría Pública"]
      },
      {
        name: "Facultad de Ciencias Humanas",
        careers: ["Antropología", "Historia", "Filosofía", "Geografía", "Psicología", "Sociología", "Trabajo Social", "Lingüística"]
      },
      {
        name: "Facultad de Derecho, Ciencias Políticas y Sociales",
        careers: ["Derecho", "Ciencia Política"]
      },
      {
        name: "Facultad de Enfermería",
        careers: ["Enfermería"]
      },
      {
        name: "Facultad de Ingeniería",
        careers: ["Ingeniería Civil", "Ingeniería de Sistemas", "Ingeniería Eléctrica", "Ingeniería Electrónica", "Ingeniería Industrial", "Ingeniería Mecánica", "Ingeniería Química", "Ingeniería Agrícola"]
      },
      {
        name: "Facultad de Medicina",
        careers: ["Medicina", "Terapia Ocupacional", "Nutrición y Dietética", "Fisioterapia"]
      },
      {
        name: "Facultad de Minas",
        careers: ["Ingeniería de Minas y Metalurgia", "Ingeniería Ambiental", "Ingeniería Civil", "Ingeniería Eléctrica", "Ingeniería Geológica", "Ingeniería Industrial", "Ingeniería Mecánica", "Ingeniería Química", "Ingeniería de Sistemas"]
      },
    ]
  },

  // ── UNIMINUTO ─────────────────────────────────────────────────────
  "uniminuto.edu.co": {
    name: "UNIMINUTO",
    campuses: [
      { id: "uniminuto-bello",  label: "Seccional Bello",       city: "Bello",  department: "Antioquia" },
      { id: "uniminuto-bogota", label: "Sede Principal Bogotá", city: "Bogotá", department: "Cundinamarca" },
      { id: "uniminuto-cali",   label: "Seccional Cali",        city: "Cali",   department: "Valle del Cauca" },
    ],
    faculties: [
      {
        name: "Facultad de Ciencias de la Comunicación",
        careers: ["Comunicación Social y Periodismo", "Publicidad y Mercadeo", "Diseño Gráfico"]
      },
      {
        name: "Facultad de Ciencias Empresariales",
        careers: ["Administración de Empresas", "Contaduría Pública", "Economía", "Negocios Internacionales", "Administración en Salud"]
      },
      {
        name: "Facultad de Ciencias Humanas y Sociales",
        careers: ["Psicología", "Trabajo Social", "Filosofía"]
      },
      {
        name: "Facultad de Educación",
        careers: ["Licenciatura en Educación Básica", "Licenciatura en Educación Infantil", "Licenciatura en Humanidades y Lengua Castellana", "Licenciatura en Inglés como Lengua Extranjera"]
      },
      {
        name: "Facultad de Ingeniería",
        careers: ["Ingeniería de Sistemas", "Ingeniería Civil", "Ingeniería Agroecológica", "Tecnología en Informática", "Tecnología en Gestión de Redes"]
      },
    ]
  },

  // ── EAFIT ─────────────────────────────────────────────────────────
  "eafit.edu.co": {
    name: "Universidad EAFIT",
    campuses: [
      { id: "eafit-medellin", label: "Campus Medellín", city: "Medellín", department: "Antioquia" },
      { id: "eafit-bogota",   label: "Sede Bogotá",     city: "Bogotá",   department: "Cundinamarca" },
      { id: "eafit-pereira",  label: "Sede Pereira",    city: "Pereira",  department: "Risaralda" },
    ],
    faculties: [
      {
        name: "Escuela de Administración",
        careers: ["Administración de Empresas", "Negocios Internacionales", "Contaduría Pública", "Administración de Negocios"]
      },
      {
        name: "Escuela de Derecho",
        careers: ["Derecho"]
      },
      {
        name: "Escuela de Economía y Finanzas",
        careers: ["Economía", "Finanzas", "Economía y Negocios Internacionales"]
      },
      {
        name: "Escuela de Humanidades",
        careers: ["Comunicación Social", "Música", "Filosofía", "Literatura"]
      },
      {
        name: "Escuela de Ingeniería",
        careers: ["Ingeniería de Sistemas", "Ingeniería Civil", "Ingeniería de Producción", "Ingeniería Mecánica", "Ingeniería Matemática", "Ingeniería Física"]
      },
      {
        name: "Escuela de Ciencias",
        careers: ["Física", "Matemáticas", "Biología"]
      },
    ]
  },

  // ── UPB ───────────────────────────────────────────────────────────
  "upb.edu.co": {
    name: "Universidad Pontificia Bolivariana",
    campuses: [
      { id: "upb-medellin",     label: "Campus Medellín",          city: "Medellín",     department: "Antioquia" },
      { id: "upb-bucaramanga",  label: "Seccional Bucaramanga",    city: "Bucaramanga",  department: "Santander" },
      { id: "upb-monteria",     label: "Seccional Montería",       city: "Montería",     department: "Córdoba" },
      { id: "upb-palmira",      label: "Seccional Palmira",        city: "Palmira",      department: "Valle del Cauca" },
    ],
    faculties: [
      {
        name: "Facultad de Ciencias Económicas y Administrativas",
        careers: ["Administración de Empresas", "Contaduría Pública", "Economía", "Negocios Internacionales", "Gestión Comercial"]
      },
      {
        name: "Facultad de Derecho y Ciencias Políticas",
        careers: ["Derecho", "Ciencia Política"]
      },
      {
        name: "Facultad de Ingeniería",
        careers: ["Ingeniería Civil", "Ingeniería de Sistemas", "Ingeniería Electrónica", "Ingeniería Industrial", "Ingeniería Mecánica", "Ingeniería Biomédica", "Ingeniería de Software", "Ingeniería Eléctrica"]
      },
      {
        name: "Facultad de Arquitectura y Diseño",
        careers: ["Arquitectura", "Diseño Gráfico", "Diseño Industrial"]
      },
      {
        name: "Facultad de Psicología",
        careers: ["Psicología"]
      },
      {
        name: "Facultad de Comunicación Social",
        careers: ["Comunicación Social", "Publicidad", "Periodismo"]
      },
      {
        name: "Facultad de Medicina",
        careers: ["Medicina"]
      },
      {
        name: "Escuela de Teología, Filosofía y Humanidades",
        careers: ["Filosofía", "Teología"]
      },
    ]
  },

  // ── Politécnico Colombiano ────────────────────────────────────────
  "elpoli.edu.co": {
    name: "Politécnico Colombiano Jaime Isaza Cadavid",
    campuses: [
      { id: "poli-medellin", label: "Campus Robledo", city: "Medellín", department: "Antioquia" },
    ],
    faculties: [
      {
        name: "Facultad de Administración",
        careers: ["Administración Deportiva", "Tecnología en Administración y Gestión de Empresas"]
      },
      {
        name: "Facultad de Comunicación Audiovisual",
        careers: ["Comunicación Audiovisual"]
      },
      {
        name: "Facultad de Ciencias Agropecuarias",
        careers: ["Ingeniería Agropecuaria", "Tecnología en Gestión Agropecuaria"]
      },
      {
        name: "Facultad de Educación Física, Recreación y Deporte",
        careers: ["Educación Física y Deportes", "Recreación"]
      },
      {
        name: "Facultad de Ingenierías",
        careers: ["Ingeniería de Telecomunicaciones", "Ingeniería Informática", "Ingeniería Electrónica", "Ingeniería Eléctrica", "Tecnología en Electrónica", "Tecnología en Telecomunicaciones"]
      },
    ]
  },

  // ── Universidad de Medellín ───────────────────────────────────────
  "udem.edu.co": {
    name: "Universidad de Medellín",
    campuses: [
      { id: "udem-medellin", label: "Campus Universitario", city: "Medellín", department: "Antioquia" },
    ],
    faculties: [
      {
        name: "Facultad de Ciencias Básicas",
        careers: ["Matemáticas Aplicadas", "Estadística"]
      },
      {
        name: "Facultad de Ciencias Económicas y Administrativas",
        careers: ["Administración de Negocios", "Contaduría Pública", "Economía", "Mercadeo", "Negocios Internacionales"]
      },
      {
        name: "Facultad de Ciencias Jurídicas",
        careers: ["Derecho"]
      },
      {
        name: "Facultad de Comunicación",
        careers: ["Comunicación y Relaciones Corporativas", "Publicidad"]
      },
      {
        name: "Facultad de Ingeniería",
        careers: ["Ingeniería Ambiental", "Ingeniería Civil", "Ingeniería de Sistemas", "Ingeniería de Software", "Ingeniería Financiera", "Ingeniería Industrial", "Ingeniería de Telecomunicaciones", "Tecnología en Gestión de Sistemas"]
      },
      {
        name: "Facultad de Ciencias Sociales y Humanas",
        careers: ["Psicología", "Sociología", "Trabajo Social"]
      },
    ]
  },

  // ── Universidad CES ───────────────────────────────────────────────
  "ces.edu.co": {
    name: "Universidad CES",
    campuses: [
      { id: "ces-medellin", label: "Campus CES", city: "Medellín", department: "Antioquia" },
    ],
    faculties: [
      {
        name: "Facultad de Derecho",
        careers: ["Derecho"]
      },
      {
        name: "Facultad de Medicina",
        careers: ["Medicina"]
      },
      {
        name: "Facultad de Medicina Veterinaria y Zootecnia",
        careers: ["Medicina Veterinaria y Zootecnia"]
      },
      {
        name: "Facultad de Odontología",
        careers: ["Odontología"]
      },
      {
        name: "Facultad de Psicología",
        careers: ["Psicología"]
      },
      {
        name: "Facultad de Salud Pública",
        careers: ["Salud Pública", "Gerencia de Sistemas de Salud", "Regencia de Farmacia"]
      },
    ]
  },

  // ── LinkUp HQ (admin) ─────────────────────────────────────────────
  "admin.linkup.dev": {
    name: "LinkUp",
    campuses: [
      { id: "linkup-hq", label: "LinkUp HQ", city: "Medellín", department: "Antioquia" }
    ],
    faculties: [
      {
        name: "Diseño de Producto",
        careers: ["UX/UI Design", "Diseño de Experiencias", "Diseño de Interfaces"]
      },
      {
        name: "Ingeniería de Software",
        careers: ["Desarrollo Backend", "Desarrollo Frontend", "Ingeniería de Software", "DevOps"]
      },
    ]
  },

};

export const VALID_DOMAINS = Object.keys(INSTITUTIONS);

export const INSTITUTION_LIST = Object.entries(INSTITUTIONS).map(([domain, data]) => ({
  domain,
  name:      data.name,
  campuses:  data.campuses,
  faculties: data.faculties ?? []
}));
