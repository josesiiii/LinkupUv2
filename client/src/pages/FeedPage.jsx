import useAuthStore from "../store/authStore";

function FeedPage() {

  const usuario =
    useAuthStore(
      (state) => state.usuario
    );

  return (

    <div className="min-h-screen bg-zinc-950 text-white p-10">

      <h1 className="text-4xl font-bold">
        Bienvenido {usuario?.fullName}
      </h1>

      <p className="text-zinc-400 mt-2">
        {usuario?.institution}
      </p>

    </div>

  );

}

export default FeedPage;    