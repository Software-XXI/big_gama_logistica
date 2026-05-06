import { PrismaService } from "../../../prisma.service";
import { IUserRepository, CreateUserDto } from "../../interfaces/repositories/i-user.repository";
import { User, UserRole } from '@prisma/client';
export declare class UserRepository implements IUserRepository {
    private prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): Promise<User & {
        password: string;
    } | null>;
    findById(id: string): Promise<{
        id: string;
        email: string;
        name: string;
        role: string;
        isActive: boolean;
    } | null>;
    findAllByRole(role: UserRole): Promise<{
        id: string;
        email: string;
        name: string;
        role: string;
    }[]>;
    create(dto: CreateUserDto): Promise<User & {
        password: string;
    }>;
}
