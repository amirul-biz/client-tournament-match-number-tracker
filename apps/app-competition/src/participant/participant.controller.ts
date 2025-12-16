import { Participant } from '@app-competition/prisma';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import * as XLSX from 'xlsx';
import { CreateParticipantDto, UpdateParticipantDto } from './participant.dto';
import { ParticipantService } from './participant.service';

@ApiTags('participant')
@Controller('participant')
export class ParticipantController {
  private readonly logger = new Logger(ParticipantController.name);

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

  // @Get('bout-chart')
  // @Header('Content-Type', 'application/pdf')
  // @Header('Content-Disposition', 'attachment; filename="tournament-brackets.pdf"')
  // async getParticipantsBoutChart(): Promise<StreamableFile> {
  //   const participants = await this.participantService.findAll();
  //   const arenaIds = ['arena-1', 'arena-2'];
  //   const prefixes: [string, string] = ['Blue', 'Red'];
  //   const boutCharts = generateTournamentSchedule(arenaIds, prefixes, participants);
  //   Logger.log(boutCharts, 'Bout Charts Generated');
  //   const pdfBytes = await generateBracketPdf(boutCharts);
  //   const buffer = Buffer.from(pdfBytes);

  //   return new StreamableFile(buffer);
  // }

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
    @Body() updateParticipantDto: UpdateParticipantDto
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
    try {
      if (!file) {
        throw new BadRequestException('No file uploaded');
      }

      this.logger.log(`Processing file: ${file.originalname}, size: ${file.size} bytes`);

      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rawData = XLSX.utils.sheet_to_json(worksheet);

      this.logger.log(`Found ${rawData.length} rows in Excel file`);

      // Validate and transform data - handle different column name variations
      const data: CreateParticipantDto[] = rawData.map((row: any) => ({
        name: row.name || row.Name || row.participantName || row['Participant Name'],
        teamId: row.teamId || row.TeamId || row.team_id || row['Team ID'],
        categoryId: row.categoryId || row.CategoryId || row.category_id || row['Category ID'],
      }));

      // Filter out invalid rows
      const validData = data.filter((item) => item.name && item.teamId && item.categoryId);

      this.logger.log(`Valid rows: ${validData.length}/${rawData.length}`);

      if (validData.length === 0) {
        throw new BadRequestException(
          'No valid data found in file. Ensure columns: name, teamId, categoryId exist'
        );
      }

      const result = await this.participantService.createMany(validData);

      this.logger.log(`Successfully inserted ${result.count} participants`);

      return {
        message: 'File processed successfully',
        totalRows: rawData.length,
        validRows: validData.length,
        inserted: result.count,
        skipped: validData.length - result.count,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`File upload failed: ${errorMessage}`, errorStack);
      throw new BadRequestException(`Failed to process file: ${errorMessage}`);
    }
  }
}
