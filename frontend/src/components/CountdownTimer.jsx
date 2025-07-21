import { useState, useEffect } from "react";
import { Clock, Zap, Calendar, AlertCircle } from "lucide-react";

const CountdownTimer = ({ auction, status }) => {
  const [timeData, setTimeData] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalSeconds: 0,
    progress: 0,
    isUrgent: false
  });

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      let targetTime;
      let totalDuration;

      if (status === "Upcoming") {
        targetTime = new Date(auction.startTime);
        totalDuration = targetTime - new Date(auction.createdAt || auction.startTime);
      } else {
        targetTime = new Date(auction.endTime);
        totalDuration = targetTime - new Date(auction.startTime);
      }

      const diff = targetTime - now;

      if (diff <= 0) {
        setTimeData({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          totalSeconds: 0,
          progress: 100,
          isUrgent: false
        });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      const totalSeconds = Math.floor(diff / 1000);
      
      // Calculate progress (how much time has passed)
      const elapsed = totalDuration - diff;
      const progress = Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));
      
      // Consider urgent if less than 1 hour remaining
      const isUrgent = totalSeconds < 3600;

      setTimeData({
        days,
        hours,
        minutes,
        seconds,
        totalSeconds,
        progress,
        isUrgent
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [auction.startTime, auction.endTime, auction.createdAt, status]);

  const getStatusConfig = () => {
    switch (status) {
      case "Upcoming":
        return {
          title: "Starts In",
          icon: Calendar,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          progressColor: "bg-blue-500"
        };
      case "Live":
        return {
          title: "Ends In",
          icon: timeData.isUrgent ? AlertCircle : Zap,
          color: timeData.isUrgent ? "text-red-600" : "text-green-600",
          bgColor: timeData.isUrgent ? "bg-red-50" : "bg-green-50",
          borderColor: timeData.isUrgent ? "border-red-200" : "border-green-200",
          progressColor: timeData.isUrgent ? "bg-red-500" : "bg-green-500"
        };
      case "Ended":
        return {
          title: "Auction Ended",
          icon: Clock,
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          progressColor: "bg-gray-500"
        };
      default:
        return {
          title: "Time",
          icon: Clock,
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          progressColor: "bg-gray-500"
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  if (status === "Ended" || timeData.totalSeconds <= 0) {
    return (
      <div className={`p-6 rounded-2xl border ${config.borderColor} ${config.bgColor}`}>
        <div className="text-center">
          <Icon className={`w-8 h-8 ${config.color} mx-auto mb-3`} />
          <h3 className={`text-xl font-bold ${config.color} mb-2`}>
            Auction Ended
          </h3>
          <p className="text-gray-600">
            This auction has concluded
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-2xl border ${config.borderColor} ${config.bgColor} relative overflow-hidden`}>
      {/* Animated background for urgent status */}
      {timeData.isUrgent && status === "Live" && (
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 animate-pulse"></div>
      )}
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <Icon className={`w-5 h-5 ${config.color} ${timeData.isUrgent ? 'animate-pulse' : ''}`} />
          <h3 className={`text-lg font-semibold ${config.color}`}>
            {config.title}
          </h3>
        </div>

        {/* Time Display */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { value: timeData.days, label: "Days" },
            { value: timeData.hours, label: "Hours" },
            { value: timeData.minutes, label: "Minutes" },
            { value: timeData.seconds, label: "Seconds" }
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className={`
                bg-white rounded-xl p-3 shadow-sm border border-gray-200 
                ${timeData.isUrgent && item.label === "Seconds" ? 'animate-pulse' : ''}
                transition-all duration-300
              `}>
                <div className={`text-2xl font-bold ${config.color} font-mono`}>
                  {String(item.value).padStart(2, '0')}
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-1 font-medium">
                {item.label}
              </div>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-600">
            <span>Progress</span>
            <span>{Math.round(timeData.progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out ${config.progressColor} relative`}
              style={{ width: `${timeData.progress}%` }}
            >
              {/* Animated progress glow */}
              <div className={`absolute inset-0 ${config.progressColor} opacity-60 animate-pulse`}></div>
            </div>
          </div>
        </div>

        {/* Urgency Warning */}
        {timeData.isUrgent && status === "Live" && (
          <div className="mt-4 p-3 bg-red-100 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle size={16} />
              <span className="text-sm font-medium">
                Auction ending soon! Place your bid now.
              </span>
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            {status === "Upcoming" 
              ? `Auction starts ${new Date(auction.startTime).toLocaleDateString()} at ${new Date(auction.startTime).toLocaleTimeString()}`
              : `Auction ends ${new Date(auction.endTime).toLocaleDateString()} at ${new Date(auction.endTime).toLocaleTimeString()}`
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
