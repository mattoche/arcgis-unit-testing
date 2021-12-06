export enum LogLevel {
  NORMAL,
  DEBUG,
}

class LoggerService {
  constructor(level: LogLevel) {
    this.setLogLevel(level);
  }

  public debug: (message: string, value?: any) => void = this.debugActivated;

  public error(message: string, value?: any): void {
    console.error(message, value);
  }

  public info(message: string, value?: any): void {
    console.log(message, value);
  }

  public errorAndThrow(message: string): void {
    throw new Error(message);
  }

  public warn(message: string, value?: any) {
    console.warn(message, value);
  }

  private debugActivated(message: string, value?: any): void {
    console.debug('[' + this.getCurrentDate() + '] : ' + message, value);
  }

  private debugDesactivated(/*message: string, value?: any*/): void {
    // do nothing
  }

  public setLogLevel(level: LogLevel) {
    this.debug = level === LogLevel.DEBUG ? this.debugActivated : this.debugDesactivated;
  }

  private getCurrentDate(): string {
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    return date + ' ' + time;
  }
}

export const logger = new LoggerService(LogLevel.NORMAL);
