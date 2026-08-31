export type MyersOp<T> =
  | { type: "equal"; aIndex: number; bIndex: number; value: T }
  | { type: "delete"; aIndex: number; value: T }
  | { type: "insert"; bIndex: number; value: T };

/**
 * Classic Myers O(ND) shortest-edit-script diff. Generic over tokens so the
 * same implementation drives both line-level diffing (tokens = lines) and
 * word-level diffing inside a changed line pair (tokens = words).
 */
export function myersDiff<T>(a: T[], b: T[], equal: (x: T, y: T) => boolean = (x, y) => x === y): MyersOp<T>[] {
  const N = a.length;
  const M = b.length;
  const max = N + M;

  if (max === 0) return [];

  let v = new Map<number, number>([[1, 0]]);
  const trace: Map<number, number>[] = [];

  let found = false;
  for (let d = 0; d <= max && !found; d++) {
    trace.push(new Map(v));
    for (let k = -d; k <= d; k += 2) {
      let x: number;
      const vkMinus1 = v.get(k - 1) ?? -Infinity;
      const vkPlus1 = v.get(k + 1) ?? -Infinity;

      if (k === -d || (k !== d && vkMinus1 < vkPlus1)) {
        x = vkPlus1;
      } else {
        x = vkMinus1 + 1;
      }

      let y = x - k;
      while (x < N && y < M && equal(a[x], b[y])) {
        x++;
        y++;
      }

      v.set(k, x);

      if (x >= N && y >= M) {
        found = true;
        break;
      }
    }
  }

  // Backtrack through the trace to recover the edit script, in reverse.
  const ops: MyersOp<T>[] = [];
  let x = N;
  let y = M;

  for (let d = trace.length - 1; d >= 0; d--) {
    const vAtD = trace[d];
    const k = x - y;
    const vkMinus1 = vAtD.get(k - 1) ?? -Infinity;
    const vkPlus1 = vAtD.get(k + 1) ?? -Infinity;

    const prevK = k === -d || (k !== d && vkMinus1 < vkPlus1) ? k + 1 : k - 1;
    const prevX = vAtD.get(prevK) ?? 0;
    const prevY = prevX - prevK;

    while (x > prevX && y > prevY) {
      ops.push({ type: "equal", aIndex: x - 1, bIndex: y - 1, value: a[x - 1] });
      x--;
      y--;
    }

    if (d > 0) {
      if (x === prevX) {
        ops.push({ type: "insert", bIndex: y - 1, value: b[y - 1] });
      } else {
        ops.push({ type: "delete", aIndex: x - 1, value: a[x - 1] });
      }
    }

    x = prevX;
    y = prevY;
  }

  return ops.reverse();
}
