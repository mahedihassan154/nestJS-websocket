export class GlobalService{ 
    static environmentVariable: any; 
  
    public async setGlobalVriable() {
      let variableKeys = new Array();
      Object.keys(process.env).forEach((key) => variableKeys.push(key));
      for (let i = 0; i < variableKeys.length; i++) {
        const key = variableKeys[i];
        GlobalService.environmentVariable[key] = process.env[key];
      }
    }
  }
  