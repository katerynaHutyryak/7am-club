import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User as UserEntity } from './user.entity';
import { User, UserWithPassword } from './user.type';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  find(where: FindOptionsWhere<UserEntity>): Promise<User | null> {
    return this.usersRepository.findOne({ where });
  }

  findByEmailWithPassword(email: string): Promise<UserWithPassword | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', { email })
      .getOne();
  }

  create(email: string, passwordHash: string, name?: string): Promise<User> {
    const user = this.usersRepository.create({
      email,
      passwordHash,
      name: name,
    });

    return this.usersRepository.save(user);
  }
}
