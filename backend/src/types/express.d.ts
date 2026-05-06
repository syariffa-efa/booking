import "express";

declare module "express" {
  export interface Request {
    user?: {
      id: number;
      id_users?: number;
      role?: string;
    };
  }
}