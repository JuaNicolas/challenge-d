import { TestBed } from '@angular/core/testing';

import { NoEmptyListGuard } from './no-empty-list.guard';

describe('NoEmptyListGuard', () => {
  let guard: NoEmptyListGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(NoEmptyListGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
