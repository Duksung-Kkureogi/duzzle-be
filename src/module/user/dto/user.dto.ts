import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { Expose, plainToInstance } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { UserEntity } from 'src/module/repository/entity/user.entity';
import { ProfileType } from 'src/module/repository/enum/user.enum';

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
  profileType: ProfileType;

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

export class UpdateUserProfileTypeRequest {
  @ApiProperty({ type: 'enum', enum: ProfileType })
  @IsEnum(ProfileType)
  profileType: ProfileType;
}

export class ImageUploadDto {
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  file: any;
}
