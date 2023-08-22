# Rx Loop

This package provides two functions for looping in RxJS:

* `function loop<T>(factory:(index:number) => ObservableInput<T>):Observable<T>`
* `function loopScan<T>(factory:(seed: T, index:number) => ObservableInput<T>, seed: T):Observable<T>`