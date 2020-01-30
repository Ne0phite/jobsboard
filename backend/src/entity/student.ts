import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public zID: string;

  @Column({
    default: false,
  })
  public isAdmin: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
