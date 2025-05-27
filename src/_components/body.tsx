"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button"
import { ArrowUp } from 'lucide-react';

interface Video {
  id: number;
  title: string;
  description: string;
  link: string;
  thumbnail: string;
  duration: number;
}

export default function Body() {
  // const [videos, setVideos] = useState<Video[]>([]);
  const [videos, setVideos] = useState<Video[] | null>(null);
  const [searchVideo, setSearchVideo] = useState("");
  const [editVideo, setEditVideo] = useState<Video | null>(null);
  // const router = useRouter();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get("https://node-api-fvge.onrender.com/videos");
        setVideos(response.data);
      } catch (error) {
        console.error("Erro ao buscar vídeos:", error);
      }
    };

    fetchVideos();
  }, []);

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este vídeo?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`https://node-api-fvge.onrender.com/videos/${id}`);
      // setVideos((prevVideos) => prevVideos.filter((video) => video.id !== id));
      setVideos((prevVideos) => (prevVideos ?? []).filter((video) => video.id !== id));
      alert("Vídeo excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar vídeo:", error);
      alert("Erro ao excluir vídeo. Tente novamente.");
    }
  };

  const handleEdit = (video: Video) => setEditVideo(video);

  const handleUpdate = async () => {
    if (!editVideo) return;

    try {
      await axios.put(`https://node-api-fvge.onrender.com/videos/${editVideo.id}`, editVideo);

      setVideos((prevVideos) =>
        (prevVideos ?? []).map((video) => (video.id === editVideo?.id ? { ...video, ...editVideo } : video))
      );

      setEditVideo(null);
      alert("Vídeo atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar vídeo:", error);
      alert("Erro ao atualizar vídeo. Tente novamente.");
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) =>
    setSearchVideo(event.target.value);

  const handleClear = () => setSearchVideo("");

  // Filtrar os vídeos com base na pesquisa
  const filteredVideos = (videos ?? []).filter(video =>
    video.title.toLowerCase().includes(searchVideo.toLowerCase()) ||
    video.description.toLowerCase().includes(searchVideo.toLowerCase())
  );


  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      // Mostrar botão após 200px de scroll
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-[#000] text-white">


      <div className="flex align-middle justify-center pt-5 pb-15 relative">
        <input className="pl-2 border-2 border-amber-50 rounded-sm pt-2 pb-2 w-2xs" placeholder="🔍 Search" onChange={handleSearch} value={searchVideo} />
        <span className="pt-2 ml-65 cursor-pointer hover:text-2xl absolute" onClick={handleClear}>x</span>
      </div>

      <div className="w-3xl mx-auto max-w-3xl">
        {filteredVideos === null ? (
          <p>Carregando vídeos...</p>
        ) : filteredVideos.length === 0 ? (
          <p>Nenhum vídeo encontrado...</p>
        ) : (
          filteredVideos.map((video) => (
            <div className="bg-[#000] pb-10" key={video.id}>
              {editVideo?.id === video.id ? (

                <div className="bg-[#ffeeb7] flex flex-col align-middle justify-center p-5">
                  {/* Cada linha do grid terá 2 colunas: uma para o label e outra para o input */}
                  <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
                    {/* Título */}
                    <span className="text-black font-bold">Título:</span>
                    <input
                      className="text-black bg-[#fff] mb-1 h-9 w-full border-2 rounded-sm pl-5 pr-5"
                      type="text"
                      value={editVideo.title}
                      onChange={(e) => setEditVideo({ ...editVideo, title: e.target.value })}
                    />

                    {/* Descrição */}
                    <span className="text-black font-bold">Descrição:</span>
                    <input
                      className="text-black bg-[#fff] mb-1 h-9 w-full border-2 rounded-sm pl-5 pr-5"
                      type="text"
                      value={editVideo.description}
                      onChange={(e) => setEditVideo({ ...editVideo, description: e.target.value })}
                    />

                    {/* Link */}
                    <span className="text-black font-bold">Link:</span>
                    <input
                      className="text-black bg-[#fff] mb-1 h-9 w-full border-2 rounded-sm pl-5 pr-5"
                      type="text"
                      value={editVideo.link}
                      onChange={(e) => setEditVideo({ ...editVideo, link: e.target.value })}
                    />

                    {/* Thumbnail */}
                    <span className="text-black font-bold">Thumbnail:</span>
                    <input
                      className="text-black bg-[#fff] mb-1 h-9 w-full border-2 rounded-sm pl-5 pr-5"
                      type="text"
                      value={editVideo.thumbnail}
                      onChange={(e) => setEditVideo({ ...editVideo, thumbnail: e.target.value })}
                    />

                    {/* Duração */}
                    <span className="text-black font-bold">Duração:</span>
                    <input
                      className="text-black bg-[#fff] mb-1 h-9 w-full border-2 rounded-sm pl-5 pr-5"
                      type="number"
                      value={editVideo.duration}
                      onChange={(e) => setEditVideo({ ...editVideo, duration: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <Button className="cursor-pointer duration-500 hover:bg-sky-700 mt-5" onClick={handleUpdate}>✏️ Salvar Alterações</Button>
                </div>


              ) : (
                <div className="bg-[#4e4e4e] mx-auto max-w-2xl rounded-md mg-5 mb-10 overflow-hidden">
                  <h2 className="font-bold text-2xl max-w-full h-auto mt-5 mb-5 flex align-middle justify-center p-2.5 pt-5">{video.title}</h2>
                  <p className="text-[#fff27e] max-w-full h-auto flex align-middle justify-center p-2.5">{video.description}</p>

                  <div className="flex justify-center pt-5 pb-5">
                      <div style={{ position: "relative", display: "inline-block" }}>
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="max-w-full h-auto"
                          style={{ maxWidth: "576px", maxHeight: "384px" }}
                        />

                      </div>
                  </div>


                  <div className="flex align-middle justify-center pt-5 pb-5 gap-4">

                  </div>
                  <div className="flex align-middle justify-center pt-5 pb-5 gap-4">
                    <Button className="cursor-pointer duration-500 hover:bg-[#83733f]" onClick={() => handleDelete(video.id)}>🗑 Deletar</Button>
                    <Button className="cursor-pointer duration-500 hover:bg-[#ff7f7f]" onClick={() => window.open(video.link, "_blank")}>🎬 Assistir no YouTube</Button>
                    <Button className="cursor-pointer duration-500 hover:bg-sky-700" onClick={() => handleEdit(video)}>✏️ Editar</Button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      <Button
        className={`fixed bottom-8 right-8 w-12 h-12 rounded-full cursor-pointer transition-all duration-300 ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        onClick={scrollToTop}
      >
        <ArrowUp className="size-6"/>
      </Button>
    </div>
  );
}
