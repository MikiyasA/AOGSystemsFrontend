import { Box, Group, Loader, LoadingOverlay } from "@mantine/core";
import { useEffect, useState } from "react";


const MyLoadingOverlay = () => {

    const [color, setColor] = useState('green');
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const intervalId = setInterval(() => {
          const colors = ['green', 'yellow', 'red'];
          const nextColorIndex = (colors.indexOf(color) + 1) % colors.length;
          setColor(colors[nextColorIndex]);
        }, 1000); // Change color every 1 second
    
        return () => clearInterval(intervalId); // Cleanup on unmount
      }, [color]); // Add color to the dependency array
    
      return (
        <LoadingOverlay
        visible={visible} 
        zIndex={1000}
        overlayProps={{ radius: 'xl', blur: 1 }}
        loaderProps={{ color: color, type: 'oval' }}
        />
      );
    }

export default MyLoadingOverlay