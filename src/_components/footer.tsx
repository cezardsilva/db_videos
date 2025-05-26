import Link from "next/link";

export default function Footer() {
  return (
        <>
            <div className="bg-[#000000] h-20 m-0 pt-4 p-0">
                <Link className="text-white flex justify-center pt-5 pb-5 text-1xl" href="/new">&copy; 2025 Cezar D Silva</Link>
            </div>
        </>
  );
}
