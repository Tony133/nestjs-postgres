import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Client } from 'pg';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { NotFoundException } from '@nestjs/common';
import { InjectConnection } from '../../../../../../lib';
import { Post } from './interfaces/post.interface';

@Injectable()
export class PostService {
  constructor(
    @InjectConnection('db2Connection')
    private dbConnection: Client,
  ) {}

  public async findAll(): Promise<Post[]> {
    const users = await this.dbConnection.query('SELECT * FROM posts');
    return users.rows;
  }

  public async findOne(id: string): Promise<Post[]> {
    if (!id) {
      throw new BadRequestException();
    }

    const result = await this.dbConnection.query(
      'SELECT * FROM posts WHERE id=$1',
      [id],
    );

    if (!result) {
      throw new NotFoundException();
    }

    return result.rows;
  }

  public async create(createPostDto: CreatePostDto): Promise<Post[]> {
    try {
      const post = await this.dbConnection.query(
        'INSERT INTO posts (title, description)  VALUES ($1, $2) RETURNING *',
        [createPostDto.title, createPostDto.description],
      );
      return post.rows;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async update(
    id: number,
    updateUserDto: UpdatePostDto,
  ): Promise<Post[]> {
    try {
      const { title, description } = updateUserDto;

      const post = await this.dbConnection.query(
        'UPDATE posts SET title = $1, description = $2 WHERE id=$3 RETURNING *',
        [title, description, id],
      );
      return post.rows;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async remove(id: string): Promise<void[]> {
    if (!id) {
      throw new BadRequestException();
    }

    const posts = await this.dbConnection.query(
      'DELETE FROM posts WHERE id=$1 RETURNING *',
      [id],
    );
    return posts.rows;
  }
}
