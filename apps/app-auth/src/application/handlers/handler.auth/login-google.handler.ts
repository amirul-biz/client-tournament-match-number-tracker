import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { LoginGoogleCommand } from '../../commands';
import { AuthRepository } from '../../../infrastructure/repositories/repository.auth/auth.repository';
import { AuthMapper } from '../../../domain/mappers';
import { AuthResponseDto } from '../../../domain/dtos';

@CommandHandler(LoginGoogleCommand)
export class LoginGoogleHandler
  implements ICommandHandler<LoginGoogleCommand, AuthResponseDto>
{
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly authMapper: AuthMapper,
    private readonly jwtService: JwtService
  ) {}

  async execute(command: LoginGoogleCommand): Promise<AuthResponseDto> {
    const { googleUser } = command;

    // Check if user exists
    let user = await this.authRepository.findByGoogleId(googleUser.googleId);

    // Create user if doesn't exist
    if (!user) {
      user = await this.authRepository.create({
        googleId: googleUser.googleId,
        name: googleUser.name,
      });
    }

    // Generate tokens
    const payload = {
      sub: user.id,
      googleId: user.googleId,
      name: user.name,
      teamId: user.teamId,
      teamName: user.teamName,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '5m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '3h' });

    // Store refresh token
    await this.authRepository.updateRefreshToken(user.googleId, refreshToken);

    return this.authMapper.toAuthResponseDto(user, accessToken, refreshToken);
  }
}
