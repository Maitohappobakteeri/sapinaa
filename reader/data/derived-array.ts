import { Subject, of } from "rxjs";
import { filter, flatMap, map } from "rxjs/operators";

enum ChangeType {
  Push,
  Insert
}

type PushChange<T> = { items: T[] };
type InsertChange<T> = { item: T; index: number };
type ArrayChangeEvent<T> = {
  type: ChangeType;
  change: PushChange<T> | InsertChange<T>;
};

export class SourceArray<T> {
  array = new Array<T>();
  subject = new Subject<ArrayChangeEvent<T>>();
  changes = this.subject.asObservable();
  isBefore: (item: T, next: T) => boolean;
  excludeFilter: (item: T) => boolean;

  constructor(
    isBefore?: (item: T, next: T) => boolean,
    excludeFilter?: (item: T) => boolean
  ) {
    this.isBefore = isBefore;
    this.excludeFilter = excludeFilter;
  }

  push(item: T, ...moreItems: T[]) {
    if (
      this.excludeFilter !== undefined &&
      this.excludeFilter.call(this, item)
    ) {
      return;
    }

    if (this.isBefore) {
      this.pushSorted(item);
      moreItems.forEach(e => this.pushSorted(e));
    } else {
      this.subject.next({
        type: ChangeType.Push,
        change: { items: [item, ...moreItems] }
      });

      this.array.push(item, ...moreItems);
    }
  }

  insert(i: number, item: T) {
    if (
      this.excludeFilter !== undefined &&
      this.excludeFilter.call(this, item)
    ) {
      return;
    }

    this.subject.next({
      type: ChangeType.Insert,
      change: { item: item, index: i }
    });
    this.array.splice(i, 0, item);
  }

  pushSorted(item: T) {
    if (
      this.excludeFilter !== undefined &&
      this.excludeFilter.call(this, item)
    ) {
      return;
    }

    let i = this.array.findIndex(
      function(i: T) {
        return this.isBefore(item, i);
      }.bind(this)
    );
    if (i === -1) {
      i = this.array.length;
    }

    this.insert(i, item);
  }

  subscribeWith<D>(sub: SourceArray<D>, mapFun: (value: T) => D) {
    this.array.map(v => mapFun(v)).forEach(v => sub.push(v));

    this.changes
      .pipe(
        filter(e => e.type === ChangeType.Push),
        flatMap(e => (e.change as PushChange<T>).items.map(v => mapFun(v)))
      )
      .subscribe(v => sub.push(v));

    this.changes
      .pipe(
        filter(e => e.type === ChangeType.Insert),
        map(c => c.change as InsertChange<T>)
      )
      .subscribe(v => sub.insert(v.index, mapFun(v.item)));
  }
}
