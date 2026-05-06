import { db } from '../db';

export const generateNoAntrian = async (id_insurance: number) => {
  const jenis = id_insurance === 1 ? 'A' : 'B';

  const count = await db.query(
    `SELECT COUNT(*) FROM registrations 
     WHERE DATE(created_at) = CURRENT_DATE 
     AND id_insurance = $1`,
    [id_insurance]
  );

  const nomor = Number(count.rows[0].count) + 1;

  return `${jenis}${String(nomor).padStart(3, '0')}`;
};