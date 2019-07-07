export default class AccountDTO {
  id?: string;
  username: string;
  password?: string;
  status: 'DEACTIVATED' | 'ACTIVATED' | 'SUSPENDED' | 'BLACKLISTED';
  createdAt: Date;
  updatedAt?: Date;
}
