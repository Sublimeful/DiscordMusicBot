export class Debugger {
  public static log(message: any = "", tag = "Debug") {
    if (message)
      console.log(`[${tag}] : ${message}`);
    else
      console.log(`[${tag}]`);
  }
}
