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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { TeamService } from './team.service';
import { CreateTeamDto, UpdateTeamDto } from './team.dto';
import { Team } from '@app-competition/prisma';

@ApiTags('teams')
@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new team' })
  @ApiBody({ type: CreateTeamDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Team created successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async create(@Body() createTeamDto: CreateTeamDto): Promise<Team> {
    return this.teamService.create(createTeamDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all teams' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all teams',
  })
  async findAll(): Promise<Team[]> {
    return this.teamService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a team by ID' })
  @ApiParam({
    name: 'id',
    description: 'Team UUID',
    type: String,
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Team found',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Team not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid UUID format',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Team> {
    return this.teamService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a team' })
  @ApiParam({
    name: 'id',
    description: 'Team UUID',
    type: String,
    format: 'uuid',
  })
  @ApiBody({ type: UpdateTeamDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Team updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Team not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data or UUID format',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTeamDto: UpdateTeamDto,
  ): Promise<Team> {
    return this.teamService.update(id, updateTeamDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a team' })
  @ApiParam({
    name: 'id',
    description: 'Team UUID',
    type: String,
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Team deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Team not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid UUID format',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.teamService.remove(id);
  }
}
