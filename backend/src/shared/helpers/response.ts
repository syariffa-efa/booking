export const successResponse = (
  res: any,
  message: string,
  data: any = null
) => {
  return res.status(200).json({
    success: true,
    message,
    data,
  });
};

export const error = (
  res: any,
  message: string,
  code: number = 500
) => {
  return res.status(code).json({
    success: false,
    message,
  });
};