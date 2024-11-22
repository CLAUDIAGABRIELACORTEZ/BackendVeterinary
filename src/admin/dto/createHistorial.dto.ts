// createHistorialMedico.dto.ts

import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateHistorialMedicoDto {
  @IsInt()
  ReservacionID: number;

  @IsOptional()
  @IsString()
  Diagnostico?: string;

  @IsOptional()
  @IsString()
  Tratamiento?: string;

  @IsOptional()
  @IsString()
  Notas?: string;
}