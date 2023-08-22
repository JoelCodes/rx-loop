import { Observable, ObservableInput, defer, from, repeat, tap } from "rxjs";

export function loop<T>(factory:(index:number) => ObservableInput<T>):Observable<T> {
  return defer(() => {
    let index = 0;
    return defer(() => factory(index++)).pipe(repeat());
  });
}

export function loopScan<T>(factory:(seed: T, index:number) => ObservableInput<T>, seed: T):Observable<T> {
  return defer(() => {
    let index = 0;
    let current = seed;
    return defer(() => factory(current, index++)).pipe(
      repeat(),
      tap(value => { current = value; })
    );
  });
}