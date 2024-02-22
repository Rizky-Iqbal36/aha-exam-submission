import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'users' })
export default class UserModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @Column({ type: 'timestamp' })
  lastLoginDate: string;

  @Column({ type: 'timestamp', default: null, nullable: true })
  emailVerificationDate: string | null;

  @UpdateDateColumn({ type: 'timestamp' })
  lastUpdate: string;

  @CreateDateColumn({ type: 'timestamp' })
  insertDate: string;
}
