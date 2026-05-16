import { useEffect, useState } from "react";

import { getRoom, type Room } from "./roomApi";

export function useRoomPolling(roomId: number) {
  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadRoom = async () => {
      try {
        const room = await getRoom(roomId);

        if (isMounted) {
          setRoom(room);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadRoom();

    const intervalId = window.setInterval(loadRoom, 500);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, [roomId]);

  return {
    room,
    isLoading,
  };
}
