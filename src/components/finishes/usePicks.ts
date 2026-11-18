"use client";

import { useEffect, useState } from "react";
import { onPicks, readPicks, type Pick } from "@/lib/finish-selection";

export function usePicks(): Pick[] {
  const [list, setList] = useState<Pick[]>([]);
  useEffect(() => {
    const sync = () => setList(readPicks());
    const id = requestAnimationFrame(sync);
    const off = onPicks(sync);
    return () => {
      cancelAnimationFrame(id);
      off();
    };
  }, []);
  return list;
}
