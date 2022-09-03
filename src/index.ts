/**
 * Attaches the methods from the extension type to the target type.
 * @example
 * ```typescript
 * // For TypeScript, update the target type interfaces with extension methods.
 * // Be sure to OMIT the first argument (the target) and that methods are NOT static.
 * declare global {
 *   interface Array<T> {
 *     clear(): void;
 *   }
 * }
 *
 * // Define extension class.
 * // Ensure each method is static and the first argument is the target type.
 * class ArrayExtensions {
 *   public static clear<TSource>(arr: TSource[]): void {
 *     arr.length = 0;
 *   }
 * }
 *
 * // Bind extension class to array.
 * bindExtensions(ArrayExtensions, Array);
 *
 * const arr = [1, 2, 3];
 *
 * // Arrays now have extension methods.
 * arr.clear();
 *
 * // Will be []
 * console.log(arr);
 * ```
 * @param extensionType The extension type to attach the methods from.
 * @param targetType The target type to attach the extension methods to.
 */
export function bindExtensions(extensionType: new () => unknown, targetType: new () => unknown): void;

/**
 * Attaches the methods from the extension type to the target type.
 * @example
 * ```typescript
 * // For TypeScript, update the target type interfaces with extension methods.
 * // Be sure to OMIT the first argument (the target) and that methods are NOT static.
 * declare global {
 *   interface Array<T> {
 *     clear(): void;
 *   }
 *
 *   interface Set<T> {
 *     pipe(action: (item: T) => void): void;
 *   }
 * }
 *
 * // Define extension classes.
 * // Ensure each method is static and the first argument is the target type.
 * class ArrayExtensions {
 *   public static clear<TSource>(arr: TSource[]): void {
 *     arr.length = 0;
 *   }
 * }
 *
 * class SetExtensions {
 *   public static pipe<TSource>(set: Set<TSource>, action: (item: TSource) => void): void {
 *     for (const item of set) {
 *       action(item);
 *     }
 *   }
 * }
 *
 * // Bind extension classes to targets.
 * bindExtensions([[ArrayExtensions, Array], [SetExtensions, Set]]);
 *
 * const arr = [1, 2, 3];
 *
 * // Arrays now have extension methods.
 * arr.clear();
 *
 * // Will be []
 * console.log(arr);
 *
 * const set = new Set([1, 2, 3]);
 *
 * // Sets now have extension methods.
 * set.pipe(x => console.log(x));
 * ```
 * @param extensions The extensions to attach to targets.
 */
export function bindExtensions(extensions: [new () => unknown, new () => unknown][]): void;

export function bindExtensions(
  extensionTypeOrExtensions: (new () => unknown) | [new () => unknown, new () => unknown][],
  targetType?: new () => unknown
): void {
  if (typeof extensionTypeOrExtensions === 'function' && typeof targetType !== 'function') {
    throw new Error('Invalid use of extensions.');
  }

  let extensions: [new () => unknown, new () => unknown][] = [];

  if (Array.isArray(extensionTypeOrExtensions)) {
    extensions = extensionTypeOrExtensions;
  } else if (typeof extensionTypeOrExtensions === 'function' && typeof targetType === 'function') {
    extensions = [[extensionTypeOrExtensions, targetType]];
  } else {
    throw new Error('Invalid use of extensions.');
  }

  for (const [extension, target] of extensions) {
    const extensionPropNames = Object.getOwnPropertyNames(extension);

    for (const prop of extensionPropNames) {
      if ((target as any)[prop] === undefined && target.prototype[prop] === undefined) {
        target.prototype[prop] = function (...params: unknown[]) {
          return (extension as any)[prop](this, ...params);
        };
      }
    }
  }
}
