export default function MapSection() {
    return (
      <div className="w-full mt-12 px-10">
  
        <h2 className="text-xl font-semibold mb-4">Lokasi Klinik Annisa</h2>
  
        <div className="w-full overflow-hidden rounded-2xl">
  <iframe
    className="w-full h-[350px]"
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.574159856407!2d106.60206457503736!3d-6.187697493799867!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69fefb5e994293%3A0xa524acfcc8b9ff29!2sRS%20AN-NISA%20Tangerang!5e0!3m2!1sid!2sid!4v1778148035547!5m2!1sid!2sid"
    allowFullScreen
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
  />
</div>
  
      </div>
    );
  }