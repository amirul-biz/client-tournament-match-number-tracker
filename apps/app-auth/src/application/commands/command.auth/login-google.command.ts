import { GoogleUserDto } from '../../../domain/dtos';

export class LoginGoogleCommand {
  constructor(public readonly googleUser: GoogleUserDto) {}
}
