import { useEffect, useState, useRef } from "react";

function Timer({initialMinutes = 1, initialSeconds = 30, onTimeout}) {
    const [minutes, setMinutes] = useState(initialMinutes);
    const [seconds, setSeconds] = useState(initialSeconds);
    const timerRef = useRef(null);

    useEffect(() => {
        timerRef.current = setInterval(() => {
            setSeconds((prevSeconds) => {
                if (prevSeconds > 0) {
                    return prevSeconds - 1;
                } else {
                    setMinutes((prevMinutes) => {
                        if (prevMinutes > 0) {
                            setSeconds(59);
                            return prevMinutes - 1;
                        } else {
                            if (timerRef.current) {
                                clearInterval(timerRef.current);
                                timerRef.current = null;
                            }
                            if (onTimeout) onTimeout();
                            return 0;
                        }
                    });
                    return 0;
                }
            });
        }, 1000);
        
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [onTimeout]);

    return (
        <div className="text-xl font-bold">
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </div>
    )
}

export default Timer;
