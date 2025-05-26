"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button"


export default function CreateVideo() {
  const [isClient, setIsClient] = useState<boolean>(false);
  const router = useRouter();
  const [form, setForm] = useState<{
    title: string;
    description: string;
    link: string;
    thumbnail: string;
    duration: string;
  }>({ title: "", description: "", link: "", thumbnail: "", duration: "" });


  useEffect(() => {
    setIsClient(true);
  }, []);

  // Agora verificamos `isClient` dentro do JSX, sem impedir o React de montar os hooks
  if (!isClient || typeof window === "undefined") {
    return <h1>Carregando...</h1>; // Substituímos `null` para evitar o erro
  }

  const convertDurationToSeconds = (duration: string): number => {
    const [hours, minutes, seconds] = duration.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Enviando dados:", form);

    if (!form.title || !form.description || !form.link || !form.thumbnail || !form.duration) {
      alert("Todos os campos são obrigatórios!");
      return;
    }

    try {
      const formattedData = {
        ...form,
        duration: convertDurationToSeconds(form.duration), // Converte para número antes de enviar
      };

      await axios.post("https://node-api-fvge.onrender.com/videos", formattedData);
      alert("Vídeo criado com sucesso!");
      router.push("/");
    } catch (error) {
      console.error("Erro ao criar vídeo:", error);
      alert("Erro ao criar vídeo. Verifique os dados e tente novamente.");
    }
  };


  return (
    <>
      <div className="bg-[#000000] h-screen m-0 p-0">

        <h1 className="text-white relative overflow-hidden text-3xl mt-0 mb-0 pt-6 flex align-middle justify-center-safe">Criar Novo Vídeo</h1>

        <div>
          <Link className="text-white flex justify-end px-10 text-1xl" href="/">✔️ Home</Link>
        </div>
        <div className="flex align-middle justify-center mt-20">
          <form className="flex align-middle justify-center flex-col" onSubmit={handleSubmit}>
            <input className="bg-[#fff] mb-1 h-9 w-96 border-2 rounded-sm" type="text" placeholder="Título" onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <input className="bg-[#fff] mb-1 h-9 w-96 border-2 rounded-sm" type="text" placeholder="Descrição" onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <input className="bg-[#fff] mb-1 h-9 w-96 border-2 rounded-sm" type="text" placeholder="Link do vídeo" onChange={(e) => setForm({ ...form, link: e.target.value })} />
            <input
              className="bg-[#fff] mb-1 h-9 w-96 border-2 rounded-sm"
              type="text"
              placeholder="Imagem Thumbnail"
              onChange={(e) => {
                const videoLink = form.link; // Pegamos o link do vídeo
                const youtubeId = videoLink.match(/(?:youtu\.be\/|v=)([\w-]{11})/)?.[1]; // Captura o ID do vídeo
                setForm({
                  ...form,
                  thumbnail: youtubeId 
                    ? `https://img.youtube.com/vi/${youtubeId}/0.jpg`
                    : e.target.value, // Se não for do YouTube, usa o valor inserido
                });
              }}

            />
            <input
              className="bg-[#fff] mb-1 h-9 w-96 border-2 rounded-sm"
              type="text"
              placeholder="Duração (hh:mm:ss)"
              onChange={(e) => setForm({ ...form, duration: e.target.value })} // Apenas captura o valor
              onBlur={(e) => {
                const value = e.target.value;
                const regex = /^\d{2}:\d{2}:\d{2}$/; // Regex para validar hh:mm:ss

                if (!regex.test(value)) {
                  alert("Formato inválido! Use hh:mm:ss");
                }
              }}

            />
            <Button className="bg-[#15409e] cursor-pointer duration-500 hover:bg-sky-700 text-white rounded-sm h-12" type="submit">Criar</Button>
          </form>
        </div>
      </div>
    </>
  );
}
