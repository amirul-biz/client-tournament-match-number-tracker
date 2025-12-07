import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParticipantService } from './participant.service';
import { CreateParticipantDto } from './dto/create-participant.dto';
import * as XLSX from 'xlsx';

export interface IFileUploadResponse {
  participantName: string;
  categoryId: string;
  teamId: string
}

export interface IResponseMapper {
  teamId: number;
  participantName: string;
  categoryId: number;
}

@ApiTags('participant')
@Controller('participant')
export class ParticipantController {
  constructor(private participantService: ParticipantService) {}

  @Post()
  create(@Body() createParticipantDto: CreateParticipantDto) {
    return this.participantService.create(
      createParticipantDto.name,
      createParticipantDto.teamId,
      createParticipantDto.categoryId
    );
  }

  @Get()
  findAll() {
    return this.participantService.findAll();
  }

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
    const data = XLSX.utils.sheet_to_json(worksheet) as CreateParticipantDto[];

  
    // You can now process the 'data' array (e.g., save to database)
    console.log(data);

    this.participantService.createMany(data)


    return { message: 'File processed successfully', data };
  }


}
