import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'users' })
export default class UserModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  hash: string;

  @Column()
  salt: string;

  @Column({ type: 'enum', enum: ['Y', 'N'], default: 'N' })
  isEmailVerified: 'Y' | 'N';

  @UpdateDateColumn({ type: 'timestamp' })
  last_update: string;

  @CreateDateColumn({ type: 'timestamp' })
  insertDate: string;
}
