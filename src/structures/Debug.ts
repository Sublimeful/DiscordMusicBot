export default class Debug {
  public static log(message: any = "", tag = "Debug Log") {
    if (message) console.log(`[${tag}] : ${message}`);
    else console.log(`[${tag}]`);
  }
  public static error(message: any = "", tag = "Debug Error") {
    console.error(`[${tag}] : ${message}`);
    console.trace();
  }
}
