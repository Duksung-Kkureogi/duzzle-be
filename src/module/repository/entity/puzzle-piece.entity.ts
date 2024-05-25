import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
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

@Entity('puzzle_piece')
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
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'season_zone_id' })
  seasonZone: SeasonZoneEntity;

  @ManyToOne(() => UserEntity, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'user_id' })
  owner: UserEntity;

  @ManyToOne(() => NftMetadataEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'nft_metadata_id' })
  metadata: NftMetadataEntity;
}
