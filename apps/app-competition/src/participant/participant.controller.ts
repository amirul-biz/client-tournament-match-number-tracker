import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import * as XLSX from 'xlsx';
import { ParticipantService } from './participant.service';
import { CreateParticipantDto, UpdateParticipantDto } from './participant.dto';
import { Participant } from '../../generated/prisma';

@ApiTags('participant')
@Controller('participant')
export class ParticipantController {
  constructor(private readonly participantService: ParticipantService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new participant' })
  @ApiBody({ type: CreateParticipantDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Participant created successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async create(@Body() createParticipantDto: CreateParticipantDto): Promise<Participant> {
    return this.participantService.create(createParticipantDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all participants' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all participants',
  })
  async findAll(): Promise<Participant[]> {
    return this.participantService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a participant by ID' })
  @ApiParam({
    name: 'id',
    description: 'Participant UUID',
    type: String,
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Participant found',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Participant not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid UUID format',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Participant> {
    return this.participantService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a participant' })
  @ApiParam({
    name: 'id',
    description: 'Participant UUID',
    type: String,
    format: 'uuid',
  })
  @ApiBody({ type: UpdateParticipantDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Participant updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Participant not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data or UUID format',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateParticipantDto: UpdateParticipantDto,
  ): Promise<Participant> {
    return this.participantService.update(id, updateParticipantDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a participant' })
  @ApiParam({
    name: 'id',
    description: 'Participant UUID',
    type: String,
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Participant deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Participant not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid UUID format',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.participantService.remove(id);
  }

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Bulk upload participants via Excel file' })
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'File processed successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid file format',
  })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet) as CreateParticipantDto[];

    const result = await this.participantService.createMany(data);

    return {
      message: 'File processed successfully',
      count: result.count,
      data,
    };
  }
}
