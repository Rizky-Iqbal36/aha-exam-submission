import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'users' })
@Index('IDX_user_email', ['email'], { unique: true })
export default class UserModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  name: string;

  @Column()
  email: string;

  @Column({ default: null })
  password: string;

  @Column({ default: null })
  salt: string;

  @Column({ default: 0 })
  loginCount: number;

  @Column({ default: null })
  profilePicture: string;

  @Column({ type: 'timestamp' })
  lastLoginDate: string;

  @Column({ type: 'timestamp', default: null, nullable: true })
  emailVerificationDate: string | null;

  @UpdateDateColumn({ type: 'timestamp' })
  lastUpdate: string;

  @CreateDateColumn({ type: 'timestamp' })
  insertDate: string;
}
