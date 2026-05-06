export default function MapSection() {
    return (
      <div className="w-full mt-12 px-10">
  
        <h2 className="text-xl font-semibold mb-4">Lokasi Klinik Annisa</h2>
  
        <iframe
          className="w-full h-[300px] rounded-xl"
          src="https://www.google.com/maps/embed?pb=!1m18..."
          loading="lazy"
        />
  
      </div>
    );
  }