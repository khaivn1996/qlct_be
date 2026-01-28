import { AuthService } from "./auth.service";
import { RegisterDto, LoginDto, RefreshTokenDto, LogoutDto } from "./dto";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
        };
    }>;
    refresh(dto: RefreshTokenDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
        };
    }>;
    logout(dto: LogoutDto): Promise<{
        message: string;
    }>;
    getProfile(user: {
        sub: string;
    }): Promise<{
        email: string;
        id: string;
        createdAt: Date;
    }>;
}
