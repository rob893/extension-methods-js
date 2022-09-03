import { bindExtensions } from '../index';

class ArrayExtensions {
  public static clear<TSource>(arr: TSource[]): void {
    arr.length = 0;
  }
}

class SetExtensions {
  public static pipe<TSource>(set: Set<TSource>, action: (item: TSource) => void): void {
    for (const item of set) {
      action(item);
    }
  }
}

const defaultNativeTypes: (new () => Iterable<unknown>)[] = [Array, Set];

const originals = new Map(defaultNativeTypes.map(ctor => [ctor, { ...ctor.prototype }]));

function resetPrototypesToOriginal(): void {
  for (const ctor of defaultNativeTypes) {
    const originalProto = originals.get(ctor);

    if (!originalProto) {
      throw new Error('Something went wrong and stuff.');
    }

    for (const prop in ctor.prototype) {
      delete ctor.prototype[prop];
    }

    for (const prop in originalProto) {
      ctor.prototype[prop] = originalProto[prop];
    }
  }
}

beforeEach(() => resetPrototypesToOriginal());

describe('bindExtensions', () => {
  it('should bind extension to target', () => {
    bindExtensions(ArrayExtensions, Array);

    const arr: any = [1, 2, 3];
    arr.clear();

    expect(typeof arr['clear']).toBe('function');
    expect(arr).toEqual([]);
  });

  it('should bind extensions to targets', () => {
    bindExtensions([
      [ArrayExtensions, Array],
      [SetExtensions, Set]
    ]);

    const arr: any = [1, 2, 3];
    arr.clear();

    const set: any = new Set([1, 2, 3]);

    expect(typeof arr['clear']).toBe('function');
    expect(typeof set['pipe']).toBe('function');
    expect(arr).toEqual([]);
  });

  it('should throw for invalid overload use', () => {
    expect(() => (bindExtensions as any)(ArrayExtensions)).toThrow();
    expect(() => (bindExtensions as any)()).toThrow();
  });
});
