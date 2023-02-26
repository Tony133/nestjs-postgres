import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Client } from 'pg';
import { InjectConnection } from '../../../../../../lib';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectConnection('db1Connection')
    private dbConnection: Client,
  ) {}

  public async findAll(): Promise<User[]> {
    const users = await this.dbConnection.query('SELECT * FROM users');
    return users.rows;
  }

  public async findOne(id: string): Promise<User[]> {
    if (!id) {
      throw new BadRequestException();
    }

    const result = await this.dbConnection.query(
      'SELECT * FROM users WHERE id=$1',
      [id],
    );

    if (!result) {
      throw new NotFoundException();
    }

    return result.rows;
  }

  public async create(createUserDto: CreateUserDto): Promise<User[]> {
    try {
      const user = await this.dbConnection.query(
        'INSERT INTO users (firstName, lastName)  VALUES ($1, $2) RETURNING *',
        [createUserDto.firstName, createUserDto.lastName],
      );
      return user.rows;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User[]> {
    try {
      const { firstName, lastName } = updateUserDto;

      const users = await this.dbConnection.query(
        'UPDATE users SET firstName=$1, lastName=$2 WHERE id=$3 RETURNING *',
        [firstName, lastName, id],
      );
      return users.rows;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async remove(id: string): Promise<void[]> {
    if (!id) {
      throw new BadRequestException();
    }

    const users = await this.dbConnection.query(
      'DELETE FROM users WHERE id=$1 RETURNING *',
      [id],
    );
    return users.rows;
  }
}
