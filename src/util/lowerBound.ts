import Comparator, { Compared } from "./Comparator";

const lowerBound = <T extends Comparator<T>>(list: T[], val: T): number => {
  let l: number = 0,
    r: number = list.length - 1,
    ans: number = list.length;

  while (l <= r) {
    let mid = Math.floor(l + (r - l) / 2);

    if (val.compareTo(list[mid]) === Compared.LESS) l = mid + 1;
    else if (
      val.compareTo(list[mid]) === Compared.GREATER ||
      val.compareTo(list[mid]) === Compared.EQUAL
    ) {
      ans = mid;
      r = mid - 1;
    }
  }

  return ans;
};

export default lowerBound;