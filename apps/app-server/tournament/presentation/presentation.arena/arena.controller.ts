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
    private readonly queryBus: QueryBus
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new arena' })
  @ApiBody({ type: CreateArenaDto })
  @ApiResponse({
    status: 201,
    description: 'Arena created successfully',
    type: ArenaResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createArenaDto: CreateArenaDto): Promise<ArenaResponseDto> {
    return this.commandBus.execute(new CreateArenaCommand(createArenaDto));
  }

  @Get()
  @ApiOperation({ summary: 'Get all arenas' })
  @ApiResponse({
    status: 200,
    description: 'List of all arenas',
    type: [ArenaResponseDto],
  })
  async findAll(): Promise<ArenaResponseDto[]> {
    return this.queryBus.execute(new GetAllArenasQuery());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an arena by ID' })
  @ApiParam({ name: 'id', description: 'Arena ID', type: String })
  @ApiResponse({
    status: 200,
    description: 'Arena found',
    type: ArenaResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Arena not found' })
  async findOne(@Param('id') id: string): Promise<ArenaResponseDto> {
    return this.queryBus.execute(new GetArenaByIdQuery(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an arena' })
  @ApiParam({ name: 'id', description: 'Arena ID', type: String })
  @ApiBody({ type: UpdateArenaDto })
  @ApiResponse({
    status: 200,
    description: 'Arena updated successfully',
    type: ArenaResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Arena not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async update(
    @Param('id') id: string,
    @Body() updateArenaDto: UpdateArenaDto
  ): Promise<ArenaResponseDto> {
    return this.commandBus.execute(new UpdateArenaCommand(id, updateArenaDto));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an arena' })
  @ApiParam({ name: 'id', description: 'Arena ID', type: String })
  @ApiResponse({ status: 204, description: 'Arena deleted successfully' })
  @ApiResponse({ status: 404, description: 'Arena not found' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.commandBus.execute(new DeleteArenaCommand(id));
  }
}
