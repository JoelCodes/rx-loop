import { Subject } from "rxjs";
import { loop } from ".";

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
  it('when a generated observable ends, it calls the factory function with an incremented index', () => {
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
  it('when a generated observable errors, it errors the observable', () => {
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
  it.todo('uses "repeatConfig" to determine how many times to repeat');
});

describe('loopScan', () => {
  it.todo('creates an observable from a factory function and a seed value');
  it.todo('when a generated observable ends, it calls the factory function with an incremented index and the last emitted value');
  it.todo('when a generated observable errors, it errors the observable');
});