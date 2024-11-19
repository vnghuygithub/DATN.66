import { useState, useEffect } from 'react';

interface MobileState {
  isMobile: boolean;
}

export const mobileResponsive = (): MobileState => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = (): void => {
      const screenWidth = window.innerWidth;
      setIsMobile(
        screenWidth <= 600 || (screenWidth > 600 && screenWidth <= 1024)
      );
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return (): void => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return { isMobile };
};
