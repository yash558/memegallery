import Image from "next/image";
import MemeGallery from "./components/memeGallery";

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Reddit Memes Gallery</h1>
      <MemeGallery />
    </div>
  );
}
