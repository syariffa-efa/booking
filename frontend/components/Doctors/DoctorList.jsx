import api from "@/lib/api";

export default async function DoctorList() {
  let doctors = [];

  try {
    const res = await api.get("/doctors/all");
    doctors = res.data.data || [];
  } catch (error) {
    console.log("Error fetch doctors:", error);
  }

  return (
    <div className="px-6 mt-8">
      <h2 className="text-xl font-bold mb-4">
        👨‍⚕️ Semua Dokter
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {doctors.map((doc) => (
          <div
            key={doc.id_doctor}
            className="bg-white shadow rounded-xl p-3"
          >
            <img
              src={doc.foto || "/doctor.png"}
              className="h-[150px] w-full object-cover rounded-lg"
            />

            <p className="font-semibold mt-2">
              {doc.nama_dokter}, {doc.gelar}
            </p>

            <p className="text-sm text-gray-500">
              {doc.spesialisasi}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}