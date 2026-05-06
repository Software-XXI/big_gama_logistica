import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<import("./dto/auth.dto").AuthResponseDto>;
    register(dto: RegisterDto): Promise<import("./dto/auth.dto").AuthResponseDto>;
    getProfile(req: any): Promise<{
        id: string;
        email: string;
        name: string;
        role: string;
        isActive: boolean;
    } | null>;
}
