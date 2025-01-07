import {useEffect, useState} from "react";

export function useNetworkStatus() {
    const [isOnline, setIsOnline] = useState<boolean | undefined>(true);

    useEffect(() => {
        // Перевірка статусу мережі після монтовання компонента
        setIsOnline(navigator.onLine);

        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        // Додавання слухачів подій
        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        // Очистка слухачів при демонтованні компонента
        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []); // Тільки при монтуванні

    return isOnline;
}
