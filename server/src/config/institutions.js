// src/config/institutions.js

export const INSTITUTIONS = {

  // ── SENA ──────────────────────────────────────────────────────────
  "soy.sena.edu.co": {
    name: "Servicio Nacional de Aprendizaje (SENA)",
    campuses: [
      { id: "sena-comercio",     label: "Centro de Comercio",                                       city: "Medellín", department: "Antioquia" },
      { id: "sena-salud",        label: "Centro de Servicios de Salud",                             city: "Medellín", department: "Antioquia" },
      { id: "sena-gestion",      label: "Centro de Servicios y Gestión Empresarial",                city: "Medellín", department: "Antioquia" },
      { id: "sena-textil",       label: "Centro Textil y de Gestión Industrial",                    city: "Itagüí",   department: "Antioquia" },
      { id: "sena-manufactura",  label: "Centro de Tecnología de la Manufactura Avanzada",          city: "Medellín",   department: "Antioquia" },
      { id: "sena-habitat",      label: "Centro para el Desarrollo del Hábitat y la Construcción",  city: "Medellín", department: "Antioquia" },
      { id: "sena-moda",         label: "Centro de Formación en Diseño, Confección y Moda",         city: "Itagüí",   department: "Antioquia" },
      { id: "sena-salada",       label: "Centro de Recursos Naturales Renovables La Salada",        city: "Caldas",   department: "Antioquia" },
      { id: "sena-mobiliario",   label: "Centro Tecnológico del Mobiliario",                        city: "Bello",    department: "Antioquia" },
      { id: "sena-complejo-sur", label: "Complejo Sur",                                             city: "Itagüí",   department: "Antioquia" },
    ],
    faculties: [
      {
        name: "Centro de Comercio",
        careers: [
          "Técnico en Venta de Productos y Servicios",
          "Técnico en Operaciones Comerciales y Financieras",
          "Tecnólogo en Gestión de Mercados",
          "Tecnólogo en Gestión Logística",
          "Técnico en Asistencia en Organización de Archivos",
          "Técnico en Servicios Postales y Afines",
        ]
      },
      {
        name: "Centro de Servicios de Salud",
        careers: [
          "Técnico en Auxiliar de Enfermería",
          "Técnico en Auxiliar Administrativo en Salud",
          "Técnico en Atención Integral a la Primera Infancia",
          "Técnico en Farmacia",
          "Tecnólogo en Regencia de Farmacia",
          "Técnico en Cosmetología y Estética Integral",
        ]
      },
      {
        name: "Centro de Servicios y Gestión Empresarial",
        careers: [
          "Técnico en Asistencia Administrativa",
          "Técnico en Contabilización de Operaciones Comerciales y Financieras",
          "Técnico en Programación de Software",
          "Tecnólogo en Análisis y Desarrollo de Software",
          "Tecnólogo en Gestión Empresarial",
          "Tecnólogo en Gestión del Talento Humano",
          "Tecnólogo en Negociación Internacional",
          "Tecnólogo en Gestión de Redes de Datos",
        ]
      },
      {
        name: "Centro Textil y de Gestión Industrial",
        careers: [
          "Técnico en Confección Industrial",
          "Técnico en Operación de Equipos de Producción Textil",
          "Técnico en Tejeduría",
          "Tecnólogo en Diseño para la Industria de la Moda",
          "Tecnólogo en Gestión Industrial",
        ]
      },
      {
        name: "Centro de Tecnología de la Manufactura Avanzada",
        careers: [
          "Técnico en Electricidad Industrial",
          "Técnico en Mantenimiento Electromecánico Industrial",
          "Técnico en Operación de Equipos de Control Numérico",
          "Técnico en Sistemas",
          "Tecnólogo en Automatización Industrial",
          "Tecnólogo en Mecatrónica Industrial",
        ]
      },
      {
        name: "Centro para el Desarrollo del Hábitat y la Construcción",
        careers: [
          "Técnico en Acabados de Construcción",
          "Técnico en Construcción de Obras Civiles",
          "Técnico en Electricidad Residencial y Comercial",
          "Técnico en Instalaciones Hidrosanitarias",
          "Tecnólogo en Gestión de Proyectos de Construcción",
        ]
      },
      {
        name: "Centro de Formación en Diseño, Confección y Moda",
        careers: [
          "Técnico en Bordado y Decoración Textil",
          "Técnico en Confección Artística",
          "Técnico en Patronaje y Confección para Moda",
          "Tecnólogo en Diseño de Modas",
        ]
      },
      {
        name: "Centro de Recursos Naturales Renovables La Salada",
        careers: [
          "Técnico en Acuicultura",
          "Técnico en Floricultura",
          "Técnico en Guianza Turística",
          "Técnico en Manejo Ambiental",
          "Técnico en Producción Agropecuaria",
          "Tecnólogo en Gestión de Recursos Naturales Renovables",
        ]
      },
      {
        name: "Centro Tecnológico del Mobiliario",
        careers: [
          "Técnico en Acabado de Superficies de Madera",
          "Técnico en Producción de Muebles y Madera",
          "Técnico en Tapizado",
          "Tecnólogo en Diseño y Fabricación de Muebles",
        ]
      },
    ]
  },

  // ── ITM ───────────────────────────────────────────────────────────
  "itm.edu.co": {
    name: "Instituto Tecnológico Metropolitano",
    campuses: [
      { id: "itm-fraternidad", label: "Campus Fraternidad", city: "Medellín", department: "Antioquia" },
      { id: "itm-robledo",     label: "Campus Robledo",     city: "Medellín", department: "Antioquia" },
      { id: "itm-floresta",    label: "Campus Floresta",    city: "Medellín", department: "Antioquia" },
      { id: "itm-castilla",    label: "Campus Castilla",    city: "Medellín", department: "Antioquia" },
    ],
    faculties: [
      {
        name: "Facultad de Artes y Humanidades",
        careers: [
          "Artes Plásticas y Visuales",
          "Tecnología en Comunicación Gráfica",
          "Tecnología en Gestión Cultural",
          "Tecnología en Publicidad",
        ]
      },
      {
        name: "Facultad de Ciencias Económicas y Administrativas",
        careers: [
          "Administración Tecnológica",
          "Contaduría Pública",
          "Ingeniería Financiera",
          "Tecnología en Gestión Administrativa",
          "Tecnología en Gestión de Mercados",
          "Tecnología en Gestión Financiera",
        ]
      },
      {
        name: "Facultad de Ciencias Exactas y Aplicadas",
        careers: [
          "Biología Aplicada",
          "Física Aplicada",
          "Matemáticas Aplicadas",
          "Química Aplicada",
        ]
      },
      {
        name: "Facultad de Ingenierías",
        careers: [
          "Ingeniería Biomédica",
          "Ingeniería de Sistemas",
          "Ingeniería Electrónica",
          "Ingeniería Industrial",
          "Ingeniería Mecatrónica",
          "Tecnología en Desarrollo de Software",
          "Tecnología en Electromedicina",
          "Tecnología en Electrónica",
        ]
      },
    ]
  },

  // ── UdeA ──────────────────────────────────────────────────────────
  "udea.edu.co": {
    name: "Universidad de Antioquia",
    campuses: [
      { id: "udea-ciudad-universitaria", label: "Ciudad Universitaria",        city: "Medellín",             department: "Antioquia" },
      { id: "udea-ciudadela-robledo",    label: "Ciudadela Robledo",           city: "Medellín",             department: "Antioquia" },
      { id: "udea-area-salud",           label: "Área de la Salud",            city: "Medellín",             department: "Antioquia" },
      { id: "udea-ciencias-agrarias",    label: "Campus de Ciencias Agrarias", city: "Medellín",             department: "Antioquia" },
      { id: "udea-oriente",              label: "Seccional Oriente",           city: "El Carmen de Viboral", department: "Antioquia" },
      { id: "udea-uraba",                label: "Seccional Urabá",             city: "Apartadó",             department: "Antioquia" },
      { id: "udea-suroeste",             label: "Seccional Suroeste",          city: "Andes",                department: "Antioquia" },
      { id: "udea-nordeste",             label: "Seccional Nordeste",          city: "Amalfi",               department: "Antioquia" },
      { id: "udea-magdalena-medio",      label: "Seccional Magdalena Medio",   city: "Puerto Berrío",        department: "Antioquia" },
      { id: "udea-bajo-cauca",           label: "Seccional Bajo Cauca",        city: "Caucasia",             department: "Antioquia" },
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
        careers: ["Artes Plásticas", "Artes Visuales", "Educación Artística", "Música", "Teatro"]
      },
      {
        name: "Facultad de Ciencias Agrarias",
        careers: ["Ingeniería Agroindustrial", "Ingeniería Agropecuaria", "Ingeniería Forestal", "Zootecnia"]
      },
      {
        name: "Facultad de Ciencias Económicas",
        careers: ["Administración de Empresas", "Contaduría Pública", "Economía", "Negocios Internacionales"]
      },
      {
        name: "Facultad de Ciencias Exactas y Naturales",
        careers: ["Biología", "Estadística", "Física", "Matemáticas", "Química"]
      },
      {
        name: "Facultad de Ciencias Farmacéuticas y Alimentarias",
        careers: ["Farmacia", "Ingeniería de Alimentos", "Tecnología en Regencia de Farmacia"]
      },
      {
        name: "Facultad de Ciencias Sociales y Humanas",
        careers: ["Antropología", "Filosofía", "Historia", "Psicología", "Sociología", "Trabajo Social"]
      },
      {
        name: "Facultad de Comunicaciones y Filología",
        careers: ["Comunicación Social", "Lingüística", "Literatura", "Periodismo", "Publicidad"]
      },
      {
        name: "Facultad de Derecho y Ciencias Políticas",
        careers: ["Ciencia Política", "Derecho"]
      },
      {
        name: "Facultad de Educación",
        careers: [
          "Educación",
          "Licenciatura en Ciencias Naturales y Educación Ambiental",
          "Licenciatura en Humanidades y Lengua Castellana",
          "Licenciatura en Matemáticas",
        ]
      },
      {
        name: "Facultad de Enfermería",
        careers: ["Administración en Salud", "Enfermería"]
      },
      {
        name: "Facultad de Ingeniería",
        careers: [
          "Ingeniería Civil",
          "Ingeniería de Sistemas",
          "Ingeniería Eléctrica",
          "Ingeniería Electrónica",
          "Ingeniería Industrial",
          "Ingeniería Química",
          "Ingeniería Sanitaria y Ambiental",
        ]
      },
      {
        name: "Facultad de Medicina",
        careers: ["Instrumentación Quirúrgica", "Medicina"]
      },
      {
        name: "Facultad de Odontología",
        careers: ["Odontología"]
      },
      {
        name: "Facultad de Salud Pública",
        careers: ["Gerencia en Salud", "Salud Pública", "Tecnología en Regencia de Farmacia"]
      },
      {
        name: "Instituto de Filosofía",
        careers: ["Filosofía"]
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
      { id: "unal-el-volador", label: "Campus El Volador (Sede Medellín)", city: "Medellín",  department: "Antioquia" },
      { id: "unal-del-rio",    label: "Campus del Río (Sede Medellín)",    city: "Medellín",  department: "Antioquia" },
      { id: "unal-bogota",     label: "Sede Bogotá",                       city: "Bogotá",    department: "Cundinamarca" },
      { id: "unal-manizales",  label: "Sede Manizales",                    city: "Manizales", department: "Caldas" },
      { id: "unal-palmira",    label: "Sede Palmira",                      city: "Palmira",   department: "Valle del Cauca" },
    ],
    faculties: [
      {
        name: "Facultad de Arquitectura",
        careers: ["Arquitectura", "Diseño de la Comunicación Gráfica", "Diseño Gráfico", "Diseño Industrial"]
      },
      {
        name: "Facultad de Ciencias",
        careers: ["Biología", "Ciencias de la Computación", "Estadística", "Física", "Geología", "Matemáticas", "Química"]
      },
      {
        name: "Facultad de Ciencias Agrarias",
        careers: ["Agronomía", "Ingeniería Agrícola y Ambiental", "Ingeniería Biológica", "Ingeniería Forestal", "Zootecnia"]
      },
      {
        name: "Facultad de Ciencias Humanas y Económicas",
        careers: ["Ciencia Política", "Economía", "Filosofía", "Historia", "Historia del Arte", "Sociología", "Trabajo Social"]
      },
      {
        name: "Facultad de Minas",
        careers: [
          "Ingeniería Administrativa",
          "Ingeniería Civil",
          "Ingeniería de Control",
          "Ingeniería de Minas y Metalurgia",
          "Ingeniería de Petróleos",
          "Ingeniería de Sistemas e Informática",
          "Ingeniería Eléctrica",
          "Ingeniería Electrónica",
          "Ingeniería Geológica",
          "Ingeniería Industrial",
          "Ingeniería Mecánica",
          "Ingeniería Química",
          "Ingeniería Sanitaria y Ambiental",
        ]
      },
    ]
  },

  // ── UNIMINUTO ─────────────────────────────────────────────────────
  "uniminuto.edu.co": {
    name: "Corporación Universitaria Minuto de Dios (UNIMINUTO)",
    campuses: [
      { id: "uniminuto-bello",   label: "Seccional Antioquia-Chocó (Bello)", city: "Bello",    department: "Antioquia" },
      { id: "uniminuto-virtual", label: "Sede Virtual y Distancia",          city: "Medellín", department: "Antioquia" },
      { id: "uniminuto-bogota",  label: "Sede Principal Bogotá",             city: "Bogotá",   department: "Cundinamarca" },
      { id: "uniminuto-cali",    label: "Seccional Cali",                    city: "Cali",     department: "Valle del Cauca" },
    ],
    faculties: [
      {
        name: "Facultad de Ciencias de la Comunicación",
        careers: ["Comunicación Social y Periodismo", "Diseño Gráfico", "Publicidad y Mercadeo"]
      },
      {
        name: "Facultad de Ciencias Empresariales",
        careers: [
          "Administración de Empresas",
          "Administración en Salud",
          "Contaduría Pública",
          "Economía",
          "Negocios Internacionales",
          "Tecnología en Gestión de Empresas",
        ]
      },
      {
        name: "Facultad de Ciencias Humanas y Sociales",
        careers: ["Filosofía", "Psicología", "Trabajo Social"]
      },
      {
        name: "Facultad de Educación",
        careers: [
          "Licenciatura en Educación Básica con Énfasis en Tecnología e Informática",
          "Licenciatura en Educación Infantil",
          "Licenciatura en Educación Religiosa",
          "Licenciatura en Humanidades y Lengua Castellana",
          "Licenciatura en Inglés como Lengua Extranjera",
        ]
      },
      {
        name: "Facultad de Ingeniería",
        careers: [
          "Ingeniería Agroecológica",
          "Ingeniería Civil",
          "Ingeniería de Sistemas",
          "Tecnología en Gestión de Redes de Datos",
          "Tecnología en Informática",
        ]
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
      { id: "upb-medellin",    label: "Campus Medellín",       city: "Medellín",    department: "Antioquia" },
      { id: "upb-bucaramanga", label: "Seccional Bucaramanga", city: "Bucaramanga", department: "Santander" },
      { id: "upb-monteria",    label: "Seccional Montería",    city: "Montería",    department: "Córdoba" },
      { id: "upb-palmira",     label: "Seccional Palmira",     city: "Palmira",     department: "Valle del Cauca" },
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
