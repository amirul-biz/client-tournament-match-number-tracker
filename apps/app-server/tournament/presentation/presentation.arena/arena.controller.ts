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
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import {
  CreateArenaDto,
  UpdateArenaDto,
  ArenaResponseDto,
} from '../../domain/dtos';
import {
  CreateArenaCommand,
  UpdateArenaCommand,
  DeleteArenaCommand,
} from '../../application/commands';
import {
  GetAllArenasQuery,
  GetArenaByIdQuery,
} from '../../application/queries';

@ApiTags('arenas')
@Controller('arenas')
export class ArenaController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new arena' })
  @ApiBody({ type: CreateArenaDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Arena created successfully',
    type: ArenaResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async create(
    @Body() createArenaDto: CreateArenaDto,
  ): Promise<ArenaResponseDto> {
    return this.commandBus.execute<CreateArenaCommand, ArenaResponseDto>(
      new CreateArenaCommand(createArenaDto),
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all arenas' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all arenas',
    type: [ArenaResponseDto],
  })
  async findAll(): Promise<ArenaResponseDto[]> {
    return this.queryBus.execute<GetAllArenasQuery, ArenaResponseDto[]>(
      new GetAllArenasQuery(),
    );
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
    type: ArenaResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Arena not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid UUID format',
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ArenaResponseDto> {
    return this.queryBus.execute<GetArenaByIdQuery, ArenaResponseDto>(
      new GetArenaByIdQuery(id),
    );
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
    type: ArenaResponseDto,
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
  ): Promise<ArenaResponseDto> {
    return this.commandBus.execute<UpdateArenaCommand, ArenaResponseDto>(
      new UpdateArenaCommand(id, updateArenaDto),
    );
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
    await this.commandBus.execute<DeleteArenaCommand, void>(
      new DeleteArenaCommand(id),
    );
  }
}
