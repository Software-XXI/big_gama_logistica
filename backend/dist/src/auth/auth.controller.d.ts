import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<import("./dto/auth.dto").AuthResponseDto>;
    register(dto: RegisterDto): Promise<import("./dto/auth.dto").AuthResponseDto>;
    getProfile(req: any): Promise<{
        id: string;
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.UserRole;
    } | null>;
}
