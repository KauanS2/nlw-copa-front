import Image from "next/image";

import appPreviewImage from "../assets/app-preview.png";
import logoImg from "../assets/logo.svg";
import usersImg from "../assets/users-exemple.png";
import iconImg from "../assets/icon.svg";
import { api } from "../lib/axios";
import { FormEvent, useState } from "react";

interface HomeProps {
  poolCounts: number;
  guessCounts: number;
  userCounts: number;
}

export default function Home(props: HomeProps) {
  const [poolTitle, setPoolTitle] = useState<String>();

  async function createPool(event: FormEvent) {
    event.preventDefault();

    try {
      const response = await api.post("/pools", {
        title: poolTitle,
      });

      const { code } = response.data;

      await navigator.clipboard.writeText(code);

      alert(
        "Sucesso ao criar o bolão, codigo copiado para à área de tranferência!"
      );
      setPoolTitle("");
    } catch (err) {
      console.log(err);
      alert("Falha ao criar o bolão, tente novamente!");
    }
  }

  return (
    <div className="grid grid-cols-2 items-center h-screen gap-28 max-w-[1124px] mx-auto">
      <main className="flex flex-col">
        <Image src={logoImg} alt="NLW Copa" />

        <h1 className="text-white mt-14 leading-tight font-bold text-5xl">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="flex mt-10 gap-2 items-center">
          <Image src={usersImg} alt="Users imagem" />
          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{props.userCounts}</span> pessoas
            já estão usando
          </strong>
        </div>

        <form onSubmit={createPool} className="flex mt-10 gap-2">
          <input
            className="flex-1 px-6 py-4 rounded bg-gray-800 text-gray-100 border-gray-600 text-sm"
            type="text"
            required
            placeholder="Qual nome do seu Bolão?"
            value={poolTitle}
            onChange={(event) => setPoolTitle(event.target.value)}
          />
          <button
            className="bg-yellow-500 rounded font-bold uppercase text-sm py-4 px-6 hover:bg-yellow-700"
            type="submit"
          >
            Criar meu bolão
          </button>
        </form>
        <p className="text-sm text-gray-300 mt-4 leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>

        <div className="flex mt-10 pt-10 justify-between items-center border-t border-gray-600">
          <div className="flex gap-6 items-center">
            <Image src={iconImg} alt="icone" />
            <div className="flex flex-col ">
              <span className="text-gray-100 text-2xl ">
                +{props.poolCounts}
              </span>
              <span className="text-gray-100">Bolões criados </span>
            </div>
          </div>
          <div className="flex gap-6 items-center">
            <Image src={iconImg} alt="icone" />
            <div className="flex flex-col ">
              <span className="text-gray-100 text-2xl ">
                +{props.guessCounts}
              </span>
              <span className="text-gray-100 text-base">Papites enviados</span>
            </div>
          </div>
        </div>
      </main>
      <Image src={appPreviewImage} alt="Imagem" quality={100} />
    </div>
  );
}

export const getServerSideProps = async () => {
  const [poolCountResponse, guessesCountResponse, userCountResponse] =
    await Promise.all([
      api.get("pools/count"),
      api.get("guesses/count"),
      api.get("users/count"),
    ]);

  return {
    props: {
      poolCounts: poolCountResponse.data.count,
      guessCounts: guessesCountResponse.data.count,
      userCounts: userCountResponse.data.count,
    },
  };
};
