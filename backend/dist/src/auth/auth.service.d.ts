import { JwtService } from '@nestjs/jwt';
import { UserRepository } from "../common/providers/repositories/user.repository";
import { LoginDto, RegisterDto, AuthResponseDto } from './dto/auth.dto';
export declare class AuthService {
    private userRepo;
    private jwtService;
    constructor(userRepo: UserRepository, jwtService: JwtService);
    login(dto: LoginDto): Promise<AuthResponseDto>;
    register(dto: RegisterDto): Promise<AuthResponseDto>;
    validateUser(userId: string): Promise<{
        id: string;
        email: string;
        name: string;
        role: string;
        isActive: boolean;
    }>;
    getProfile(userId: string): Promise<{
        id: string;
        email: string;
        name: string;
        role: string;
        isActive: boolean;
    } | null>;
}
