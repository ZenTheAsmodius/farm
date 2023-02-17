import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, JoinColumn, ManyToOne } from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity()
export class Farm {
  @PrimaryGeneratedColumn("uuid")
  public readonly id: string;

  @Column()
  public name: string;

  @Column()
  public address: string;

  @Column()
  public owner: string;

  @Column()
  public coordinates: string;

  @Column({ type: "decimal", precision: 10, scale: 1, default: 0 })
  public size: number;

  @Column({ type: "decimal", precision: 10, scale: 1, default: 0 })
  public yield: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "owner", referencedColumnName: "email" })
  public user: User;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  public drivingDistance: number;
}
