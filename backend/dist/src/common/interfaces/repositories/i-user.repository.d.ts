import { User, UserRole } from '@prisma/client';
export interface CreateUserDto {
    email: string;
    password: string;
    name: string;
    role: UserRole;
    isActive?: boolean;
}
export interface IUserRepository {
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
