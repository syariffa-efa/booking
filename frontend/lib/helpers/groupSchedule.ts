export const groupScheduleByDoctor = (data: any[]) => {
    const group: any = {};
  
    data.forEach((item) => {
      const doctorId = item.doctor.id_doctor;
  
      if (!group[doctorId]) {
        group[doctorId] = {
          doctor: item.doctor,
          schedules: [],
        };
      }
  
      group[doctorId].schedules.push(item);
    });
  
    return group;
  };