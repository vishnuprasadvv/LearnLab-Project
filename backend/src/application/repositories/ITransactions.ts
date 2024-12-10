export interface ITransactionManager {
    startTransaction(): Promise<ITransaction>;
  }
  
  export interface ITransaction {
    commit(): Promise<void>;
    rollback(): Promise<void>;
    getSession(): any; // Session object abstracted from specific ORM
  }
  