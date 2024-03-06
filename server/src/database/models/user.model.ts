import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'users' })
@Index('IDX_user_email', ['email'], { unique: true })
export default class UserModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, default: null })
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true, default: null })
  password: string;

  @Column({ nullable: true, default: null })
  salt: string;

  @Column({ default: 0 })
  loginCount: number;

  @Column({ nullable: true, default: null })
  profilePicture: string;

  @Column({ type: 'timestamp', nullable: true, default: null })
  lastLoginDate: string;

  @Column({ type: 'timestamp', nullable: true, default: null })
  emailVerificationDate: string | null;

  @UpdateDateColumn({ type: 'timestamp' })
  lastUpdate: string;

  @CreateDateColumn({ type: 'timestamp' })
  insertDate: string;
}
