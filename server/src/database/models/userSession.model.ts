import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'user_session' })
@Index('IDX_user_session_primary', ['userId', 'token', 'recordCreated'], { unique: true })
export default class UserSessionModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  token: string;

  @Column()
  used: number;

  @Column({ type: 'date' })
  recordCreated: string;

  @UpdateDateColumn({ type: 'timestamp' })
  lastUpdate: string;

  @CreateDateColumn({ type: 'timestamp' })
  insertDate: string;
}
