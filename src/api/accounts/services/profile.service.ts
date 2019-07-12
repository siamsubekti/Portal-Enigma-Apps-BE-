import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Profile from '../models/profile.entity';

@Injectable()
export default class ProfileService {
  constructor(@InjectRepository(Profile) private readonly profile: Repository<Profile>) {}

  repository(): Repository<Profile> {
    return this.profile;
  }

  async get(id: string): Promise<Profile> {
    return this.profile.findOne(id);
  }

  async save(profile: Profile): Promise<Profile> {
    return this.profile.save(profile);
  }
}
