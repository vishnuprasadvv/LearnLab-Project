import mongoose, { ClientSession } from "mongoose";
import { ITransaction, ITransactionManager } from "../../application/repositories/ITransactions";

class MongooseTransaction implements ITransaction {
  private session: ClientSession;

  constructor(session: ClientSession) {
    this.session = session;
  }

  async commit(): Promise<void> {
    await this.session.commitTransaction();
    this.session.endSession();
  }

  async rollback(): Promise<void> {
    await this.session.abortTransaction();
    this.session.endSession();
  }

  getSession(): ClientSession {
    return this.session;
  }
}

export class MongooseTransactionManager implements ITransactionManager {
  async startTransaction(): Promise<ITransaction> {
    const session = await mongoose.startSession();
    session.startTransaction();
    return new MongooseTransaction(session);
  }
}
