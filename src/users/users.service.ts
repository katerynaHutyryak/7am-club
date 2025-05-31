import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { hash } from 'bcrypt';
import { CreateUserDTO } from './dto/createUser.dto';
import { UpdateUserDTO } from './dto/updateUser.dto';
import { isDbErrorWithCode } from 'src/common/isDbErrorWithCode';
import { UserFilterDTO } from './dto/userFilter.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findAll(filters: UserFilterDTO): Promise<User[]> {
    const hasFilters = Object.keys(filters).length > 0;

    if (hasFilters) {
      return this.userRepository.find({
        where: filters,
        cache: true,
      });
    }

    // No filters — return all users
    return this.userRepository.find({
      cache: true,
    });
  }

  findOne(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id }, cache: true });
  }

  async create(userData: CreateUserDTO): Promise<User> {
    try {
      const passwordHash = await hash(userData.password, 10);

      const user = this.userRepository.create({
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        nickname: userData.nickname,
        role: userData.role ? userData.role : UserRole.USER,
        passwordHash,
      });
      return await this.userRepository.save(user);
    } catch (error) {
      if (isDbErrorWithCode(error) && error.code === '23505') {
        throw new ConflictException(
          'User with this nickname or email already exists',
        );
      }
      throw new BadRequestException();
    }
  }

  async update(id: string, userData: UpdateUserDTO): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    try {
      Object.assign(user, userData);
      return await this.userRepository.save(user);
    } catch (error) {
      if (isDbErrorWithCode(error) && error.code === '23505') {
        throw new ConflictException(
          'User with this nickname or email already exists',
        );
      }
      throw error;
    }
  }

  async delete(id: string): Promise<null> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepository.delete(id);
    return null;
  }
}
