# extension-methods-js

This package is inspired by [C#'s extension methods](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/extension-methods).
This package provides a function that will bind an extension type to whatever target type you want those methods to be on.

## Table of Contents

1. [Installation](#installation)
2. [Basic Usage](#basic-usage)
3. [Documentation](#documentation)

## Installation:

```typescript
npm i extension-methods-js
```

## Basic Usage:

This function will modify the prototype of the target types. It will not override any existing functions so be sure the name of your extension methods are not the same as any static or instance methods on your target type.

```typescript
import { bindExtensions } from 'extension-methods-js';

// For TypeScript, update the target type interfaces with extension methods.
// Be sure to OMIT the first argument (the target) and that methods are NOT static.
declare global {
  interface Array<T> {
    clear(): void;
  }

  interface Set<T> {
    pipe(action: (item: T) => void): void;
  }
}
 
// Define extension classes.
// Ensure each method is static and the first argument is the target type.
class ArrayExtensions {
  public static clear<TSource>(arr: TSource[]): void {
    arr.length = 0;
  }
}

class SetExtensions {
  public static pipe<TSource>(set: TSource[], action: (item: TSource) => void): void {
    for (const item of set) {
      action(item);
    }
  }
}

// Bind extension classes to targets.
bindExtensions([[ArrayExtensions, Array], [SetExtensions, Set]]);
// You can also use the other overload bindExtensions(ArrayExtensions, Array) if you only have one extension class.

const arr = [1, 2, 3];

// Arrays now have extension methods.
arr.clear();

// Will be []
console.log(arr);

const set = new Set([1, 2, 3]);

// Sets now have extension methods.
set.pipe(x => console.log(x));
```

## Documentation

Please see full documentation [here](https://rob893.github.io/extension-methods-js/).