import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express'; // <-- 1. Import FileInterceptor@ApiTags('participant')
import * as XLSX from 'xlsx';

export interface IFileUploadResponse {
  participantName: string;
  categoryId: number;
}

export interface IResponseMapper {
  teamId: number;
  participantName: string;
  categoryId: number;
  categoryName: string
}

@Controller('participant')
export class ParticipantController {
  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });

    // Get the first worksheet (or iterate through workbook.SheetNames to get all)
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert the worksheet data to JSON
    const data = XLSX.utils.sheet_to_json(worksheet) as IFileUploadResponse[];
    const mockTeamId = 1; // Moi TKD

    const responseData = data.map((data) => {
      return {
        teamId: mockTeamId,
        participantName: data.participantName,
        categoryId: data.categoryId,
      } as IResponseMapper;
    });

    // You can now process the 'data' array (e.g., save to database)
    console.log(responseData);

    return { message: 'File processed successfully', responseData };
  }
}
