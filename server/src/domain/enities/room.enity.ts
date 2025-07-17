export interface Room {
  id: string;
  name: string;
  isGroup: boolean;
  createdBy: string;
  members: string[];
  createdAt: Date;
}
