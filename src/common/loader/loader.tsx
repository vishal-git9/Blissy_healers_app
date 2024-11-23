import React from 'react';
import { MotiView } from '@motify/components';
export const Loader = ({ size }: { size: number }) => {
  return (
      <MotiView
        from={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 0,
          shadowOpacity: 0.5,
        }}
        animate={{
          width: size + 10,
          height: size + 10,
          borderRadius: (size + 10) / 2,
          borderWidth: size / 10,
          shadowOpacity: 1,
        }}
        transition={{
          type: 'timing',
          duration: 1000,
          loop: true,
        }}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: size / 10,
          borderColor: '#fff',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 1,
          shadowRadius: 10,
          // position: 'absolute',
          zIndex: 3,
        }}
      />
  );
};
