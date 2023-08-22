import { Observable, ObservableInput, RepeatConfig, defer, from, repeat, tap } from "rxjs";

export function loop<T>(
  factory:(index:number) => ObservableInput<T>,
  countOrConfig?: number | RepeatConfig
):Observable<T> {
  return defer(() => {
    let index = 0;
    return defer(() => factory(index++)).pipe(repeat(countOrConfig));
  });
}

export function loopScan<T>(
  factory:(seed: T, index:number) => ObservableInput<T>, 
  seed: T,
  countOrConfig?: number | RepeatConfig
):Observable<T> {
  return defer(() => {
    let index = 0;
    let current = seed;
    return defer(() => factory(current, index++)).pipe(
      repeat(countOrConfig),
      tap(value => { current = value; })
    );
  });
}