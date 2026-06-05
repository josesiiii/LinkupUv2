import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="relative h-screen overflow-hidden flex items-center justify-center">

      {/* Fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#fdf2f8] via-[#fce7f3] to-[#fae8ff]" />

      {/* Blob 1 */}
      <div
        className="
        absolute
        w-[700px]
        h-[700px]
        rounded-full
        bg-[#f1adc2]
        blur-[150px]
        opacity-40
        animate-pulse
      "
      />

      {/* Blob 2 */}
      <div
        className="
        absolute
        right-0
        bottom-0
        w-[500px]
        h-[500px]
        rounded-full
        bg-[#d8b4fe]
        blur-[140px]
        opacity-30
      "
      />

      <div className="relative z-10 text-center px-6">

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="
          text-6xl
          md:text-8xl
          font-black
          tracking-tight
          text-[#3c2f41]
        "
        >
          Conecta.
          <br />
          Colabora.
          <br />
          Crece.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: .4 }}
          className="
          mt-8
          text-xl
          max-w-2xl
          mx-auto
          text-[#6f5f73]
        "
        >
          La plataforma donde estudiantes encuentran
          compañeros, proyectos y oportunidades reales.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: .8 }}
          className="flex justify-center gap-4 mt-10"
        >
          <Link
            to="/register"
            className="
            px-8
            py-4
            rounded-full
            bg-[#f1adc2]
            hover:scale-105
            transition
            shadow-xl
          "
          >
            Empezar
          </Link>

          <Link
            to="/login"
            className="
            px-8
            py-4
            rounded-full
            border
            border-white/40
            backdrop-blur-xl
            bg-white/30
          "
          >
            Iniciar sesión
          </Link>
        </motion.div>

      </div>
    </section>
  );
}