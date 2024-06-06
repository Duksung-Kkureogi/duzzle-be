import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { Expose, plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { UserEntity } from 'src/module/repository/entity/user.entity';

export class UserInfoResponse {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  image: string;

  @ApiProperty()
  @Expose()
  level: number;

  @ApiProperty()
  @Expose()
  walletAddress: string;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  static from(entity: UserEntity) {
    return plainToInstance(this, entity, {
      excludeExtraneousValues: true,
    });
  }
}

export class UserNftTotals {
  @ApiProperty()
  @Expose()
  totalItems: number;

  @ApiProperty()
  @Expose()
  totalPieces: number;
}

export class UserProfileResponse extends IntersectionType(
  UserInfoResponse,
  UserNftTotals,
) {}

export class UpdateUserNameRequest {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
}

export class ImageUploadDto {
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  file: any;
}
