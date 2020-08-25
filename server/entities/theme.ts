import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

import type { Theme as ThemeInterface } from "../../types/entities/theme.type";

import { User } from "./user";

@Entity()
export class Theme implements ThemeInterface {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ default: 0 })
  public order: number;

  @Column({ default: false })
  public isPublished: boolean;

  // @OneToOne(() => Image, { onDelete: "SET NULL" })
  // @JoinColumn()
  // public image: Image;

  @ManyToOne(() => User)
  public user: User;

  @Column({ type: "json" })
  public names: { [key: string]: string };
}
