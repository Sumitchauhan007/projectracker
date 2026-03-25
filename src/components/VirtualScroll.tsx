import React, { useMemo, useState } from 'react';

type VirtualScrollProps<T> = {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
  renderItem: (item: T, index: number) => React.ReactNode;
};

export function VirtualScroll<T>({
  items,
  itemHeight,
  containerHeight,
  overscan = 6,
  renderItem,
}: VirtualScrollProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);

  const totalHeight = items.length * itemHeight;

  const { startIndex, endIndex } = useMemo(() => {
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const end = Math.min(items.length - 1, start + visibleCount + overscan * 2);

    return { startIndex: start, endIndex: end };
  }, [containerHeight, itemHeight, items.length, overscan, scrollTop]);

  const visibleItems = items.slice(startIndex, endIndex + 1);

  return (
    <div
      className="h-full overflow-auto"
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
      style={{ height: containerHeight }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map((item, i) => {
          const absoluteIndex = startIndex + i;
          return (
            <div
              key={absoluteIndex}
              style={{
                position: 'absolute',
                top: absoluteIndex * itemHeight,
                left: 0,
                right: 0,
                height: itemHeight,
              }}
            >
              {renderItem(item, absoluteIndex)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
