import { Column, Entity, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { SeasonZoneEntity } from './season-zone.entity';
import { UserEntity } from './user.entity';
import { NftMetadataEntity } from './nft-metadata.entity';

@Entity('blueprint_item', {
  comment:
    'season_zone 의 모든 설계도면 아이템 목록, 아이템의 민트 여부와 NFT 소유자  ',
})
export class BlueprintItemEntity extends BaseEntity {
  @Column('int', { primary: true })
  id: number;

  @Column('int')
  seasonZoneId: number;

  @Column('int', { nullable: true })
  userId?: number;

  @Column('int', { nullable: true })
  nftMetadataId?: number;

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
