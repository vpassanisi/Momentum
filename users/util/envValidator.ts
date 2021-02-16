function validateVar<T>({
    spec,
    name,
    rawValue,
  }: {
    name: string;
    rawValue: string | T;
    spec: Validator<T>;
  }) {
    const value = spec._parse(rawValue as string);
  
    if (value == null) {
      console.log(`environment: ${name} unset`);
      process.exit(0);
    }
  
    return value;
  }
  
  const readRawEnvValue = <T>(env: unknown, k: keyof T): T[keyof T] => {
    return (env as any)[k];
  };
  
  function getSanitizedEnv<T>(
    environment: unknown,
    specs: { [K in keyof T]: Validator<T[K]> }
  ): T {
    let cleanedEnv = {} as T;
    const varKeys = Object.keys(specs) as Array<keyof T>;
  
    for (const k of varKeys) {
      const spec = specs[k];
  
      const rawValue = readRawEnvValue(environment, k) ?? undefined;
  
      if (rawValue === undefined) {
        console.log(`environment: ${k} unset`);
        process.exit(0);
      } else {
        cleanedEnv[k] = validateVar({ name: k as string, spec, rawValue });
      }
    }
  
    return cleanedEnv;
  }
  
  function str() {
    return {
      _parse: (input: string) => {
        if (typeof input === "string") return input;
        throw new Error(`Not a string: "${input}"`);
      },
    } as Validator<string>;
  }
  
  interface Validator<T> {
    _parse: (input: string) => T;
  }

  const env = getSanitizedEnv(process.env, {
      PORT: str(),
      NODE_ENV: str(),
      FDB_SECRET: str()
  })

  export {env}