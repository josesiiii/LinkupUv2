// src/config/institutions.js

export const INSTITUTIONS = {
  "soy.sena.edu.co": {
    name: "SENA",
    campuses: [
      { id: "sena-medellin-centro",      label: "Centro de Servicios y Gestión Empresarial", city: "Medellín",     department: "Antioquia" },
      { id: "sena-medellin-industrial",  label: "Centro Industrial del Diseño y la Manufactura", city: "Medellín", department: "Antioquia" },
      { id: "sena-bello",                label: "Centro Tecnológico del Mobiliario",          city: "Bello",        department: "Antioquia" },
      { id: "sena-bogota-industrial",    label: "Centro de Gestión Industrial",               city: "Bogotá",       department: "Cundinamarca" },
      { id: "sena-cali-industrial",      label: "Centro Industrial y Desarrollo Empresarial", city: "Cali",         department: "Valle del Cauca" },
      { id: "sena-barranquilla",         label: "Centro para el Desarrollo Agroempresarial",  city: "Barranquilla", department: "Atlántico" },
    ]
  },
  "itm.edu.co": {
    name: "Instituto Tecnológico Metropolitano",
    campuses: [
      { id: "itm-robledo",    label: "Campus Robledo",    city: "Medellín", department: "Antioquia" },
      { id: "itm-fraternidad", label: "Campus Fraternidad", city: "Medellín", department: "Antioquia" },
      { id: "itm-campo-amor", label: "Campus Campo Amor", city: "Medellín", department: "Antioquia" },
    ]
  },
  "udea.edu.co": {
    name: "Universidad de Antioquia",
    campuses: [
      { id: "udea-ciudadela",        label: "Ciudad Universitaria",  city: "Medellín",              department: "Antioquia" },
      { id: "udea-oriente",          label: "Seccional Oriente",     city: "El Carmen de Viboral",  department: "Antioquia" },
      { id: "udea-uraba",            label: "Seccional Urabá",       city: "Apartadó",              department: "Antioquia" },
      { id: "udea-suroeste",         label: "Seccional Suroeste",    city: "Andes",                 department: "Antioquia" },
    ]
  },
  "pascualbravo.edu.co": {
    name: "Institución Universitaria Pascual Bravo",
    campuses: [
      { id: "pascual-robledo", label: "Campus Robledo", city: "Medellín", department: "Antioquia" },
    ]
  },
  "unal.edu.co": {
    name: "Universidad Nacional de Colombia",
    campuses: [
      { id: "unal-medellin",  label: "Sede Medellín",  city: "Medellín",  department: "Antioquia" },
      { id: "unal-bogota",    label: "Sede Bogotá",    city: "Bogotá",    department: "Cundinamarca" },
      { id: "unal-manizales", label: "Sede Manizales", city: "Manizales", department: "Caldas" },
      { id: "unal-palmira",   label: "Sede Palmira",   city: "Palmira",   department: "Valle del Cauca" },
    ]
  },
  "uniminuto.edu.co": {
    name: "UNIMINUTO",
    campuses: [
      { id: "uniminuto-bello",  label: "Seccional Bello",       city: "Bello",   department: "Antioquia" },
      { id: "uniminuto-bogota", label: "Sede Principal Bogotá", city: "Bogotá",  department: "Cundinamarca" },
      { id: "uniminuto-cali",   label: "Seccional Cali",        city: "Cali",    department: "Valle del Cauca" },
    ]
  },"admin.linkup.dev": {
    name: "LinkUp",
    campuses: [
      {
        id: "linkup-hq",
        label: "LinkUp HQ",
        city: "Medellín",
        department: "Antioquia"
      }
    ]
  },
};

export const VALID_DOMAINS = Object.keys(INSTITUTIONS);