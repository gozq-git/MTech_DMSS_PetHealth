abstract class CustomNotification {
  name: string;
  engines: Array<string>;
  
  constructor(name: string, engines: Array<string>){
    this.name = name;
    this.engines = engines;
  }

  abstract find(searchString: string): CustomNotification;
}
