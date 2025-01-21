import {useEffect, useState} from "react";

/**
 * Custom hook to monitor the network status of the user's device.
 * It listens for changes in online/offline status and provides the current state.
 *
 * @returns {boolean | undefined} The network status (true if online, false if offline, undefined initially).
 */
export function useNetworkStatus() {
    const [isOnline, setIsOnline] = useState<boolean | undefined>(true);

    useEffect(() => {
        // Set the initial network status when the component mounts
        setIsOnline(navigator.onLine);

        // Handler to update the state when the device goes online
        const handleOnline = () => setIsOnline(true);

        // Handler to update the state when the device goes offline
        const handleOffline = () => setIsOnline(false);

        // Adding event listeners for online and offline events
        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        // Cleanup event listeners when the component unmounts
        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []); // Runs only once after the initial render (component mount)

    return isOnline; // Return the current network status
}
