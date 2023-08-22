import { Subject, of } from "rxjs";
import { loop, loopScan } from ".";

describe('loop', () => {
  it('creates an observable from a factory function', () => {
    const subject = new Subject();
    const next = jest.fn();
    const complete = jest.fn();
    const error = jest.fn();
    const factory = jest.fn().mockReturnValue(subject);

    const observable = loop(factory);
    expect(factory).not.toHaveBeenCalled();
    const subscription = observable.subscribe({next, error, complete});
    expect(factory).toHaveBeenCalledTimes(1);
    expect(factory).toHaveBeenCalledWith(0);

    expect(next).not.toHaveBeenCalled();

    subject.next(1);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(1);
    subscription.unsubscribe();
    expect(complete).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();
    
  });
  it('when a generated observable ends, calls the factory function with an incremented index', () => {
    const subj1 = new Subject();
    const subj2 = new Subject();
    const next = jest.fn();
    const complete = jest.fn();
    const error = jest.fn();
    const factory = jest.fn(() => subj2).mockReturnValueOnce(subj1);

    const observable = loop(factory);
    const subscription = observable.subscribe({next, error, complete});
    expect(factory).toHaveBeenCalledTimes(1);
    expect(factory).toHaveBeenCalledWith(0);
    subj1.complete();
    expect(factory).toHaveBeenCalledTimes(2);
    expect(factory).toHaveBeenCalledWith(1);

    expect(next).not.toHaveBeenCalled();
    subj2.next(3);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(3);

    subscription.unsubscribe();
    expect(complete).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();
  });
  it('when a generated observable errors, errors the observable', () => {
    const subj1 = new Subject();
    const next = jest.fn();
    const complete = jest.fn();
    const error = jest.fn();
    const factory = jest.fn(() => subj1);

    const observable = loop(factory);
    observable.subscribe({next, error, complete});
    expect(error).not.toHaveBeenCalled();
    subj1.error('error');
    expect(error).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledWith('error');

    expect(next).not.toHaveBeenCalled();
    expect(complete).not.toHaveBeenCalled();
  });
  it('uses "repeatConfig" to determine count or delay of repetitions', () => {
    const next = jest.fn();
    const complete = jest.fn();
    const error = jest.fn();
    const factory = jest.fn((n:number) => of(n));

    const observable = loop(factory, {count: 3});
    expect(factory).not.toHaveBeenCalled();
    observable.subscribe({next, error, complete});
    expect(factory).toHaveBeenCalledTimes(3);
    expect(factory).toHaveBeenNthCalledWith(1, 0);
    expect(factory).toHaveBeenNthCalledWith(2, 1);
    expect(factory).toHaveBeenNthCalledWith(3, 2);
    expect(next).toHaveBeenCalledTimes(3);
    expect(next).toHaveBeenNthCalledWith(1, 0);
    expect(next).toHaveBeenNthCalledWith(2, 1);
    expect(next).toHaveBeenNthCalledWith(3, 2);
    expect(complete).toHaveBeenCalledTimes(1);
    expect(error).not.toHaveBeenCalled();
  });
});

describe('loopScan', () => {
  it('creates an observable from a factory function and a seed value', () => {
    const subject = new Subject<string>();
    const next = jest.fn();
    const complete = jest.fn();
    const error = jest.fn();
    const factory = jest.fn(() => subject);

    const observable = loopScan(factory, 'A');
    expect(factory).not.toHaveBeenCalled();
    const subscription = observable.subscribe({next, error, complete});
    expect(factory).toHaveBeenCalledTimes(1);
    expect(factory).toHaveBeenCalledWith('A', 0);

    expect(next).not.toHaveBeenCalled();

    subject.next('B');
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith('B');
    subscription.unsubscribe();
    expect(complete).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();
    
  });
  it('when a generated observable ends, it calls the factory function with an incremented index and the last emitted value', () => {
    const subj1 = new Subject<string>();
    const subj2 = new Subject<string>();
    const next = jest.fn();
    const complete = jest.fn();
    const error = jest.fn();
    const factory = jest.fn(() => subj2).mockReturnValueOnce(subj1);

    const observable = loopScan(factory, 'A');
    const subscription = observable.subscribe({next, error, complete});
    subj1.next('B');

    expect(factory).toHaveBeenCalledTimes(1);
    subj1.complete();
    expect(factory).toHaveBeenCalledTimes(2);
    expect(factory).toHaveBeenCalledWith('B', 1);

    subj2.next('C');
    expect(next).toHaveBeenCalledTimes(2);
    expect(next).toHaveBeenCalledWith('C');
    
    subscription.unsubscribe();
    expect(complete).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();

  });
  it('when a generated observable errors, it errors the observable', () => {
    const subj = new Subject<string>();
    const next = jest.fn();
    const complete = jest.fn();
    const error = jest.fn();
    const factory = jest.fn(() => subj);
    const observable = loopScan(factory, 'A');
    observable.subscribe({next, error, complete});
    expect(error).not.toHaveBeenCalled();
    subj.error('error');
    expect(error).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledWith('error');
  });
  it('uses "repeatConfig" to determine count or delay of repetitions', () => {
    const next = jest.fn();
    const complete = jest.fn();
    const error = jest.fn();
    const factory = jest.fn((n:number) => of(n + 2));
    const observable = loopScan(factory, 0, {count: 3});
    expect(factory).not.toHaveBeenCalled();
    observable.subscribe({next, error, complete});
    expect(factory).toHaveBeenCalledTimes(3);
    expect(factory).toHaveBeenNthCalledWith(1, 0, 0);
    expect(factory).toHaveBeenNthCalledWith(2, 2, 1);
    expect(factory).toHaveBeenNthCalledWith(3, 4, 2);
    expect(next).toHaveBeenCalledTimes(3);
    expect(next).toHaveBeenNthCalledWith(1, 2);
    expect(next).toHaveBeenNthCalledWith(2, 4);
    expect(next).toHaveBeenNthCalledWith(3, 6);
    expect(complete).toHaveBeenCalledTimes(1);
    expect(error).not.toHaveBeenCalled();
  });
});