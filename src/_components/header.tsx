import Link from "next/link";

export default function Header() {

    return (
        <>
            <div className="bg-[#000000] h-40 m-0 p-0">
                <h1 className="text-white relative overflow-hidden text-3xl mt-0 mb-0 pt-6 flex align-middle justify-center-safe">Lista de Vídeos</h1>
                <Link className="text-white flex justify-end px-10 text-1xl" href="/new">➕ Adicionar Vídeo</Link>
            </div>
        </>
    );
}
