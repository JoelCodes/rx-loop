import { Observable, ObservableInput } from "rxjs";

export function loop<T>(factory:(index:number) => ObservableInput<T>):Observable<T> {
  throw new Error("Function not implemented.");
}

export function loopScan<T>(factory:(seed: T, index:number) => ObservableInput<T>, seed: T):Observable<T> {
  throw new Error("Function not implemented.");
}