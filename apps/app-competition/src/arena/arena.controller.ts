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
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@libs';
import { ArenaService } from './arena.service';
import { CreateArenaDto, UpdateArenaDto } from './arena.dto';
import { Arena } from '@app-competition/prisma';

@ApiTags('arenas')
@Controller('arenas')
export class ArenaController {
  constructor(private readonly arenaService: ArenaService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new arena' })
  @ApiBody({ type: CreateArenaDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Arena created successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async create(@Body() createArenaDto: CreateArenaDto): Promise<Arena> {
    return this.arenaService.create(createArenaDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all arenas' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all arenas',
  })
  async findAll(): Promise<Arena[]> {
    return this.arenaService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an arena by ID' })
  @ApiParam({
    name: 'id',
    description: 'Arena UUID',
    type: String,
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Arena found',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Arena not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid UUID format',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Arena> {
    return this.arenaService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an arena' })
  @ApiParam({
    name: 'id',
    description: 'Arena UUID',
    type: String,
    format: 'uuid',
  })
  @ApiBody({ type: UpdateArenaDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Arena updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Arena not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data or UUID format',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateArenaDto: UpdateArenaDto,
  ): Promise<Arena> {
    return this.arenaService.update(id, updateArenaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an arena' })
  @ApiParam({
    name: 'id',
    description: 'Arena UUID',
    type: String,
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Arena deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Arena not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid UUID format',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.arenaService.remove(id);
  }
}
