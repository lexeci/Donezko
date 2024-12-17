import { UserService } from '@/api/user/user.service';
import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { verify } from 'argon2';
import { CookieOptions, Response } from 'express';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
	EXPIRE_DAY_REFRESH_TOKEN = 1;
	REFRESH_TOKEN_NAME = 'refreshToken';

	constructor(
		private jwt: JwtService,
		private userService: UserService,
		private configService: ConfigService
	) {}

	private issueTokens(userId: string) {
		const data = { id: userId };

		const accessToken = this.jwt.sign(data, {
			expiresIn: '1h'
		});

		const refreshToken = this.jwt.sign(data, {
			expiresIn: '7d'
		});

		return { accessToken, refreshToken };
	}

	private async validateUser(dto: AuthDto) {
		const user = await this.userService.getByEmail(dto.email);

		if (!user) throw new NotFoundException('User not found');

		const isValid = await verify(user.password, dto.password);

		if (!isValid) throw new UnauthorizedException('Invalid password');

		return user;
	}

	private getCookieResponseValue(expires: Date) {
		return {
			httpOnly: true,
			domain: this.configService.get('LOCAL_DOMAIN'),
			expires,
			secure: true,
			//lax if production
			sameSite: 'none'
		} as CookieOptions;
	}

	async login(dto: AuthDto) {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...user } = await this.validateUser(dto);
		const tokens = this.issueTokens(user.id);

		return {
			user,
			...tokens
		};
	}

	async register(dto: AuthDto) {
		const oldUser = await this.userService.getByEmail(dto.email);

		if (oldUser) throw new BadRequestException('User already exist');

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...user } = await this.userService.create(dto);
		const tokens = this.issueTokens(user.id);

		return {
			user,
			...tokens
		};
	}

	addRefreshTokenToResponse(res: Response, refreshToken: string) {
		const expiresIn = new Date();
		expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN);

		res.cookie(
			this.REFRESH_TOKEN_NAME,
			refreshToken,
			this.getCookieResponseValue(expiresIn)
		);
	}

	removeRefreshTokenToResponse(res: Response) {
		res.cookie(
			this.REFRESH_TOKEN_NAME,
			'',
			this.getCookieResponseValue(new Date(0))
		);
	}

	async refreshTokens(refreshToken: string) {
		const result = await this.jwt.verifyAsync(refreshToken);

		if (!result) throw new UnauthorizedException('Invalid refresh token');

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...user } = await this.userService.getById(result.id);

		const tokens = this.issueTokens(user.id);

		return {
			user,
			...tokens
		};
	}
}
