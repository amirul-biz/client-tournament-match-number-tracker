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
  Req,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from '../../../../../libs/app-auth/auth-guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import {
  CreateTeamDto,
  UpdateTeamDto,
  TeamResponseDto,
} from '../../domain/dtos';
import { CreateTeamCommand } from '../../application/commands/team.command/create-team.command';
import { UpdateTeamCommand } from '../../application/commands/team.command/update-team.command';
import { DeleteTeamCommand } from '../../application/commands/team.command/delete-team.command';
import { GetAllTeamsQuery } from '../../application/queries/query.team/get-all-teams.query';
import { GetTeamByIdQuery } from '../../application/queries/query.team/get-team-by-id.query';

@ApiTags('teams')
@Controller('teams')
export class PresentationTeamController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new team' })
  @ApiBody({ type: CreateTeamDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Team created successfully',
    type: TeamResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async create(
    @Body() createTeamDto: CreateTeamDto,
    @Req() request: Request,
  ): Promise<TeamResponseDto> {
    // Extract userId from JWT authenticated user
    const user = request.user as Express.User;

    Logger.log(request.user);

    if (!user?.id) {
      throw new UnauthorizedException('User ID not found in token');
    }

    // Attach userId to DTO
    const dtoWithUser = { ...createTeamDto, userId: user.id };

    return this.commandBus.execute<CreateTeamCommand, TeamResponseDto>(
      new CreateTeamCommand(dtoWithUser),
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all teams' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all teams',
    type: [TeamResponseDto],
  })
  async findAll(): Promise<TeamResponseDto[]> {
    return this.queryBus.execute<GetAllTeamsQuery, TeamResponseDto[]>(
      new GetAllTeamsQuery(),
    );
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
    type: TeamResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Team not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid UUID format',
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<TeamResponseDto> {
    return this.queryBus.execute<GetTeamByIdQuery, TeamResponseDto>(
      new GetTeamByIdQuery(id),
    );
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
    type: TeamResponseDto,
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
  ): Promise<TeamResponseDto> {
    return this.commandBus.execute<UpdateTeamCommand, TeamResponseDto>(
      new UpdateTeamCommand(id, updateTeamDto),
    );
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
    await this.commandBus.execute<DeleteTeamCommand, void>(
      new DeleteTeamCommand(id),
    );
  }
}
