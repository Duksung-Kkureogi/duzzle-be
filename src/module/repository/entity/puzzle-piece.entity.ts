import { Column, Entity, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { SeasonZoneEntity } from './season-zone.entity';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from './user.entity';
import { NftMetadataEntity } from './nft-metadata.entity';
import { Expose } from 'class-transformer';

export class Point {
  @ApiProperty()
  @Expose()
  x: number;

  @ApiProperty()
  @Expose()
  y: number;
}

@Entity('puzzle_piece', {
  comment: 'season_zone 의 모든 퍼즐 조각 목록, 조각의 민트 여부와 NFT 소유자',
})
export class PuzzlePieceEntity extends BaseEntity {
  @Column('int', { primary: true })
  seasonZoneId: number;

  @Column('int', { primary: true })
  id: number;

  @Column('int', { nullable: true })
  userId?: number;

  @Column('int', { nullable: true })
  nftMetadataId?: number;

  @Column({
    type: 'jsonb',
  })
  points: Point[];

  @Column('boolean', { default: false })
  minted: boolean;

  @ManyToOne(() => SeasonZoneEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'season_zone_id' })
  seasonZone: SeasonZoneEntity;

  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  owner: UserEntity;

  @OneToOne(() => NftMetadataEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'nft_metadata_id' })
  metadata: NftMetadataEntity;
}
