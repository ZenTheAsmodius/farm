import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Farm } from "modules/farms/entities/farm.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  public readonly id: string;

  @Column({ unique: true })
  public email: string;

  @Column()
  public hashedPassword: string;

  @Column({nullable: true})
  public address?: string;

  @Column({nullable: true})
  public coordinates?: string;

  @OneToMany(() => Farm, farm => farm.user)
  public farms: Farm[];

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
